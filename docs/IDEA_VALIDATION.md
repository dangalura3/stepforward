# Idea Validation Report - StepForward

**Project:** StepForward, an MLBB pro-draft predictor and simulator · **Author:** Danilo S. Galura Jr. · **Date:** 21 Nov 2026
**Framework:** the 7-step validation framework from Week 4A (Define the problem → Profile the customer → Size the market → Map the competition → Define your edge → Design a cheap test → Stress-test the idea).

**How to read the evidence tags**
- ✅ **Sourced** - found online; the link is in the list at the bottom.
- 🧪 **Measured** - I tested it myself on real match data (walk-forward tests in `data/results/`, shown on `site/formulas.html`).
- ✍️ **Your turn** - needs real people. These cannot be written by an AI; fill them in before submitting (grading rewards "real evidence").

---

## Step 1 · Define the problem
*Testing: a real, specific pain point exists that people actively try to solve.*

**Problem statement (2 sentences).** People who follow or analyse Mobile Legends pro matches (fans, casters, amateur coaches) cannot easily answer "what will this team ban or pick next?" while a draft is happening. They fall back on gut feeling and scattered stat pages, and nothing they can open for free shows *team-specific* predictions with reasons and honest accuracy.

**Why the draft matters.** Before every game, each pro team bans and picks heroes in a fixed order (10 bans, 10 picks), so the draft shapes the game before any play happens. Draft guides treat the draft phase as a major part of winning. ✅ (see source 5)

**Evidence that people try to solve this today**
| # | Evidence | Tag |
|---|---|---|
| 1 | Free draft simulators exist and are used: MLBBHub's draft simulator offers a practice mode, an MPL (pro) mode and an AI assistant that ranks heroes by counter and synergy. | ✅ [4, 5] |
| 2 | MPL shoutcaster Caisam "Wolf" Nopueto published a video about his own draft simulator program, aimed at helping analysts. | ✅ [8] |
| 3 | A press article titled "AI Predicts the MPL ID S17 Champion" exists, so there is an audience for AI predictions about MPL. | ✅ [10] |
| 4 | In another game (League of Legends) a hobbyist's "predict the match from the draft" AI got a Reddit thread with 2,310 upvotes and 420+ comments. This suggests the *idea* attracts people, though it is a different game. | ✅ [13] |
| 5 | Students and hobbyists write papers and portfolio projects on MLBB draft recommendation and win prediction (graph-based draft recommender; Naive Bayes win predictor). | ✅ [9, 11] |
| 6 | **Direct interviews:** how many people told me they have this problem, in their own words? | ✍️ see box below |

> ✍️ **Your turn - Problem interviews (do 3-5, 10 minutes each, in person or Messenger/Discord).** Ask: *"When you watch MPL, do you try to guess the bans? How? What do you wish you could see?"* Do not describe my app first. Paste real quotes (with their permission, first name only):
> 1. "…" - name, role (fan / caster / coach)
> 2. "…"
> 3. "…"

**Verdict:** The problem is real but *indirectly* evidenced until the interviews are added.

---

## Step 2 · Profile the target customer
*Testing: a reachable, identifiable group has this problem badly enough to use a solution.*

**Primary user - "The Draft Watcher":** a Filipino, Indonesian or Malaysian MLBB fan, 16-30, who watches MPL / M-series on stream, talks about drafts in chat, and wants to know *why* a team banned something. Uses a phone. Free tools only.

**Secondary users**
- **Casters / content creators** who want talking points before a series ("this team opens with Khufra ban 70% of the time on blue side").
- **Amateur and school-league coaches** preparing for a scrim against a team with public draft history.

**Where they are (reachable):** the largest MLBB markets by monthly players are Indonesia (35M), the Philippines (15M) and Malaysia (10M). ✅ [3] The project's data already covers MPL ID and MPL MY, and M8 teams include Philippine sides.

**Willingness to pay:** *Unproven.* Every competing tool I found is free, so I assume users expect free. The project goal is a useful free tool and a portfolio piece, not revenue.

> ✍️ **Your turn - persona with real quotes.** Take 3 of the people from Step 1 and write one line each: what they use today, what annoys them, and where you would find 10 more like them (which group chat, Discord, Facebook group or TikTok community).

---

## Step 3 · Size the market
*Testing: the opportunity is large enough to be worth building.*

| Layer | Number | Source / how it was reached |
|---|---|---|
| **Total**: people who play MLBB each month | **110 million** monthly active users, 1.5 billion installs | ✅ [1] (Moonton, Sep 2026) |
| **Engaged with the pro scene**: peak concurrent viewers of the M7 final | **5.68 million** (record for mobile esports; 4th most-watched esports event ever) | ✅ [2, 12] |
| **Reachable in my launch markets**: monthly players in Indonesia + Philippines + Malaysia | **≈ 60 million** (35M + 15M + 10M) | ✅ [3] |
| **Realistic first-year target** (my assumption, not data) | **5,000 - 30,000 visitors around M8** (17 Dec 2026 - 23 Jan 2027), i.e. roughly 0.1% - 0.5% of the 5.68M peak audience | ✍️ assumption: replace after a real launch (see Step 6) |

