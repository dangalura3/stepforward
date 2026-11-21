# MLBB draft win-probability and pick recommendation engine

Predicts P(blue team wins) from a draft (finished or half-way) and suggests the best next picks.

## Run it
    pip install numpy scipy catboost pytest
    python -m pytest -q                       # 22 unit tests
    python -m mlbb_draft --tune               # train + test on the bundled SYNTHETIC sample, list M8 teams
    python -m mlbb_draft --data my_games.csv --blue "Kalea|Freya" --red "Esmeralda" --bans "Fanny|Masha" --side blue

Without catboost installed it automatically uses the SciPy logistic model (same loss, linear log-odds).

## In Python
    from mlbb_draft import DraftEngine, DraftState, load_matches, predict_best_pick
    engine = DraftEngine().fit(load_matches("my_games.csv"))
    state = DraftState(blue_picks=("Kalea",), red_picks=("Esmeralda", "Atlas"), bans=("Fanny",), side_to_pick="blue",
                       blue_team="BTR", red_team="RORA")
    engine.predict_state(state)               # P(blue wins)
    predict_best_pick(state, engine)          # top 3 by  dP_k = P(Y=1 | X + {k}) - P(Y=1 | X)

## Your match CSV (one row per game)
    match_id,date,patch,blue_team,red_team,blue_picks,red_picks,blue_bans,red_bans,blue_win
    M8-001,2027-01-03,2.2.16a,BTR,RORA,Kalea|Freya|Zhuxin|Granger|Khufra,Esmeralda|Fanny|Pharsa|Claude|Atlas,...,...,1
Picks in pick order, heroes split by `|`, blue_win 1 or 0. Add new patches to `mlbb_draft/data/patches.csv`.
M8 teams are in `mlbb_draft/data/m8_teams.csv` (fill the "To be decided" rows after MCT SEA, 9-13 Dec 2026).

## Where each requirement lives
| Requirement | File |
|---|---|
| BCE + L2, z = w0 + sum w_j x_j, exact gradient sum (sigma(z_i) - y_i) x_ij | `logistic.py` |
| CatBoost (Logloss + l2_leaf_reg; optional exact-derivative custom objective) | `models.py` |
| Patch decay w(t) = exp(-lambda t) | `decay.py` |
| 2N sparse multi-hot, synergy matrix, counter delta, role balance, smoothed target encoding | `features.py` |
| Training, partial-draft rows, time-ordered testing, tuning lambda and L2 | `engine.py` |
| `predict_best_pick(current_draft_state)` | `recommend.py` |
| Sample dataset loader, CSV loader, M8 teams | `loaders.py`, `sample.py` |

## Honest limits
- The bundled sample is synthetic. Its scores show the code works, not how accurate it will be on real games.
- The CatBoost path could not be run where this was built (package not installed); only its wiring is tested.
- Draft alone explains a small part of who wins; expect modest edges on real data.
