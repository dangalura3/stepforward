# Submission checklist - Week 4 Graded Mini Project (20 points)

Legend: ✅ done · 🟡 done, but you must review or finish a small part · ⬜ not done yet

**Links:** repo https://github.com/dangalura3/stepforward · live app https://dangalura3.github.io/stepforward/ · demo https://drive.google.com/file/d/1ETHGOGcTAkjYtsfzWfsyQ_NOj_MDCLJA/view?usp=sharing · v2 issue: GitHub Issues #1

## A. Rubric self-check

| Criterion (4 pts each) | What would score 4 | Where it is | Status |
|---|---|---|---|
| **Problem & Validation** | All 7 steps with real evidence; clear "why now"; specific user | `docs/IDEA_VALIDATION.md` (7 steps, 17 sources, measured results, 3 interviews) | ✅ 3 interviews and the 5-person phone test (5 of 5 finished) |
| **PRD Quality** | All 6 components; specific features with testable acceptance criteria | `docs/PRD.md` (the 6 parts from the Week 4A slides: problem statement, target users, core features with acceptance criteria, out of scope, success metrics, open questions) | ✅ matches the Week 4A template |
| **Spec & Architecture** | All 5 spec elements; testable criteria; `CLAUDE.md` and `.cursorrules` present | `spec.md` (v1.1: capability, inputs, outputs, 17 acceptance criteria, architecture, revision log), `docs/ARCHITECTURE.md`, `CLAUDE.md`, `.cursorrules` | ✅ |
| **Working Application** | Live URL; core AI feature works; clean UI; no broken flows | https://dangalura3.github.io/stepforward/ | ✅ tested in a private window and on a phone (22 Nov 2026) |
| **CI/CD & Engineering Quality** | GitHub Actions; no hardcoded secrets; meaningful commits; README complete | `.github/workflows/ci.yml` (tests, Python tests, secret scan, Pages deploy), `uptime.yml`, 20+ commits, `README.md` | ✅ (the deploy job runs only after the tests and the secret scan pass) |

## B. Core deliverables

| # | Deliverable | File / link | Status |
|---|---|---|---|
| 1 | Idea Validation Report (7 steps + evidence) | `docs/IDEA_VALIDATION.md` | ✅ |
| 2 | PRD, one page, 6 components | `docs/PRD.md` | ✅ |
| 3 | `spec.md` + Architecture notes | `spec.md`, `docs/ARCHITECTURE.md` | ✅ |
| 4 | GitHub repo: public, 5+ commits, README, CI/CD | github.com/dangalura3/stepforward | ✅ |
| 5 | Live deployed app | GitHub Pages URL above | ✅ |
| 6 | 2-minute demo recording | Drive link above (also in `README.md`) | ✅ plays in a private window (22 Nov 2026) |
| 7 | 1-page reflection | `docs/REFLECTION.md` | ✅ |
| 8 | One GitHub issue for a v2 improvement | Issue #1 | ✅ |

## C. Manual test before you submit (10 minutes, on your phone)

1. Open the live URL in a **private window**. Pick **ONIC Esports** vs **Bigetron by Vitality**.
2. The box under *Ban 1* shows suggestions. Tap one → it fills the slot and the next box appears.
3. Type `khuf` in the box, press Enter → Khufra is recorded.
4. Keep tapping until "Draft complete". Press **Undo** → it steps back.
5. Scroll sideways: the page must not move left-right.
6. Open **How accurate is it?** and **Explain this draft**. Open Formulas, Habits and Programs from the links under the title.

## D. Things an AI cannot do for you

- Talk to real people (done for the interviews and the 5-person phone test; a community post is optional).
- Hero pictures: the badges are placeholders; real pictures need an image source (see the note in `README.md`).

## E. Graded Assignment 4.2 brief - phase by phase

| Phase / task | Where | Status |
|---|---|---|
| **1** All 7 validation steps; user, problem, market evidence; differentiating angle | `docs/IDEA_VALIDATION.md` | ✅ interviews and phone test (5 of 5) added |
| **1** 1-page PRD | `docs/PRD.md` (about 600 words, 6 parts from Week 4A) | ✅ |
| **2** Architecture notes | `docs/ARCHITECTURE.md` | ✅ |
| **2** `spec.md` | `spec.md` | ✅ |
| **2** `CLAUDE.md` / `agents.md` | `CLAUDE.md` | ✅ |
| **2** `.cursorrules` | `.cursorrules` | ✅ |
| **2** Revise the spec after review | `spec.md` section 8 (v1.1) | ✅ |
| **3** Scaffold the application | `src/`, `scripts/build.js`, `site/` | ✅ |
| **3** Core AI feature | ban / pick / win models in `src/` | ✅ |
| **3** At least 5 meaningful commits | `git log --oneline` (20+) | ✅ |
| **3** At least 3 unit tests | `tests/` (26 JS tests) and `engine/` (22 Python tests) | ✅ |
| **3** Check secrets and input validation | gitleaks job, `tests/data.test.js`, `tests/input.test.js` (AC-10, AC-17) | ✅ |
| **4** Configure GitHub Actions | `.github/workflows/ci.yml` | ✅ |
| **4** Deploy to a live host | GitHub Pages (`deploy-pages` job in `ci.yml`) | ✅ |
| **4** Set environment variables | The app needs none. The only setting is the optional repository variable `LIVE_URL` used by `uptime.yml`; Pages needs no secret | ✅ (nothing required) |
| **4** Test the live app | section C above | ✅ done in a private window and on a phone |
| **4** Basic monitoring or analytics | `.github/workflows/uptime.yml` | ✅ run by hand twice on 22 Nov 2026, both green |
| **5** Complete README | `README.md` (live link, demo link, tests, CI/CD, monitoring) | ✅ |
| **5** 2-minute demo | Drive link above | ✅ plays in a private window |
| **5** 1-page reflection | `docs/REFLECTION.md` | ✅ |
| **5** One GitHub issue for a v2 improvement | Issue #1 | ✅ |
| **Before submission** URL works in incognito; repo public; secrets not exposed; demo link works; reflection attached | | ✅ all checked except your own final read-through |
