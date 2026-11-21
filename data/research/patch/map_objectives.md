# MLBB map objectives and game functions (as of 7 Nov 2026) and implications for MPL ID S18 draft scoring

Scope note: current date treated as 7 Nov 2026. Official patch text was read through mlbbhub.com mirrors of the patch notes (mlbbhub is a third-party site, not Moonton). Moonton's own site was only reached for the 2025 Project NEXT post, not for 2026. The in-game Battlefield Overview tab, which the notes say holds full details, was not accessible, so exact live numbers for Golden Turret and Healing Turtle are unpublished in any source I could reach. Roughly 40 tool calls were used; the research guideline of about 15 was exceeded because the hero table needed many single-page fetches.

## 1. Exact mechanics of the 2026 Annual Map Change and later tuning (live vs Advance Server only)

### Takeaway
Live (Original server, patch 2.2.16 from 16 Sep, map change effective 28 Sep 2026 server time) has Golden Turret, Healing Turtle, Revealing Wisps and a Sanctum Island art revamp, but the official live notes give almost no numbers. The only numbers appear in Advance Server notes (2.2.26 and 2.2.28), which are test-only. The latest Original patch as of 7 Nov is 2.2.16a (14 Oct), a hero-only patch, so none of the Advance tuning below is confirmed live.

### Cited Findings

