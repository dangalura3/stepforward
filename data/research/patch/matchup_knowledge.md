# MLBB hero counters, synergies and dash classification for the MPL ID Season 18 draft predictor (data as of 2026-11-07)

Companion files in this folder: `matchup_rules.csv` (101 counter rows, 27 synergy rows) and `hero_mobility.csv` (52 heroes).

Strength scale used for measured data: mlbbhub "pp edge" of 4.0 or more = 3, 2.0 to 3.9 = 2, below 2.0 = 1. Unmeasured "kit matchups" and analyst opinions are capped at 2 and marked low or low-medium confidence.

Important method caveats, found while reading the pages:
- mlbbhub counter pages show an edge in percentage points (pp), "not a win rate", taken from "ranked data", with no rank tier, no server and no sample size. Footer says "Patch 2.2.16a"; the counter section says "updated November 5, 2026"; the footer also says "Updated Oct 2026". These dates conflict, so I cite all of them as "Patch 2.2.16a, Nov 2026 (page dates inconsistent)". The matrix page says it holds 133 heroes, 1,982 measured edges and 946 flagged counters, and some pairings come from Moonton's in-game counter lists rather than measurements. ([mlbbhub matrix](https://mlbbhub.com/matchups))
- Many mlbbhub "reasons" are templated text reused across heroes (for example "hard CC pins X in place, denying the resets that make X slippery" appears for Freya, Dyrroth and others). Treat the numbers as the evidence and the reasons as heuristics.
- mlbb.io tables show win rates "All Ranks, past 7 days" and sometimes contradict themselves (a hero with under 50% win rate described as having an advantage). I treat mlbb.io as a second opinion only.

## 1. Counter relations (who counters whom, with reasons and strength)

### Takeaway
There are 101 counter rows in `matchup_rules.csv`. Almost all come from mlbbhub ranked-data edges (Patch 2.2.16a, Nov 2026), which is ranked-queue data and not pro-play data. Strong themes: dash-heavy heroes (Freya, Fanny, Hirara, Dyrroth, Paquito, Benedetta) are punished by Phoveus and by hard or chain CC (Minsitthar, Khufra, Marcel, Minotaur, Carmilla, Johnson, Tigreal); Atlas is hit hardest by Marcel (+5.8pp). I found no pro-play head-to-head counter table.

### Seed rules: verdicts

| Seed rule | Verdict | Evidence |
|---|---|---|
| Gloo picked makes Alice viable (synergy) | **Not supported as a synergy. Supported as a counter-pick: Alice counters Gloo.** | mlbbhub Gloo page: Alice has a +3.7pp edge over Gloo (Patch 2.2.16a ranked). No synergy section on Gloo page and Alice is not listed as a partner. The 1v9.gg "best duos" articles for Gloo and for Alice (both June 2025) do not list each other. The viewer may mean "when the enemy picks Gloo, Alice becomes a priority answer". Confidence in that reading: medium. |
| Esmeralda counters Paquito | **Supported (strength 2).** | Paquito page: Esmeralda +3.0pp, "sustain outlasts Paquito's burst". Esmeralda page: 51.2% win rate delta, "strong early game advantage". Both mlbbhub, so one dataset. |
| Dyrroth is a very good counter to Esmeralda | **Supported, but data says "solid", not "very good" (strength 2).** | Dyrroth page: +3.2pp, Esmeralda ranked first among heroes he is strong against. Esmeralda page: Dyrroth 51.2% win rate, burst deletes her. mlbb.io: Dyrroth 49.3% in its best-counter list (no reason). |
| Freya counters Esmeralda | **Not supported. The data points the other way.** | Freya page: Esmeralda has a +1.8pp edge over Freya. mlbb.io lists Esmeralda among best Freya counters (46.9%). Freya is not listed on Esmeralda's counter page. |
| Phoveus punishes dash-heavy heroes (Benedetta, Paquito) | **Supported on skill text and on ranked edges, magnitude varies.** | Skill text: passive Astaros' Gaze reduces his cooldowns when an enemy hero blinks, dashes or is displaced near him. Edges: Benedetta +3.3pp, Paquito +1.9pp (weak), Freya +5.2pp, Wanwan +6.4pp, Chou +2.8pp, Hirara +2.1pp, Selena +1.7pp. Fanny is named in a blog but does not appear on Phoveus's mlbbhub page at all. |

### Cited Findings

