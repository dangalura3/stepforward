# Lower Bracket Final status, game lengths and how games ended (MPL ID Season 18)

Collected on 7 Nov 2026 (Saturday), about 10:55 to 11:50 UTC (17:55 to 18:50 WIB). Season 18 of MPL Indonesia only.

## Files in this folder
| File | Rows (excl. header) | What it holds |
|---|---|---|
| game_results.csv | 54 games | One row per game: winner, duration, kills for each team |
| game_scoreboards.csv | 540 rows | One row per player per game (54 games x 10 players): hero, K/D/A, win/loss |

19 series, 54 games, all on MLBBHub match pages. Every game's team kill totals equal the sum of the five players' kills on that page (checked in code, no mismatches). Every series' game winners add up to the headline score on its page (checked, no mismatches). The 45 hero rows in the earlier game1_scoreboard_heroes.csv all match the Game 1 rows here (0 mismatches), so the earlier "Game 1 assumed" rows are now confirmed.

Extra columns I added at the end of game_results.csv: team_left, kills_left, team_right, kills_right. Reason: the pages do NOT show blue/red side, so blue_team, red_team, kills_blue and kills_red are empty (not guessed). "Left" and "right" are just the page's layout order (the home-listed team is on the left), not a side.

## 1. Today's Lower Bracket Final, BTR vs TLID (BO7, scheduled 17:30 WIB)
- Status: in progress. MLBBHub /mpl/id/playoffs, stamp "Data as of 7 Nov 2026, 11:20 UTC" (18:20 WIB): Lower Bracket Final shows "In progress", TLID 1, BTR 0. The earlier read of the same page ("Data as of 10:59 UTC") showed 0-0. So TLID had won one game by 11:20 UTC.
- The /mpl/id/schedule page (stamp 11:10 UTC) still listed it only as "Next match: TLID vs BTR at 17:30".
- Per-game scoreboard: not available. https://mlbbhub.com/mpl/id/match/1114 (the next ID after 1113) returned HTTP 404 twice, once around 11:10 UTC and once after the 11:20 UTC read. I only guessed that ID from the pattern; the real match ID for the Final is unknown. The playoffs page does not link to a match page for the Final.
- Heroes, durations, kills, which side: not found for Game 1 or anything later. The Game 1 winner is TLID only because the bracket cell says 1-0 for TLID. I did not record it as a game row because I have no game-level data for it.
- News: searches (Indonesian and English) found only previews, nothing with a result. The IndoGamers and Kompas items were previews. Kompas (tekno.kompas.com) refused automated fetching (robots), so I did not read it.
- Not checked: official MPL ID social posts and VODs (not reachable with my tools). Re-read /mpl/id/playoffs later; once the series ends, the Final's match page should appear.

