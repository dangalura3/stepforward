from __future__ import annotations

import math
import sys
import types

import numpy as np
import pytest

from mlbb_draft import DraftEngine, DraftState, EngineConfig, predict_best_pick
from mlbb_draft.engine import PICK_ORDER, draft_prefix, time_split, tune_hyperparameters
from mlbb_draft.recommend import set_default_engine


def test_model_beats_a_coin_flip_on_newer_unseen_games(world):
    train, test = time_split(world.drafts, 0.25)
    assert max(d.date for d in train) <= min(d.date for d in test)
    scores = DraftEngine(EngineConfig(backend="logistic", l2=100.0)).fit(train).evaluate(test)
    assert scores["log_loss"] < math.log(2) - 0.01 and scores["auc"] > 0.6


def test_probabilities_are_valid_for_partial_and_empty_drafts(engine, world):
    d = world.drafts[0]
    p = engine.predict_proba([draft_prefix(d, s) for s in range(len(PICK_ORDER) + 1)])
    assert np.all((p > 0) & (p < 1))
    assert 0.35 < engine.predict_state(DraftState()) < 0.65
    assert draft_prefix(d, 3).blue_picks == d.blue_picks[:1] and draft_prefix(d, 3).red_picks == d.red_picks[:2]


def test_predict_best_pick_returns_top3_by_marginal_gain(engine, world):
    d = world.drafts[5]
    state = DraftState(blue_picks=d.blue_picks[:2], red_picks=d.red_picks[:2], bans=d.blue_bans + d.red_bans, side_to_pick="blue")
    recs = predict_best_pick(state, engine)
    assert len(recs) == 3 and recs[0].delta_p >= recs[1].delta_p >= recs[2].delta_p
    used = set(state.blue_picks + state.red_picks + state.bans)
    assert not used & {r.hero for r in recs}
    base = engine.predict_state(state)
    for r in recs:
        after = engine.predict_state(DraftState(blue_picks=state.blue_picks + (r.hero,), red_picks=state.red_picks))
        assert r.p_blue_before == pytest.approx(base) and r.delta_p == pytest.approx(after - base)
    every = predict_best_pick(state, engine, top_k=500)
    assert len(every) == engine.table.n - len(used) and recs[0].delta_p == max(r.delta_p for r in every)


def test_red_side_gain_is_a_drop_in_blue_win_chance(engine):
    recs = predict_best_pick(DraftState(blue_picks=("Fanny",), side_to_pick="red"), engine)
    assert all(r.delta_p == pytest.approx(r.p_blue_before - r.p_blue_after) and r.delta_p > 0 for r in recs)


def test_recommendations_find_the_planted_strong_heroes(engine, world):
    recs = predict_best_pick(DraftState(), engine, top_k=10)
    strengths = np.array(list(world.hero_strength.values()))
    assert np.mean([world.hero_strength[r.hero] for r in recs]) > strengths.mean() + strengths.std()


def test_candidates_full_side_and_default_engine(engine):
    recs = predict_best_pick(DraftState(), engine, candidates=["fanny", "Atlas", "Atlas"])
    assert {r.hero for r in recs} == {"Fanny", "Atlas"}
    full = DraftState(blue_picks=("Fanny", "Atlas", "Khufra", "Granger", "Zhuxin"))
    with pytest.raises(ValueError, match="already has 5"):
        predict_best_pick(full, engine)
    with pytest.raises(ValueError, match="unknown hero"):
        predict_best_pick(DraftState(blue_picks=("Nobody",)), engine)
    set_default_engine(engine)
    assert predict_best_pick(DraftState()) == predict_best_pick(DraftState(), engine)


def test_tuning_picks_from_the_grid(world):
    result = tune_hyperparameters(world.drafts[:400], half_lives=(30.0, 365.0), l2_values=(30.0, 300.0), base=EngineConfig(backend="logistic"))
    assert len(result.trials) == 4 and result.best.half_life_days in (30.0, 365.0) and result.best.l2 in (30.0, 300.0)
    assert min(t[2] for t in result.trials) == [t[2] for t in result.trials if t[:2] == (result.best.half_life_days, result.best.l2)][0]


def test_unfitted_engine_and_too_little_data(world):
    with pytest.raises(RuntimeError):
        DraftEngine().predict_state(DraftState())
    with pytest.raises(ValueError):
        DraftEngine().fit(world.drafts[:5])


def test_catboost_backend_wiring_with_a_stand_in_module(world, monkeypatch):
    """catboost may not be installed, so a tiny stand-in checks that the adapter passes Logloss, L2, weights and an
    early-stopping set, and turns raw scores into probabilities. It does not test CatBoost itself."""
    seen: dict[str, object] = {}

    class FakeClassifier:
        def __init__(self, **params):
            seen["params"] = params

        def fit(self, X, y, sample_weight=None, eval_set=None, **kwargs):
            seen.update(n=len(y), weights=sample_weight, eval_set=eval_set, kwargs=kwargs)
            self.bias = float(np.log(np.average(y, weights=sample_weight) / (1 - np.average(y, weights=sample_weight))))

        def predict(self, X, prediction_type="Class"):
            assert prediction_type == "RawFormulaVal"
            return np.full(X.shape[0], self.bias)

    monkeypatch.setitem(sys.modules, "catboost", types.SimpleNamespace(CatBoostClassifier=FakeClassifier))
    monkeypatch.setattr("mlbb_draft.engine.catboost_available", lambda: True)
    eng = DraftEngine(EngineConfig(backend="catboost", l2=5.0)).fit(world.drafts[:200])
    assert eng.backend_name == "catboost"
    assert seen["params"]["loss_function"] == "Logloss" and seen["params"]["l2_leaf_reg"] == 5.0
    assert seen["eval_set"] is not None and len(seen["weights"]) == seen["n"]
    assert 0 < eng.predict_state(DraftState()) < 1
