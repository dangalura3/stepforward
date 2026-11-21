from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from mlbb_draft import DraftEngine, EngineConfig, load_hero_table  # noqa: E402
from mlbb_draft.sample import SyntheticWorld, generate_synthetic_matches  # noqa: E402


@pytest.fixture(scope="session")
def table():
    return load_hero_table()


@pytest.fixture(scope="session")
def world() -> SyntheticWorld:
    return generate_synthetic_matches(n_matches=900, seed=7)


@pytest.fixture(scope="session")
def engine(world: SyntheticWorld) -> DraftEngine:
    return DraftEngine(EngineConfig(backend="logistic", l2=100.0)).fit(world.drafts)
