# Submission checklist - Week 4 Graded Mini Project (20 points)

Legend: ✅ done in this repo · 🟡 done as a draft, you must review/add · ⬜ you must do it (cannot be done by an AI from here)

## A. Rubric self-check

| Criterion (4 pts each) | What would score 4 | Where it is | Status |
|---|---|---|---|
| **Problem & Validation** | All 7 steps with real evidence; clear "why now"; specific user | `docs/IDEA_VALIDATION.md` (7 steps, 17 sources, measured results) | 🟡 add real interview quotes (step 1, 2) and 5-person test (step 6B) |
| **PRD Quality** | All 6 components; specific features with testable acceptance criteria | `docs/PRD.md` (problem, users, goals/metrics, features + AC, scope, risks/timeline) | 🟡 compare with your course's PRD template and rename sections if its 6 components differ |
| **Spec & Architecture** | All 5 spec elements; testable criteria; `CLAUDE.md` and `.cursorrules` present | `spec.md` (capability, inputs, outputs, 14 acceptance criteria, architecture), `docs/ARCHITECTURE.md`, `CLAUDE.md`, `.cursorrules` | ✅ |
| **Working Application** | Live URL; core AI feature works; clean UI; no broken flows | https://stepforward-mlbb-draft-simulator.netlify.app/ | 🟡 redeploy the new version, then open it on a phone and run section C |
| **CI/CD & Engineering Quality** | GitHub Actions; no hardcoded secrets; meaningful commits; README complete | `.github/workflows/ci.yml`, secret-scan test, 11 commits, `README.md` | ⬜ push the repo, add the two Netlify secrets, confirm green check |

## B. Core deliverables

| # | Deliverable | File / link | Status |
|---|---|---|---|
| 1 | Idea Validation Report (7 steps + evidence) | `docs/IDEA_VALIDATION.md` | 🟡 |
| 2 | PRD, one page, 6 components | `docs/PRD.md` | 🟡 |
| 3 | `spec.md` + Architecture notes | `spec.md`, `docs/ARCHITECTURE.md` | ✅ |
| 4 | GitHub repo: public, 5+ commits, README, CI/CD | this folder (git history included) | ⬜ push |
| 5 | Live deployed app | Netlify URL above | 🟡 |
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
5. **Deploy through the pipeline (shows "secrets managed"):** GitHub repo → Settings → Secrets and variables → Actions → *New repository secret* → add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` (where to find them: README → CI/CD and secrets). Push any small change; the Actions tab should show 4 green jobs and the site updates.
   *Simpler alternative:* in Netlify choose "Import from Git", pick the repo, publish directory `site`, no build command.
6. Open the **Actions** tab and confirm the green check. Screenshot it for the demo.

## E. Things I could not do for you

- Talk to real people (interviews, usability test, community post).
- Record the demo video or log in to GitHub / Netlify for you.
- Verify the live site from my side: my last attempt to open the Netlify URL failed, so check it yourself.
- Hero pictures: the badges are placeholders; real pictures need an image source (see the note in `README.md`).