## 2. How I read the pages (so you can judge the data)
- One page at a time in the in-app browser, then clicking the Game tabs on that page. About 28 page loads in total. No scripts, no loops, no /api/ calls.
- Duration: the page shows an unlabeled clock beside the date (for example "13:23"). I treat it as the game length (mm:ss). Evidence: it changes on every Game tab, and it cannot be time of day because Game 2 can be lower than Game 1 (1080: Game 1 12:30, Game 2 10:03). This is an inference about the label, not text on the page.
- Winner: the crown icon beside the team name on each game tab (checked on a zoomed screenshot of each tab; the 1111 Game 1 and 1112 Game 1 winner came from a full-page screenshot).
- Hero names: "cici" is written "Cici"; the page's "Wu/Zetian" is written "Zetian".
- Lane column: row order on the page is EXP, JUNGLE, MID, ROAM, GOLD. For BTR and TLID that matches the lanes in player_hero_pools.csv. For all other teams the lane is only inferred from the same row order.
- Page gates: the first time I opened 1111, a "Support our work / watch a short ad" box covered the Game tabs and could not be closed. I did not click the ad. Later loads of the same page had no box, and Games 2 to 4 opened normally. Google ad pop-ups (#google_vignette) appeared on some pages; I closed them with the browser's Back button, not by clicking the ads. No page had to be skipped because of a gate.
- Timestamps: match pages carry no "as of" stamp, only the date. The only stamps are on /playoffs (10:59 UTC and 11:20 UTC) and /schedule (11:10 UTC).

## 3. Series read (all on https://mlbbhub.com/mpl/id/match/{id})
Played in games: 1070 TLID 2-0 BTR (12 Sep); 1080 TLID 2-0 BTR (19 Sep); 1082 ONIC 2-0 BTR (20 Sep); 1083 EVOS 2-1 TLID (20 Sep); 1084 GEEK 1-2 BTR (2 Oct); 1085 DEWA 2-1 TLID (2 Oct); 1087 BTR 2-1 RRQ (3 Oct); 1089 TLID 2-0 AE (4 Oct); 1092 AE 2-0 BTR (8 Oct); 1093 NAVI 2-0 TLID (8 Oct); 1095 RRQ 0-2 TLID (9 Oct); 1099 BTR 2-0 DEWA (11 Oct); 1103 EVOS 1-2 BTR (17 Oct); 1106 NAVI 0-2 BTR (18 Oct); 1107 TLID 2-0 ONIC (18 Oct); 1109 BTR 3-2 EVOS (4 Nov); 1111 TLID 3-1 BTR (5 Nov); 1112 AE 2-3 BTR (6 Nov); 1113 NAVI 3-2 TLID (6 Nov).

Your priority list: (2) the 5 Nov series, all 4 games: done. (3) the 6 Nov series, both, all 5 games each: done. (4) 12 Sep and 19 Sep BTR vs TLID: done, all games. (5) 14 more series as time allowed (1082, 1083, 1084, 1085, 1087, 1089, 1092, 1093, 1095, 1099, 1103, 1106, 1107, 1109).

## 4. Game length patterns (from the clock on each game tab)
Games I read: BTR 35 games (17 W, 18 L), TLID 27 games (17 W, 10 L). These are only the series I could reach, not the full season.

| Group | Games | Average | Median | Shortest | Longest |
|---|---|---|---|---|---|
| BTR, all | 35 | 16:41 | 16:36 | 9:04 (1112 G2, BTR beat AE) | 26:01 (1109 G2, EVOS beat BTR) |
| BTR, wins | 17 | 16:25 | 16:43 | 9:04 | 23:00 (1106 G2) |
| BTR, losses | 18 | 16:56 | 16:16 | 10:03 (1080 G2) | 26:01 |
| BTR, playoffs | 14 | 16:35 | 15:46 | 9:04 | 26:01 |
| BTR, regular season | 21 | 16:45 | 16:43 | 10:03 | 23:00 |
| TLID, all | 27 | 16:05 | 14:20 | 10:03 (1080 G2, TLID beat BTR) | 27:08 (1113 G5, NAVI beat TLID) |
| TLID, wins | 17 | 15:09 | 14:13 | 10:03 | 22:51 (1111 G4) |
| TLID, losses | 10 | 17:41 | 16:08 | 13:48 (1083 G3) | 27:08 |
| TLID, playoffs | 9 | 17:47 | 16:59 | 13:23 (1111 G1) | 27:08 |
| TLID, regular season | 18 | 15:15 | 14:04 | 10:03 | 22:03 (1083 G2) |
| BTR vs TLID, 8 games read | 8 | 15:15 | 13:52 | 10:03 | 22:51 |

What this says, in plain words:
- Most games end between about 12 and 20 minutes. Out of all 54 games read, the average is 16:36 and the median 15:48. Only two went past 25 minutes (1113 G5 at 27:08 and 1109 G2 at 26:01), and both were playoff games.
- TLID games are shorter than BTR games when TLID wins (15:09 average) and longer when TLID loses (17:41). TLID's wins are quick.
- TLID played longer games in the playoffs (17:47) than in the regular season (15:15). BTR's playoff and regular-season lengths are almost the same.
- BTR vs TLID: five of the eight games I read ended in under 15 minutes, and all five were TLID wins (12:48, 12:30, 10:03, 13:23, 14:20). TLID's other two wins took 19:08 and 22:51. BTR's only win in this matchup so far (1111 G3, 16:59) was a longer game.
- Short games (11:00 or less): 1112 G2 (9:04), 1080 G2 (10:03), 1085 G1 (10:12). TLID won two of them, BTR one.

## 5. How games were won, according to recaps (and what I could not confirm)
No recap I could read gives Lord, turtle, team-fight or comeback details per game. What the recaps do say:
- TLID 3-1 BTR, 5 Nov ([ANTARA](https://www.antaranews.com/berita/5835415/tlid-tumbangkan-btr-3-1-tantang-navi-di-final-jalur-atas-mpl)): TLID won G1, G2 and G4, BTR won G3. Player of the Game: Aran (Freya) in G1, Aran (Kalea) in G2, Moreno (BTR) in G3, Lyoni in G4. BTR's pressure was on the EXP lane in G3 and G4. In G4 both teams pressured each other before TLID "anticipated" BTR's plan. Aran credited a bigger hero pool and playoff experience. The scoreboard agrees with the named players and heroes (1111 G1 Aran Freya 2/0/5; G2 Aran Kalea 0/0/7; G3 Morenooo Valir 3/1/7; G4 Lyoni Marcel 0/2/12).
- NAVI 3-2 TLID, 6 Nov ([LigaGame](https://www.ligagame.tv/mlbb/derai-air-mata-penggawa-navi-pecah-usai-kalahkan-tlid-3-2-demi-slot-grand-final-mpl-id-s18)): winners per game only (TLID, NAVI, TLID, NAVI, NAVI), which matches the scoreboard. It says NAVI's defence tightened and they made fewer mistakes in G4, and credits Karss in G2 and G5 and Aran's defence for TLID in G3.
- BTR 3-2 AE, 6 Nov ([informasi.com](https://informasi.com/sportivo/infrms-29681/playoff-mpl-bigetron-by-vitality-amankan-tiket-lower-bracket-final-mpl-id-s18-kalahkan-alter-ego-3-2)): only that BTR won the fifth game and 3-2. Nothing per game.
- Previews only, no results: [IndoGamers](https://indogamers.com/e-sport/56961/07112026/team-liquid-id-vs-bigetron-by-vitality-di-final-lower-bracket-mpl-id-s18-laga-hidup-mati-berburu-tiket-m8) (Final preview) and [Gizmologi](https://gizmologi.id/game/jadwal-mpl-id-s18-hari-ini-12-september-2026/amp/) (12 Sep preview, published before the match). [Gizmologi week 4](https://gizmologi.id/news/hasil-dan-klasemen-mpl-id-s18-week-4/) covers other BTR games, not BTR vs TLID.

What the scoreboards suggest (my reading of the numbers, not from any recap, so treat it as a guess about HOW, not a fact):
- Snowball-looking games (kill gap of 12 or more): 13 of 54. Examples with BTR or TLID: 1080 G1 (TLID 19-1, 12:30), 1080 G2 (TLID 17-2, 10:03), 1112 G2 (BTR 24-7, 9:04), 1112 G3 (BTR 23-2, 11:34), 1106 G1 (BTR 18-5, 11:26), 1085 G1 (TLID 14-1, 10:12). These also line up with short durations.
- Winner had fewer kills than the loser (so the win probably came from towers or Lord, not kills): 3 games: 1099 G1 (BTR won 21-23, 18:56), 1092 G1 (AE beat BTR despite 14-19, 19:26), 1087 G2 (RRQ beat BTR despite 16-21, 22:09). BTR was on the winning side once and the losing side twice.
- Closest in kills: 1113 G5 (9-9, 27:08, NAVI won), 1070 G1 (9-8, TLID won), 1092 G2 (9-8, AE won), 1099 G1 (21-23, BTR won).
- I cannot tell Lord vs team-fight vs comeback from the scoreboard, and I did not label any game that way in the CSVs.

## 6. Gaps
- The Lower Bracket Final (today): no game-level data at all; only that TLID leads 1-0 as of 11:20 UTC. Real match ID unknown (1114 gave 404).
- 15 other BTR or TLID series IDs from the earlier notes, not read: 1038, 1041, 1042, 1044, 1045, 1046, 1050, 1052, 1054, 1056, 1059, 1061, 1063, 1067, 1073 (the earlier weeks, before 12 Sep). I stopped at about 28 page loads, as instructed. Season coverage: BTR 9 of 16 regular-season series plus 3 of 3 playoff series; TLID 8 of 16 regular-season series plus 2 of 2 playoff series read (before the Final).
- Blue/red side and who picked first: not shown on any match page. Bans: not shown on match pages (the earlier notes say the /drafts page has bans and picks by side, no player names; I did not read it).
- Lord / turtle / objective counts: not shown on the match pages.
- Gold, damage dealt and damage taken are on the pages but were not put in the CSVs (not asked for).
- Duration label is an inference (see section 2). Opponent lanes are inferred from row order.
- The earlier notes said the match pages have only one scoreboard. That was wrong: the Game tabs work, and each tab has a full scoreboard (heroes, K/D/A, gold, damage). The only obstacle was an intermittent ad box on one page load.
- Not checked: official MPL ID social posts, VODs, Liquipedia (blocked in the earlier session), Hybrid, Viva, Kontan.
