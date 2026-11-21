"""Hero metadata used by the role-balance features (role, damage split, frontline, hard crowd control)."""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from numpy.typing import NDArray

DATA_DIR = Path(__file__).parent / "data"
ROLES: tuple[str, ...] = ("Fighter", "Mage", "Assassin", "Marksman", "Tank", "Support")

# Used only when the source table says UNKNOWN for a hero: a role-level prior.
_PHYSICAL_PRIOR = {"Fighter": 0.85, "Mage": 0.05, "Assassin": 0.75, "Marksman": 0.95, "Tank": 0.5, "Support": 0.3}
_FRONTLINE_PRIOR = {"Fighter": 0.45, "Mage": 0.05, "Assassin": 0.05, "Marksman": 0.0, "Tank": 0.9, "Support": 0.35}
_HARD_CC_PRIOR = {"Fighter": 0.4, "Mage": 0.5, "Assassin": 0.3, "Marksman": 0.1, "Tank": 0.8, "Support": 0.6}


@dataclass(frozen=True)
class HeroTable:
    names: tuple[str, ...]
    role_idx: NDArray[np.int64]
    physical: NDArray[np.float64]
    magic: NDArray[np.float64]
    frontline: NDArray[np.float64]
    hard_cc: NDArray[np.float64]
    lanes: tuple[frozenset[str], ...]

    @property
    def n(self) -> int:
        return len(self.names)

    def _lookup(self) -> dict[str, int]:
        return {name.casefold(): i for i, name in enumerate(self.names)}

    def index(self, name: str) -> int:
        """Return the hero's index; the match ignores case and surrounding spaces."""
        key = " ".join(name.split()).casefold()
        try:
            return self._lookup()[key]
        except KeyError:
            raise ValueError(f"unknown hero: {name!r}") from None

    def canonical(self, name: str) -> str:
        return self.names[self.index(name)]

    def role_of(self, name: str) -> str:
        return ROLES[int(self.role_idx[self.index(name)])]


def _flag(value: str, prior: float) -> float:
    value = value.strip().upper()
    if value == "Y":
        return 1.0
    if value == "N":
        return 0.0
    return prior


def load_hero_table(path: str | Path | None = None) -> HeroTable:
    path = Path(path) if path else DATA_DIR / "hero_table.csv"
    rows: list[dict[str, str]] = []
    with open(path, newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        raise ValueError(f"{path} has no heroes")
    names: list[str] = []
    role_idx: list[int] = []
    physical: list[float] = []
    frontline: list[float] = []
    hard_cc: list[float] = []
    lanes: list[frozenset[str]] = []
    for row in rows:
        role = row["role"].strip()
        if role not in ROLES:
            raise ValueError(f"{row['hero']}: unknown role {role!r}")
        names.append(row["hero"].strip())
        role_idx.append(ROLES.index(role))
        damage = row["damage_type"].strip().capitalize()
        if damage == "Physical":
            physical.append(1.0)
        elif damage == "Magic":
            physical.append(0.0)
        elif damage == "Mixed":
            physical.append(0.5)
        else:
            physical.append(_PHYSICAL_PRIOR[role])
        frontline.append(_flag(row["frontline"], _FRONTLINE_PRIOR[role]))
        hard_cc.append(_flag(row["hard_cc"], _HARD_CC_PRIOR[role]))
        lanes.append(frozenset(x.strip() for x in row["lanes"].split("|") if x.strip()))
    phys = np.asarray(physical, dtype=np.float64)
    return HeroTable(
        names=tuple(names), role_idx=np.asarray(role_idx, dtype=np.int64), physical=phys,
        magic=1.0 - phys, frontline=np.asarray(frontline, dtype=np.float64),
        hard_cc=np.asarray(hard_cc, dtype=np.float64), lanes=tuple(lanes),
    )
