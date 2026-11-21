# spec.md - StepForward

**Version 1.0 · 21 Nov 2026 · Owner: Danilo S. Galura Jr.**
Spec for the AI module and the app around it. The PRD (`docs/PRD.md`) says *what and why*; this file says *exactly how it must behave*.

## 1. AI capability

**Type: classification / ranking.** In a Mobile Legends pro draft, the model reads the draft so far and ranks every hero (about 135)
by how likely it is to be the **next ban** or the **next pick** for the team whose turn it is.
A second, weaker module estimates the **win chance** of a finished draft and of a best-of-3 / best-of-5 series.

| Module | Question it answers | Method (no LLM, runs in the browser) | Status |
|---|---|---|---|
| Ban model | "Which hero will this team ban next?" | Recency-weighted team ban frequency, side and head-to-head weights, shrinkage to a league prior, playoff prior, lane-feasibility check | **Core feature**, measured |
| Pick model | "Which hero will this team pick next?" | Team and player hero pools, ban-shift (a banned hero's chance moves to its replacements), matchup and combo rules, denial | Core feature, measured on a small set |
| Win model | "Who is favoured?" | Logistic blend of team strength, hero evidence, composition and side; Bayesian Bradley-Terry (MCMC) for series | **About a coin flip** - shown with a warning |
| Python engine | Same questions, trainable on new CSV data | BCE + L2 logistic regression (SciPy) and optional CatBoost | Optional, unit-tested on a synthetic sample |

## 2. Inputs

| Input | Type | Source | Validation |
|---|---|---|---|
| Blue team, Red team | one of 24 team codes (M8 teams and MPL ID teams) | dropdowns | two different teams |
| Draft so far | ordered list of heroes with step type (ban/pick) and side | tap a hero in the quick-pick box, the hero list, or type names | hero must exist, no hero twice (AC-2) |
| Draft order | 20 steps, default `bB rB bB rB bB rB | bP rP rP bP bP rP | rB bB rB bB | rP bP bP rP` | `src/sim.js` | exactly 10 bans and 10 picks |
| Switches | playoff prior, matchup rules, patch discount, ban-shift, drafter habits (off by default), hot-hero list | checkboxes | booleans |
| History | 198 real MPL ID S18 games + 105 MPL Malaysia S18 games (playoff prior), dated | `data/` (built into the page) | every game has two teams, a winner and 5 bans per side (AC-9) |

## 3. Outputs

1. **Top 5 bans / top 5 picks** for the team on the clock (list of 10 is stored for scoring): hero, probability (sums to 1 across all heroes), short reason tags (Target, Meta, Habit, Playoff, Protect, Deny, Signature, Counter, Combo, Replaces, Flex).
2. **Quick-pick box** under the active slot: the top 6 suggestions with their chance, plus a search box for any hero.
3. **Scorecard**: when you record what really happened, the app shows the rank the model gave it and keeps a running log-score and top-5 hit rate.
4. **Draft verdict**: win chance clamped to 35-65%, composition notes, and best-of-3 odds with a credible range.
5. **Projection**: the draft the model would produce if each team follows its first guess.
6. **Transparency pages**: `formulas.html` (all formulas and accuracy tests), `habits.html`, `programs.html` (source code shown).

## 4. Acceptance criteria (testable)

| ID | Criterion | How it is checked |
|---|---|---|
| AC-1 | The default draft has 20 steps: 10 bans and 10 picks; blue bans first. | `tests/sim.test.js` - "draft order…" |
| AC-2 | A hero can be used only once per draft; Undo frees it. | `tests/sim.test.js` - "a hero can only be used once", "undo…" |
| AC-3 | A ban prediction is sorted from most to least likely, probabilities sum to 1 (±1e-6), and used heroes are never listed. | `tests/sim.test.js` - "ban prediction is a sorted probability list…" |
| AC-4 | **Accuracy floor:** on the last 40 real games (each predicted only from games before it), the real ban is in the model's top 5 at least 30% of the time (random is ~4%; measured ~50%). | `tests/sim.test.js` - "walk-forward…" |
| AC-5 | The lane check rejects five heroes that cannot cover five distinct lanes. | `tests/sim.test.js` - "lane feasibility…" |
| AC-6 | Series maths is correct: fair coin = 50%, one game left = single-game chance, longer series favour the better team. | `tests/stats.test.js` |
| AC-7 | The Bradley-Terry fit ranks a team that wins 80% of games above its opponent with P > 0.9. | `tests/stats.test.js` |
| AC-8 | The win model never shows less than 35% or more than 65%, and its weights match the documented values. | `tests/stats.test.js` (weights), manual check of the verdict panel |
| AC-9 | Every game record has two different teams, a winner from those teams, and 5 unique bans per side. | `tests/data.test.js` |
| AC-10 | No secrets are stored in the repository. | `tests/data.test.js` and the CI secret-scan job |
| AC-11 | `npm run build` reproduces `site/index.html`; the page has a viewport tag and no console errors. | CI build job, `tests/data.test.js` |
| AC-12 | **Quick-pick:** when it is a team's turn, a box appears directly under that team's active slot with the top suggestions; one tap records the hero and moves to the next step; typing a name + Enter records it and keeps focus in the box. | Manual script in `docs/SUBMISSION_CHECKLIST.md` (Playwright run on the original build: full 20-step draft by taps only, desktop and 400 px) |
| AC-13 | No sideways scrolling on a 400 px wide phone screen. | Manual (Playwright check on the original build) |
| AC-14 | The app never claims more accuracy than measured: the win model is labelled "about a coin flip". | Manual review of `formulas.html` and the verdict text |

## 5. Architecture (summary - full notes in `docs/ARCHITECTURE.md`)

```
 Browser (static site on Netlify)
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ UI  src/index.template.html   VS banner · team cards · quick-pick box ·    │
 │                               hero list · scorecard · verdict · series      │
 │            │ draft state + settings                                         │
 │            ▼                                                                │
 │ AI layer  src/sim.js ── predictBan / predictPick ── ranked heroes           │
 │            ├─ src/model.js  ban statistics (recency, side, h2h, priors)     │
 │            ├─ src/comp.js   composition rating, win probability             │
 │            └─ src/bt.js     Bayesian Bradley-Terry + series odds            │
 │            ▲                                                                │
 │ Data      games, hero roles/traits, rules, tuned results (baked into page)  │
 └───────────────────────────────────────────────────────────────────────────┘
 Build time: scripts/build.js  (src/ + data/ → site/index.html)
 CI/CD:      GitHub Actions → tests → build check → secret scan → deploy to Netlify
 Optional:   engine/ (Python: SciPy logistic regression, CatBoost) for retraining on new CSVs
```

**Data flow for one tap:** tap hero → `record()` → `S.apply(draft, hero)` → `renderAll()` → `S.predictNext(draft, ctx())` for the new step → ranked list → UI. Nothing leaves the browser.

## 6. Non-functional requirements

- **Privacy:** no accounts, no analytics beyond the host's defaults, no personal data stored.
- **Performance:** a prediction for one step takes well under a second on a phone; the page is a single 0.4 MB file.
- **Reliability:** deterministic models (the only randomness, the Bradley-Terry sampler, uses a fixed seed).
- **Honesty:** every accuracy number on the site comes from `data/results/*.json`, produced by walk-forward tests.

## 7. Out of scope for v1

Live data refresh, user accounts, an LLM explainer (planned for v2, would need a server-side key), copyrighted hero art, in-game overlays.
