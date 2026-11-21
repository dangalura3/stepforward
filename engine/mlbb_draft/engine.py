"""The full pipeline: patch decay -> features -> model -> win probability for any (partial) draft."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field, replace
from datetime import date
from typing import Literal

import numpy as np
from numpy.typing import NDArray

from .decay import lambda_from_half_life, patch_decay_weights
from .features import FeatureBuilder, FeatureConfig
from .heroes import HeroTable, load_hero_table
from .loaders import load_patches
from .metrics import log_loss, summarize
from .models import Backend, CatBoostBackend, LogisticBackend, catboost_available
from .schema import PICKS_PER_SIDE, Draft, DraftState

# Pick turns of a standard MLBB draft: B1, R1 R2, B2 B3, R3, (bans), R4, B4 B5, R5.
PICK_ORDER: tuple[str, ...] = ("b", "r", "r", "b", "b", "r", "r", "b", "b", "r")


@dataclass(frozen=True)
class EngineConfig:
    backend: Literal["auto", "catboost", "logistic"] = "auto"
    half_life_days: float = 45.0          # lambda = ln(2) / half_life_days
    decay_basis: Literal["patch", "match"] = "patch"
    l2: float | None = None               # None -> 8.0 for CatBoost (l2_leaf_reg), 30.0 for the logistic model
    prefixes_per_draft: int = 3           # partial-draft copies of each game, so mid-draft states are learned too
    prefix_weight: float = 0.5
    validation_fraction: float = 0.15     # most recent share of games, used by CatBoost for early stopping
    catboost_iterations: int = 800
    catboost_learning_rate: float = 0.04
    catboost_depth: int = 4
    catboost_custom_objective: bool = False
    seed: int = 0
    features: FeatureConfig = field(default_factory=FeatureConfig)

    @property
    def decay_lambda(self) -> float:
        return lambda_from_half_life(self.half_life_days)


def draft_prefix(draft: Draft, step: int) -> Draft:
    """The draft as it looked after ``step`` picks (0..10), keeping the final result as the label."""
    nb = PICK_ORDER[:step].count("b")
    nr = step - nb
    return replace(draft, blue_picks=draft.blue_picks[:nb], red_picks=draft.red_picks[:nr])


def time_split(drafts: Sequence[Draft], holdout_fraction: float) -> tuple[list[Draft], list[Draft]]:
    """Oldest games for training, newest for testing (never shuffle: the future must not leak into the past)."""
    ordered = sorted(drafts, key=lambda d: (d.date, d.match_id))
    cut = int(round(len(ordered) * (1 - holdout_fraction)))
    return ordered[:cut], ordered[cut:]


class DraftEngine:
    def __init__(self, config: EngineConfig | None = None, table: HeroTable | None = None,
                 patch_dates: Mapping[str, date] | None = None) -> None:
        self.config = config or EngineConfig()
        self.table = table or load_hero_table()
        self.patch_dates = dict(patch_dates) if patch_dates is not None else load_patches()
        self.builder = FeatureBuilder(self.table, self.config.features)
        self.model: Backend | None = None
        self.as_of: date | None = None

    def _make_backend(self) -> Backend:
        choice = self.config.backend
        if choice == "auto":
            choice = "catboost" if catboost_available() else "logistic"
        if choice == "catboost":
            if not catboost_available():
                raise RuntimeError("backend='catboost' needs the catboost package: pip install catboost")
            c = self.config
            return CatBoostBackend(l2=8.0 if c.l2 is None else c.l2, iterations=c.catboost_iterations,
                                   learning_rate=c.catboost_learning_rate, depth=c.catboost_depth, seed=c.seed,
                                   custom_objective=c.catboost_custom_objective)
        return LogisticBackend(l2=30.0 if self.config.l2 is None else self.config.l2, n_unscaled=self.builder.n_hero_columns)

    def fit(self, drafts: Sequence[Draft], as_of: date | None = None) -> DraftEngine:
        games = sorted((d for d in drafts if d.blue_win is not None and d.is_complete), key=lambda d: (d.date, d.match_id))
        if len(games) < 20:
            raise ValueError("need at least 20 finished games with results to train")
        for g in games:
            g.validate()
        self.as_of = as_of or games[-1].date
        w = patch_decay_weights(games, self.as_of, self.config.decay_lambda, self.patch_dates, self.config.decay_basis)
        self.builder.fit(games, w)

        rng = np.random.default_rng(self.config.seed)
        rows: list[Draft] = list(games)
        stat_w: list[float] = w.tolist()
        fit_w: list[float] = w.tolist()
        origin: list[int] = list(range(len(games)))
        for i, g in enumerate(games):
            for step in rng.choice(2 * PICKS_PER_SIDE, size=min(self.config.prefixes_per_draft, 2 * PICKS_PER_SIDE), replace=False):
                rows.append(draft_prefix(g, int(step)))
                stat_w.append(float(w[i]))
                fit_w.append(float(w[i]) * self.config.prefix_weight)
                origin.append(i)
        X = self.builder.transform(rows, exclude_self=True, weights=np.asarray(stat_w)).toarray()
        y = np.asarray([float(r.blue_win or 0) for r in rows])
        sw = np.asarray(fit_w)

        self.model = self._make_backend()
        cut = int(round(len(games) * (1 - self.config.validation_fraction)))
        is_val = np.asarray(origin) >= cut
        if self.model.name == "catboost" and 0 < cut < len(games):
            self.model.fit(X[~is_val], y[~is_val], sw[~is_val], X[is_val], y[is_val])
        else:
            self.model.fit(X, y, sw)
        return self

    @property
    def backend_name(self) -> str:
        return self.model.name if self.model else "unfitted"

    def _require(self) -> Backend:
        if self.model is None:
            raise RuntimeError("engine is not fitted; call fit(drafts) first")
        return self.model

    def predict_proba(self, drafts: Sequence[Draft]) -> NDArray[np.float64]:
        """P(blue wins) for each draft (complete or partial), using all fitted history."""
        model = self._require()
        if not drafts:
            return np.zeros(0)
        return model.predict_proba(self.builder.transform(drafts).toarray())

    def predict_states(self, states: Sequence[DraftState]) -> NDArray[np.float64]:
        today = self.as_of or date.today()
        return self.predict_proba([
            Draft(match_id="state", date=today, patch="", blue_team=s.blue_team, red_team=s.red_team,
                  blue_picks=tuple(self.table.canonical(h) for h in s.blue_picks),
                  red_picks=tuple(self.table.canonical(h) for h in s.red_picks)) for s in states
        ])

    def predict_state(self, state: DraftState) -> float:
        return float(self.predict_states([state])[0])

    def evaluate(self, drafts: Sequence[Draft]) -> dict[str, float]:
        games = [d for d in drafts if d.blue_win is not None]
        y = np.asarray([float(d.blue_win or 0) for d in games])
        return summarize(y, self.predict_proba(games))


@dataclass(frozen=True)
class TuningResult:
    best: EngineConfig
    trials: list[tuple[float, float, float]]  # (half_life_days, l2, validation log-loss)


def tune_hyperparameters(
    drafts: Sequence[Draft], half_lives: Sequence[float] = (20.0, 45.0, 90.0, 365.0), l2_values: Sequence[float] | None = None,
    base: EngineConfig | None = None, validation_fraction: float = 0.2,
) -> TuningResult:
    """Pick the decay half-life (so lambda) and L2 strength by log-loss on the most recent games."""
    base = base or EngineConfig()
    train, valid = time_split([d for d in drafts if d.blue_win is not None and d.is_complete], validation_fraction)
    if not train or not valid:
        raise ValueError("not enough games to tune")
    uses_catboost = base.backend == "catboost" or (base.backend == "auto" and catboost_available())
    grid = l2_values if l2_values is not None else ((3.0, 8.0, 20.0) if uses_catboost else (3.0, 10.0, 30.0, 100.0, 300.0))
    y = np.asarray([float(d.blue_win or 0) for d in valid])
    trials: list[tuple[float, float, float]] = []
    for hl in half_lives:
        for l2 in grid:
            cfg = replace(base, half_life_days=hl, l2=l2)
            engine = DraftEngine(cfg).fit(train, as_of=valid[0].date)
            trials.append((hl, l2, log_loss(y, engine.predict_proba(valid))))
    hl, l2, _ = min(trials, key=lambda t: t[2])
    return TuningResult(best=replace(base, half_life_days=hl, l2=l2), trials=trials)
