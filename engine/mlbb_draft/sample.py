"""Synthetic draft generator with known (planted) effects, for tests and demos.

Everything produced here is SYNTHETIC: heroes get hidden strengths, some hero pairs get a synergy lift, some ordered
pairs get a counter lift, and teams get a skill level. Real match results are not used. Because the truth is known,
tests can check that the pipeline finds the signal that was put in.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

import numpy as np
from numpy.typing import NDArray
from scipy.special import expit

from .heroes import DATA_DIR, HeroTable, load_hero_table
from .loaders import load_patches, write_matches
from .schema import Draft

LANES = ("EXP", "Jungle", "Mid", "Gold", "Roam")


@dataclass
class SyntheticWorld:
    drafts: list[Draft]
    hero_strength: dict[str, float]
    synergy_pairs: dict[tuple[str, str], float]
    counter_pairs: dict[tuple[str, str], float]
    team_skill: dict[str, float]


def generate_synthetic_matches(
    n_matches: int = 1800, seed: int = 2026, table: HeroTable | None = None, start: date = date(2026, 8, 14),
    span_days: int = 90, hero_sd: float = 0.30, synergy_lift: float = 0.40, counter_lift: float = 0.35, team_sd: float = 0.35,
    n_synergy: int = 70, n_counter: int = 90,
) -> SyntheticWorld:
    rng = np.random.default_rng(seed)
    table = table or load_hero_table()
    patches = sorted(load_patches().items(), key=lambda kv: kv[1])
    teams = [f"SYN-T{i + 1:02d}" for i in range(12)]  # made-up teams: no fake results for real teams
    n = table.n
    strength = rng.normal(0.0, hero_sd, n)
    patch_shift = {p: rng.normal(0.0, 0.18, n) for p, _ in patches}  # the meta moves a little each patch
    synergy: dict[tuple[int, int], float] = {}
    while len(synergy) < n_synergy:
        a, b = sorted(rng.choice(n, 2, replace=False).tolist())
        synergy[(a, b)] = synergy_lift * rng.choice([-1.0, 1.0], p=[0.25, 0.75])
    counter: dict[tuple[int, int], float] = {}
    while len(counter) < n_counter:
        a, b = rng.choice(n, 2, replace=False).tolist()
        if (b, a) not in counter:
            counter[(a, b)] = counter_lift
    skill = {t: float(rng.normal(0.0, team_sd)) for t in teams}
    lane_pool = {ln: np.array([i for i in range(n) if ln in table.lanes[i]] or list(range(n))) for ln in LANES}

    days = np.sort(rng.integers(0, span_days, n_matches))
    drafts: list[Draft] = []
    for m in range(n_matches):
        day = start + timedelta(days=int(days[m]))
        patch = [p for p, released in patches if released <= day][-1] if any(r <= day for _, r in patches) else patches[0][0]
        shift = patch_shift[patch]
        blue_team, red_team = rng.choice(teams, 2, replace=False).tolist()
        taken: set[int] = set()
        sides: list[list[int]] = [[], []]
        for slot in range(5):
            for side in (0, 1):
                pool = np.array([h for h in lane_pool[LANES[slot]] if h not in taken])
                if len(pool) == 0:
                    pool = np.array([h for h in range(n) if h not in taken])
                weights = np.exp(1.5 * (strength[pool] + shift[pool]))
                hero = int(rng.choice(pool, p=weights / weights.sum()))
                taken.add(hero)
                sides[side].append(hero)
        blue, red = sides
        z = 0.08 + skill[blue_team] - skill[red_team]
        z += float(np.sum(strength[blue] + shift[blue]) - np.sum(strength[red] + shift[red]))
        for (a, b), lift in synergy.items():
            z += lift * ((a in blue and b in blue) - (a in red and b in red))
        for (a, b), lift in counter.items():
            z += lift * ((a in blue and b in red) - (a in red and b in blue))
        win = int(rng.random() < float(expit(z)))
        banned = [h for h in rng.choice([i for i in range(n) if i not in taken], 10, replace=False).tolist()]
        names = table.names
        drafts.append(Draft(
            match_id=f"SYN-{m + 1:05d}", date=day, patch=patch, blue_team=blue_team, red_team=red_team,
            blue_picks=tuple(names[h] for h in blue), red_picks=tuple(names[h] for h in red),
            blue_bans=tuple(names[h] for h in banned[:5]), red_bans=tuple(names[h] for h in banned[5:]), blue_win=win,
        ))
    return SyntheticWorld(
        drafts=drafts, hero_strength={table.names[i]: float(strength[i]) for i in range(n)},
        synergy_pairs={(table.names[a], table.names[b]): v for (a, b), v in synergy.items()},
        counter_pairs={(table.names[a], table.names[b]): v for (a, b), v in counter.items()}, team_skill=skill,
    )


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Write the synthetic sample dataset CSV.")
    parser.add_argument("--out", default=str(DATA_DIR / "sample_matches.csv"))
    parser.add_argument("--matches", type=int, default=1800)
    parser.add_argument("--seed", type=int, default=2026)
    args = parser.parse_args(argv)
    world = generate_synthetic_matches(n_matches=args.matches, seed=args.seed)
    write_matches(world.drafts, Path(args.out))
    print(f"wrote {len(world.drafts)} synthetic matches to {args.out}")


if __name__ == "__main__":
    main()
