"""Command line: train, test on the newest games, list the M8 teams and show a pick recommendation.

    python -m mlbb_draft                      # bundled synthetic sample
    python -m mlbb_draft --data my_games.csv  # your own match CSV
"""

from __future__ import annotations

import argparse
import math

from .engine import DraftEngine, EngineConfig, time_split, tune_hyperparameters
from .loaders import load_m8_teams, load_matches, load_sample_dataset
from .recommend import predict_best_pick
from .schema import DraftState


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(prog="mlbb_draft", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--data", help="match CSV (default: bundled synthetic sample)")
    parser.add_argument("--backend", choices=("auto", "catboost", "logistic"), default="auto")
    parser.add_argument("--tune", action="store_true", help="search the decay half-life and L2 strength first")
    parser.add_argument("--blue", default="", help="blue picks so far, separated by |")
    parser.add_argument("--red", default="", help="red picks so far, separated by |")
    parser.add_argument("--bans", default="", help="all banned heroes, separated by |")
    parser.add_argument("--side", choices=("blue", "red"), default="blue", help="side that picks next")
    args = parser.parse_args(argv)

    drafts = load_matches(args.data) if args.data else load_sample_dataset()
    print(f"games: {len(drafts)}" + ("" if args.data else "  (SYNTHETIC sample, not real matches)"))
    train, test = time_split(drafts, 0.2)
    config = EngineConfig(backend=args.backend)
    if args.tune:
        result = tune_hyperparameters(train, base=config)
        config = result.best
        print(f"tuned: half-life {config.half_life_days:g} days (lambda {config.decay_lambda:.4f}/day), L2 {config.l2:g}")
    engine = DraftEngine(config).fit(train)
    scores = engine.evaluate(test)
    print(f"backend: {engine.backend_name}")
    print(f"newest {int(scores['n'])} games (never seen in training): log-loss {scores['log_loss']:.4f} "
          f"(coin flip = {math.log(2):.4f}), accuracy {scores['accuracy']:.1%}, AUC {scores['auc']:.3f}, "
          f"Brier {scores['brier']:.4f}, calibration error {scores['ece']:.3f}")

    print("\nM8 World Championship teams:")
    for team in load_m8_teams():
        print(f"  [{team.stage:8}] {team.name:22} {team.region:15} {team.route}")

    split = lambda cell: tuple(x.strip() for x in cell.split("|") if x.strip())  # noqa: E731
    state = DraftState(blue_picks=split(args.blue), red_picks=split(args.red), bans=split(args.bans), side_to_pick=args.side)
    engine_all = DraftEngine(config).fit(drafts)
    print(f"\nP(blue wins) now: {engine_all.predict_state(state):.1%}. Best next picks for {args.side}:")
    for rec in predict_best_pick(state, engine_all):
        print(f"  {rec.hero:16} {rec.role:9} gain {rec.delta_p:+.1%}  (blue win chance {rec.p_blue_before:.1%} -> {rec.p_blue_after:.1%})")


if __name__ == "__main__":
    main()
