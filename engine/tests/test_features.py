from __future__ import annotations

from dataclasses import replace
from datetime import date

import numpy as np
import pytest

from mlbb_draft.features import DENSE_FEATURES, FeatureBuilder, FeatureConfig
from mlbb_draft.loaders import load_m8_teams, load_matches, load_patches, load_sample_dataset, write_matches
from mlbb_draft.schema import Draft

D = DENSE_FEATURES.index


def _game(i: int, blue: tuple[str, ...], red: tuple[str, ...], win: int) -> Draft:
    return Draft(f"g{i}", date(2026, 10, 1), "2.2.16", "A", "B", blue, red, blue_win=win)


BLUE = ("Uranus", "Fanny", "Zhuxin", "Granger", "Khufra")
RED = ("Esmeralda", "Hayabusa", "Pharsa", "Claude", "Atlas")


def test_multi_hot_block_is_sparse_2n_with_one_per_pick(table):
    fb = FeatureBuilder(table).fit([_game(0, BLUE, RED, 1)])
    X = fb.transform([_game(1, BLUE, RED, 1), _game(2, BLUE[:2], RED[:1], 1)])
    assert X.shape == (2, 2 * table.n + len(DENSE_FEATURES)) and len(fb.feature_names) == X.shape[1]
    hot = X[:, : 2 * table.n].toarray()
    assert hot[0, : table.n].sum() == 5 and hot[0, table.n:].sum() == 5 and hot[1].sum() == 3
    assert hot[0, table.index("Fanny")] == 1 and hot[0, table.n + table.index("Atlas")] == 1
    assert set(np.unique(hot)) == {0.0, 1.0}


def test_target_encoding_is_smoothed_for_rarely_picked_heroes(table):
    games = [_game(i, BLUE, RED, 1) for i in range(40)] + [_game(99, ("Layla",) + BLUE[1:], ("Miya",) + RED[1:], 1)]
    te = FeatureBuilder(table, FeatureConfig(hero_smoothing=20)).fit(games).hero_encoding()
    assert te[table.index("Layla")] == pytest.approx(21 / 21 * (1 + 10) / 21 * 21 / 21)  # (1 + 20*0.5) / (1 + 20)
    assert 0.5 < te[table.index("Layla")] < 0.55 < te[table.index("Uranus")]             # 1 game barely moves it
    assert te[table.index("Aamon")] == 0.5                                                # never seen -> prior


def test_leave_one_out_removes_a_games_own_result(table):
    game = _game(0, BLUE, RED, 1)
    fb = FeatureBuilder(table).fit([game])
    leaky = fb.transform([game]).toarray()[0, 2 * table.n:]
    clean = fb.transform([game], exclude_self=True, weights=np.ones(1)).toarray()[0, 2 * table.n:]
    assert leaky[D("te_diff")] > 0
    assert clean[D("te_diff")] == 0 and clean[D("synergy_diff")] == 0 and clean[D("counter_delta")] == 0


def test_synergy_and_counter_matrices(table):
    games = [_game(i, BLUE, RED, 1) for i in range(30)]
    fb = FeatureBuilder(table).fit(games)
    S, C = fb.synergy_matrix(), fb.counter_matrix()
    assert np.allclose(S, S.T) and np.allclose(C, -C.T)
    swapped = fb.transform([_game(0, BLUE, RED, 1), _game(1, RED, BLUE, 0)]).toarray()[:, 2 * table.n:]
    assert swapped[0, D("counter_delta")] == pytest.approx(-swapped[1, D("counter_delta")])
    assert swapped[0, D("te_diff")] == pytest.approx(-swapped[1, D("te_diff")])


def test_role_balance_indices(table):
    fb = FeatureBuilder(table).fit([_game(0, BLUE, RED, 1)])
    all_phys = ("Granger", "Claude", "Fanny", "Hayabusa", "Layla")
    row = fb.transform([_game(1, all_phys, ("Khufra", "Atlas", "Tigreal", "Pharsa", "Zhuxin"), 1)]).toarray()[0, 2 * table.n:]
    assert row[D("physical_ratio_blue")] == 1.0 and row[D("damage_balance_blue")] == 0.0
    assert row[D("frontline_red")] > row[D("frontline_blue")]
    assert 0 <= row[D("physical_ratio_red")] <= 1 and row[D("picks_blue")] == 1.0


def test_loaders_round_trip_and_validation(tmp_path, table):
    sample = load_sample_dataset(table)
    assert len(sample) >= 1000 and all(d.is_complete and d.blue_win in (0, 1) for d in sample)
    path = tmp_path / "m.csv"
    write_matches(sample[:25], path)
    assert load_matches(path, table) == sorted(sample[:25], key=lambda d: (d.date, d.match_id))
    bad = replace(sample[0], blue_picks=("Not A Hero",) + sample[0].blue_picks[1:])
    write_matches([bad, sample[1]], path)
    with pytest.raises(ValueError, match="unknown hero"):
        load_matches(path, table)
    assert len(load_matches(path, table, strict=False)) == 1
    assert table.canonical("  chang'e ") == "Chang'e"
    assert set(load_patches()) >= {"2.2.16", "2.2.16a"}


def test_m8_team_list():
    teams = load_m8_teams()
    names = {t.name for t in teams if t.status == "qualified"}
    assert {"Bigetron by Vitality", "NAVI", "Aurora Gaming PH", "Team Falcons PH", "Selangor Red Giants", "Team Rey"} <= names
    assert len(teams) == 23 and sum(t.stage == "main" for t in teams) == 13 and sum(t.stage == "wildcard" for t in teams) == 10
