# CLAUDE.md - instructions for AI coding assistants working on StepForward

## What this project is
StepForward predicts the next **ban** or **pick** in Mobile Legends: Bang Bang (MLBB) pro drafts and
simulates a draft step by step. It is a static web app: all models run in the browser. No backend, no API keys.
The owner is a beginner. Explain changes in plain, simple English ("explain like I'm 12").

## Commands
- `npm run build`  : rebuilds `site/index.html` from `src/` + `data/` (deterministic; commit the result)
- `npm test`       : unit tests (Node's built-in runner, no packages to install)
- `npm run test:py`: Python engine tests (`engine/`, needs numpy, scipy, pytest)

## Layout
- `src/model.js`   ban statistics (recency, side, head-to-head, shrinkage to league, playoff prior)
- `src/sim.js`     draft engine: order, apply/undo, lane feasibility, ban and pick prediction
- `src/comp.js`    composition rating and win probability
- `src/bt.js`      Bayesian Bradley-Terry team strength and series maths
- `src/explain.js`  "Explain this draft": plain-English paragraph from on-screen numbers (templates only, no LLM, no network)
- `src/index.template.html`  the whole UI (HTML + CSS + JS in one file; the build injects the modules)
- `scripts/build.js`         builds the page from the template and `data/`
- `data/`          games, research notes, tuned results. Provenance is in `docs/`
- `engine/`        optional Python engine (logistic regression and CatBoost)
- `site/`          the deployed output. Never edit `site/index.html` by hand; edit `src/` and rebuild

## Rules
1. **Never invent data.** Every number shown in the app or the docs must come from `data/` or a cited source.
   If something is unknown, show it as unknown.
2. **Be honest about accuracy.** Win prediction is about a coin flip on the data we have. Do not claim more.
   Report ban accuracy as measured walk-forward (never test on data the model saw).
3. **Keep the modules dependency-free** (plain JavaScript, ES5 style inside an IIFE, works in browser and Node).
4. **Every change that touches a model needs a test** in `tests/` and, if it changes a number, a re-run of the
   walk-forward check (`tests/sim.test.js`).
5. **No secrets in the repo.** `tests/data.test.js` scans for keys. Use environment variables and GitHub Secrets.
6. **Respect the data sources.** Do not scrape. Read single pages by hand, record where each fact came from.
7. **No copied game art** without permission. Hero tiles use initials badges unless the owner supplies image URLs
   in `data/hero_img.json`.
8. **Mobile first.** After any UI change, check there is no sideways scroll at 400 px wide.
9. Small commits with clear messages: `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`.

## Definition of done
`npm run build && npm test` pass, the page opens with no console errors, and `spec.md` acceptance criteria still hold.
