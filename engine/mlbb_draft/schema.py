"""Plain data containers for drafts. Picks are listed in pick order (first pick first)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Literal

Side = Literal["blue", "red"]
PICKS_PER_SIDE = 5


@dataclass(frozen=True)
class Draft:
    """One finished (or partial) game. ``blue_win`` is 1 if blue won, 0 if red won, None if unknown."""

    match_id: str
    date: date
    patch: str
    blue_team: str
    red_team: str
    blue_picks: tuple[str, ...]
    red_picks: tuple[str, ...]
    blue_bans: tuple[str, ...] = ()
    red_bans: tuple[str, ...] = ()
    blue_win: int | None = None

    def validate(self) -> None:
        for side, picks in (("blue", self.blue_picks), ("red", self.red_picks)):
            if len(picks) > PICKS_PER_SIDE:
                raise ValueError(f"{self.match_id}: {side} has {len(picks)} picks (max {PICKS_PER_SIDE})")
        everything = self.blue_picks + self.red_picks
        if len(set(everything)) != len(everything):
            raise ValueError(f"{self.match_id}: a hero is picked twice")
        if set(everything) & set(self.blue_bans + self.red_bans):
            raise ValueError(f"{self.match_id}: a hero is both banned and picked")
        if self.blue_win not in (0, 1, None):
            raise ValueError(f"{self.match_id}: blue_win must be 0, 1 or empty")

    @property
    def is_complete(self) -> bool:
        return len(self.blue_picks) == PICKS_PER_SIDE and len(self.red_picks) == PICKS_PER_SIDE


@dataclass(frozen=True)
class DraftState:
    """A draft in progress. ``bans`` holds every banned hero (both sides)."""

    blue_picks: tuple[str, ...] = ()
    red_picks: tuple[str, ...] = ()
    bans: tuple[str, ...] = ()
    side_to_pick: Side = "blue"
    blue_team: str = ""
    red_team: str = ""
