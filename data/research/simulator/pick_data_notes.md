# MPL ID Season 18 pick data: notes (collected 7 Nov 2026)

Scope: league hero table and BTR / TLID player hero pools for MPL Indonesia Season 18 (2026), to seed a draft predictor.

## Files
| File | Rows (excl. header) | Season | As-of |
|---|---|---|---|
| hero_stats_id_s18.csv | 91 | S18 | MLBBHub page stamp "Data as of 7 Nov 2026, 04:22 UTC" (as_of column = 2026-11-07T04:22Z) |
| player_hero_pools.csv | 128 (10 players) | S18 | same page, same stamp |
| game1_scoreboard_heroes.csv (extra) | 45 (6 series; BTR and TLID sides only, 5 players per side per series) | S18 | match pages read 7 Nov 2026 |

## Context on the data (important for the predictor)
- The playoffs page (as of 6 Nov 2026, 23:58 UTC) shows the Lower Bracket Final, TLID vs BTR (BO7), at 17:30 WIB on Sat 7 Nov 2026, not yet played. All numbers below therefore exclude that series. Playoff games are included in the season totals (the page does not split regular season from playoffs).
- Regular-season seeding: TLID 12-4, NAVI 12-4, AE 10-6, BTR 10-6, EVOS 8-8, ONIC 7-9.
- Playoff results seen: BTR 3-2 EVOS (4 Nov), TLID 3-1 BTR (5 Nov), AE 2-3 BTR (6 Nov), NAVI 3-2 TLID (6 Nov).

## Sources used
1. https://mlbbhub.com/mpl/id/stats : hero table, player hero pools, "Who plays each hero" (all read from one page).
2. https://mlbbhub.com/mpl/id/drafts : season ban statistics (top 10 only), as of 6 Nov 2026 08:55 UTC.
3. https://mlbbhub.com/mpl/id/schedule and /playoffs : match IDs and series results.
4. Match pages https://mlbbhub.com/mpl/id/match/{1070,1080,1109,1111,1112,1113}.
5. https://mlbbhub.com/llms.txt and /agents.md : URL patterns (site-provided guidance for AI agents).
Method: pages were read one at a time (WebFetch, and the built-in browser for pages where the summariser could not show everything). No scripts, loops or crawlers were run against the site. The only JavaScript used was run inside an already-open page to total up numbers already on screen.

