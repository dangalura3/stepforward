# How MLBB analysts, casters and coaches judge a draft, predict the winner, and how games end (research notes, 7 Nov 2026)

Reading guide for the report writer:
- **[ANALYST]** = a named analyst, coach or player saying it (or a named creator's analysis video).
- **[MEDIA]** = a news or stats article with no named analyst quoted.
- **[GUIDE]** = a generic guide or blog opinion, not a pro. Treat as low-to-medium confidence.
- **[FETCH-SUMMARY]** = I read the page through a fetch tool that returns a summary, not raw text. Short quotes were passed through that summary and should be re-checked before being used as verbatim quotes.
- No source found gives a percentage for "how much the draft decides the game", and none gives minute windows for each archetype. Where I say "none", I mean none found in the pages I could read. I did about 20 tool calls, so coverage is thin on 2026 analyst commentary.

---

## 1. Composition archetypes: names, win condition, timing, weakness

### Takeaway
There is no single official list. Three sources give three overlapping lists, and they agree on the core styles: front-to-back or engage team fight, poke/siege, catch/pick-off, protect/scaling, and split push. The only archetype matchup table is from one analysis creator (Lav). Nobody I could read gives minute windows per archetype.

### Cited Findings
- [ANALYST, creator Lav, "How MPL Teams Build the Perfect Draft", read via a transcript mirror; video date not shown] Says every draft "falls into one of five core team compositions": Engage, Poke, Catch, Protect, Split. — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
  - Engage: needs at least one initiator, long CC, big AOE and a good executor; attacks first and creates the moment.
  - Poke: wins through HP advantage, short cooldowns, range and repositioning; needs patience and tight coordination; "high risk, high reward"; needs an earlier power spike and range or positioning control.
  - Catch: aims to delete one target before the enemy can react; needs long single-target CC, high burst and heroes that escape sticky situations; usually paired with a pick-off plan.
  - Protect: built around a scaling carry with layers of protection (disruptive utility plus tanky frontliners); teams often run two scaling heroes as backup.
  - Split: pressures several objectives at once so the enemy chooses wrong; needs a hard-to-catch hero, strong objective control, a duelist and a flanker.
- [ANALYST, same Lav video] Archetype matchups: Engage is weak against Catch and Protect. Poke hard-counters Protect and soft-counters Catch. Engage vs Engage cancels out and individual hero power decides. Pair the strategy with the comp: a Protect comp running a pick-off plan "will not work well"; Poke works with grouping. — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [ANALYST, same video] You can usually read the enemy's intended comp from their first three picks and the bans. — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [GUIDE, MLBBHub article by Rai Santos, "draft guide tips ranked 2026"] Five win conditions: front-to-back teamfight, pick-and-trap, dive/backline delete, siege/objective melt, split push. "Choose one and draft toward it." The jungler sets tempo: an aggressive jungler signals early fights, a scaling one signals a late game. The roamer anchors the fighting style. — [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026) [FETCH-SUMMARY]
- [GUIDE, blog "MLBB Draft Composition 2025 Team Building Guide"] Seven archetypes with win conditions and weaknesses. — [Blog](https://mobilelegendsbuildup.blogspot.com/2025/07/mlbb-draft-composition-2025-team.html) [FETCH-SUMMARY]
  - Hyper-carry: late-game snowball from one carry. Weakness: predictable, countered by ganking and early aggression.
  - Sustain: wins prolonged fights. Weakness listed for burst-heavy comps: they lose to strong healing and survivability.
  - Pick-off: isolates and kills key targets.
  - Split-push: pressures several lanes.
  - Objective control: early lead, then fast objective takes before the enemy catches up.
  - CC lockdown: isolate enemy damage dealers so the marksman deals free damage.
  - Sustain and siege: outlast with healing and shields, then slowly siege the base.
  - General weaknesses it names: missing CC, damage, tank, sustain, mobility or push power; over-reliance on one hero.
  - Timing: "None given" in minutes; only early/mid/late phases.
- [GUIDE, GuildOrder] Names dive, poke and sustain comps, and says a hero's tier depends on the comp. Regional styles it claims: MPL-ID = late-game team fight comps; MPL-PH = skirmish-heavy, mid-game tempo; MPL-MY = aggressive early rush. — [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool) [FETCH-SUMMARY]
- [ANALYST, Wolf, 2023 draft simulator] Wolf's own tool scored drafts on: teamfights, burst damage, early-to-midgame spike, wave clear, tower pushing. This is the closest thing to a named MPL analyst's list of scoring dimensions. — [SPIN.ph](https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526) [FETCH-SUMMARY]
- [MEDIA, MLBBHub grand final recap] Possible evidence for the early-snowball style in MPL ID S17: BTR "closes it in around 12 minutes" in Game 1, and "returns to early snowball" in Game 5 of the grand final. The article does not give the draft. — [MLBBHub](https://mlbbhub.com/news/btr-wins-mpl-id-season-17-onic-grand-final) [FETCH-SUMMARY]

### Inferences
- A rating tool could use about five to six archetypes: Engage/front-to-back, Poke/Siege, Catch/Pick-off, Protect/Late-scaling, Split/Global pressure, plus an Early-tempo/Snowball tag. Early-tempo is the one the sources describe least, even though the recent S17 grand final recap points to it.
- Minute windows would have to be set by the tool designer. Weak anchors only: the S17 final recap says one game ended around 12 minutes and the M7 final averaged roughly 13 minutes a map (see section 5). Treat any "early = 0-8, mid = 8-15, late = 15+" split as an assumption, not a sourced fact.
- Regional-style claims (MPL-ID = late teamfight) conflict with the S17 grand final recap (fast snowball). Do not hard-code regional style.

### Gaps
- No source gave minute windows per archetype.
- No 2025-2026 analyst (coach or caster) naming "tempo", "snowball" or "global pressure" comps was found. The only named-analyst list is Lav's, and I could not confirm the video's date.
- Lav's archetype matchup table is one creator's view, not a consensus.

---

## 2. Draft evaluation checklist

### Takeaway
Sources agree on a checklist: frontline, engage/catch, peel, mixed damage, wave clear, objective control, tower pressure, plus counter-picks, flexible picks, last-pick information advantage, and four kinds of bans. Only Lav and Wolf are analyst-level sources; the rest is guide opinion.

### Cited Findings
- [GUIDE, MLBBHub] Seven composition checks: frontline, engage/catch, peel, mixed damage, wave clear, objective control, tower pressure. "Covering about five is the stated goal." — [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026) [FETCH-SUMMARY]
  - Frontline: without a real tank or fighter in front, teamfights collapse; required, not optional.
  - CC: hard engage, lockdown, catch tools and peel are valued; no CC quota given.
  - Damage mix: avoid one damage type because it is easy to itemize against; if EXP and jungle are physical, mid should lean magic.
  - Objectives: contesting Turtle and Lord needs burst, zoning or a secure threat.
  - Counter-picks: counter the game plan, not just the lane; categories are anti-dive, anti-sustain, anti-poke, anti-split-push; "pick for the team first".
  - Last pick: generally preferred for information; early picks safe and flexible, late picks specific and punishing.
- [ANALYST, Lav] Four ban types: Respect (opponent's exceptional hero), Meta (strong, annoying heroes), Synergy (a hero whose best combo hurts you, usually later), Counter (heroes that counter your planned picks). — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [GUIDE, MLBBHub] Ban logic: power, comfort, counter (protecting your plan), and draft-structure bans (breaking the enemy's composition). Read the enemy's bans as a signal of their plan. — [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026) [FETCH-SUMMARY]
- [ANALYST, Lav] Pick-by-pick logic (Blue = B, Red = R):
  - B1: a hard-to-answer or flexible hero (examples named: Zhuxin, Baxia).
  - R1/R2: counter the first pick's weakness, or stay flexible.
  - B2/B3: synergy with B1, or keep the enemy guessing; lock heroes likely to be banned or stolen.
  - R3: the enemy comp is usually readable; counter it or pivot (for example engage to catch), but do not pivot if a game-defining hero is open.
  - R4: blind or flexible picks to bait.
  - B4/B5: fully counter, or build synergy that cannot be answered by one pick.
  - R5: "the strongest position"; surprise, power or safe pick depending on the enemy lineup.
  — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [ANALYST, Lav] Cited cases: Zhuxin "weak to repeated stuns"; Twisted Minds vs TNC (blind picks baited bans); Onic R5 surprise pick (S.Test) countered Liquid; Xborg's flexible early pick soft-countered four Turkey heroes. — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [GUIDE, GuildOrder] Pick order is snake 1-2-2-2-2-1; Red R1-R2 is a counter window and R5 is the final adjustment with full information. Flex roles hide assignments until late; flex groups named: Mid + Jungle + Roamer, EXP + Roamer, Gold + Mid. Prep advice: shrink the 130+ hero pool to 30-40, ban 5 to deny the opponent and 5 to protect your own, avoid spending 8-10 bans only on the opponent. Single-hero players are a draft liability; fewer than 3-5 heroes per role is called inflexible. — [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool) [FETCH-SUMMARY]
- [MEDIA, IDN Times, no analyst named] Why MPL ID S17 picks differ from ranked: coordination favors initiators (Khaleed, Gatotkaca); pros prioritize objectives such as turtle and lord; drafts are built around the opponent's lineup with situational heroes (Chip, Valentina); pros use higher-mechanics heroes (Claude, Harith as gold lane); pros adapt quicker to patches. Standard structure described as damage dealers (marksmen, assassins) paired with initiators (tanks, fighters). Ranked stats cited are from May 2026 official statistics. — [IDN Times](https://www.idntimes.com/tech/games/alasan-hero-mlbb-laris-di-mpl-id-s17-berbeda-dengan-ranked-c1c2-01-zr123-03nktr) [FETCH-SUMMARY]
- [MEDIA, Duniagames] Team Liquid ID "has started to diversify its draft strategies, incorporating heroes like Leomord and Phoveus"; analysts (unnamed) warn against "over-reliance on specific draft patterns" because opponents will exploit them. — [Duniagames MPL ID S17 Week 5](https://duniagames.co.id/amp/discover/article/mpl-id-s17-week-5-review-rrq-hoshis-worst-first-half-in-history/en) [FETCH-SUMMARY]
- [ANALYST, Ynot, ONIC PH, MSC 2025 semifinal, article of 1 Aug 2025] Ynot said "lahat kami nagsastart talaga sa draft" (we all start from the draft) and that ONIC PH won only when they had first pick in that series. See section 4. — [Tiebreaker Times](https://tiebreakertimes.com.ph/tbt/ynot-admits-draft-mishaps-amid-onic-ph-narrow-miss-in-msc-semis/343608) [FETCH-SUMMARY]

### Inferences
- Items present in two or more independent sources (so safest to score): frontline present, an initiator/CC source, mixed damage, wave clear, objective (Turtle/Lord) control, counter-picks that hit the enemy plan, flexibility/hiding information, and last-pick advantage.
- "Jungle priority" is only touched by MLBBHub (jungler sets tempo) and the IDN Times list of jungle heroes (Leomord, Suyou). No analyst gave a jungle-priority formula.
- Lane matchups specifically (gold, EXP, mid duels) were not detailed by any source I read.

### Gaps
- No quotas (for example "at least N CC skills", "no more than N% physical") from any named analyst.
- No source stated how to weigh checklist items against each other.
- Wolf's draft-reading views in his own words were not reachable (see section 6).

---

## 3. Team-fight combos and synergy patterns (2025-2026)

### Takeaway
I found no named-analyst hero pairs or trios for 2025-2026. What exists is generic patterns (initiator plus damage dealer, frontline plus marksman peel) and pick/ban data for MPL ID S17 that shows which heroes teams actually draft.

### Cited Findings
- [MEDIA, IDN Times "hero langganan pick MPL ID S17", citing official stats] Most-picked MPL ID S17 heroes: Zhuxin (mage, 127 picks, 70 bans; poke and CC, used by Geek Fam ID, Bigetron by Vitality, NAVI); Claude (marksman, 118 picks, 61.02% win rate; used by BTR, Geek Fam, Dewa United); Leomord (jungle fighter, 95 picks); Harith (gold lane mage, 91 picks); Suyou (jungle, 81 picks, sometimes picked when Leomord was banned). No analyst quotes, no pair synergy discussion. Stats not independently verified. — [IDN Times](https://www.idntimes.com/tech/games/hero-langganan-pick-mpl-id-s17-c1c2-01-1mc7z-j215r3) [FETCH-SUMMARY]
- [MEDIA, esports.ru M7 recap] M7 pick/ban counts: Cloud most picked (72, 54.17% win rate); Fasha 63 picks but 42.86% win rate; Grock most banned (91); Kaleea and Zhuxin 87 bans each. No composition analysis in the article. — [esports.ru](https://esports.ru/articles/itogi-m7-world-champoinship/) [FETCH-SUMMARY]
- [GUIDE, blog] Example classic pairs: Johnson + Odette, Tigreal + Eudora, Khufra + Gusion; patterns: initiators set up burst mages, CC supports peel for marksmen. These are not tied to 2025-2026 pro play and the blog says no data. — [Blog](https://mobilelegendsbuildup.blogspot.com/2025/07/mlbb-draft-composition-2025-team.html) [FETCH-SUMMARY]
- [GUIDE, MLBBHub] Engage/catch plus peel is a standard checklist pairing. — [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026) [FETCH-SUMMARY]
- [ANALYST, Lav] Strategy pairing: Poke with grouping; Protect comps carry a scaling hero with disruptive utility plus tanky frontline; Catch comps need long single-target CC plus burst. — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]
- [ANALYST, Wolf, 2023] Wolf's simulator example drafts: ECHO PH (Fredrinn, Claude, Faramis, Benedetta, Chou) scored 9/10 in teamfights; Bren Esports (Hayabusa, Lolita, Karrie, Yve, Gloo) scored 7.4. Older (2023), shown to illustrate his scoring, not 2026 meta. — [SPIN.ph](https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526) [FETCH-SUMMARY]

### Inferences
- A tool should not rely on a hard-coded pair list from these sources. Safer: score synergy from role tags (initiator + burst follow-up, tank/support peel + marksman), then add a small hero-pair table the project builds itself from current match data.
- Hero lists above are a snapshot for S17 (and M7); the patch changes. Any 2026 pair data needs a data source (match history).

### Gaps
- No named analyst, coach or caster gave 2025-2026 hero pairs or trios.
- No source explained *why* Zhuxin or Claude fit with specific partners (for example, what hero keeps Claude safe).
- Patch 2.1.90 MSC 2026 meta guide (topuplist.com) failed to load, so MSC 2026 draft trends from it are not covered.

---

## 4. Win-prediction thinking: draft vs player skill, and examples

### Takeaway
No source gives a percentage for how much the draft decides. The strongest direct statement is from an active pro (Ynot, MSC 2025): draft is where everything starts and was a main reason for a loss, but not the only one. Media analysts blame "systemic" team problems more than individuals.

### Cited Findings
- [ANALYST, Ynot, ONIC PH, 1 Aug 2025] He pointed to the draft as a key reason for the semifinal loss; ONIC PH won only when they had first pick in the series. Quotes (Filipino, as given by the article): "Sa buong series kasi sa first pick lang kami nanalo. Never nanalo yung second pick."; "Maraming factor kasi talaga eh pero syempre lahat kami nagsastart talaga sa draft"; also, "Siyempre kung di mo mabigyan ng proper tools yung mga players, mas mahihirapan". He also said in-game decision-making needs improvement. The article's wording that the draft was "the main factor but not the only one" is the fetch tool's summary. — [Tiebreaker Times](https://tiebreakertimes.com.ph/tbt/ynot-admits-draft-mishaps-amid-onic-ph-narrow-miss-in-msc-semis/343608) [FETCH-SUMMARY; re-check quotes against the page]
- [MEDIA, Tiebreaker Times, same article] Fetch summary says SRG built a 10,000-gold lead in Game 5 with first pick and ONIC conceded; no heroes or pick/ban sequences named. — [Tiebreaker Times](https://tiebreakertimes.com.ph/tbt/ynot-admits-draft-mishaps-amid-onic-ph-narrow-miss-in-msc-semis/343608) [FETCH-SUMMARY]
- [MEDIA, Duniagames, MPL ID S17 Week 5] Analysts (unnamed) said RRQ Hoshi's problems "are systemic rather than individual"; RRQ showed "weak synergy and poor adaptation"; Dewa United's success was credited to "structured and disciplined gameplay" rather than star players; Idok criticised for errors when not paired with his usual duo partner. — [Duniagames](https://duniagames.co.id/amp/discover/article/mpl-id-s17-week-5-review-rrq-hoshis-worst-first-half-in-history/en) [FETCH-SUMMARY]
- [MEDIA, esports.ru, M7] Virtus.pro's Zaur was player of the match four times yet VP lost 2:3 to Boostgate in the Wildcard stage. The article draws no draft-vs-skill conclusion. — [esports.ru](https://esports.ru/articles/itogi-m7-world-champoinship/) [FETCH-SUMMARY]
- [GUIDE, GuildOrder] Single-hero players are draft liabilities (they can be banned or countered); players with fewer than 3-5 heroes per role lack flexibility. Mastery limits what a draft can ask for. — [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool) [FETCH-SUMMARY]
- [GUIDE, MLBBHub] Says "the community has flagged" limits of draft simulators; unattributed. — [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026) [FETCH-SUMMARY]
- [ANALYST, Lav] Engage vs Engage "cancels out, leaving individual hero power as the difference." — [Transcript mirror](https://tubescript.cc/transcript/8I8pkqUY1kY) [FETCH-SUMMARY]

### Inferences
- Draft quality and first-pick/side are tied together in Ynot's account; a tool might keep a small separate input for pick order and side, but no source gives its size.
- The "better draft lost" documented examples I found are weak: the SRG vs ONIC PH case is a team blaming its own draft, not a neutral analyst scoring both drafts. I did not find a documented case with both drafts rated before the game and an upset after.
- A sensible tool design is to treat the draft rating as one adjustment on top of team strength/form and hero mastery, and to say plainly that the weight is a tuned parameter, not something analysts published.

### Gaps
- No percentage or weight for draft vs player skill from any source.
- No documented "pre-game draft rated better, then lost" example with both sides' drafts and an analyst's pre-game call.
- Wolf's own win-probability thinking was not found.

---

## 5. How games end, and game length

### Takeaway
Only partial data. For M7 (Jan 2026) the grand final's four maps took 53:27 in total (a record low for an M-series final). For MPL ID S17 I found one game duration (~12 min) and no league-wide average. Sources talk about objective play (Turtle, Lord) more than about the exact ending pattern of individual games.

### Cited Findings
- [MEDIA, esports.ru] M7 grand final: Aurora Gaming PH beat Alter Ego 4:0 in "four maps and 53 minutes 27 seconds", the fastest final in M-series history; the previous record, from M4, was four maps and just over 59 minutes. — [esports.ru](https://esports.ru/articles/itogi-m7-world-champoinship/) [FETCH-SUMMARY]
- [MEDIA, MLBBHub] MPL ID S17 grand final: BTR beat ONIC (series reported as 4-1 in the Medcom headline URL). Game 1 closed "in around 12 minutes"; Game 5 "returns to early snowball". Credits Nnael's jungle pathing, Finn's roams, EMANNN's fights. Mentions Moreno's mid-lane play leads to "Lord setups, and clean base pressure". Other game durations and ending sequences not given. — [MLBBHub](https://mlbbhub.com/news/btr-wins-mpl-id-season-17-onic-grand-final) [FETCH-SUMMARY]; headline score from [Medcom](https://www.medcom.id/teknologi/esports/nbw50ORK-hancurkan-dominasi-onic-4-1-bigetron-by-vitality-cetak-sejarah-juara-mpl-id-s17) (search result title only; page not opened)
- [MEDIA, Tiebreaker Times] In one MSC 2025 semifinal game the first-pick team "built a 10,000-gold lead" and the other side conceded (fetch summary). — [Tiebreaker Times](https://tiebreakertimes.com.ph/tbt/ynot-admits-draft-mishaps-amid-onic-ph-narrow-miss-in-msc-semis/343608) [FETCH-SUMMARY]
- [MEDIA, IDN Times] Pros "prioritize objectives such as turtle and lord and fight only when needed"; ranked players chase kills. — [IDN Times](https://www.idntimes.com/tech/games/alasan-hero-mlbb-laris-di-mpl-id-s17-berbeda-dengan-ranked-c1c2-01-zr123-03nktr) [FETCH-SUMMARY]
- [GUIDE, GuildOrder] Claims MPL-ID leans to late-game team fights and MPL-MY to early rush; states no typical match duration. — [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool) [FETCH-SUMMARY]

### Inferences
- Rough arithmetic only: 53:27 over 4 maps is about 13.4 minutes per map for that series. That is a single series, not an average for the league, and I computed it myself.
- Taken together, the sourced picture is "get an objective or gold lead, then Lord or base pressure," which fits a rating tool that checks objective control and tower push. This is an inference; no source lists "how games end" as a ranked set of patterns (Lord push, teamfight wipe, comeback).
- What decides the final fight: no source answered directly. Lav's framing (who engages first, CC chain, protecting the carry) is the nearest, but it is about composition design, not about fights in progress.

### Gaps
- No MPL ID S17 (or MPL ID 2025-2026) average game length found. Searches for it returned schedules and viewership pages, not statistics.
- No source breaks down game endings by type (Lord push vs teamfight wipe vs comeback).
- No analyst statement on what decides the last fight.
- The two grand-final games beyond Game 1 are not described.

---

## 6. Statements by Wolf, Mirko and other MPL analysts

### Takeaway
I could not reach any transcript of a Wolf or Mirko draft breakdown. What I have for Wolf is a 2023 article on his draft simulator and his Moneyball remark about building a roster. Nothing for Mirko.

### Cited Findings
- [ANALYST, Wolf, 2023] Wolf showed an unreleased draft simulator program: selecting a hero shows counters; graphs of strengths and weaknesses build as picks come in; scored on teamfights, burst damage, early-to-midgame spike, wave clear, tower pushing. The article has no direct quote from Wolf about how the tool reasons. — [SPIN.ph](https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526) [FETCH-SUMMARY]
- [ANALYST, Wolf, on roster building, not drafting] "Imagine the draft and scouting of the team, it's really like Moneyball." This refers to choosing players for TNC, not hero draft. — [ONE Esports](https://www.oneesports.gg/mobile-legends/how-wolf-built-tnc-roster-mpl-ph/) [FETCH-SUMMARY]
- Wolf was reported (SPIN.ph headline in the search results; page not opened) to have joined ONIC Indonesia as data analyst in Jan 2025. — [SPIN.ph](https://www.spin.ph/esports/onic-indonesia-welcomes-wolf-as-the-team-s-data-analyst-a4858-20250124) [search-result title only]
- The only transcript I could read was a transcript-mirror page of a video by the creator Lav, not Wolf or Mirko. YouTube itself was not fetched. Another transcript-mirror hit ("formula behind TLPH dominance MLBB") exists at [sozai.app](https://sozai.app/transcript/formula-behind-tlph-dominance-mlbb/) but I did not open it, so I cannot say who speaks in it.

### Inferences
- Wolf's simulator dimensions are the best "named MPL analyst" starting point for the scoring categories of a tool, but they are from 2023 and the article does not say how he weights them.

### Gaps
- Mirko: no source found.
- Wolf Casts YouTube draft analysis: not reached; no transcript read, so no quotes are given.
- Other Indonesian analyst commentary (Liputan6, Hybrid, Bola.com) was not reached.
- esports.gg article on coach Midnight / TLPH MSC EWC 2026 failed to load; the topuplist MSC 2026 patch 2.1.90 guide failed to load.

---

## Rules a rating tool could use
Each rule is a proposal built from the source shown; confidence follows the source tag. No numeric weights are sourced.

1. Require a frontline (tank or fighter); flag the draft if absent. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026)
2. Require at least one engage/catch source and one peel source. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026); ANALYST (Lav), [Engage needs an initiator and long CC](https://tubescript.cc/transcript/8I8pkqUY1kY)
3. Penalise single-damage-type drafts; reward a mix of physical and magic. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026)
4. Score wave clear and tower pushing separately from teamfighting. — ANALYST (Wolf's simulator dimensions), [SPIN.ph](https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526)
5. Score early-to-midgame spike vs late scaling separately, and use the jungler type as a tempo signal (aggressive jungler = early, scaling jungler = late). — ANALYST (Wolf), [SPIN.ph](https://www.spin.ph/esports/mlbb-shoutcaster-wolf-showcases-his-draft-simulator-program-a4858-20230526); GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026)
6. Score objective (Turtle/Lord) contest ability: burst, zoning or a secure threat. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026); MEDIA, pros prioritize turtle and lord, [IDN Times](https://www.idntimes.com/tech/games/alasan-hero-mlbb-laris-di-mpl-id-s17-berbeda-dengan-ranked-c1c2-01-zr123-03nktr)
7. Classify each comp into an archetype and apply a counter table: Engage loses to Catch and Protect; Poke beats Protect and soft-counters Catch; Engage vs Engage = hero power decides. Treat as one creator's table, low weight. — ANALYST (Lav), [transcript](https://tubescript.cc/transcript/8I8pkqUY1kY)
8. Penalise a mismatch between archetype and plan (for example Protect + pick-off). — ANALYST (Lav), [transcript](https://tubescript.cc/transcript/8I8pkqUY1kY)
9. Counter score: reward heroes that deny the enemy's win condition (anti-dive, anti-sustain, anti-poke, anti-split-push), not only lane counters. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026)
10. Reward flexibility (heroes or players that can fill several roles) because it hides information; penalise predictable drafts and one-hero players. — ANALYST (Lav), [transcript](https://tubescript.cc/transcript/8I8pkqUY1kY); GUIDE, [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool); MEDIA, analysts warn about over-reliance on patterns, [Duniagames](https://duniagames.co.id/amp/discover/article/mpl-id-s17-week-5-review-rrq-hoshis-worst-first-half-in-history/en)
11. Last pick / R5 gets a small information bonus; Red R1-R2 is a counter window. Size unknown. — GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026), [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool); ANALYST (Lav), [transcript](https://tubescript.cc/transcript/8I8pkqUY1kY)
12. Keep first-pick/side as a separate input, because a pro (Ynot) tied his series losses to not having first pick. Single anecdote; weight is a tuned parameter. — ANALYST (Ynot), [Tiebreaker Times](https://tiebreakertimes.com.ph/tbt/ynot-admits-draft-mishaps-amid-onic-ph-narrow-miss-in-msc-semis/343608)
13. Add a hero-mastery / player-pool term so draft score is not used alone. — GUIDE, [GuildOrder](https://guildorder.com/games/mlbb/guides/draft-strategy-120-hero-pool); MEDIA, "systemic rather than individual" team issues, [Duniagames](https://duniagames.co.id/amp/discover/article/mpl-id-s17-week-5-review-rrq-hoshis-worst-first-half-in-history/en)
14. Ban scoring: tag each ban as Respect, Meta, Synergy or Counter and read the enemy's bans as a hint of their plan. — ANALYST (Lav), [transcript](https://tubescript.cc/transcript/8I8pkqUY1kY); GUIDE, [MLBBHub](https://mlbbhub.com/news/mlbb-draft-guide-tips-ranked-2026)
15. Synergy: score role-pattern pairs (initiator + burst follow-up; tank/support peel + marksman); do not rely on a fixed hero pair list. Build hero data from current patch stats. — GUIDE, [blog](https://mobilelegendsbuildup.blogspot.com/2025/07/mlbb-draft-composition-2025-team.html); stats snapshot in [IDN Times](https://www.idntimes.com/tech/games/hero-langganan-pick-mpl-id-s17-c1c2-01-1mc7z-j215r3)
16. Game-ending model: treat "lead -> objective -> Lord/base pressure" as the default finishing path, with a fast-snowball branch (S17 final example). Durations: use ~12 min for the fast branch (S17 G1) as an anchor only. — MEDIA, [MLBBHub](https://mlbbhub.com/news/btr-wins-mpl-id-season-17-onic-grand-final); M7 final ~13.4 min per map is my arithmetic from [esports.ru](https://esports.ru/articles/itogi-m7-world-champoinship/)

---

## Gaps (overall)
- No source gives a percentage or weight for how much a draft decides a game; every weight in a tool is a design choice.
- No minute windows per archetype from any source.
- No named 2025-2026 analyst hero pairs/trios; only generic patterns and S17 pick counts.
- No MPL ID S17 average game length; only one game duration (~12 min) and the M7 final total (53:27 for 4 maps).
- No breakdown of game endings by type, and no analyst statement on what decides the final fight.
- No documented case where an analyst rated both drafts before the game and the "worse" draft won.
- Wolf and Mirko draft-thinking: no video transcript reached; no Mirko source found. YouTube was not fetched; only a transcript-mirror page for Lav loaded.
- Pages that failed to load: topuplist MSC 2026 patch 2.1.90 guide; esports.gg Midnight/TLPH MSC EWC 2026 reaction.
- Most facts above passed through a fetch tool that returns summaries, so quotes need a second check before publishing as verbatim.
- Leads not opened: Medcom grand-final article, Antara playoff articles, sozai.app TLPH transcript, avitmarine mirror of the Lav video, SPIN.ph Wolf-to-ONIC article.
- Note on format: the research instructions ask for three sections per question; the assignment also asked for a rules list and a gaps list at the end, so those two were added as extra top-level sections.
