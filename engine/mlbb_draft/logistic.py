"""Binary cross-entropy + L2 logistic model with the exact analytic gradient, solved with L-BFGS.

    z_i   = w0 + sum_j w_j x_ij          P(Y_i = 1 | X_i) = sigmoid(z_i)
    L(w)  = sum_i s_i [softplus(z_i) - y_i z_i] + (l2 / 2) * ||w_feat||^2
    dL/dw_j  = sum_i s_i (sigmoid(z_i) - y_i) x_ij + l2 * w_j        (the intercept w0 is not penalised)

s_i are sample weights (patch decay); with s_i = 1 and l2 = 0 this is exactly sum_i (sigma(z_i) - y_i) x_ij.
"""

from __future__ import annotations

import numpy as np
from numpy.typing import NDArray
from scipy.optimize import minimize
from scipy.special import expit


def bce_l2_loss_and_grad(
    params: NDArray[np.float64], X: NDArray[np.float64], y: NDArray[np.float64],
    sample_weight: NDArray[np.float64], l2: float,
) -> tuple[float, NDArray[np.float64]]:
    """Return (loss, gradient) for params = [w0, w_1..w_d]."""
    b, w = params[0], params[1:]
    z = X @ w + b
    p = expit(z)
    loss = float(np.sum(sample_weight * (np.logaddexp(0.0, z) - y * z)) + 0.5 * l2 * float(w @ w))
    resid = sample_weight * (p - y)
    grad = np.empty_like(params)
    grad[0] = resid.sum()
    grad[1:] = X.T @ resid + l2 * w
    return loss, grad


def grad_hess_wrt_logit(z: NDArray[np.float64], y: NDArray[np.float64]) -> tuple[NDArray[np.float64], NDArray[np.float64]]:
    """dL/dz = sigmoid(z) - y and d2L/dz2 = sigmoid(z)(1 - sigmoid(z)) for the per-sample BCE loss."""
    p = expit(z)
    return p - y, p * (1.0 - p)


class LogisticL2:
    """Logistic regression (BCE + L2). Columns from ``n_unscaled`` onward are standardised; the first
    ``n_unscaled`` columns (the sparse multi-hot hero block) are used as they are."""

    def __init__(self, l2: float = 30.0, n_unscaled: int = 0, max_iter: int = 500, tol: float = 1e-9) -> None:
        if l2 < 0:
            raise ValueError("l2 must be >= 0")
        self.l2, self.n_unscaled, self.max_iter, self.tol = l2, n_unscaled, max_iter, tol
        self.coef_: NDArray[np.float64] | None = None
        self.intercept_: float = 0.0
        self._mean: NDArray[np.float64] | None = None
        self._scale: NDArray[np.float64] | None = None
        self.converged_: bool = False

    def _transform(self, X: NDArray[np.float64]) -> NDArray[np.float64]:
        assert self._mean is not None and self._scale is not None
        return (X - self._mean) / self._scale

    def fit(self, X: NDArray[np.float64], y: NDArray[np.float64], sample_weight: NDArray[np.float64] | None = None) -> LogisticL2:
        X = np.asarray(X, dtype=np.float64)
        y = np.asarray(y, dtype=np.float64)
        sw = np.ones(len(y)) if sample_weight is None else np.asarray(sample_weight, dtype=np.float64)
        mean = np.zeros(X.shape[1])
        scale = np.ones(X.shape[1])
        if X.shape[1] > self.n_unscaled:
            tail = X[:, self.n_unscaled:]
            mean[self.n_unscaled:] = np.average(tail, axis=0, weights=sw)
            sd = np.sqrt(np.average((tail - mean[self.n_unscaled:]) ** 2, axis=0, weights=sw))
            scale[self.n_unscaled:] = np.where(sd > 1e-9, sd, 1.0)
        self._mean, self._scale = mean, scale
        Z = self._transform(X)
        start = np.zeros(Z.shape[1] + 1)
        rate = float(np.clip(np.average(y, weights=sw), 1e-3, 1 - 1e-3))
        start[0] = np.log(rate / (1 - rate))
        result = minimize(
            bce_l2_loss_and_grad, start, args=(Z, y, sw, self.l2), jac=True, method="L-BFGS-B",
            options={"maxiter": self.max_iter, "ftol": self.tol, "gtol": 1e-7},
        )
        self.intercept_ = float(result.x[0])
        self.coef_ = np.asarray(result.x[1:], dtype=np.float64)
        self.converged_ = bool(result.success)
        return self

    def decision_function(self, X: NDArray[np.float64]) -> NDArray[np.float64]:
        if self.coef_ is None:
            raise RuntimeError("model is not fitted")
        return np.asarray(self._transform(np.asarray(X, dtype=np.float64)) @ self.coef_ + self.intercept_)

    def predict_proba(self, X: NDArray[np.float64]) -> NDArray[np.float64]:
        return np.asarray(expit(self.decision_function(X)))
