# Hero roles and lanes table: notes

Patch 2.2.16a (14 Oct 2026), MPL Indonesia Season 18. Built 7 Nov 2026. Output: `hero_roles.csv` (same folder).

## Coverage

| Item | Count |
|---|---|
| Heroes in table | 133 (MLBBHub heroes page and its footer both say 133) |
| UNKNOWN role or lanes | 0 |
| high confidence | 46 |
| medium confidence | 34 |
| low confidence | 53 |
| Draft CSV heroes (`btr_tlid_drafts_v2.csv`, column `hero`) | 67 distinct names (11 rows have a blank hero cell and were ignored); all 67 are in the table with identical spelling |

The 53 low-confidence rows split into two groups:
- 42 heroes with no MPL Indonesia S18 pick. Lanes come only from the MLBBHub hero page (a casual/ranked lane field), so every lane carries a `?`. Aamon, Akai, Aldous, Alucard, Aurora, Balmond, Bane, Baxia, Beatrix, Benedetta, Chang'e, Cyclops, Diggie, Floryn, Franco, Gord, Grock, Gusion, Helcurt, Irithel, Jawhead, Johnson, Julian, Karina, Lancelot, Layla, Lolita, Martis, Nana, Natalia, Natan, Popol and Kupa, Roger, Silvanna, Sun, Thamuz, Vale, X.Borg, Xavier, Yin, Zhask, Zilong. None of these appear in the BTR/TLID draft CSV.
- 11 heroes with only 1 or 2 pro picks where the pick count is too thin, or the pro lane contradicts the hero page: Argus, Edith, Granger, Guinevere, Ixia, Joy, Lapu-Lapu, Ling, Luo Yi, Minsitthar, Tigreal.

Primary-lane count among the 80 high/medium rows: Mid 19, Roam 18, Gold 15, EXP 14, Jungle 14. A five-lane check has plenty of non-low heroes for every lane.

## Sources

1. Lane evidence (pro play): MLBBHub MPL Indonesia stats page, "Player Hero Pools" section, https://mlbbhub.com/mpl/id/stats, "Data as of 7 Nov 2026, 00:39 UTC". It lists, per player, the lane group (EXP, JUNGLE, MID, GOLD, ROAM) and each hero with games and win rate. I summed games per hero per lane. Cross-check: my per-hero totals equal the page's own hero-table pick counts for every hero visible there (for example Paquito 98, Hirara 94, Freya 54, Atlas 56, Nolan 70, Zhuxin 59, Kimmy 48, Cici 53, Marcel 34, Gloo 44). The section covers 91 heroes; the page says 42 heroes were not picked, and 91 + 42 = 133. The page's hero table says 93 heroes, which presumably includes 2 heroes that were banned but never picked.
2. Role class: MLBBHub heroes list, https://mlbbhub.com/heroes (patch label 2.2.16a, 133 heroes). The first class listed is used as `role`; any other class is in `notes` ("MLBBHub also lists ...").
3. Lane corroboration and fallback: individual MLBBHub hero pages, https://mlbbhub.com/heroes/<name>, read one at a time (about 80 pages in total, no scripted crawling). I read each page's "Lane" field and "Also played" field. Pages read: the 42 heroes with no pro pick, plus the pro-pick heroes with fewer than 5 picks, plus Freya, Alice, Esmeralda, Harley, Kaja, Fredrinn, Masha, Bruno, Hilda, Lunox, Yi Sun-shin.
4. Cross-checks only (not used for lanes): https://mlbbhub.com/tier-list ("By Lane" top 8 per lane, ranked-play stats), `btr_tlid_drafts_v2.csv` scoreboard rows (lane column filled for 5 games).
5. Not available: MPL Philippines and MPL Malaysia stats pages have no "Player Hero Pools" section, so there is no per-hero lane data for those leagues. Liquipedia and wiki pages were not used.

All MLBBHub pages were read through WebFetch, which summarises the page, so a transcription error is possible. Supporting evidence for accuracy: the pool totals match the page's own pick counts, and hero page lane fields agree with pro data for nearly all heroes with enough picks.

## Method

