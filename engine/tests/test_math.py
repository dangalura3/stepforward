from __future__ import annotations

import math
from datetime import date

import numpy as np
from scipy.optimize import check_grad
from scipy.special import expit

from mlbb_draft.decay import lambda_from_half_life, patch_age_days, patch_decay_weights
from mlbb_draft.logistic import LogisticL2, bce_l2_loss_and_grad, grad_hess_wrt_logit
from mlbb_draft.metrics import auc, log_loss
from mlbb_draft.models import BCEObjective
from mlbb_draft.schema import Draft


def _problem(seed: int = 0):
    rng = np.random.default_rng(seed)
    X = rng.normal(size=(60, 5))
    y = (rng.random(60) < expit(X @ np.array([1.0, -2.0, 0.5, 0.0, 0.0]))).astype(float)
    return rng, X, y


def test_gradient_is_the_stated_formula_without_weights_or_penalty():
    rng, X, y = _problem()
    params = rng.normal(size=6)
    _, grad = bce_l2_loss_and_grad(params, X, y, np.ones(60), 0.0)
    resid = expit(X @ params[1:] + params[0]) - y
    assert np.allclose(grad[1:], (resid[:, None] * X).sum(axis=0))  # sum_i (sigma(z_i) - y_i) x_ij
    assert math.isclose(grad[0], resid.sum())


def test_gradient_matches_finite_differences_with_weights_and_l2():
    rng, X, y = _problem(1)
    sw = rng.uniform(0.2, 2.0, 60)
    f = lambda p: bce_l2_loss_and_grad(p, X, y, sw, 3.0)[0]  # noqa: E731
    g = lambda p: bce_l2_loss_and_grad(p, X, y, sw, 3.0)[1]  # noqa: E731
    assert check_grad(f, g, rng.normal(size=6)) < 1e-4


def test_l2_shrinks_weights_and_intercept_is_free():
    _, X, y = _problem(2)
    loose = LogisticL2(l2=0.01).fit(X, y)
    tight = LogisticL2(l2=100.0).fit(X, y)
    assert np.linalg.norm(tight.coef_) < np.linalg.norm(loose.coef_)
    assert loose.converged_
    assert abs(tight.predict_proba(X).mean() - y.mean()) < 0.02


def test_logit_derivatives_and_catboost_objective_signs():
    z, y = np.array([-2.0, 0.0, 3.0]), np.array([0.0, 1.0, 1.0])
    grad, hess = grad_hess_wrt_logit(z, y)
    assert np.allclose(grad, expit(z) - y) and np.allclose(hess, expit(z) * (1 - expit(z)))
    ders = BCEObjective().calc_ders_range(z.tolist(), y.tolist(), None)
    assert np.allclose([d[0] for d in ders], y - expit(z)) and all(d[1] < 0 for d in ders)


def _draft(day: date, patch: str) -> Draft:
    return Draft("m", day, patch, "A", "B", (), (), blue_win=1)


def test_patch_decay_is_exponential_in_patch_age():
    patches = {"old": date(2026, 9, 1), "new": date(2026, 10, 1)}
    lam = lambda_from_half_life(30.0)
    as_of = date(2026, 10, 31)
    old, new = _draft(date(2026, 9, 20), "old"), _draft(date(2026, 10, 20), "new")
    assert patch_age_days(old, as_of, patches) == 60 and patch_age_days(new, as_of, patches) == 30
    w = patch_decay_weights([old, new], as_of, lam, patches)
    assert math.isclose(w[0] / w[1], math.exp(-lam * 30)) and math.isclose(w[0] / w[1], 0.5)
    assert math.isclose(w.mean(), 1.0)
    assert patch_age_days(_draft(date(2026, 10, 30), "unknown"), as_of, patches) == 1
    assert np.allclose(patch_decay_weights([old, new], as_of, 0.0, patches), 1.0)


def test_metrics():
    y = np.array([1.0, 0.0, 1.0, 0.0])
    assert math.isclose(log_loss(y, np.full(4, 0.5)), math.log(2))
    assert auc(y, np.array([0.9, 0.1, 0.8, 0.3])) == 1.0
