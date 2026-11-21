# What MLBBHub's MPL Indonesia Season 18 drafts data means (BTR and TLID games)

Scope: MPL Indonesia Season 18 (2026) only. Read 7 Nov 2026. Output data: `btr_tlid_drafts_v2.csv` (same folder). The earlier files (`btr_drafts.*`, `tlid_drafts.*`) were not modified.

Headline answers
1. The two 5-hero lists per team per game on mlbbhub.com/mpl/id/drafts are BANS, not picks. The TLID notes (which called them picks) were wrong; the BTR notes (which called them bans) were right.
2. Each list is most probably the bans made BY the team named above it, in ban order (first hero = that team's first ban).
3. The page never prints "blue" or "red". The order in which the two teams are printed in a game appears to be blue first, red second. This is inferred from several statistical signatures, not stated by the site.
4. The match pages (`/mpl/id/match/NNNN`) show ONE unlabelled scoreboard of heroes actually played (picks), which is Game 1 in all four series where it could be tested. No bans, sides, pick order or per-game picks for Games 2+.
5. Patch per game, pick order, global ban/pick step numbers and Game 2+ picks are not on the site.

Confidence key used in the CSV `confidence` column: it describes the WEAKEST element on the row. Ban rows are `inferred` because the ban-vs-pick call is confirmed but the owning team, side and within-team order are inferred. Scoreboard pick rows are `inferred` because hero, player and team are read directly but the game number (Game 1) is inferred. `unknown` rows are placeholders.

## 1. What do the labelled columns/sections of the drafts page and a match page actually show?

### Takeaway
The drafts page is titled "MPL Indonesia Season 18 Drafts & Bans" and has aggregate ban tables plus a match-by-match block where each Game shows two teams, each with five heroes, and a "Winner" marker. It has no "Pick", "Blue", "Red" or "First Pick" labels per game. The match page has a header, game tabs (none marked active), VOD link and one unlabelled scoreboard.

### Cited Findings
- Drafts page structure, top to bottom: breadcrumb, title "MPL Indonesia Season 18 Drafts & Bans", coverage line "verified drafts cover 76 of 76 completed matches", attribution "draft data (bans and side) from Liquipedia, CC BY-SA 3.0", a "Most Banned Heroes" table, a "Side Win Rate" block (Blue 58% / 110 games, Red 42% / 80 games, of 190 games with a winner), "First Bans" tables (separate "Blue side first bans" and "Red side first bans"), then "Match-by-Match Drafts" with one block per match (teams, date, score, Scoreboard link) and "Game N" sub-blocks — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Label words found: Ban/Bans, First Bans, Blue side, Red side, Side Win Rate, Winner, Scoreboard, Game 1 to 5. Not found in game blocks: Pick, First Pick, Blue, Red, any step number — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Inside a game block the text order is: first team name, its five heroes, second team name, its five heroes; "Winner" sits right after the winning team's name and before its hero list. The winner can be either the first or second printed team (first-printed team won 46 of 80 games) — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts) (counted by me from the 80 BTR/TLID games transcribed from the page)
- No icon alt text or title attributes were visible in the text I could read — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Page-level ban statistics (denominator 190 drafted games): Freya 141 (74%), Atlas 123 (65%), Fanny 114 (60%), Marcel 94 (49%), Hirara 83 (44%), Masha 71 (37%), Carmilla 69 (36%), Paquito 68 (36%), Esmeralda 66 (35%), Uranus 55 (29%). Blue side first bans: Fanny 29, Atlas 27, Hirara 17, Paquito 15, Marcel 13. Red side first bans: Freya 82, Masha 36, Hirara 9, Carmilla 8, Marcel 8. The page has no caption defining "first ban" — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Match page (examples 1042, 1038, 1109, 1111, 1112): header with the two team abbreviations, "Winner" label, series score, stage label (when present), local date/time, "Game 1..N" tabs with none marked selected, "Watch VOD" link, then ONE scoreboard per team (player, hero, K/D/A, gold, damage, damage taken, items/emblem icons). Player rows run in a fixed order (BTR: Shogun, Nnael, Morenooo, Finn, EMANN; TLID: Aran, Kevinn, Drichel, Lyoni, Keven). No ban, pick, side, blue/red, per-game winner or first-pick labels. The footer says "Patch 2.2.16a" — [match 1042](https://mlbbhub.com/mpl/id/match/1042), [match 1038](https://mlbbhub.com/mpl/id/match/1038), [match 1109](https://mlbbhub.com/mpl/id/match/1109), [match 1111](https://mlbbhub.com/mpl/id/match/1111), [match 1112](https://mlbbhub.com/mpl/id/match/1112)

### Inferences
- The "Patch 2.2.16a" footer appears identically on pages dated 15 Aug and 6 Nov, so it looks like the site's current patch, not a per-game patch. The patch column in the CSV is therefore empty.
- Match pages carry no game-level draft, so the only per-game draft source on the site is the drafts page.

### Gaps
- Raw HTML (alt text, CSS classes, data attributes such as a side class on team names) was not inspected: the session proxy blocks direct HTTP to mlbbhub.com and the browser pane was not authorised. Everything above comes from WebFetch text extraction (a summarising fetcher that cannot quote long passages), so any colour or position cue that is not in text form (a blue/red badge, for example) would have been invisible to me. It is possible the live page shows side colours that I could not see.

## 2. Are the 5-hero lists bans or picks? (validation)

### Takeaway
They are bans. Four independent checks agree, and one of them (the Game 1 scoreboard test) directly rules out "picks". Confidence: confirmed for ban-vs-pick as far as the data allow; there is no external article naming a specific game's bans, so no check is truly outside mlbbhub.

### Cited Findings
- Test A (site's own wording): the page is titled "Drafts & Bans", the stats are headed "Most Banned Heroes", and its attribution says "bans and side" come from Liquipedia. It never uses the word "pick" for the lists — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Test B (frequencies match the page's own ban table): over the 80 BTR/TLID games I transcribed, the share of games in which a hero appears in either list is: Freya 69% (page ban rate 74%), Atlas 61% (65%), Fanny 61% (60%), Marcel 52% (49%), Hirara 46% (44%), Masha 35% (37%), Carmilla 34% (36%), Paquito 42% (36%), Esmeralda 29% (35%), Uranus 29% (29%). A hero cannot be picked in a game where it was banned, so Freya appearing in 69% of lists cannot be a pick list when the page says she is banned in 74% of games. Also, no hero appears in both teams' lists in any of the 80 games (a hero can only be banned once per game) — computed by me from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Test C (scoreboard = Game 1, banned heroes never played): in each of the four series where I read the match page scoreboard, the heroes actually played on the scoreboard overlap ZERO heroes of the Game 1 lists but overlap 1 to 5 heroes in every later game (1038: G1 0, G2 5, G3 5; 1042: G1 0, G2 3, G3 1; 1109: G1 0, G2 4, G3 3, G4 4, G5 3; 1111: G1 0, G2 4, G3 3, G4 4). If the lists were picks, the scoreboard would equal one game's lists exactly; it equals none. If they are bans, the scoreboard can only be a game with zero overlap, which is Game 1 in 4 of 4 series — [match 1038](https://mlbbhub.com/mpl/id/match/1038), [match 1042](https://mlbbhub.com/mpl/id/match/1042), [match 1109](https://mlbbhub.com/mpl/id/match/1109), [match 1111](https://mlbbhub.com/mpl/id/match/1111) with [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Test D (Game 1 winner agrees with the scoreboard): the drafts page records the Game 1 winner as GEEK for 1038, BTR for 1042 and TLID for 1111, and the scoreboards show GEEK 12 kills vs TLID 1 (1038), BTR 16 vs GEEK 14 (1042), TLID 13 vs BTR 4 (1111), i.e. the Game 1 winner is the team with more kills on the scoreboard. (1109: BTR 19 kills vs EVOS 18, BTR won Game 1.) This independently ties the scoreboard to Game 1 — [match 1038](https://mlbbhub.com/mpl/id/match/1038), [match 1042](https://mlbbhub.com/mpl/id/match/1042), [match 1109](https://mlbbhub.com/mpl/id/match/1109), [match 1111](https://mlbbhub.com/mpl/id/match/1111), [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Worked example (1042, BTR vs GEEK, Game 1, 16 Aug): printed lists BTR "Atlas, Paquito, Marcel, Eudora, Vexana" and GEEK "Freya, Fanny, Hirara, Melissa, Hanabi". Scoreboard heroes played: BTR Uranus, Hayabusa, Novaria, Mathilda, Ixia; GEEK Barats, Ling, Kimmy, Kaja, Brody. No hero is on both. In Game 2, GEEK's list contains Novaria and BTR's list contains Uranus and Kaja, all heroes played in Game 1; in Game 3 GEEK's list contains Hayabusa — [match 1042](https://mlbbhub.com/mpl/id/match/1042), [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Transcription check: two separate fetch passes (earlier researchers' CSVs and mine) give the same hero set for all 166 lists in the BTR (96) and TLID (70) CSVs — compared by me against `btr_drafts.csv` and `tlid_drafts.csv`.

### Inferences
- Combining A to D, the lists are ban lists. The TLID file's statements such as "Fanny is TLID's most-picked hero (17 games)" are really "Fanny is in the list printed under TLID in 17 games", i.e. a ban in that list, and should be discarded as pick statistics.
- Heroes that a team actually plays are NOT in either list for that game; picks for Games 2+ cannot be reconstructed from the lists (they only exclude heroes).

### Gaps
- No news article, YouTube description or recap naming a specific game's bans was found for any S18 game (searched: Indonesian and English queries on BTR/TLID drafts; DuniaGames week 2 breakdown mentions only hero examples and no bans or sides — [DuniaGames](https://duniagames.co.id/amp/discover/article/breakdown-mpl-id-s18-week-2-btr-terlalu-kuat-evos-masih-inkonsisten/en)). So there is no verification from outside mlbbhub's own pages.

## 3. Which team made each ban, which side was each team on, and is there ban or pick order?

### Takeaway
Most probable reading (inferred, moderate to strong): the list printed under a team is the bans made by that team, in order, and the first-printed team in each game is the blue side. Ban order within a team is inferred from the first-ban statistics; global step order (interleaving blue and red) and all pick order are not on the site.

### Cited Findings
- Team print order carries side. In the 80 games (BTR and TLID, as transcribed), the first hero of the SECOND-printed team's list is Freya in 32 games and Masha in 15 (47 of 80, 59%), while the FIRST-printed team's list starts with Freya in 1 game and Masha in 0. The first-printed team's lists start with Atlas 12, Hirara 10, Paquito 9, Fanny 8, Carmilla 8, Mathilda 7, Marcel 5. The page's own tables give Red first bans = Freya 82 and Masha 36 of 190 (43% and 19%) and Blue first bans = Fanny 29, Atlas 27, Hirara 17, Paquito 15, Marcel 13. Fanny or Atlas open the first-printed list in 20 games versus 4 for the second-printed list — computed by me from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts); reference tables at the same URL
- The first-printed team won 46 of 80 games (57.5%). The page says blue side won 58% (110 of 190). If first-printed were red (42% expected), 46 or more wins out of 80 has probability about 0.004; 57.5% fits blue — computed by me from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Two consecutive games do not follow a "loser gets blue" pattern: the first-printed team in a game was the previous game's loser in only 23 of 48 follow-up games — computed by me from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts). Header order (series title) matched the first-printed team in 43 of 80 games, so print order is a per-game property, not series order.
- Ownership (H1 = list under a team is that team's bans; H2 = bans against that team). The win-rate result above is only consistent with H1 (under H2, the first-printed team would be red and should win about 42%). A second weak test supports H1: heroes played on the Game 1 scoreboards appear in later games' lists printed under the OPPOSING team 24 times versus 15 under their own team (teams ban what the opponent played, rather than their own just-played heroes) — computed by me from [match pages](https://mlbbhub.com/mpl/id/match/1111) and [drafts](https://mlbbhub.com/mpl/id/drafts). A third test (consistency of a team's lists across opponents, mean Jaccard overlap) was inconclusive: 0.141 for lists grouped under the team versus 0.138 grouped under the opponent, and TLID and BTR leaned toward H2 (TLID 0.111 vs 0.171, BTR 0.119 vs 0.135) because lists are dominated by a league-wide meta (Freya, Atlas, Fanny) — computed by me from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- The source of the data is stated as Liquipedia — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts). Liquipedia's own MLBB match pages (not read; blocked) are generally understood to list bans per team, but I could not confirm that for S18.
- First-ban reading: the blue side first-ban table and red side first-ban table are consistent with the first hero of each printed list being that team's first ban (see first bullet). The remaining positions 2 to 5 are plausibly ban order but there is no test for them.

### Inferences
- Side rule used in the CSV: `blue_team` = first-printed team, `red_team` = second-printed team. Evidence: three converging signatures (first-ban hero mix, first-printed win share 57.5% vs the site's 58% blue win rate, page-level first-ban tables). Status: inferred, not stated by the site. If side is not on the live page in a form I could not read (see Gaps in Section 1), the real labels should be checked against it.
- `action_team` in ban rows = team printed above the list (H1). If H2 were true, every ban row's action_team would be the other team, AND blue/red would swap. The two assumptions stand or fall together.
- `step_no` in the CSV is the within-team ban index (1 to 5 as printed). It is not the global 1 to 10 ban step. Why: the order in which blue and red alternate is not shown on the site, and I did not assume a league rule for it.
- Pick order and player-to-hero assignments exist only for the Game 1 scoreboards. Pick order is unknown for every game.

### Gaps
- No source states ban order, pick order, global step order, first-pick marker, or sides per game in plain text. I found no evidence of a "first pick" marker anywhere on mlbbhub.
- The ownership question (H1 vs H2) is not settled by any direct external source. Liquipedia (the stated origin) was blocked.

## 4. Extracted data: coverage, results and what the data say for BTR and TLID

### Takeaway
`btr_tlid_drafts_v2.csv` has 861 rows: 800 ban rows (80 games x 10), 40 scoreboard pick rows (Game 1 of 4 series, 10 per game), 11 empty placeholder rows for games that were played but have no draft on the site, and 10 pick rows for the 6 Nov BTR vs AE scoreboard whose game number is unknown. 80 distinct games have ban lists: 48 of BTR's 53 games and 40 of TLID's 46 games (8 games are BTR vs TLID and are counted in both).

### Cited Findings
- Regular season: all 16 BTR series (39 games) and 15 of 16 TLID series are complete on the drafts page, the exception being ONIC vs TLID on 18 Oct where only Game 1 is listed (TLID won the series 2-0, so a Game 2 existed). Playoffs on the page: BTR vs EVOS 3-2 (4 Nov, match 1109), TLID 3-1 BTR (5 Nov, match 1111). Per-game winners on the page sum to the series scores for all 31 series I checked, including 1046, 1059, 1083, 1085 and 1093, which the earlier TLID notes reported as conflicting or missing — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts), compared against series scores in the earlier notes derived from [MLBBHub schedule](https://mlbbhub.com/mpl/id/schedule)
- Dates in the CSV are those printed on the drafts page (the schedule page prints different dates for some series; the drafts-page dates are supported by match IDs running in time order and by the Gizmologi 21 Aug fixture article) — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts), [Gizmologi 21 Aug](https://gizmologi.id/game/jadwal-mpl-id-s18-hari-ini-21-agustus/)
- Missing from the site: BTR 3-2 AE, 6 Nov, Lower Bracket Semifinal (match 1112; five games, no bans, no per-game winners); NAVI vs TLID Upper Bracket Final, 6 Nov (not on the drafts page when read; result and game winners are reported by news per a separate research note, which I have not verified). The page data is stamped 6 Nov 2026; BTR vs TLID Lower Bracket Final (7 Nov) had not been played when I read the pages — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts), [match 1112](https://mlbbhub.com/mpl/id/match/1112), [MLBBHub playoffs](https://mlbbhub.com/mpl/id/playoffs)
- Game 1 scoreboards (picks, player, hero), with the side inferred as above:
  - 1042 BTR (blue) vs GEEK (red), 16 Aug, BTR won: BTR Shogun Uranus, Nnael Hayabusa, Morenooo Novaria, Finn Mathilda, EMANN Ixia; GEEK MarceL Barats, Nazara Ling, Aboyy Kimmy, AudyTzy Kaja, KennzySkie Brody — [match 1042](https://mlbbhub.com/mpl/id/match/1042)
  - 1038 GEEK (blue) vs TLID (red), 15 Aug, GEEK won: GEEK MarceL Freya, Nazara Nolan, Aboyy Eudora, AudyTzy Kaja, KennzySkie Brody; TLID Aran Uranus, Kevinn Paquito, Drichel Novaria, Lyoni Minotaur, Keven Melissa — [match 1038](https://mlbbhub.com/mpl/id/match/1038)
  - 1109 BTR (blue) vs EVOS (red), 4 Nov, BTR won: BTR Shogun Yu Zhong, Nnael Nolan, Morenooo Kimmy, Finn Masha, EMANN Esmeralda; EVOS Rendyyy Dyrroth, Alberttt Suyou, Ryzaa Lylia, Muezza Kalea, Erlan Paquito — [match 1109](https://mlbbhub.com/mpl/id/match/1109)
  - 1111 TLID (blue) vs BTR (red), 5 Nov, TLID won: TLID Aran Freya, Kevinn Hirara, Drichel Lylia, Lyoni Masha, Keven Harith; BTR Shogun Uranus, Nnael Alice, Morenooo Kimmy, Finn Gatotkaca, EMANN Cici — [match 1111](https://mlbbhub.com/mpl/id/match/1111)
  - 1112 AE vs BTR, 6 Nov, game number and winner not stated: AE Nino Barats, Yazukee Suyou, Hijumee Eudora, alekk Khaleed, Arfy Freya; BTR Shogun Uranus, Nnael Nolan, Morenooo Valir, Finn Marcel, EMANN Paquito. By analogy with the other four series it is probably Game 1 but this cannot be tested because there are no ban lists for the series — [match 1112](https://mlbbhub.com/mpl/id/match/1112)
- Roles in the CSV for BTR and TLID players come from the fixed scoreboard row order matched to the DuniaGames roster (TLID: Aran EXP, Kevinn Jungle, Drichel Mid, Lyoni Roam, Keven Gold; BTR: Shogun EXP, Nnael Jungle, Morenooo Mid, Finn Roam, EMANN Gold) — [DuniaGames roster](https://duniagames.co.id/amp/discover/article/roster-mpl-id-s18-lengkap-susunan-9-tim-terbaru/en), [MLBBHub stats](https://mlbbhub.com/mpl/id/stats). Opponent roles are left empty.
- Side and results summary computed by me (using the inferred side rule), games with ban lists only: BTR 48 games, blue 18 and red 30; BTR won 11 of 18 on blue and 14 of 30 on red (25 wins in 48). TLID 40 games, blue 19 and red 21; TLID won 16 of 19 on blue and 12 of 21 on red (28 wins in 40) — computed from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Bans printed under BTR (own bans if H1), most common over 48 games: Freya 23, Carmilla 17, Paquito 16, Atlas 15, Zhuxin 13, Melissa 12, Marcel 10, Masha 10, Gloo 10, Lylia 9. First ban of BTR's list: Freya 19, Masha 9, Carmilla 6, Atlas 6. Bans printed under BTR's opponents (against BTR): Fanny 33, Mathilda 17, Atlas 14, Marcel 13, Masha 10, Hirara 10, Nolan 10, Selena 9, Novaria 9, Esmeralda 8 — computed from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- Bans printed under TLID, over 40 games: Fanny 18, Marcel 15, Atlas 12, Esmeralda 11, Aulus 10, Rafaela 10, Obsidia 9, Masha 8, Paquito 8, Eudora 7. First ban of TLID's list: Rafaela 7, Marcel 6, Fanny 5, Aulus 5, Mathilda 4, Paquito 4. Bans against TLID: Freya 30, Hirara 22, Atlas 13, Zhuxin 10, Lylia 10, Uranus 10, Paquito 9, Melissa 8 — computed from [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)
- In all five 5 Nov and 18 Oct TLID games with Fanny and Esmeralda (the two opening TLID bans in 5 of 5 games) the pattern fits a fixed TLID habit of opening with Fanny and Esmeralda late in the season; BTR opened with Carmilla in 4 of 5 games vs EVOS on 4 Nov — [MLBBHub drafts](https://mlbbhub.com/mpl/id/drafts)

### Inferences
- The patterns in the last three bullets only mean something if H1 (list = own bans) holds. If H2 is true the lists would be bans against the team, and BTR's "own" bans would be its opponents' bans of BTR.
- The earlier BTR note's reading that BTR's block is dominated by BTR's own signature heroes (Uranus, Gloo, Marcel, Lylia, Zhuxin) fits H2, while the blue-win-rate test and the 24-vs-15 scoreboard test fit H1. I weighted H1 higher because of the win-rate result and because Liquipedia is understood to store bans by team, but H2 is not eliminated.

### Gaps
- Game 2+ picks, pick order, players per hero, roles of opponents, and any game on 6 or 7 Nov (BTR vs AE, NAVI vs TLID, the 7 Nov Lower Bracket Final).
- ONIC vs TLID 18 Oct Game 2: no lists on the page (placeholder row).
- Whether the live page displays blue/red colouring not captured in the text.

## 5. Other sources tried

### Takeaway
No other source supplied bans, picks or sides for a BTR/TLID S18 game. Each source was tried once and then dropped.

### Cited Findings
- Liquipedia (MPL Indonesia Season 18): fetch refused with URL_NOT_ON_ALLOWLIST — `https://liquipedia.net/mobilelegends/MPL/Indonesia/Season_18` (not read)
- Direct HTTP to mlbbhub.com from the shell: blocked by the session proxy (connect rejected), so only the WebFetch tool could read mlbbhub pages. The browser pane (Claude Browser) needed per-site approval and the Chrome extension was not connected, so raw HTML was not read.
- DuniaGames Week 2 breakdown: mentions BTR hero examples for the ONIC series (Uranus, Barats, Belerick for Shogun) but gives no bans, sides, or game numbers — [DuniaGames](https://duniagames.co.id/amp/discover/article/breakdown-mpl-id-s18-week-2-btr-terlalu-kuat-evos-masih-inkonsisten/en)
- esports.gg search: returned only M6 results from another season and no S18 recap; bo3.gg only a preview article (listed in search results, not opened) — [bo3.gg S18 preview](https://bo3.gg/es/mlbb/articles/mpl-indonesia-season-18-preview)
- Detik, Gizmologi and Cybersport.ru S18 pages found by search are schedules and results; none was found to carry bans (Detik results article listed in search: [Detik standings](https://inet.detik.com/esport/d-8714076/hasil-dan-klasemen-akhir-reguler-season-mpl-id-s18)) — not opened for drafts.

### Inferences
- A VOD is the likely way to verify ownership and side directly: the match pages link a YouTube VOD per series (for example 1111: https://www.youtube.com/watch?v=n9d7HBZ-aGA, 1042: a YouTube live link) and the draft screen of Game 1 would show the blue/red labels and who banned what. I did not open any VOD.

### Gaps
- One VOD check of any Game 1 draft (for instance 1111 Game 1 on 5 Nov, where the printed lists are TLID Fanny, Esmeralda, Eudora, Kalea, Aulus and BTR Zhuxin, Nolan, Paquito, Zetian, Valir) would settle H1 vs H2 and the side rule in a minute and turn the `inferred` rows into `confirmed`.

## Corrections to the earlier files
- `tlid_drafts.csv`/`.md`: action "pick" is wrong (these are bans); the "conflicting winners" for 1046, 1059, 1083 were misreads (page winners add up to the series scores); matches 1085 (DEWA vs TLID, dated 2 Oct on the page, not 20 Sep) and 1093 (NAVI vs TLID, 8 Oct) are on the drafts page; the claim that the team print order might show side is supported.
- `btr_drafts.csv`/`.md`: "ban" classification is right; `listed_under:` is read here as "banned by" under H1; sides and ban order can be added as in `btr_tlid_drafts_v2.csv`.