- Lanes (heroes with 5 or more MPL ID S18 picks): a lane is listed if it has at least 3 games and at least 15% of the hero's games; ordered by games, maximum 3 lanes. Lanes below the threshold with 3+ games are kept in `notes` as "minor lanes" (Kimmy Gold 6, Aulus Gold 7).
- Confidence: high = 15 or more picks; medium = 5 to 14 picks, or 2 to 4 picks that agree with the hero page (a `?` marks any lane that comes only from the hero page); low = 1 pick, or pro picks that disagree with the hero page, or no pro picks at all. Every lane in a low row has a `?`.
- Masha is capped at medium because she was reworked in 2.2.16 and the season picks mix old and new versions (see conflicts).
- The pools cover the whole of Season 18 (regular season and playoffs to 7 Nov). MLBBHub does not give the patch per game (see `draft_semantics.md`), so I cannot restrict to 2.2.16a.

## Conflicts and judgement calls

Role class
- The stats page "Who Plays Each Hero" class tags list a different first class from the heroes page for Alice (mage first), Esmeralda (mage first), Harley (mage first), Kaja (fighter, support) and Fredrinn (tank first). I read the five hero pages: all five show the same order as the heroes list (Alice Tank, Mage; Esmeralda Tank, Mage; Harley Assassin, Mage; Kaja Support only; Fredrinn Fighter, Tank). The heroes list order was used.
- The stats tags also add or drop second classes for other heroes (for example Atlas "tank support", Ruby "fighter tank", Carmilla "support" only). The first class matches the heroes list in those cases.
- Dual-class heroes are stored with one primary class; the other class is in `notes`. If the simulator needs official in-game classes instead, those would need a second source.

Lanes: pro play versus the MLBBHub hero page
- Pro primary lane differs from the hero page's primary lane: Masha (pro Roam 15, EXP 5, Gold 4; page EXP, then Roam and Gold), Angela (pro Mid 3; page Roam, also Mid), Hilda (pro EXP 3, Roam 1; page Roam then EXP). The table follows pro play.
- Direct disagreement, flagged low: Argus (2 Gold picks; page EXP), Guinevere (Jungle 2, EXP 1; page EXP), Joy (EXP 1, Gold 1; page Jungle), Minsitthar (1 Gold pick; page EXP, Roam).
- Hero page lists a lane with zero pro picks: Freya (Jungle), Harley (Mid), Yi Sun-shin (Gold). These lanes are in `notes`, not in `lanes`.
- Pro flex worth knowing: Paquito Jungle 57 / Gold 36; Freya EXP 34 / Gold 20; Cici Gold 35 / EXP 18; Rafaela Roam 20 / Mid 18; Chou Gold 12 / Roam 8; Esmeralda EXP 28 / Gold 6; Harith 5 picks, all Gold; Kimmy Mid 42 / Gold 6; Aulus Jungle 46 / EXP 10 / Gold 7.
- Lane groups in the pools are the player's listed lane, not a per-game lane tag. If a player swaps lane in a game, the pick is counted under the player's usual lane.

Reworks
- Masha and Bruno were reworked in 2.2.16 (hero pages confirm). Bruno: 4 pro picks, all Gold, hero page Gold, so medium. Masha: the two BTR and TLID scoreboard games in the draft CSV where she was picked (1109, 1111) both show Roam, which agrees with the season pool, but the pool mixes versions, so medium.
- Hirara, Kalea, Zhuxin, Zetian, Valir, Obsidia, Novaria, Marcel, Gloo, Ixia and the other new or recent heroes you listed all have pro data and are in the table; Ixia has only 1 pick (low).

Names and spelling
- Names follow the MLBBHub heroes list. Where the stats page differs in case, the heroes list wins: "Lapu-Lapu" (stats page "Lapu-lapu"), "Yi Sun-shin" (stats page "Yi Sun-Shin"; the hero page confirms "Yi Sun-shin"). The unusual spellings "Minsitthar", "X.Borg", "Chang'e" and "Popol and Kupa" are as MLBBHub shows them. None of these are in the draft CSV.
- Your instruction list repeats Mathilda and Cici; they appear once in the table.

Data quality notes
- MLBBHub dates are inconsistent on every page (hero "Updated" Aug to Oct 2026, stats "last refreshed" 1 to 6 Nov 2026, footer "Updated Oct 2026"). The patch label is 2.2.16a everywhere.
- The ID stats hero table shows 93 heroes while the pools cover 91; I assumed the 2 extra are ban-only heroes but did not identify them.
- Pro sample is one league (MPL Indonesia S18, about 190 drafted games). Pro lane habits in MPL PH/MY or earlier seasons may differ.

## Suggested follow-ups
- Read MPL PH and MPL MY scoreboards (once their pools are published) to lift the 42 no-pick heroes above low.
- If the simulator only needs "can this hero fill lane X", treat any lane with `?` as tentative and the first lane of high/medium rows as reliable.
