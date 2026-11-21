"""Model backends. Both minimise binary cross-entropy with an L2 penalty and output P(blue wins) = sigmoid(z).

* CatBoostBackend: gradient-boosted trees (Logloss + l2_leaf_reg). Needs the ``catboost`` package.
* LogisticBackend: the linear log-odds model z = w0 + sum_j w_j x_j, fitted with the exact analytic gradient.
"""

from __future__ import annotations

import importlib.util
from collections.abc import Sequence
from typing import Any, Protocol

import numpy as np
from numpy.typing import NDArray
from scipy.special import expit

from .logistic import LogisticL2, grad_hess_wrt_logit


class Backend(Protocol):
    name: str

    def fit(self, X: NDArray[np.float64], y: NDArray[np.float64], sample_weight: NDArray[np.float64],
            X_val: NDArray[np.float64] | None = None, y_val: NDArray[np.float64] | None = None) -> None: ...

    def predict_proba(self, X: NDArray[np.float64]) -> NDArray[np.float64]: ...


def catboost_available() -> bool:
    return importlib.util.find_spec("catboost") is not None


class BCEObjective:
    """Custom CatBoost objective using the exact derivatives of binary cross-entropy with respect to the raw score z:
    dL/dz = sigmoid(z) - y, d2L/dz2 = sigmoid(z)(1 - sigmoid(z)). CatBoost maximises, so the signs are flipped."""

    def calc_ders_range(
        self, approxes: Sequence[float], targets: Sequence[float], weights: Sequence[float] | None,
    ) -> list[tuple[float, float]]:
        z = np.asarray(approxes, dtype=np.float64)
        y = np.asarray(targets, dtype=np.float64)
        grad, hess = grad_hess_wrt_logit(z, y)
        w = np.ones_like(z) if weights is None else np.asarray(weights, dtype=np.float64)
        return list(zip((-grad * w).tolist(), (-hess * w).tolist()))


class CatBoostBackend:
    name = "catboost"

    def __init__(self, l2: float = 8.0, iterations: int = 800, learning_rate: float = 0.04, depth: int = 4,
                 seed: int = 0, early_stopping_rounds: int = 60, custom_objective: bool = False) -> None:
        from catboost import CatBoostClassifier

        params: dict[str, Any] = {
            "iterations": iterations, "learning_rate": learning_rate, "depth": depth, "l2_leaf_reg": l2,
            "loss_function": BCEObjective() if custom_objective else "Logloss", "eval_metric": "Logloss",
            "random_seed": seed, "verbose": False, "allow_writing_files": False,
        }
        self._early = early_stopping_rounds
        self.model = CatBoostClassifier(**params)

    def fit(self, X: NDArray[np.float64], y: NDArray[np.float64], sample_weight: NDArray[np.float64],
            X_val: NDArray[np.float64] | None = None, y_val: NDArray[np.float64] | None = None) -> None:
        if X_val is not None and y_val is not None and len(y_val):
            self.model.fit(X, y, sample_weight=sample_weight, eval_set=(X_val, y_val),
                           early_stopping_rounds=self._early, use_best_model=True)
        else:
            self.model.fit(X, y, sample_weight=sample_weight)

    def predict_proba(self, X: NDArray[np.float64]) -> NDArray[np.float64]:
        raw = np.asarray(self.model.predict(X, prediction_type="RawFormulaVal"), dtype=np.float64)
        return np.asarray(expit(raw))


class LogisticBackend:
    name = "logistic"

    def __init__(self, l2: float = 30.0, n_unscaled: int = 0) -> None:
        self.model = LogisticL2(l2=l2, n_unscaled=n_unscaled)

    def fit(self, X: NDArray[np.float64], y: NDArray[np.float64], sample_weight: NDArray[np.float64],
            X_val: NDArray[np.float64] | None = None, y_val: NDArray[np.float64] | None = None) -> None:
        self.model.fit(X, y, sample_weight)

    def predict_proba(self, X: NDArray[np.float64]) -> NDArray[np.float64]:
        return self.model.predict_proba(X)
