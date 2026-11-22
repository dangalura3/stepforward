# Product Requirements Document - StepForward (one page)

**Owner:** Danilo S. Galura Jr. · **Version 1.2** · 22 Nov 2026 · **Status:** v1 live at https://dangalura3.github.io/stepforward/
**Details:** `spec.md`, `docs/ARCHITECTURE.md` · **Evidence:** `docs/IDEA_VALIDATION.md`

## 1. Problem statement
Fans, casters and amateur coaches who watch Mobile Legends (MLBB) pro matches cannot easily answer "what will this team ban or pick next?" while a draft is live. Free tools suggest heroes from ranked-play data. None that I found predicts a *named pro team's* next move, explains why, and reports its own accuracy. In 3 informal interviews, all 3 people try to guess drafts, and 2 of 3 said existing tools are too slow or complicated under the 20-second timer. **Why now:** the M8 World Championship runs 17 Dec 2026 to 23 Jan 2027, after M7 set a mobile-esports record of 5.68M peak viewers.

## 2. Target users
| User | Need |
|---|---|
| **Draft Watcher** (fan, 16-30, phone, Southeast Asia) | Guess along with the broadcast and understand why |
| **Caster / creator** | Quick talking points for a team and side |
| **Amateur coach** | Prepare for a team with public draft history |

## 3. Core features (MVP) and acceptance criteria
| # | Feature | Acceptance criterion (details: `spec.md` §4) |
|---|---|---|
| 1 | **Ban prediction** for either of 24 teams at any step | Ranked list sums to 100% and never lists a used hero; on the last 40 games the real ban is in the top 5 at least 30% of the time (measured about 49%) |
| 2 | **Pick prediction** with ban-shift, matchups and a lane check | Lineups that cannot fill five distinct lanes are rejected, and a reason is shown for each suggestion |
| 3 | **Quick-pick box** under the active slot | One tap records the hero and moves to the next step; typing a name and pressing Enter also works |
| 4 | **Scorecard** of real picks | After each recorded step the app shows the rank the model gave it and a running hit rate |
| 5 | **Honest explanation**: "How accurate is it?" box, "Explain this draft" button, win chance labelled low-confidence | Numbers are read from `data/results/`; the explanation ends "This is a prediction, not a promise."; win chance stays between 35% and 65% and is labelled "about a coin flip" |

Data in v1: MPL Indonesia S18 (198 games), MPL Malaysia S18 playoffs (105 games), 135 heroes. AI type: classification and ranking (no LLM).

## 4. Out of scope for v1
Live data feed, accounts, a mobile app, LLM-written explanations (planned for v2, GitHub issue #1), copied game art or hero pictures, and any confident claim about who will win a series.

## 5. Success metrics
| Metric | Target | Now |
|---|---|---|
| Real ban is in the model's top 5 (walk-forward test on the last 800 ban steps) | ≥ 40% | **about 49%** (top-1 about 23%; random is about 5% and 1%) |
| Phone testers who finish 3 bans without help | ≥ 4 of 5 | **5 of 5** (22 Nov, informal; step order confusing at first) |
| Quality: tests pass on every push; secrets in the repo | All pass; 0 | **48 tests pass** (26 JS, 22 Python); 0 secrets |

## 6. Open questions
1. Can strangers, not only my 5 testers, finish a draft unaided once the step order is clearer? (v1.1: a "whose turn / which step" cue, then retest.)
2. Pick predictions are not validated yet. Is there enough public pick data to test them?
3. Where can I find readable draft data for Türkiye, CIS, Myanmar and MENA teams, which M8 will include?
4. Would an LLM-written explanation help users more than the current template text?
5. Can the tool cover its running costs without betting links? B2B interest is unvalidated.
