"""Patch-age decay: w(t) = exp(-lambda * t), t in days, so matches from older patches count less."""

from __future__ import annotations

import math
from collections.abc import Mapping, Sequence
from datetime import date

import numpy as np
from numpy.typing import NDArray

from .schema import Draft


def lambda_from_half_life(half_life_days: float) -> float:
    if half_life_days <= 0:
        raise ValueError("half_life_days must be positive")
    return math.log(2.0) / half_life_days


def patch_age_days(draft: Draft, as_of: date, patch_dates: Mapping[str, date], basis: str = "patch") -> float:
    """Age t in days. basis='patch' uses the patch release date (falls back to the match date if the patch is unknown);
    basis='match' uses the match date. Never negative."""
    if basis not in ("patch", "match"):
        raise ValueError("basis must be 'patch' or 'match'")
    start = patch_dates.get(draft.patch) if basis == "patch" else None
    start = start if start is not None else draft.date
    return float(max((as_of - start).days, 0))


def patch_decay_weights(
    drafts: Sequence[Draft], as_of: date, lam: float, patch_dates: Mapping[str, date], basis: str = "patch",
) -> NDArray[np.float64]:
    """w_i = exp(-lam * t_i), rescaled so the mean weight is 1 (keeps the L2 strength comparable across datasets)."""
    if lam < 0:
        raise ValueError("lam must be >= 0")
    ages = np.asarray([patch_age_days(d, as_of, patch_dates, basis) for d in drafts], dtype=np.float64)
    w = np.exp(-lam * ages)
    return w / w.mean() if len(w) else w