**What it means:** the audience is very large, so an "attention" opportunity exists, especially because **M8 (17 Dec 2026 - 23 Jan 2027, US$1,000,000 prize pool, first time in Europe)** is the next big moment. ✅ [6, 7] *Monetisation is weak*: free competitors, price-sensitive audience. A sustainable business would need a B2B angle (teams, media, sponsors) which is unvalidated. **For this course the right goal is a high-quality portfolio product with an honest market note, not a venture business.**

---

## Step 4 · Map the competition
*Testing: no existing solution fully solves the problem; there is a gap worth filling.*

| Competitor | What it does well | Where it falls short for this problem | Tag |
|---|---|---|---|
| **MLBBHub Draft Simulator** | Free, no login, 120+ heroes, MPL mode, AI assistant ranking heroes by counter score and synergy from ranked data. | Recommends the *best* hero from ranked-play statistics; I found nothing saying it predicts what a *specific pro team* will ban or pick next. | ✅ [4, 5] |
| **mlbb.io "Draft & Meta Intelligence"** | Real-time meta data, counter picks, draft strategy; claims 10,000+ players and 5M+ ranked matches. | Built around ranked meta, not pro-team behaviour. | ✅ [6b] |
| **Shoutcaster Wolf's draft simulator program (2023)** | Detailed analyst-oriented draft program. | Made for one analyst's use; not a public, always-on web tool that I could verify. | ✅ [8] |
| **Academic / portfolio projects** (graph-based draft recommender; Naive Bayes win predictor) | Show the methods work as research. | Papers and portfolio pages, not live tools for the pro scene. | ✅ [9, 11] |
| **Gut feeling + stat sites + analyst talk shows** | Free and familiar. | Not quantified, not team-specific, not testable. | - |

**The gap (what StepForward does that I did not find elsewhere):** (1) predicts the *next ban or pick of a named pro team*, using that team's own history, side, opponent and the playoff meta; (2) gives *reasons* for each suggestion; (3) *scores itself* against what really happened; (4) states its accuracy honestly (win prediction is about a coin flip).
*Caveat:* I did not test every tool on the market, so "I did not find one" is not the same as "none exists".

---

## Step 5 · Define your edge
*Testing: you have a specific reason why you, and this timing, can win.*

**Why now**
1. **M8 is weeks away** (Wild Card in Bangkok from 17 Dec 2026, Main Stage in Istanbul to 23 Jan 2027) and it is the first M-series in Europe, so many teams from new regions will appear and fans will want help understanding them. ✅ [6, 7]
2. **Attention is at a record:** M7's 5.68M peak viewers set the mobile-esports record. ✅ [2]
3. **AI coding tools** (Claude, Cursor) now let one beginner build, test and ship a full data product in weeks. (The course itself is built on this.)
4. **Fresh data exists**: MPL ID S18, MPL MY S18 and PH playoffs just finished (Oct-Nov 2026), so the model learns from the *current* patch.

**Why me / why this approach (the edge)**
- A **fan with domain knowledge** who studied how analysts think about bans and picks (lane limits, ban-shift, denial, playoff changes) and encoded those rules.
- **Honest measurement:** walk-forward tests, confidence ranges, and a page that tells users where the model is weak. Most hobby tools show a number and stop.
- **Explainability:** every suggestion carries a reason tag.

**Edge in one sentence:** *the only free tool (that I found) that predicts what a specific pro team will do next, explains why, and shows its own report card.*

---

## Step 6 · Design a cheap test
*Testing: people will change their behaviour (and use/pay) for a solution.*

**Test A - Does the model beat chance? 🧪 (done)** Walk-forward on real games: for each game the model only sees earlier games.
| Result | Value |
|---|---|
| Real ban is the model's #1 guess | ~23% (random ≈ 1%), on the last 800 ban steps |
| Real ban is in the model's top 5 | ~49% (random ≈ 5%); on the 270 playoff ban steps alone about 24% and 53% |
| Adding playoff data from MPL ID + PH + MY improved the log-score | −3.520 → −3.365 → −3.317 |
| Win prediction (54 games) | about a coin flip - *not* a selling point |
Source: `data/results/*.json`, `site/formulas.html`.
**Pass line:** top-5 ≥ 40% → **passed** (about 49%). *Honest note: I chose the 40% line after seeing earlier results, so treat it as a sanity floor, not a pre-registered test.*

**Test B - Can a stranger use it? ✍️ (do this)** Ask 5 people (fans) to open the live link on their phone and, without help, record 3 bans. Watch, do not explain.
| Tester | Finished 3 bans without help? | Time | What confused them | Quote |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
**Pass line:** at least 4 of 5 finish unaided. **Fixes made after testing:** list them here (the quick-pick box and the full team names were changes made during building).

**Test C - Will people come back? ✍️ (optional, 1 week)** Post the link once in one MLBB community with the screenshot in `docs/img/`. Record visits and any replies. **Pass line:** 100 visits and 5 meaningful replies.

---

## Step 7 · Stress-test the idea
*Testing: the risks are known and manageable, or reveal a fatal flaw before you invest.*

