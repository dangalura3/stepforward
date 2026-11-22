# Submission checklist - Week 4 Graded Mini Project (20 points)

Legend: ✅ done in this repo · 🟡 done as a draft, you must review/add · ⬜ you must do it (cannot be done by an AI from here)

## A. Rubric self-check

| Criterion (4 pts each) | What would score 4 | Where it is | Status |
|---|---|---|---|
| **Problem & Validation** | All 7 steps with real evidence; clear "why now"; specific user | `docs/IDEA_VALIDATION.md` (7 steps, 17 sources, measured results) | 🟡 add real interview quotes (step 1, 2) and 5-person test (step 6B) |
| **PRD Quality** | All 6 components; specific features with testable acceptance criteria | `docs/PRD.md` (problem, users, goals/metrics, features + AC, scope, risks/timeline) | 🟡 compare with your course's PRD template and rename sections if its 6 components differ |
| **Spec & Architecture** | All 5 spec elements; testable criteria; `CLAUDE.md` and `.cursorrules` present | `spec.md` (capability, inputs, outputs, 17 acceptance criteria, architecture, revision log), `docs/ARCHITECTURE.md`, `CLAUDE.md`, `.cursorrules` | ✅ |
| **Working Application** | Live URL; core AI feature works; clean UI; no broken flows | https://dangalura3.github.io/stepforward/ | 🟡 redeploy the new version, then open it on a phone and run section C |
| **CI/CD & Engineering Quality** | GitHub Actions; no hardcoded secrets; meaningful commits; README complete | `.github/workflows/ci.yml`, `uptime.yml`, secret-scan test, 16+ commits, `README.md` | ⬜ push the repo, add the two Netlify secrets, confirm green check |

## B. Core deliverables

| # | Deliverable | File / link | Status |
|---|---|---|---|
| 1 | Idea Validation Report (7 steps + evidence) | `docs/IDEA_VALIDATION.md` | 🟡 |
| 2 | PRD, one page, 6 components | `docs/PRD.md` | 🟡 |
| 3 | `spec.md` + Architecture notes | `spec.md`, `docs/ARCHITECTURE.md` | ✅ |
| 4 | GitHub repo: public, 5+ commits, README, CI/CD | this folder (git history included) | ⬜ push |
| 5 | Live deployed app | GitHub Pages URL above | 🟡 |
| 6 | 2-minute demo recording | script: `docs/DEMO_SCRIPT.md` | ⬜ record |
| 7 | 1-page reflection | `docs/REFLECTION.md` | 🟡 rewrite in your voice |

## C. Manual test before you submit (10 minutes, on your phone)

1. Open the live URL. Pick **ONIC Esports** vs **Bigetron by Vitality**.
2. The box under *Ban 1* shows suggestions. Tap one → it fills the slot and the next box appears (on the other team's card; on a phone it is a panel at the bottom).
3. Type `khuf` in the box, press Enter → Khufra is recorded.
4. Keep tapping until "Draft complete". Press **Undo** → it steps back.
5. Scroll sideways: the page must not move left-right.
6. Open Formulas, Habits and Programs from the links under the title.

## D. How to publish (beginner steps)

1. **Unzip** the file. Open a terminal inside the `stepforward` folder.
2. On github.com click **New repository** → name `stepforward` → **Public** → do *not* tick "Add a README" → Create.
3. Run (replace YOUR-USERNAME):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/stepforward.git
   git push -u origin main
   ```
   The folder already contains the commit history. Commits are authored with the email in this folder's git config; to use GitHub's private address instead, run `git config user.email "ID+USERNAME@users.noreply.github.com"` before making new commits (from GitHub → Settings → Emails).
4. In `README.md`, replace every `YOUR-USERNAME` with your GitHub name, commit and push.
5. **Deploy through the pipeline (GitHub Pages, free, no secrets):** GitHub repo → Settings → Pages → *Build and deployment* → Source: **GitHub Actions**. Then Actions tab → the latest `CI/CD` run → **Re-run all jobs**. The `Deploy to GitHub Pages` job gives the live link (`https://dangalura3.github.io/stepforward/`). Netlify is optional (see README); its production deploys were paused on this account.
6. Open the **Actions** tab and confirm the green check. Screenshot it for the demo.

## E. Things I could not do for you

- Talk to real people (interviews, usability test, community post).
- Record the demo video or log in to GitHub for you.
- Verify the live site from my side: I cannot open it from here, so check it yourself.
- Hero pictures: the badges are placeholders; real pictures need an image source (see the note in `README.md`).

## F. Graded Assignment 4.2 brief - phase by phase

| Phase / task | Where | Status |
|---|---|---|
| **1** All 7 validation steps; user, problem, market evidence; differentiating angle | `docs/IDEA_VALIDATION.md` | 🟡 add your real interviews and 5-person test |
| **1** 1-page PRD | `docs/PRD.md` | 🟡 trim to one page if your template needs it |
| **2** Architecture notes | `docs/ARCHITECTURE.md` | ✅ |
| **2** `spec.md` | `spec.md` | ✅ |
| **2** `CLAUDE.md` / `agents.md` | `CLAUDE.md` | ✅ |
| **2** `.cursorrules` | `.cursorrules` | ✅ |
| **2** Revise the spec after review | `spec.md` section 8 (v1.1) | 🟡 add one line for any feedback from a classmate or teacher |
| **3** Scaffold the application | `src/`, `scripts/build.js`, `site/` | ✅ |
| **3** Core AI feature | ban / pick / win models in `src/` | ✅ |
| **3** At least 5 meaningful commits | `git log --oneline` (16+) | ✅ |
| **3** At least 3 unit tests | `tests/` (26 tests) | ✅ |
| **3** Check secrets and input validation | gitleaks job, `tests/data.test.js`, `tests/input.test.js` (AC-10, AC-17) | ✅ |
| **4** Configure GitHub Actions | `.github/workflows/ci.yml` | ⬜ push and see it go green |
| **4** Deploy to a live host | GitHub Pages (`deploy-pages` job in `ci.yml`) | ⬜ enable Pages, re-run |
| **4** Set environment variables | The app needs none. The only setting is the optional repository variable `LIVE_URL` used by `uptime.yml`; Pages needs no secret | ⬜ add `LIVE_URL` under Settings → Secrets and variables → Actions → Variables |
| **4** Test the live app | section C above | ⬜ |
| **4** Basic monitoring or analytics | `.github/workflows/uptime.yml` | ⬜ run it once from the Actions tab |
| **5** Complete README | `README.md` | 🟡 replace `YOUR-USERNAME` |
| **5** 2-minute demo | `docs/DEMO_SCRIPT.md` | ⬜ record |
| **5** 1-page reflection | `docs/REFLECTION.md` | 🟡 rewrite in your voice |
| **5** One GitHub issue for a v2 improvement | `docs/GITHUB_ISSUE_V2.md` | ⬜ create it on GitHub |
| **Before submission** URL works in incognito; repo public; secrets not exposed; demo link works; reflection attached | | ⬜ |
