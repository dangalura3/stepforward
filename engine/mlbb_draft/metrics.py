"""Forecast-quality metrics (probabilities are for a blue-team win)."""

from __future__ import annotations

import numpy as np
from numpy.typing import NDArray
from scipy.stats import rankdata

_EPS = 1e-12


def log_loss(y: NDArray[np.float64], p: NDArray[np.float64], w: NDArray[np.float64] | None = None) -> float:
    p = np.clip(p, _EPS, 1 - _EPS)
    losses = -(y * np.log(p) + (1 - y) * np.log(1 - p))
    return float(np.average(losses, weights=w))


def brier(y: NDArray[np.float64], p: NDArray[np.float64]) -> float:
    return float(np.mean((p - y) ** 2))


def accuracy(y: NDArray[np.float64], p: NDArray[np.float64]) -> float:
    return float(np.mean((p >= 0.5) == (y >= 0.5)))


def auc(y: NDArray[np.float64], p: NDArray[np.float64]) -> float:
    """Area under the ROC curve via the rank-sum identity; 0.5 when only one class is present."""
    pos = y >= 0.5
    n_pos, n_neg = int(pos.sum()), int((~pos).sum())
    if n_pos == 0 or n_neg == 0:
        return 0.5
    ranks = rankdata(p)
    return float((ranks[pos].sum() - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg))


def expected_calibration_error(y: NDArray[np.float64], p: NDArray[np.float64], bins: int = 10) -> float:
    edges = np.linspace(0.0, 1.0, bins + 1)
    idx = np.clip(np.digitize(p, edges[1:-1]), 0, bins - 1)
    total = 0.0
    for b in range(bins):
        mask = idx == b
        if mask.any():
            total += mask.mean() * abs(float(y[mask].mean()) - float(p[mask].mean()))
    return float(total)


def summarize(y: NDArray[np.float64], p: NDArray[np.float64]) -> dict[str, float]:
    return {
        "n": float(len(y)), "log_loss": log_loss(y, p), "brier": brier(y, p), "accuracy": accuracy(y, p),
        "auc": auc(y, p), "ece": expected_calibration_error(y, p),
    }