## Terms / blocked sources
- MLBBHub terms (/terms, section 04) prohibit "automated scraping, data mining, or extraction ... without written permission". I kept to manual one-page reads and deliberately did not read every match page (see gaps). The terms do not state attribution rules; llms.txt asks users to cite mlbbhub.com and link the specific page.
- /api/stats exists but robots.txt disallows /api/, so it was not used.
- Liquipedia (liquipedia.net/mobilelegends/MPL/Indonesia/Season_18): WebFetch refused it (URL not on this session's allowlist). Not retrieved.
- esports.gg: a web search surfaced no esports.gg result for S18, and I did not guess URLs. Not retrieved. Other sites that appeared in search (gizmologi.id, detik.com) were not needed.
- The "Show all 93 heroes" button on the stats page is behind a "Support our work / watch a short ad for 1 week site-wide access" overlay. I did not click it (not my call to accept an ad-gated access grant on your behalf). This is why hero rows 31+ lack ban counts.

## hero_stats_id_s18.csv: how it was built, and caveats
- Rows 1-30 (the 30 visible by default): picks, bans and win rate as shown on the page (WIN column = wins; win_rate is the page's rounded WR in percent). 
- Rows 31-91: picks and win_rate are DERIVED, bans left empty. Derivation: sum over players of "games" for that hero in the page's "Who plays each hero" section; wins = sum of round(games x win%) per player. Per-player win% is a whole-number percent, but with fewer than 100 games per cell the rounding is reversible (checked: every cell round-trips), so wins are exact integers, but they are derived, not read from a column. win_rate for these rows = wins/picks rounded to whole percent; it may differ by 1 point from what the site would show if it ever lists it.
- Validation: for all 30 table heroes the derived picks and wins equal the table's picks and wins exactly. Total derived picks = 2010 = total of the player-pool section (consistent between the two sections).
- Hero count: page header says "Heroes (93)" but only 91 heroes have any pick (91 + 42 never-picked = 133, matching the site's 133-hero roster). The two extra rows in the 93 are almost certainly heroes with bans but zero picks; their names and ban counts are NOT available to me (not in the visible 30, and the drafts page lists only the top 10 bans). They are not in the CSV.
- pick_rate and ban_rate are empty: the stats page does not show them. The drafts page shows ban rates for the top 10 only (of 190 drafted games, as of 6 Nov 08:55 UTC); I did not mix that in because its date and counts differ (below). Games drafted at the 04:22 stamp is not shown; total picks of 2010 suggests about 201 games (2010/10) but that is arithmetic, not a published figure, so I did not compute rates from it.
- Conflict between pages: drafts page (6 Nov 08:55 UTC) top bans Freya 141, Atlas 123, Fanny 114, Marcel 94, Hirara 83, Masha 71, Carmilla 69, Paquito 68, Esmeralda 66, Uranus 55. Stats page (7 Nov) shows Freya 143, Atlas 129, Fanny 119, Marcel 101, Hirara 85, Masha 77, Carmilla 69, Paquito 73, Esmeralda 76, Uranus 58. Explained by the different timestamps (more playoff games since); the CSV uses the later stats page. Also Esmeralda: 66 vs 76 is a larger jump than the others; treat that single value with a little caution (I did not re-check it).
- Earlier in the session a WebFetch read of the same page at 00:39 UTC gave identical top-30 numbers; the browser read at 04:22 UTC is the one recorded.
- Side win rate (drafts page, 190 games): blue 58% (110), red 42% (80). First bans red side: Freya 82 (43%), Masha 36 (19%).

## player_hero_pools.csv: how it was built, and caveats
- Season 18, as of 7 Nov 2026 04:22 UTC, from the "Player hero pools" section (every hero each player has logged in official games this season, games and win rate).
- The page gives games and win rate only. wins = round(games x win%), exact for the reason above (all 128 rows round-trip). games is read directly.
- Aggregate across regular season plus playoffs; no per-stage split, no per-game sequence.
- Lanes are the page's lane headings (EXP, JUNGLE, MID, GOLD, ROAM). Player labels: the page shows the TLID jungler as "KEVIN" in the pool section and "Kevinn" elsewhere; the CSV uses "Kevinn". "Keven" is the TLID gold laner. Different people; do not merge.
- Players NOT found (no games in S18 on MLBBHub): BTR sub Miguel; TLID Anaver and Kyou. Drichel is the only TLID mid with games. If any of these three appear in the Lower Bracket Final the predictor has no S18 pool for them.
- Season 17 fallback not collected: it was only requested if S18 pools were missing, and they were found.
- A first WebFetch summary said Finn was not in the pool section and gave a slightly different Finn list. The browser read of the page showed Finn's pool in full (13 heroes, 53 games); the CSV uses the browser read. Lesson: the WebFetch summariser output should not be trusted for numbers; every number in the CSVs came from the full page text.
- Small samples: most cells are 1-3 games; win rates on those are noise.

## game1_scoreboard_heroes.csv (extra file)
- Only 6 series read, by choice (terms prohibit bulk automated extraction): 1070 and 1080 (TLID 2-0 BTR head-to-heads, regular season), 1109 (BTR 3-2 EVOS), 1111 (TLID 3-1 BTR), 1112 (AE 2-3 BTR), 1113 (NAVI 3-2 TLID). The BTR vs TLID series are 1070, 1080 and 1111.
- Only the BTR and TLID sides are recorded. The page opens on a game tab; for 1111 the Game 1 tab was visibly highlighted (screenshot). For the other five I assumed the default tab is Game 1 but did not verify. Treat those as probable, not confirmed.
- Game 1 winner is only known for 1111 (crown beside TLID). Not recorded elsewhere. No bans are shown on match pages.
- Other BTR/TLID series IDs on the schedule page, not read: 1038, 1041, 1042, 1044, 1045, 1046, 1050, 1052, 1054, 1056, 1059, 1061, 1063, 1067, 1073, 1082, 1083, 1084, 1085, 1087, 1089, 1092, 1093, 1095, 1099, 1103, 1106, 1107; playoff 1108, 1110 (not BTR/TLID). Page pattern: https://mlbbhub.com/mpl/id/match/{id}.
- The drafts page lists per-game hero picks by side (no player names) and could fill the rest of the draft order if you read it by hand; not done.