Freya
- Counters of Freya (ranked edge): Phoveus +5.2pp (all her skills have movement parts), Minsitthar +4.6pp (hard CC pins her), Franco +1.8, Baxia +1.8, Esmeralda +1.8, Nana +1.8 — [mlbbhub Freya](https://mlbbhub.com/counter/freya)
- Freya counters Yve +3.5pp, Lolita +3.4, Masha +2.9, Harith +2.2, Aulus +2.1, Kagura +1.8 — [mlbbhub Freya](https://mlbbhub.com/counter/freya)
- Kit matchups (unmeasured): Marcel, Minotaur (hard CC pin), Khufra (chain stun cancels dashes), Carmilla (CC locks mobility), Floryn and Diggie (poke) — [mlbbhub Freya](https://mlbbhub.com/counter/freya)
- mlbb.io (All Ranks, past 7 days, "November 2026"): best counters Minsitthar 51.8%, Phoveus 48.1% (tagged "Fading"), Nana 47.3%, Esmeralda 46.9%, Franco 41.4%. Figures there are internally inconsistent (Franco 41.4% in table but a "+1.2%" advantage in text) — [mlbb.io Freya](https://mlbb.io/en/counter/freya)
- Rank dependence: Phoveus, Edith, Franco, Minsitthar barely trouble Freya in Epic but become real counters in Mythic+; Yve and Diggie are Epic-only counters — [mlbb.io Freya](https://mlbb.io/en/counter/freya)

Atlas
- Counters of Atlas: Marcel +5.8pp, Wanwan +3.8, Alice +3.6, Valentina +3.4, Ling +3.2, Fanny +3.0, Kimmy +2.9, Benedetta +2.8, Lancelot +2.7, Moskov +2.3, Xavier +1.8, Yu Zhong +1.7 — [mlbbhub Atlas](https://mlbbhub.com/counter/atlas)
- Moskov's knock-back interrupts Atlas's 2nd skill (the page names Valir and Moskov as this type). Atlas counters squishy low-mobility heroes such as Eudora (+2.7pp) because they cannot escape his CC — [mlbbhub Atlas](https://mlbbhub.com/counter/atlas)
- Analyst opinion (One Esports, 2 Jan 2025, no patch named): Chou (Shunpo gives CC immunity), Nana (Molina Smooch), Valir (ult cleanses CC; "possibly the most effective") — [One Esports](https://www.oneesports.gg/mobile-legends/best-heroes-counter-atlas/)

Fanny
- Counters of Fanny: Moskov +3.0pp, Bruno +2.9, Badang +2.7, Franco +2.7, Kalea +2.6, Zilong +2.4, Chou +2.4, Lukas +2.1 (durability tanks her opener) — [mlbbhub Fanny](https://mlbbhub.com/counter/fanny)
- Fanny counters Yve +3.6pp, Granger +3.5, Gloo +3.4, Atlas +3.0 (she is strongest after ~16 min), Clint +2.6, Kimmy +2.5 — [mlbbhub Fanny](https://mlbbhub.com/counter/fanny)
- Kit matchups: Marcel and Minotaur (hard CC pin), Khufra (chain stuns cancel dashes), Carmilla (CC) — [mlbbhub Fanny](https://mlbbhub.com/counter/fanny)
- 2022 vcgamers note: Tigreal and Franco CC are dangerous to Fanny's dash — [vcgamers](https://www.vcgamers.com/news/en/hero-dash-ml-expert-escape-and-deal-damage/)

Hirara
- Counters of Hirara: Saber +2.6pp (she is fragile), Phoveus +2.1 (heals through her combo), Bruno +1.9, Minsitthar +1.8 (chain-stun cancels dashes), Odette +1.7 — [mlbbhub Hirara](https://mlbbhub.com/counter/hirara)
- Hirara counters Hanzo +2.7pp, Karina +2.5, X.Borg +2.2, Yin +2.1 (untargetable effect dodges delayed skills), Lolita +2.0; she is strongest early and dips after 16+ min — [mlbbhub Hirara](https://mlbbhub.com/counter/hirara)

Paquito
- Counters of Paquito: Esmeralda +3.0pp, Khufra +2.1 (CC locks mobility), Phoveus +1.9, Fredrinn +1.9, Melissa +1.7; kit matchups Marcel, Gloo, Minotaur, Carmilla, Lolita, Gord — [mlbbhub Paquito](https://mlbbhub.com/counter/paquito)
- Paquito counters Natalia +3.5pp, X.Borg +3.3, Karina +2.5, Wanwan +1.7, Benedetta +1.6 (early-game tempo) — [mlbbhub Paquito](https://mlbbhub.com/counter/paquito)
- Paquito is the most picked hero in MPL ID S18 (98 picks, 44% win rate) with 73 bans — [mlbbhub MPL ID stats](https://mlbbhub.com/mpl/id/stats)

Esmeralda and Dyrroth
- mlbbhub (Esmeralda page, no patch/date given): counters Dyrroth 51.2% win rate, Karrie 51.0%, Natan 50.1%, Julian 50.0%. Esmeralda is favourable vs Marcel (58.3% "WR delta", ambiguous), Akai and Lolita 55.1% (her skills ignore their shields and she converts them to her own), Diggie 53.1%, Paquito 51.2%, Mathilda 45.1% (this one conflicts with "favourable") — [mlbbhub Esmeralda](https://331.mlbbhub.com/counter/esmeralda)
- mlbb.io (All Ranks, past 7 days): counters Lunox 48.7% (+3.0% adv), Karrie 48.8% (+1.5%), Dyrroth 49.3%, Natan 51.4% (+2.5%), Alice 51.0% (+1.5%). Esmeralda is strong vs Lolita +6.1%, Mathilda +4.6%, Diggie, Yin, Aldous +3.7%. Alice, Natan, Lunox, Fredrinn, Karrie only become real counters in Mythic+; Yve, Faramis, Joy, Baxia, Atlas are Epic-only counters — [mlbb.io Esmeralda](https://mlbb.io/en/hero/esmeralda/counter)
- Dyrroth page: counters of Dyrroth are Johnson +2.1pp and Tigreal +1.7 (chain-stun cancels his dashes), Minsitthar +2.0 (hard CC), Nana +1.8, Silvanna +1.8. Dyrroth counters Esmeralda +3.2, Alice +2.9, Uranus +2.8, Valentina +2.2, Zhuxin +2.1, Moskov +2.0 — [mlbbhub Dyrroth](https://mlbbhub.com/counter/dyrroth)
- Esmeralda is not countered by Phoveus; the reverse holds: the Phoveus page lists Esmeralda as a counter to Phoveus (+3.3pp) — [mlbbhub Phoveus](https://mlbbhub.com/counter/phoveus)

Phoveus
- Phoveus counters Wanwan +6.4pp, Freya +5.2, Harith +4.9, Benedetta +3.3, Ruby +3.2, Chou +2.8 (page text is ambiguous here), Lukas +2.7, Joy +2.7, Alucard +2.6, Valentina +2.5, Arlott +2.5, Khaleed +2.3, Sora +2.3, Hirara +2.1, Kalea +2.0, Kagura +2.0, Paquito +1.9, Selena +1.7 — [mlbbhub Phoveus](https://mlbbhub.com/counter/phoveus)
- Counters of Phoveus: Minsitthar +3.8pp, X.Borg +3.7, Barats +3.4, Esmeralda +3.3, Alice +3.2, Alpha +3.2, Bane +2.7, Cecilion +2.1 (chips from range), Luo Yi +2.0, Julian +1.9, Vexana +1.4 (ranged heroes with strong CC) — [mlbbhub Phoveus](https://mlbbhub.com/counter/phoveus)
- Fanny does not appear anywhere on the Phoveus page — [mlbbhub Phoveus](https://mlbbhub.com/counter/phoveus)
- The blog stormlegacy.com names Ling, Fanny and Benedetta as heroes Phoveus punishes and lists different skill names (Malefic Wrath, Energy Absorption) than the One Esports revamp article. Treat that blog as unreliable (SEO-style content; mirrored on several unrelated domains in search results) — [stormlegacy](https://stormlegacy.com/blog/phoveus-mobile-legends-anti-dash)

Gloo
- Counters of Gloo (Patch 2.2.16a ranked, page updated 1 Oct 2026, rank table 7 Nov 2026): Faramis +6.3pp, Moskov +5.3, Natan +4.6, Alice +3.7, Masha +3.6, Ling +3.6, Ruby +3.6, Zhuxin +3.5, Fredrinn +3.5, Aulus +3.4, Fanny +3.4, Vexana +3.3, Lunox +3.1, Wanwan +3.0, Yu Zhong +2.5 — [mlbbhub Gloo](https://mlbbhub.com/th/heroes/gloo)
- Gloo counters Aamon +4.6pp, Johnson +3.8, Jawhead +3.6, Chang'e +2.8, Karina +2.8, Lesley +2.8, Vale +2.8, Harley +2.7, Nana +2.7, Selena +2.2, Zetian +1.9, Novaria +1.9, Gusion +1.8, Pharsa +1.6, Clint +1.2 — [mlbbhub Gloo](https://mlbbhub.com/th/heroes/gloo)

Other
- Matrix page strongest listed edges: Lolita over Cyclops +9.4pp, Phoveus over Wanwan +6.4, Esmeralda over Lolita +5.7, Phoveus over Freya +5.2 — [mlbbhub matrix](https://mlbbhub.com/matchups)

### Inferences
- Because ranked mlbbhub edges are all small (largest 6.4pp for listed heroes), a 3 here means "clear in ranked data" and not "hard counter in pro play".
- Chains visible in the data: Esmeralda over Paquito and over Phoveus; Phoveus over Freya, Hirara, Benedetta, Paquito; Dyrroth over Esmeralda, Alice, Uranus; Alice over Gloo, Atlas, Phoveus. A predictor could use these as soft rules but should not treat them as transitive.
- Alice appears as a counter to Gloo, Atlas and Phoveus. If the viewer's "Gloo makes Alice priority" is a counter-pick note, it fits this data. Dyrroth, however, counters Alice (+2.9pp).
- Heroes with chain CC or knock-back (Minsitthar, Khufra, Johnson, Tigreal, Marcel, Minotaur, Carmilla, Moskov, Valir) recur as counters to dashers. This is consistent with the "CC cancels dashes" pattern the page states.

### Gaps
- No pro-play counter data (pick-vs-pick or lane matchup) from MPL ID or MPL elsewhere was found. mlbbhub's MPL ID drafts and stats pages show only per-hero pick, ban and win counts, no pair or counter tables ([drafts](https://mlbbhub.com/mpl/id/drafts), [stats](https://mlbbhub.com/mpl/id/stats)).
- I fetched mlbbhub counter pages only for Freya, Atlas, Fanny, Hirara, Paquito, Esmeralda, Dyrroth, Phoveus and the Gloo hero page, plus mlbb.io for Freya and Esmeralda. I did not fetch Marcel, Nolan, Carmilla, Uranus, Zhuxin, Selena, Masha, Belerick, Aulus, Melissa, Eudora, Barats, Rafaela, Obsidia, Claude, Valentina, Alice, Mathilda, Cici, Minotaur, Lylia, Kimmy, Novaria, Moskov, Gatotkaca, Brody, Miya, Suyou, Sora, Hylos, Kalea, Zetian, Chou, Badang, Lukas, Harley, Alpha, Cecilion, Yi Sun-Shin, Ruby, Valir, Arlott or Benedetta counter pages, because of the "no bulk scraping" constraint. Many of those heroes still appear as the "other side" of a fetched pair. A per-hero follow-up (single pages, paced) would fill them in.
- No sample sizes, rank tiers or server for mlbbhub edges. The edges may come from a global ranked pool, not Indonesia.
- Moonton's in-game counter lists (the origin of "kit matchups") were not read directly.

## 2. Synergies (combos that strengthen team fights)

### Takeaway
I found no data-backed synergy source. The 27 rows are low-confidence: 11 come from 1v9.gg "best heroes to duo with" listicles (May and June 2025, generic and partly inconsistent) and 16 are my own role-logic pairings with no citation (source_url blank, confidence low). Do not use these as measured rules.

### Cited Findings
- Atlas pairs with Alice ("Atlas initiates, and Alice finishes"), Freya (his ult Fatal Links groups enemies for her leap and combo) and Gloo (his ult clumps enemies after Gloo's slows) — [1v9 Alice](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-alice), [1v9 Freya](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-freya), [1v9 Gloo](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-gloo)
- Freya partners listed: Gatotkaca (taunt and ult create openings), Claude, Mathilda (guiding wind helps dash in or out), plus off-list X.Borg, Terizla, Pharsa, Lancelot, Beatrix, Estes, Tigreal. The Freya article's "Angela" entry actually describes Atlas, which shows the listicle is sloppy — [1v9 Freya](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-freya)
- Gloo partners listed: Tigreal (#1), Atlas (#2), Angela, Estes, Mathilda, Franco and others. Alice is not listed — [1v9 Gloo](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-gloo)
- Alice partners listed: Tigreal (#1), Atlas (#2), Angela, Estes, Mathilda, Franco and others. Gloo and Freya are not listed — [1v9 Alice](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-alice)
- The Gloo and Alice articles share almost the same ranking list (same ordering of Tigreal, Atlas, Angela, Estes, Mathilda, Franco, Beatrix, Irithel, Gusion), which suggests templated content and lowers trust — compare the [Gloo](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-gloo) and [Alice](https://1v9.gg/blog/mobile-legends-mlbb-best-heroes-to-duo-with-alice) pages.
- mlbbhub has a "best Franco synergy" article and a lineup/team-builder tool, but I did not fetch them — [mlbbhub Franco synergy](https://mlbbhub.com/news/best-franco-synergy-mlbb-2026)

### Inferences
- The only pair patterns supportable are generic: CC or group-up tank (Atlas, Tigreal, Gatotkaca) followed by a burst or AoE carry (Alice, Freya, Eudora, Zhuxin), and shield or speed support (Mathilda). These are plausible but not tested against MPL data.
- The seed rule "Gloo makes Alice viable" has no synergy backing, see Section 1.

### Gaps
- No pair win rates, no pro-play duo data, no MPL ID draft pair statistics (confirmed absent on mlbbhub MPL ID pages).
- The 16 uncited pairings in the CSV (e.g. Atlas with Eudora, Zhuxin, Selena, Novaria; Gatotkaca with Melissa, Brody, Moskov; Rafaela with marksmen; Marcel with Zhuxin) are my own general-knowledge reasoning and must be validated before use.
- Not searched: Reddit, Lav or Wolf Cast summaries, MPL analyst desk talk.

## 3. Dash and mobility classification

### Takeaway
Only 21 of 52 heroes have a dash count I can state, and only Phoveus, Benedetta, Chou, Fanny, Gloo, Freya, Selena, Mathilda have a cited skill description (some from a 2022 article). The other 31 are marked `unknown` because I did not read their skill text; I did not want to guess from memory for heroes whose kits changed in 2024 to 2026. Dash punishers found: Phoveus (definitive), plus CC-based "dash cancellers".

### Cited Findings
- Phoveus (2024 revamp): passive Demonic Force charges his next basic attack at the target and knocks back; passive Astaros' Gaze lowers his cooldowns "whenever an enemy hero blinks, dashes, or is displaced near him"; Dark Wave knocks airborne and pulls; ult Infernal Pursuit (Judgment) leaps onto a marked target and heals — [One Esports, 29 Jul 2024](https://www.oneesports.gg/mobile-legends/new-phoveus-skills/). Later patches may have tuned numbers; I found no newer text.
- Benedetta: ult slashes forward, S1 shadows dash forward, "almost all" skills dash or blink. Chou: ult dashes while damaging, S2 for movement. Selena: dash via Abyss mode. Mathilda: ult has a dash effect and can stun. Fanny: skill 2 and ult are dash skills — [vcgamers, 22 Feb 2022](https://www.vcgamers.com/news/en/hero-dash-ml-expert-escape-and-deal-damage/) (older than the current patch; kits may have changed)
- Freya: "all her skills have movement components" — [mlbbhub Freya](https://mlbbhub.com/counter/freya). Hirara and Dyrroth are described as relying on dashes — [mlbbhub Hirara](https://mlbbhub.com/counter/hirara), [mlbbhub Dyrroth](https://mlbbhub.com/counter/dyrroth)
- Gloo: S2 Spread, if the wave hits a goo puddle Gloo dashes to it and pulls the enemy — [mlbbhub Gloo](https://mlbbhub.com/th/heroes/gloo)
- Anti-dash counterplay (CC that cancels dashes, per mlbbhub kit text): Khufra, Johnson, Tigreal and Minsitthar (chain stun or hard CC cancels dashes), Marcel, Minotaur and Carmilla (pin or lock mobility), Moskov and Valir (knock-back interrupts set-up skills) — [Fanny](https://mlbbhub.com/counter/fanny), [Dyrroth](https://mlbbhub.com/counter/dyrroth), [Atlas](https://mlbbhub.com/counter/atlas). Chou's S2 gives CC immunity, per [One Esports](https://www.oneesports.gg/mobile-legends/best-heroes-counter-atlas/).

### Inferences
- High-dash group for a "Phoveus punishes dashers" rule: Freya, Fanny, Hirara, Paquito, Benedetta, Dyrroth, Chou (all 3+ or described as dash-reliant). The ranked edges for Phoveus over Freya, Benedetta, Hirara, Chou and Paquito agree with that rule.
- Counter-evidence to the rule: Phoveus has no listed edge over Fanny, and the Chou page text hints multi-mobility heroes can feed his cooldowns. The simple rule "more dashes = worse versus Phoveus" is only partly borne out.

### Gaps
- No Fandom wiki page was fetched (none surfaced as fetchable in search results), so no official skill text for 44 of 52 heroes. `hero_mobility.csv` lists these as `unknown` or low confidence. Heroes I gave a count from general knowledge only (Uranus 0, Belerick 0, Eudora 0, Lylia 0, Miya 0, Cecilion 0, Aulus 1, Esmeralda 1, Claude 1) need verification.
- dash_count was not verified against current patch skill descriptions for any hero.
- Heroes with a possible anti-dash role but unconfirmed: Kalea, Hylos, Sora, Gatotkaca (no sources read).

## 4. Where the counter data comes from

### Takeaway
All measured counter data is ranked-queue data from aggregator sites. There is no pro-play counter dataset. Analyst opinion is limited to a few older articles and low-quality listicles.

### Cited Findings
- mlbbhub: ranked data, edges in pp, Patch 2.2.16a, "updated Nov 5, 2026" (footer "Oct 2026"), no tiers, server or sample size; some pairs are Moonton's in-game counter lists with direction only — [mlbbhub matrix](https://mlbbhub.com/matchups)
- mlbb.io: win rates for All Ranks (also Epic, Legend, Mythic, Mythical Honor, Mythical Glory+ filters), past 7 days, "November 2026" page title (search-result titles said August 2026), no server named — [mlbb.io Freya](https://mlbb.io/en/counter/freya)
- Pro play context, MPL ID S18 at 7 Nov 2026 (78 completed matches, 199 games with winners): most banned Freya 142 to 143 (71%), Atlas 128 to 129, Fanny 117 to 119, Marcel 100 to 101, Hirara 85, Masha 75 to 77, Esmeralda 74 to 76, Paquito 73, Carmilla 69, Uranus 58 (the two mlbbhub pages were fetched at different times, so the counts differ by a few) — [drafts](https://mlbbhub.com/mpl/id/drafts), [stats](https://mlbbhub.com/mpl/id/stats)
- MPL ID S18 per-hero pick / ban / win rate (first 30 heroes of the stats table): Freya 54/143/52%, Atlas 56/129/52%, Hirara 94/85/52%, Paquito 98/73/44%, Fanny 22/119/55%, Marcel 34/101/65%, Nolan 70/51/60%, Carmilla 45/69/53%, Uranus 55/58/45%, Zhuxin 59/53/51%, Esmeralda 34/76/44%, Selena 49/53/41%, Masha 24/77/46%, Belerick 72/22/51%, Aulus 63/28/56%, Gloo 44/46/61%, Melissa 34/53/53%, Eudora 51/33/57%, Barats 41/43/46%, Rafaela 38/44/53%, Obsidia 47/33/62%, Claude 65/11/49%, Valentina 43/33/35%, Alice 44/31/55%, Mathilda 23/51/48%, Cici 53/21/51%, Minotaur 43/29/42%, Lylia 32/39/50%, Kimmy 48/13/52%, Novaria 22/38/50% — [mlbbhub MPL ID stats](https://mlbbhub.com/mpl/id/stats)
- Analyst or opinion sources: One Esports Atlas-counter article (Jan 2025) and the 1v9.gg duo listicles (May to June 2025) — see sections 1 and 2.

### Inferences
- Ranked counters may under- or over-state pro play. Example: Paquito is the most picked hero in S18 (98 picks) yet has a 44% win rate, and Esmeralda counters him in ranked data; Valentina is 35% win rate, even though Phoveus, Dyrroth and Atlas page edges list her as a target. This suggests a predictor should weight pro pick/win rates alongside the ranked edges.
- The pro win rates are small samples (Fanny 22 picks, Mathilda 23, Masha 24, Novaria 22).

### Gaps
- No pro-play head-to-head or draft-pair data. Not found: Lav, Wolf Cast or Reddit guide content (not searched).
- Server, rank mix and sample size of mlbbhub and mlbb.io data are not disclosed.
- MPL ID S18 stats for the remaining 63 of 93 heroes (Moskov, Gatotkaca, Brody, Miya, Suyou, Sora, Hylos, Kalea, Zetian, Chou, Badang, Lukas, Harley, Phoveus, Alpha, Cecilion, Yi Sun-Shin, Ruby, Valir, Arlott, Dyrroth, Benedetta) were not displayed on the stats page I fetched.