**Live: patch 2.2.16 (Original server)**
- The 2026 Annual Map Change "begins 09/28 (Server Time)"; full details are said to be in the in-game Battlefield Overview tab. Patch released 16 Sep 2026, Season 42 "Starward Decade"; Sanctum Island art update took effect immediately with the patch. — [mlbbhub 2.2.16 Original](https://mlbbhub.com/patch-notes/original/2.2.16); [Liquipedia Patch 2.2.16 (via fetch summary)](https://liquipedia.net/mobilelegends/Patch_2.2.16); [Timesaver Sanctum Island](https://timesaver.gg/blog/mobile-legends-sanctum-island-map-changes-season-42)
- Golden Turret (live text, verbatim): "Greatly increased the Gold shared to the entire team when any Turret is destroyed." and "Inner Turret and Base Turret HP are also increased." No gold or HP numbers given. — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16)
- Healing Turtle (live text, verbatim): "Defeating the Turtle no longer grants a shield." "Instead, an allied Turtle will spawn on the enemy's strongest lane to help push it." "Allied heroes near the allied Turtle will recover HP rapidly and gain Turtle companions to help push turrets." No heal amounts, timers or turtle stats given. — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16)
- Revealing Wisps: pickable vision wisps placed across the map; a picked wisp circles the hero for several seconds, and if hidden enemy heroes are within a large range it moves to reveal them for several seconds. Durations and range unspecified. — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16); [Liquipedia 2.2.16](https://liquipedia.net/mobilelegends/Patch_2.2.16)
- Sanctum Island: scene, Lord and base art revamped; performance said to be nearly the same; no Lord mechanic change listed. Flying Cloud: visual upgrade only. — [Liquipedia 2.2.16](https://liquipedia.net/mobilelegends/Patch_2.2.16); [Timesaver Sanctum Island](https://timesaver.gg/blog/mobile-legends-sanctum-island-map-changes-season-42) (this source also says the Lord's late-game push role is unchanged)
- Economy in 2.2.16: Horned Lizard, Fire Beetle and Lava Golem base gold reduced by 13%; minion gold growth over time "slightly reduced"; the gold deficit needed to earn bonus gold from enemy hero kills drops from 2,000 to 1,500 (this is the catch-up bounty; the fetched text did not use the phrase "Team Bounty", so treat the label as an assumption). — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16)
- Enhanced Basic Attacks vs turrets (live): "All heroes' Enhanced Basic Attacks triggered by their own skills can now hit Turrets and apply their HP Regen effects." Named: "Sun, Gusion, Thamuz, Dyrroth, and Masha can now trigger HP Regen effects when attacking Turrets." Enhanced Basic Attack effects from Emblems, Battle Spells and Equipment cannot trigger on turrets; Quantum Charge cannot; Inspire on turrets keeps the attack-speed boost and defense-ignoring but not HP regen. — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16)
- Conflict on the named-hero list: Liquipedia's 2.2.16 page (via fetch summary) lists Argus as well; mlbbhub's page, re-fetched specifically for this, does not list Argus. Prefer mlbbhub (verbatim check), flag as unresolved. — [mlbbhub](https://mlbbhub.com/patch-notes/original/2.2.16) vs [Liquipedia](https://liquipedia.net/mobilelegends/Patch_2.2.16)
- 2.2.16a (Original, 14 Oct 2026) contains no map or objective change; hero changes only: Kalea buffed (solo kill potential); Aulus, Hirara, Eudora, Rafaela nerfed; Khufra adjusted. It is the latest Original patch listed on the mlbbhub index as of 7 Nov, and the MPL ID S18 draft page footer shows patch 2.2.16a. — [mlbbhub 2.2.16a](https://mlbbhub.com/patch-notes/original/2.2.16a); [mlbbhub patch index](https://mlbbhub.com/patch-notes); [mlbbhub MPL ID drafts](https://mlbbhub.com/mpl/id/drafts)

**Advance Server only (test, NOT confirmed live)**
- 2.2.24 (9 Oct): no map change for standard modes. Turret protection change appears only under Card Brawl: "First Turret Protection Duration: 2 min to 1 min" and "Damage Reduction While Protected: 80% to 50%". — [mlbbhub 2.2.24](https://mlbbhub.com/patch-notes/advanced/2.2.24) (page was summarised, not read raw)
- 2.2.26 (15 Oct): Golden Turret "in test" changed: removed extra HP for Inner and Base Turrets; added "significantly increased Hybrid Defense" to all turrets for the first 12 minutes (value not given). Healing Turtle: Gold and EXP from killing an enemy Turtle "significantly" increased (no values), shared among allied heroes in range, now roughly matching a minion wave. New test mode feature Glowing Lantern (Lantern Bearer). Global healing reduced 25% before 6 min and 50% after 6 min (listed as a "Mode Attribute"; unclear whether it applies to standard Classic/Ranked). Hero changes: Natalia revamp, Aldous, Atlas, Barats, Belerick, Dori, Gloo, Lukas, Masha, Popol and Kupa. — [mlbbhub 2.2.26](https://mlbbhub.com/patch-notes/advanced/2.2.26)
- 2.2.28 (24 Oct), verbatim on a second read: Golden Turret (ADJ) "Reverted last week's changes and adjusted the values of the original mechanics." Numbers: "Base Turret's HP Increase: 1000 >> 2000"; "Team Gold provided by the Outer Turret: 100 >> 90"; "Team Gold provided by the Inner Turret: 140 >> 120". — [mlbbhub 2.2.28](https://mlbbhub.com/patch-notes/advanced/2.2.28)
- 2.2.28, same page, Gold Lane Siege Minion (BUFF): Extra Gold in early game 40% to 60%, justified by "Fighters have been taking over the Gold Lane in both high-tier Ranked and professional matches". — [mlbbhub 2.2.28](https://mlbbhub.com/patch-notes/advanced/2.2.28)
- 2.2.28, under "Mode Adjustments > Turret Mechanics and Battle Spell Adjustments": "Protection Duration of the Second Turret and Base: 2 min >> 1 min"; "Damage Reduction While Protected: 80% >> 50%"; Aegis shield "750 (+90*Hero Level) >> 1,500 (+180*Hero Level)". The page does not say which mode this applies to. — [mlbbhub 2.2.28](https://mlbbhub.com/patch-notes/advanced/2.2.28)
- 2.2.30 (30 Oct): no turret, Golden Turret, Healing Turtle, Lord or Turtle changes. Glowing Lantern bearer buffs (greatly reduced first-death respawn; "substantial extra Gold"), and Bang Bang mode launching 10/30 (separate mode: 8-minute Golem win condition). — [mlbbhub 2.2.30](https://mlbbhub.com/patch-notes/advanced/2.2.30)
- Advance patch dates (mlbbhub index): 2.2.24 = 9 Oct, 2.2.26 = 15 Oct, 2.2.28 = 24 Oct, 2.2.30 = 30 Oct. — [mlbbhub patch index](https://mlbbhub.com/patch-notes)

**Lord and Turtle baseline timing (general game rules, guide updated "Oct 2026")**
- Turtle spawns at 2:00, respawns 2 minutes after death, stops spawning after 8:00 (a living Turtle becomes Lord if undamaged for 5 seconds). Lord spawns at 8:00 (or 2 min after last Turtle dies, whichever is later), respawns every 3 minutes, 2.5 minutes after 18:00; it pushes a lane with a siege wave and charges turrets for true damage; stats grow until 18:00. This guide still lists a "team shield" Turtle reward, which conflicts with the 2.2.16 removal of the Turtle shield, so the guide is likely only partly updated for the map change. Lord kill rewards not listed. — [mlbbhub jungle-rotation guide](https://mlbbhub.com/guides/jungle-rotation)

**Source reliability issues**
- Timesaver.gg is a commercial boosting-service blog; its own text says heal amounts, HP and gold multipliers and wisp timers were unconfirmed as of 22 Sep. Treat as qualitative colour only. — [Timesaver objectives guide](https://timesaver.gg/blog/mobile-legends-healing-turtle-golden-turret-objectives-guide)
- gamemarket.gg (announced 25 Sep, updated 23 Oct) states each match uses only one of four map effects chosen at random ("Setiap pertandingan menggunakan satu perubahan secara acak"). The mlbbhub 2.2.16 page has no "random" or "one of" wording. This may be carry-over from the 2025 four-random-maps system. Unresolved; matters for the scorer because it decides whether the objective dimension applies to every game. — [gamemarket.gg](https://gamemarket.gg/news/mobile-legends-bang-bang/mlbb-map-overhaul-golden-turret-healing-turtle-more); the 2025 random-maps system is confirmed in [Moonton Project NEXT news (2025-09-17)](https://en.moonton.com/news/244.html)

### Inferences
- The "ADJ" in 2.2.28 shows previous values as the left side of ">>". If "original mechanics" means the 2.2.16 live values, live Golden Turret is probably: Base Turret HP +1000, Outer Turret team gold 100, Inner Turret team gold 140. This is inferred from patch-note wording, not stated as live anywhere, and the numbers may be per-hero or per-team (patch note says "Team Gold").
- If 2.2.28 reaches Original, the changes would pull in two directions: lower team gold per turret (-10 outer, -20 inner), more base HP, and a shorter, weaker early turret shield (1 min, 50%), which favours early dives and fast first-turret takes. Hybrid Defense for 12 minutes (2.2.26) was reverted. All of this is Advance-only.
- The Healing Turtle test (2.2.26) raising Turtle gold/EXP to roughly a minion wave signals Moonton found Turtle value too low after the shield removal. Not confirmed live.

### Gaps
- No exact live numbers for Golden Turret team gold, Inner/Base HP, Healing Turtle healing, turtle stats, wisp range or duration, because the official notes publish none and the in-game tab was not accessible.
- Whether the first-turret protection change is "first" or "second" turret and whether it applies to Classic/Ranked or only Card Brawl/other modes: 2.2.24 says "First Turret" under Card Brawl; 2.2.28 says "Second Turret and Base" under Mode Adjustments. Unresolved.
- Whether Golden Turret / Healing Turtle are always on or random per match (see conflict above).
- Lord kill rewards and any 2026 change to Lord spawn timing: none found.
- Liquipedia's Golden Turret page exists in search results but could not be fetched; the Moonton 2026 official news post was not found.

---

## 2. Which hero traits win or lose from the new rules

### Takeaway
Sources are thin: the only hard, official hero-specific map-rule items are that Sun, Gusion, Thamuz, Dyrroth and Masha can now regen HP from skill-enhanced basic attacks on turrets. Everything else is qualitative analyst opinion (mostly Timesaver and gamemarket) or inference. Trait direction is plausible, not proven.

### Cited Findings
- Official: heroes named for turret HP regen via Enhanced Basic Attacks are Sun, Gusion, Thamuz, Dyrroth, Masha. — [mlbbhub 2.2.16](https://mlbbhub.com/patch-notes/original/2.2.16)
- Masha (pre-revamp, 20 Feb 2026 mlbbhub article): S-tier split pusher; three HP bars absorb two or three turret hits; %HP basic attacks do heavy turret damage regardless of items; ult can "permanently delete a turret's attack speed". Same article ranks X.Borg, Yu Zhong, Lapu-Lapu as A-tier split pushers (outside the requested hero list). — [mlbbhub split-push meta](https://mlbbhub.com/news/mlbb-split-push-meta-heroes-2025)
- Masha (post-revamp, live 16 Sep 2026): keeps three HP bars, AoE basic attacks, S1 main wave-clear/trade tool, S2 now a blink, ult is stun then burst; no longer an alone-in-sidelane split pusher but a teamfight brawler; jungle not recommended. Same source says Healing Turtle and Golden Turrets pull fights to the same spots, which suits a brawler. Source does not discuss turret regen. — [Timesaver Masha revamp](https://timesaver.gg/blog/mobile-legends-masha-revamp-guide-season-42)
- Timesaver (analysis, not confirmed data): grouping beats farming because Turtle and turrets reward teams that move together; Revealing Wisps flatten vision and may hurt ambush/pick comps, favouring teamfight and push comps; extra turret gold speeds item timings so tempo matters more. — [Timesaver Sanctum Island](https://timesaver.gg/blog/mobile-legends-sanctum-island-map-changes-season-42)
- Timesaver objectives guide (qualitative, no numbers): support and tank picks with vision or crowd control gain value, blind flanking comps lose; assassins such as Lancelot and Ling must plan routes around wisps; junglers should secure Healing Turtle with vision set; fighters answer the Turtle-assist push. — [Timesaver objectives guide](https://timesaver.gg/blog/mobile-legends-healing-turtle-golden-turret-objectives-guide)
- gamemarket.gg (qualitative): Golden Turret rewards teams that take towers fast and coordinate minion pushes, with the extra HP giving defenders a little time; Healing Turtle favours teams that stay near the objective to use the rapid HP recovery; Wisps help brush flankers but demand minimap checks. — [gamemarket.gg](https://gamemarket.gg/news/mobile-legends-bang-bang/mlbb-map-overhaul-golden-turret-healing-turtle-more)
- Gold lane trend: Moonton's own 2.2.28 (Advance) note says Fighters "have been taking over the Gold Lane in both high-tier Ranked and professional matches" and buffs Gold Lane siege-minion extra gold from 40% to 60% to help Marksmen. This is a developer statement about pro play pre-dating the buff and implies fighter-in-gold-lane drafts are common. — [mlbbhub 2.2.28](https://mlbbhub.com/patch-notes/advanced/2.2.28)
- TNC Bennyqt (Oct 2025, thegame.ph, a different patch and map system): fighters reach impact sooner than marksmen; "tempo wins games"; late-game heroes less valuable. Not about 2026 turret rules. — [The Game PH](https://thegame.ph/e-sports/mobile-legends/tnc-bennyqt-on-the-fighter-gold-lane-meta/)
- Hero pages (mlbbhub, patch 2.2.16a ranked data, Nov 2026): Atlas value is at Turtle entrance via S2 pull; Marcel's CC controls Turtle/Lord chokepoints and Framed Moment is not a wave-clear tool; Hirara's waves are "a waste of her time" but she can wait at back edge of Turtle to punish a solo check; Paquito's value is river and Turtle skirmishes and Jab is blocked by minions; Freya's job when ult is down is split-push and wave-clear. — [Atlas](https://mlbbhub.com/heroes/atlas), [Marcel](https://mlbbhub.com/heroes/marcel), [Hirara](https://mlbbhub.com/heroes/hirara), [Paquito](https://mlbbhub.com/heroes/paquito), [Freya](https://mlbbhub.com/heroes/freya)
- Older, dated sources naming pushers: gamersdecide list (updated 4 Nov 2022) names Sun, Zhask, Bane, Granger, Claude, Miya, Masha, Zilong, Aldous, Natalia as turret takers. Stale; kits have changed. — [gamersdecide](https://gamersdecide.com/articles/mobile-legends-best-pushers)
- Not applicable (2025 maps, not 2026 rules): the esports.gg Project NEXT piece lists map winners/losers (for example Cecilion low-mobility loser on Dangerous Grass; Tigreal, Belerick, Minotaur gaining on Broken Walls). Do not reuse as 2026 evidence. — [esports.gg](https://esports.gg/guides/mobile-legends-bang-bang/mlbb-project-next-2025-new-maps-meta-winners-losers)
- Fandom defines the in-game "Push" specialty as "Can quickly destroy turrets at all points of the game", but the fetched page did not list which heroes carry it. — [Fandom Hero specialties](https://mobile-legends.fandom.com/wiki/Hero_specialties)

### Inferences
- Likely winners under the live rules (inference from mechanics, not analyst-cited): heroes that sustain while hitting turrets (the five regen heroes), heroes that survive turret aggro (Masha's HP bars), heroes with area-wave clear that can follow Healing Turtle waves, and heroes that hold the Turtle area (CC tanks/roamers like Atlas and Marcel).
- Likely losers: pure ambush assassins with no wave clear (Hirara's own page says waves are wasted time) when Wisps reveal them; low-sustain squishies that cannot contest the Turtle area or defend against the Healing Turtle push on a "strongest lane".
- Because the 2.2.26 test explicitly removed Inner/Base HP and then 2.2.28 restored it at +2000 base HP, and the 2.2.28 protection nerf reduces early turret defence, a scorer should weight "first-turret speed" and "tempo to turrets" higher only if those land in Original. Currently unconfirmed.

### Gaps
- No analyst, caster or coach named specific winners/losers under Golden Turret + Healing Turtle for pro play. All named-hero claims are from patch notes, hero pages or generic blogs.
- No numeric turret damage, HP-regen values or clear-speed data per hero found.

---

## 3. Pro-play commentary, game length and how games end

### Takeaway
I found no published stat on average game length before vs after 28 Sep, none on the share of games decided by early turret or Turtle control, and no named pro/caster/coach commentary on Golden Turret or Healing Turtle. Plainly: none exists in the sources I could reach.

### Cited Findings
- mlbbhub MPL ID S18 stats page: "Data as of 7 Nov 2026"; lists hero pick/ban/win but does not state average game length, first turret/turtle/lord rates, objective-win correlation or total match count. — [mlbbhub MPL ID stats](https://mlbbhub.com/mpl/id/stats)
- mlbbhub MPL ID drafts page: 78 completed matches, 199 drafted games counted for ban shares, date range 14 Aug to 6 Nov 2026, patch 2.2.16a in footer. The map change date (28 Sep) falls inside this range, so a before/after split is possible with raw data but is not published. — [mlbbhub MPL ID drafts](https://mlbbhub.com/mpl/id/drafts)
- MPL ID S18 top 10 by bans (drafts page, share of 199 games): Freya 142 (71%), Atlas 128 (64%), Fanny 117 (59%), Marcel 100 (50%), Hirara 85 (43%), Masha 75 (38%), Esmeralda 74 (37%), Paquito 73 (37%), Carmilla 69 (35%), Uranus 58 (29%). — [mlbbhub MPL ID drafts](https://mlbbhub.com/mpl/id/drafts)
- Stats page (picks/bans/wins, slightly later snapshot, counts differ by 1 for Freya/Atlas/Fanny/Marcel): Paquito 98 picks, 73 bans, 43 wins (44% WR; most picked); Hirara 94 picks, 85 bans, 49 wins (52%); Nolan 70 picks, 51 bans, 42 wins (60%); Zhuxin 59/53/30; Atlas 56/129/29; Uranus 55/58/25 (45%); Freya 54/143/28 (52%); Carmilla 45/69/24; Marcel 34/101/22 (65%); Fanny 22/119/12 (55%). — [mlbbhub MPL ID stats](https://mlbbhub.com/mpl/id/stats)
- Exp Carry (updated 27 Oct 2026, MPL PH S18 finals piece): general coaching claims that coaches draft for "objective timers", a hero who cannot contest "the first turtle" may be nearly unplayable on stage, and teams controlling the map clock force bad fights. It does not mention Golden Turret, Healing Turtle, turrets, game length or specific finals results. Low-value, generic. — [Exp Carry](https://expcarry.com/mpl-ph-season-18-finals-pro-drafts-vs-ranked-picks)
- Moonton's 2.2.28 developer note says fighters were taking the gold lane in pro matches (see Q2); this is the only developer statement about pro-play behaviour found. — [mlbbhub 2.2.28](https://mlbbhub.com/patch-notes/advanced/2.2.28)

### Inferences
- With only 78 matches in a window that spans both rules, and no game-length column on any page fetched, a before/after game-length comparison would need per-match data from Liquipedia's MPL ID S18 match pages or a Moonton/MPL feed; not collected here.
- Whether MPL ID S18 matches after 28 Sep actually ran with Golden Turret and Healing Turtle is not verified (league patch adoption date unverified; the draft page footer shows 2.2.16a).

### Gaps
- No average game length before/after 28 Sep, no share of games decided by early turret/Turtle control, no MSC or M-series figures, no MPL PH/ID caster or coach quote about the new map: not found despite searches for pro reactions and "MPL ID S18 map change".
- Liquipedia MPL PH Season 18 and Playoffs pages appeared in search but were not opened, so match-level data and any reported times remain unchecked.

---

## 4. First-pass hero table for MPL ID S18 most picked or banned heroes

### Takeaway
Only 9 of the 52 requested heroes have any fetched hero-specific evidence for the three scores (and only 5 have two or more scores filled); the rest are "unknown" in the CSV by design. I did not score from memory. Full table with evidence and URLs: `/home/claude/research_notes/MLBB patch and matchup knowledge/hero_objective_traits.csv`.

### Cited Findings
Scale 0 to 3. "unknown" means no fetched source addresses it. Scores marked "interpretive" convert qualitative text to numbers and carry low confidence.

| hero | turret_push | early_objective | wave_clear | evidence in one line | confidence |
|---|---|---|---|---|---|
| Freya | 2 | 1 | 2 | Hero page: split-push and wave-clear role when ult is down; 2-3-1 jungle clear via S2 orbs; interpretive | low |
| Atlas | 0 | 1 | 1 | "not there to clear camps"; S1 speeds mid wave; value at Turtle entrance via S2 pull; no turret damage text | medium |
| Hirara | unknown | 2 | 0 | "waves are a waste of her time"; faster first camp; punishes solo Turtle checks | medium |
| Paquito | unknown | 1 | 1 | Jab blocked by minions; jungle only in stable comps; river/Turtle skirmishes | low |
| Marcel | unknown | 1 | 0 | "not a wave-clear tool"; CC controls Turtle/Lord chokepoints | medium |
| Masha | 3 | 1 | 2 | Official turret-regen list; 3 HP bars, %HP basic attacks; S1 wave clear; jungle not recommended; revamped 16 Sep | medium |
| Dyrroth | 2 | unknown | unknown | Official turret-regen list only; magnitude unpublished | low |
| Miya | 3 | unknown | unknown | 2022-dated list says high attack speed tower destroyer; stale | low |
| Claude | 3 | unknown | unknown | 2022-dated list says strong lane pusher; stale | low |
| All other 43 | unknown | unknown | unknown | No fetched kit source; see CSV notes (patch-change flags below) | low |

Patch-change flags on listed heroes: live 2.2.16a (14 Oct) buffed Kalea and nerfed Aulus, Hirara, Eudora, Rafaela — [mlbbhub 2.2.16a](https://mlbbhub.com/patch-notes/original/2.2.16a). Advance 2.2.26 (not live) changed Atlas, Barats, Belerick, Gloo, Lukas, Masha — [mlbbhub 2.2.26](https://mlbbhub.com/patch-notes/advanced/2.2.26). Ranked context on the 2.2.16a page: Hirara 50.1% WR and 68.21% ban rate, Marcel 57.54% WR and 39.86% ban rate, Atlas 52.28% WR, Paquito 50.12% WR, Freya 48.4% WR; mlbbhub hero pages show inconsistent refresh dates, so these are indicative only — [Hirara](https://mlbbhub.com/heroes/hirara), [Marcel](https://mlbbhub.com/heroes/marcel), [Atlas](https://mlbbhub.com/heroes/atlas), [Paquito](https://mlbbhub.com/heroes/paquito), [Freya](https://mlbbhub.com/heroes/freya).

### Inferences
- The most-banned MPL ID S18 heroes with fetched kit data (Freya, Atlas, Hirara, Marcel) are not turret-pushers by their own pages: they are skirmish, pull/CC and pick heroes. That fits a draft where objective contest comes from CC and jungle tempo rather than raw turret damage, but no source states this.
- A scorer can safely use only Masha, Dyrroth (and Sun, Gusion, Thamuz outside the requested list) as hard "turret regen" flags today; every other turret_push value is a placeholder.
- Suggested next step for whoever continues: fetch mlbbhub hero pages one at a time for the remaining heroes (URL pattern https://mlbbhub.com/heroes/{hero}, confirmed working for Freya, Atlas, Hirara, Marcel, Paquito), which expose role, lane, skill summary and ranked stats; they give qualitative text on wave clear but no turret-damage numbers.

### Gaps
- No kit evidence for 43 of the 52 heroes; Sora, Suyou, Kalea, Zhuxin, Phoveus and Nolan are newer heroes whose kits I could not verify at all. A Playnews guide on Marcel, Hirara and Sora could not be fetched.
- Fandom hero list and specialty ("Push") membership could not be fetched (allowlist and missing list on the specialties page).
- No source gives Turtle/Lord burst damage per hero or turret damage per hero.