| Risk | Why it could kill the idea | Evidence | Mitigation | Verdict |
|---|---|---|---|---|
| **Win prediction is no better than a coin flip** | If the product promised "who wins", it would fail. | 🧪 54 games: log-loss 0.676 vs 0.693 for a coin; range includes "no skill". Other MOBA research gets about 58-71% from drafts in large public-game datasets, and one review notes accuracy depends on players' skill level. ✅ [14, 15, 16] My guess (not tested) is that evenly matched pro teams are harder to call. | Position the product as *ban/pick prediction* (works) and show win odds only as a warning-labelled extra. | Managed |
| **Small data for new teams** (Türkiye, CIS, Myanmar, MENA) | Predictions for M8 newcomers would be guesses. | 🧪 no readable draft pages found for those regions; they fall back to league averages. | The app labels these teams "little or no data"; add data as it appears. | Managed, ongoing |
| **Meta and format change** (new patch, global ban or fearless draft rules) | History becomes less useful. | ✅ press coverage discusses global-ban / fearless draft as an option for MLBB tournaments [17]. 🧪 patch discount and day decay tested. | Patch discount, playoff prior, editable draft order. | Managed |
| **A bigger tool adds the same feature** | MLBBHub already has an AI assistant. | ✅ [4, 5] | Stay specific: team-specific, explained, self-scoring; this is a portfolio product not a business. | Accepted |
| **Data rights / terms of use** | Copying or scraping a data site could be a violation. | Project rule: no scraping, single pages read by hand, sources recorded. | Keep rule; cite sources; use initials badges instead of copied art. | Managed |
| **Overstating results** (small samples) | Loses trust. | 🧪 bootstrap intervals on `formulas.html`. | Show ranges; say "measured on N games". | Managed |
| **No evidence from real users yet** | Could be a solution nobody asked for. | Steps 1, 2, 6B are ✍️ | Do the interviews and tests before submitting. | **Open - the biggest risk** |

**Kill criteria:** if 5 interviews show *nobody* tries to predict drafts, or fewer than 3 of 5 testers can use the tool unaided after two rounds of fixes, stop adding features and reposition the project as a learning/portfolio piece only.

**Overall verdict: GO (small).** The prediction works better than chance, the timing (M8) is strong, and the risks are known. The one thing missing is real-user evidence - collect it this week.

---

## Sources
1. Moonton, "ALL IN MLBB" 10th anniversary (4 Sep 2026): 1.5B installs, 110M MAU - https://en.moonton.com/news/372.html
2. Outlook Respawn / Esports Charts: M7 peaked at 5.68M concurrent viewers - https://respawn.outlookindia.com/esports/esports-news/m7-world-championship-becomes-most-watched-mobile-esports-event
3. Esports.gg, MLBB monthly users by market - https://esports.gg/news/mobile-legends-bang-bang/mobile-legends-esports-sea-empire/
4. MLBBHub draft simulator - https://mlbbhub.com/draft
5. MLBBHub, draft guide (assistant ranks by counter score and synergy) - https://237.mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026
6. The Loadout, M8 dates, prize pool - https://theloadout.com/m8-world-championship  ·  6b. mlbb.io - https://mlbb.io/th
7. MLBBHub M8 page (Dec 17, 2026 - Jan 23, 2027; Bangkok then Istanbul) - https://mlbbhub.com/mpl/m8
8. Spin.ph, shoutcaster Wolf's draft simulator (2023) - https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526
9. ITB paper, graph-based draft pick recommendation for MLBB - https://informatika.stei.itb.ac.id/~rinaldi.munir/Matdis/2024-2025-2/Makalah2025/Makalah-Matdis-2025-IF-ITB%20(17).pdf
10. DuniaGames, "AI Predicts the MPL ID S17 Champion" - https://duniagames.co.id/amp/discover/article/ai-predicts-the-mpl-id-s17-champion/en
11. Contra portfolio, ML win prediction in Mobile Legends (Naive Bayes) - https://contra.com/p/AgEBrrQs-machine-learning-based-win-prediction-in-mobile-legends
12. Esports Insider, M7 fourth most-watched esports event - https://esportsinsider.com/2026/01/mlbb-m7-world-championship-viewership-record
13. Mein-MMO on the LoLDraftAI Reddit post (2,310 upvotes, 62% claimed accuracy) - https://mein-mmo.de/en/a-new-tool-helps-you-predict-in-lol-whether-youll-lose-before-the-match,1245052
14. Dota 2 draft-only logistic regression, 58% (65% with hero pairs) - https://vetional.github.io/2016/dota-2
15. arXiv 1701.03162, prior-information prediction ~71% with hero + player features - https://arxiv.org/pdf/1701.03162
16. Springer review of ML methods for Dota 2 drafts (accuracy depends on skill level) - https://rd.springer.com/chapter/10.1007/978-3-319-52920-2_3
17. IDN Times on global ban/fearless draft in MLBB tournaments - https://www.idntimes.com/tech/games/turnamen-mlbb-terapkan-global-ban-pick-fearless-draft-c1c2-01-zr123-lzhs9k
