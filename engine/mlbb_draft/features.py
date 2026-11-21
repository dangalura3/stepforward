"""Feature engineering for draft win prediction.

Row layout: [ blue multi-hot (N) | red multi-hot (N) | dense block ]  -> 2N sparse hero columns + dense columns.

Dense block, all computed from history seen in ``fit``:
* smoothed target encoding of heroes (handles low-pick-rate heroes):  te_h = (wins_h + m * 0.5) / (n_h + m)
* synergy matrix (same-team pairs), as a smoothed residual over what the two heroes' own encodings predict
* counter delta (cross-team pairs), same idea; it is antisymmetric, so swapping sides flips its sign
* role-balance indices: frontline density, physical/magic damage ratio, damage balance, hard-CC density
* smoothed team strength difference and how many picks each side has so far

Training rows are encoded leave-one-out (their own game is removed from the history) so the label cannot leak.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass

import numpy as np
from numpy.typing import NDArray
from scipy import sparse

from .heroes import HeroTable
from .schema import PICKS_PER_SIDE, Draft

DENSE_FEATURES: tuple[str, ...] = (
    "te_blue", "te_red", "te_diff", "synergy_blue", "synergy_red", "synergy_diff", "counter_delta",
    "frontline_blue", "frontline_red", "frontline_diff", "physical_ratio_blue", "physical_ratio_red",
    "damage_balance_blue", "damage_balance_red", "damage_balance_diff", "hard_cc_blue", "hard_cc_red", "hard_cc_diff",
    "team_strength_diff", "picks_blue", "picks_red",
)


@dataclass(frozen=True)
class FeatureConfig:
    hero_smoothing: float = 20.0
    pair_smoothing: float = 15.0
    team_smoothing: float = 10.0


class FeatureBuilder:
    def __init__(self, table: HeroTable, config: FeatureConfig | None = None) -> None:
        self.table = table
        self.config = config or FeatureConfig()
        n = table.n
        self.hero_n = np.zeros(n)
        self.hero_w = np.zeros(n)
        self.pair_n = np.zeros((n, n))
        self.pair_w = np.zeros((n, n))
        self.vs_n = np.zeros((n, n))
        self.vs_w = np.zeros((n, n))
        self.team_n: dict[str, float] = {}
        self.team_w: dict[str, float] = {}
        self._index = {name: i for i, name in enumerate(table.names)}
        self.fitted = False

    @property
    def n_hero_columns(self) -> int:
        return 2 * self.table.n

    @property
    def feature_names(self) -> list[str]:
        return [f"blue::{h}" for h in self.table.names] + [f"red::{h}" for h in self.table.names] + list(DENSE_FEATURES)

    def _idx(self, heroes: Sequence[str]) -> NDArray[np.int64]:
        try:
            return np.asarray([self._index[h] for h in heroes], dtype=np.int64)
        except KeyError:
            return np.asarray([self.table.index(h) for h in heroes], dtype=np.int64)

    def fit(self, drafts: Sequence[Draft], weights: NDArray[np.float64] | None = None) -> FeatureBuilder:
        """Accumulate (weighted) history from finished games. Games without a result are ignored."""
        for arr in (self.hero_n, self.hero_w, self.pair_n, self.pair_w, self.vs_n, self.vs_w):
            arr[...] = 0.0
        self.team_n, self.team_w = {}, {}
        w_all = np.ones(len(drafts)) if weights is None else np.asarray(weights, dtype=np.float64)
        for draft, w in zip(drafts, w_all):
            if draft.blue_win is None:
                continue
            y = float(draft.blue_win)
            b, r = self._idx(draft.blue_picks), self._idx(draft.red_picks)
            self.hero_n[b] += w
            self.hero_w[b] += w * y
            self.hero_n[r] += w
            self.hero_w[r] += w * (1 - y)
            self.pair_n[np.ix_(b, b)] += w
            self.pair_w[np.ix_(b, b)] += w * y
            self.pair_n[np.ix_(r, r)] += w
            self.pair_w[np.ix_(r, r)] += w * (1 - y)
            self.vs_n[np.ix_(b, r)] += w
            self.vs_w[np.ix_(b, r)] += w * y
            self.vs_n[np.ix_(r, b)] += w
            self.vs_w[np.ix_(r, b)] += w * (1 - y)
            for team, won in ((draft.blue_team, y), (draft.red_team, 1 - y)):
                if team:
                    self.team_n[team] = self.team_n.get(team, 0.0) + w
                    self.team_w[team] = self.team_w.get(team, 0.0) + w * won
        self.fitted = True
        return self

    def hero_encoding(self) -> NDArray[np.float64]:
        """Smoothed win rate of every hero (0.5 for a hero never seen)."""
        m = self.config.hero_smoothing
        return (self.hero_w + m * 0.5) / (self.hero_n + m)

    def synergy_matrix(self) -> NDArray[np.float64]:
        """S[a, b]: smoothed extra win rate when a and b are on the same team (symmetric, zero diagonal)."""
        te = self.hero_encoding()
        base = (te[:, None] + te[None, :]) / 2
        out = (self.pair_w - self.pair_n * base) / (self.pair_n + self.config.pair_smoothing)
        np.fill_diagonal(out, 0.0)
        return out

    def counter_matrix(self) -> NDArray[np.float64]:
        """C[a, b]: smoothed extra win rate for a's team when a faces b. C[a, b] == -C[b, a]."""
        te = self.hero_encoding()
        base = 0.5 + (te[:, None] - te[None, :]) / 2
        out = (self.vs_w - self.vs_n * base) / (self.vs_n + self.config.pair_smoothing)
        np.fill_diagonal(out, 0.0)
        return out

    def _team(self, team: str, w: float, won: float) -> float:
        m = self.config.team_smoothing
        n = max(self.team_n.get(team, 0.0) - w, 0.0) if team else 0.0
        wins = max(self.team_w.get(team, 0.0) - w * won, 0.0) if team else 0.0
        return (wins + m * 0.5) / (n + m) - 0.5

    def dense_row(
        self, blue: NDArray[np.int64], red: NDArray[np.int64], blue_team: str = "", red_team: str = "",
        exclude_weight: float = 0.0, exclude_blue_win: float = 0.0,
    ) -> NDArray[np.float64]:
        """Dense features for one draft. ``exclude_*`` removes that game's own contribution (leave-one-out)."""
        w, y = exclude_weight, exclude_blue_win
        mh, mp = self.config.hero_smoothing, self.config.pair_smoothing
        t = self.table
        te_b = (np.maximum(self.hero_w[blue] - w * y, 0) + mh * 0.5) / (np.maximum(self.hero_n[blue] - w, 0) + mh)
        te_r = (np.maximum(self.hero_w[red] - w * (1 - y), 0) + mh * 0.5) / (np.maximum(self.hero_n[red] - w, 0) + mh)

        def synergy(idx: NDArray[np.int64], te: NDArray[np.float64], won: float) -> float:
            if len(idx) < 2:
                return 0.0
            n = np.maximum(self.pair_n[np.ix_(idx, idx)] - w, 0)
            wins = np.maximum(self.pair_w[np.ix_(idx, idx)] - w * won, 0)
            base = (te[:, None] + te[None, :]) / 2
            vals = (wins - n * base) / (n + mp)
            return float(vals[np.triu_indices(len(idx), 1)].mean())

        counter = 0.0
        if len(blue) and len(red):
            n = np.maximum(self.vs_n[np.ix_(blue, red)] - w, 0)
            wins = np.maximum(self.vs_w[np.ix_(blue, red)] - w * y, 0)
            base = 0.5 + (te_b[:, None] - te_r[None, :]) / 2
            counter = float(((wins - n * base) / (n + mp)).mean())

        def mean(values: NDArray[np.float64], default: float) -> float:
            return float(values.mean()) if len(values) else default

        tb, tr = mean(te_b, 0.5) - 0.5, mean(te_r, 0.5) - 0.5
        sb, sr = synergy(blue, te_b, y), synergy(red, te_r, 1 - y)
        fb, fr = mean(t.frontline[blue], 0.0), mean(t.frontline[red], 0.0)
        pb, pr = mean(t.physical[blue], 0.5), mean(t.physical[red], 0.5)
        bb, br = 1 - abs(2 * pb - 1), 1 - abs(2 * pr - 1)
        cb, cr = mean(t.hard_cc[blue], 0.0), mean(t.hard_cc[red], 0.0)
        team = self._team(blue_team, w, y) - self._team(red_team, w, 1 - y)
        return np.asarray([
            tb, tr, tb - tr, sb, sr, sb - sr, counter, fb, fr, fb - fr, pb, pr, bb, br, bb - br, cb, cr, cb - cr,
            team, len(blue) / PICKS_PER_SIDE, len(red) / PICKS_PER_SIDE,
        ], dtype=np.float64)

    def transform(
        self, drafts: Sequence[Draft], exclude_self: bool = False, weights: NDArray[np.float64] | None = None,
    ) -> sparse.csr_matrix:
        """Build the feature matrix. With exclude_self=True each labelled row is encoded leave-one-out, using
        ``weights`` (the same weights given to ``fit``) to remove its own contribution."""
        if not self.fitted:
            raise RuntimeError("FeatureBuilder.fit must be called first")
        n = self.table.n
        w_all = np.ones(len(drafts)) if weights is None else np.asarray(weights, dtype=np.float64)
        rows: list[int] = []
        cols: list[int] = []
        dense = np.zeros((len(drafts), len(DENSE_FEATURES)))
        for i, draft in enumerate(drafts):
            b, r = self._idx(draft.blue_picks), self._idx(draft.red_picks)
            rows.extend([i] * (len(b) + len(r)))
            cols.extend(b.tolist())
            cols.extend((r + n).tolist())
            leave_out = exclude_self and draft.blue_win is not None
            dense[i] = self.dense_row(
                b, r, draft.blue_team, draft.red_team,
                exclude_weight=float(w_all[i]) if leave_out else 0.0,
                exclude_blue_win=float(draft.blue_win or 0) if leave_out else 0.0,
            )
        hot = sparse.csr_matrix((np.ones(len(rows)), (rows, cols)), shape=(len(drafts), 2 * n))
        return sparse.hstack([hot, sparse.csr_matrix(dense)], format="csr")
