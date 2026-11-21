# Product Requirements Document - StepForward (one page)

**Owner:** Danilo S. Galura Jr. · **Version 1.0** · 21 Nov 2026 · **Status:** v1 built, user testing pending
**Technical detail:** see `spec.md` and `docs/ARCHITECTURE.md` · **Research:** `docs/IDEA_VALIDATION.md`

## 1. Problem and opportunity
Fans, casters and amateur coaches who watch Mobile Legends (MLBB) pro matches cannot easily answer "what will this team ban or pick next?" while a draft is live. Existing free tools recommend the best hero from ranked-play data; none that I found predicts a *named pro team's* next move, explains why, and reports its own accuracy. The next big moment is the **M8 World Championship (17 Dec 2026 - 23 Jan 2027)**, after M7 set a mobile-esports record of 5.68M peak viewers.

## 2. Target users
| User | Need | Success looks like |
|---|---|---|
| **Draft Watcher** (fan, 16-30, phone, SEA) | Guess along with the broadcast and understand why | Records a draft in under 2 minutes and sees how often the model was right |
| **Caster / creator** | Quick talking points per team and side | Finds a team's habit ("bans X first on blue") in two taps |
| **Amateur coach** | Prepare for a team with public draft history | Sees likely bans/picks and the reasons |

## 3. Goals and success metrics
| Goal | Metric | Target | Now |
|---|---|---|---|
| Useful predictions | Real ban in model's top 5 (walk-forward, held-out games) | ≥ 40% | ~49% 🧪 |
| Honest product | Win-prediction shown with a "about a coin flip" warning | 100% of places | done |
| Easy to use | Strangers who finish 3 bans unaided (5 testers) | ≥ 4 of 5 | **to test** |
| Works on phones | Sideways scroll at 400 px wide | none | none |
| Reliable | CI green on every push; unit tests | 16 JS + 22 Python | 38 passing |
| Safe | Secrets in repo | 0 | 0 |

## 4. Features and acceptance criteria
| # | Feature | Priority | Acceptance criteria (details: `spec.md` §4) |
|---|---|---|---|
| F1 | **Ban prediction** for either team, any step | Must | Ranked list sums to 1; never lists used heroes; top-5 ≥ 30% on last 40 games (AC-3, AC-4) |
| F2 | **Pick prediction** with ban-shift, matchups, lane check | Must | Lane check rejects impossible lineups; reasons shown (AC-5) |
| F3 | **Quick-pick box** under the active slot | Must | One tap records and advances; typing + Enter works (AC-12) |
| F4 | **Scorecard**: record real picks, see model rank and running hit rate | Should | Rank shown after each recorded step |
| F5 | **Team vs team** setup with 24 teams, full names, VS banner | Must | Any two different teams selectable |
| F6 | **Draft verdict and series odds** (labelled low-confidence) | Could | Win chance 35-65%, with a credible range (AC-8) |
| F7 | **Transparency pages**: formulas and accuracy, habits, programs | Should | Every number traceable to `data/results/` |
| F8 | **Hero pictures** | Could | Pictures load when `data/hero_img.json` is supplied; badges otherwise |
| F9 | **"How accurate is it?" box** and an **AI capability** line on the main page | Should | Box shows ban top-1 / top-5 and the win result read from `data/results/`; says picks are not yet tested and that win calls are about a coin flip (AC-15) |
| F10 | **"Explain this draft" button** - a short plain-English paragraph built from the numbers on screen (templates, no LLM, no keys) | Could | Names the top 3 guesses with their percentages, shows the win split when both sides have picks, always ends "This is a prediction, not a promise.", says "Start the draft first." when there is nothing to explain (AC-16) |

## 5. Scope
**In v1:** MPL Indonesia S18 history (198 games), MPL Malaysia S18 playoff prior (105 games), 24 teams, 135 heroes, static site, English UI.
**Out of v1:** live data feed, accounts, mobile app, LLM explanations (v2), copied game art, any claim about who will win a series with confidence.
**Assumptions:** public tournament pages stay available to read by hand; the draft order stays 10 bans + 10 picks (editable in the app).

## 6. Risks, dependencies and timeline
| Risk / dependency | Plan |
|---|---|
| No readable draft data for Türkiye, CIS, Myanmar, MENA | Label "little or no data"; add data when it appears |
| Meta shifts (new patch, rule changes) | Patch discount, playoff prior, editable order |
| No real-user evidence yet | Interviews + 5 usability tests (Validation Report steps 1, 2, 6) |
| Competitor adds a similar mode | Stay team-specific, explained and self-scoring |

| Milestone | Date |
|---|---|
| v1 built, tested, deployed | 21 Nov 2026 ✅ |
| Real-user interviews + usability test, fixes | by 28 Nov 2026 |
| Demo video, README, reflection submitted | per course deadline |
| M8 Wild Card (Bangkok) begins - promote the tool | 17 Dec 2026 |
| M8 Main Stage and final (Istanbul) | to 23 Jan 2027 |
