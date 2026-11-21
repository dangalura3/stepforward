"""Pick recommendation by marginal win-probability gain:  dP_k = P(Y=1 | X + {k}) - P(Y=1 | X)."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass, replace

from .engine import DraftEngine
from .schema import PICKS_PER_SIDE, DraftState

_default_engine: DraftEngine | None = None


@dataclass(frozen=True)
class PickRecommendation:
    hero: str
    role: str
    delta_p: float         # gain in win probability for the side that is picking
    p_blue_before: float   # P(blue wins) before the pick
    p_blue_after: float    # P(blue wins) after the pick


def set_default_engine(engine: DraftEngine) -> None:
    global _default_engine
    _default_engine = engine


def get_default_engine() -> DraftEngine:
    """The engine used when none is passed. If none was set, one is trained on the bundled synthetic sample."""
    global _default_engine
    if _default_engine is None:
        from .loaders import load_sample_dataset

        _default_engine = DraftEngine().fit(load_sample_dataset())
    return _default_engine


def predict_best_pick(
    current_draft_state: DraftState, engine: DraftEngine | None = None, top_k: int = 3,
    candidates: Sequence[str] | None = None,
) -> list[PickRecommendation]:
    """Return the ``top_k`` heroes with the highest marginal win-probability gain for the side to pick.
    Heroes already picked or banned are never suggested. ``candidates`` can narrow the pool (e.g. one lane)."""
    engine = engine or get_default_engine()
    table = engine.table
    state = current_draft_state
    side = state.side_to_pick
    if side not in ("blue", "red"):
        raise ValueError("side_to_pick must be 'blue' or 'red'")
    mine = state.blue_picks if side == "blue" else state.red_picks
    if len(mine) >= PICKS_PER_SIDE:
        raise ValueError(f"{side} already has {PICKS_PER_SIDE} picks")
    used = {table.canonical(h) for h in state.blue_picks + state.red_picks + state.bans}
    pool = [table.canonical(h) for h in candidates] if candidates is not None else list(table.names)
    pool = [h for h in dict.fromkeys(pool) if h not in used]
    if not pool:
        return []
    options = [
        replace(state, blue_picks=state.blue_picks + (h,)) if side == "blue" else replace(state, red_picks=state.red_picks + (h,))
        for h in pool
    ]
    probs = engine.predict_states([state, *options])
    before = float(probs[0])
    sign = 1.0 if side == "blue" else -1.0
    recs = [
        PickRecommendation(hero=h, role=table.role_of(h), delta_p=sign * (float(p) - before), p_blue_before=before, p_blue_after=float(p))
        for h, p in zip(pool, probs[1:])
    ]
    recs.sort(key=lambda r: (-r.delta_p, r.hero))
    return recs[:top_k]
