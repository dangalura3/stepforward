"""CSV loaders: matches, patches, M8 teams, and the bundled sample dataset.

Match CSV columns: match_id, date (YYYY-MM-DD), patch, blue_team, red_team, blue_picks, red_picks,
blue_bans, red_bans, blue_win. Heroes inside a cell are separated by '|' and picks are in pick order.
"""

from __future__ import annotations

import csv
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from .heroes import DATA_DIR, HeroTable, load_hero_table
from .schema import Draft

MATCH_COLUMNS = (
    "match_id", "date", "patch", "blue_team", "red_team", "blue_picks", "red_picks", "blue_bans", "red_bans", "blue_win",
)


@dataclass(frozen=True)
class Team:
    code: str
    name: str
    region: str
    route: str
    stage: str
    status: str


def load_m8_teams(path: str | Path | None = None) -> list[Team]:
    """Teams for the M8 World Championship (main stage and wild card), including slots not yet decided."""
    path = Path(path) if path else DATA_DIR / "m8_teams.csv"
    with open(path, newline="", encoding="utf-8") as handle:
        return [Team(**{k: row[k] for k in ("code", "name", "region", "route", "stage", "status")}) for row in csv.DictReader(handle)]


def load_patches(path: str | Path | None = None) -> dict[str, date]:
    """Patch name -> release date."""
    path = Path(path) if path else DATA_DIR / "patches.csv"
    with open(path, newline="", encoding="utf-8") as handle:
        return {row["patch"]: date.fromisoformat(row["release_date"]) for row in csv.DictReader(handle)}


def _split(cell: str) -> tuple[str, ...]:
    return tuple(part.strip() for part in cell.split("|") if part.strip())


def load_matches(path: str | Path, table: HeroTable | None = None, strict: bool = True) -> list[Draft]:
    """Read drafts from a CSV. Hero names are mapped to the hero table's spelling; with strict=True an unknown hero
    raises ValueError, otherwise the whole row is skipped. Rows come back sorted by date then match_id."""
    table = table or load_hero_table()
    drafts: list[Draft] = []
    with open(path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        missing = [c for c in MATCH_COLUMNS if c not in (reader.fieldnames or [])]
        if missing:
            raise ValueError(f"{path}: missing columns {missing}")
        for line, row in enumerate(reader, start=2):
            try:
                names = {k: tuple(table.canonical(h) for h in _split(row[k])) for k in ("blue_picks", "red_picks", "blue_bans", "red_bans")}
                win = row["blue_win"].strip()
                draft = Draft(
                    match_id=row["match_id"].strip(), date=date.fromisoformat(row["date"].strip()), patch=row["patch"].strip(),
                    blue_team=row["blue_team"].strip(), red_team=row["red_team"].strip(),
                    blue_picks=names["blue_picks"], red_picks=names["red_picks"], blue_bans=names["blue_bans"], red_bans=names["red_bans"],
                    blue_win=int(win) if win else None,
                )
                draft.validate()
            except (ValueError, KeyError) as exc:
                if strict:
                    raise ValueError(f"{path} line {line}: {exc}") from exc
                continue
            drafts.append(draft)
    drafts.sort(key=lambda d: (d.date, d.match_id))
    return drafts


def write_matches(drafts: Iterable[Draft], path: str | Path) -> None:
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(MATCH_COLUMNS)
        for d in drafts:
            writer.writerow([
                d.match_id, d.date.isoformat(), d.patch, d.blue_team, d.red_team, "|".join(d.blue_picks), "|".join(d.red_picks),
                "|".join(d.blue_bans), "|".join(d.red_bans), "" if d.blue_win is None else d.blue_win,
            ])


def load_sample_dataset(table: HeroTable | None = None) -> list[Draft]:
    """The bundled SYNTHETIC sample (made by mlbb_draft.sample, seed 2026). It has planted hero, synergy, counter and
    team-strength effects so the pipeline can be tested; it is not real match data."""
    path = DATA_DIR / "sample_matches.csv"
    if not path.exists():
        from .sample import generate_synthetic_matches

        drafts = generate_synthetic_matches(table=table).drafts
        write_matches(drafts, path)
        return drafts
    return load_matches(path, table)
