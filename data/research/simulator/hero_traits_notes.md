# Hero trait table: notes

Patch 2.2.16a (14 Oct 2026), MPL Indonesia Season 18. Built 7 Nov 2026. Output: `hero_traits.csv` (133 heroes, same names and order as `hero_roles.csv`), plus `hero_traits_provenance.csv` (per-hero evidence and which fields rest on kit-knowledge).

## Coverage

| Item | Count |
|---|---|
| Heroes in table | 133 of 133 (91 with MPL ID S18 picks, then the 42 others) |
| Hero pages read | 133, one fetch at a time (Alice was fetched twice, once to see the page layout) |
| Rows with any field from kit-knowledge | 69 (damage_type 58, hard_cc 17, engage 4, frontline 1; some rows have several) |
| confidence high / medium / low | 1 / 124 / 8 |
| Low-confidence rows | Masha, Bruno (2.2.16 reworks), Cecilion, Khaleed (page contradicts itself on spike), Kagura, Baxia, Arlott, Tigreal |

Fields filled (not UNKNOWN), out of 133:

| Column | Filled | Y | N | Mixed | UNKNOWN |
|---|---|---|---|---|---|
| specialty_tags | 133 | | | | 0 |
| damage_type | 111 | Physical 57, Magic 53 | | 1 | 22 |
| power_spike | 57 | Early 25, Mid 7, Late 25 | | | 76 |
| frontline | 99 | 17 | 82 | | 34 |
| hard_cc | 102 | 80 | 22 | | 31 |
| engage | 40 | 32 | 8 | | 93 |
| sustained_dps | 19 | 13 | 6 | | 114 |
| waveclear_push | 35 | 30 | 5 | | 98 |

Within the 91 S18 heroes, power_spike is Early 20, Mid 5, Late 8, UNKNOWN 58. Within the 42 non-picked heroes it is Early 5, Mid 2, Late 17, UNKNOWN 18. The 42 are mostly late-peaking heroes on MLBBHub's phase chart, which fits pros not picking them, but the chart is thin (see game-length data).

Not enough source text to fill: engage, sustained_dps and waveclear_push are UNKNOWN for most heroes because pages only sometimes say it. 60 heroes are UNKNOWN on all three. For frontline, a consumer can fall back to the role class in `hero_roles.csv` where this table says UNKNOWN.

`power_spike` was never given Early-Mid or Mid-Late. No source states a blended phase.

## Sources

1. MLBBHub hero pages, https://mlbbhub.com/heroes/<slug>, patch label 2.2.16a. Read one page per call, in sequence, no scripts. This is the only source used. Every row's `source_url` is its page.
   - Slugs follow the hero name in lower case with hyphens. Exceptions: Chang'e is `/heroes/change`, Popol and Kupa is `/heroes/popol-and-kupa`, X.Borg is `/heroes/x-borg`, Yi Sun-shin is `/heroes/yi-sun-shin`.
2. What each page gives that was used: Specialty label(s); class and lane badges; At a Glance ratings (Durability, Offense, Control, Difficulty; read but not stored); prose with item and minute checkpoints; the Game Phase Analysis panel; skill wording in the combo and tips text.
3. Not consulted: official MLBB hero pages, the Mobile Legends wiki, Liquipedia, analyst guides. MLBBHub already stated what the columns need for most heroes and I prioritised one consistent source over mixing styles. A second source would be the way to lift the UNKNOWN engage, sustained_dps and waveclear_push columns.

## Blocked sources and access

- `curl` to mlbbhub.com through the session proxy returned 403 on CONNECT (the proxy status endpoint logged a policy denial for mlbbhub.com:443). I did not retry or work around it.
- The WebFetch tool could read the pages, which matches the "one page at a time" instruction. WebFetch summarises each page with a small model, so a transcription slip is possible. I asked for verbatim quotes and "NOT PRESENT" for anything absent, but I could not check the output against the raw page text.
- One fetch (`/heroes/chang-e`) was rejected as not on the allowlist. That was a wrong slug, not a block. The correct slug (`change`, recorded in the earlier roles notes) worked.

## Rules used for each column

- **specialty_tags**: the page's Specialty line, exact labels, `|` separated. Labels seen: Burst, Damage, Finisher, Chase, Crowd Control, Regen, Poke, Charge, Guard, Initiator, Control, Magic Damage, Support, Push, Mixed Damage. "Control" (Gloo, Kalea, Eudora, Vexana, Franco, Yin, Edith, Cyclops, Chou) is shown on MLBBHub as a different label from "Crowd Control". I kept it as shown. "Reap" never appeared.
- **damage_type**: from the page when it states it (Specialty "Magic Damage" or "Mixed Damage", or prose like "pure magic damage"); otherwise from kit-knowledge, flagged in `source_url` as `kit-knowledge:damage_type` with confidence medium. UNKNOWN when the page mentions both types or neither and I was not sure of the kit (22 heroes). Bane has both a physical and a magic build, so UNKNOWN, not Mixed.
- **power_spike**: set only from a phase statement on the page: the Game Phase Analysis panel ("peaks here" gives that phase) or an explicit "strongest in the early game" or "strongest once matches pass 16 minutes". Item and minute checkpoints ("Talisman plus Wand around minute 7 to 9") are copied into `spike_reason` but do not set the label. That gives 57 labelled heroes. If the panel says "No measured separation" the label is UNKNOWN. No kit-knowledge was used for power_spike.
- **frontline**: Y when the page says frontliner/front line or the first class badge is Tank with no contradicting page text. N when the page says the hero is not a frontliner or the first class is Assassin, Mage or Marksman (class badge). UNKNOWN for Fighters and supports without a statement, and where page and class disagree.
- **hard_cc**: Y when the page names a stun, knock-up/airborne, suppression, freeze, root/immobilize or "pin" from the hero's own skills. Conditional versions count (Badang and Grock stun only on terrain collision; Cecilion's immobilize). Pull, knockback, fear, taunt, silence and slow alone were left UNKNOWN, since they are not in the requested list and the page does not call them hard CC. N when the page lists no CC for the hero's own skills and the kit plainly has none (flagged kit-knowledge), or the page says so ("he lacks CC", "no hard CC of her own").
- **engage**: Y when the page calls the hero an initiator/starter or says "initiate", or the Specialty is Initiator and no page text contradicts it. N when the page says so ("not an engage tank", "not an initiator").
- **sustained_dps / waveclear_push**: only when the page says it (sustained damage, "clears waves", Specialty Push). A Marksman class badge alone was not enough, so most marksmen are UNKNOWN for sustained_dps.
- **confidence**: high only when every filled field comes straight from page text with no tension (Carmilla only). Medium when any field rests on kit-knowledge or weak page wording. Low for reworks and for pages that contradict themselves.

## Game-length data (answer to "does MLBBHub show win rate by game length")

- Every hero page has a "Game Phase Analysis" section with three phases: Early 0-10 min, Mid 10-16 min, Late 16+ min.
- It shows labels, not numbers: "peaks here", "In between", "dips here", or "No measured separation". The page says the bars are "shape only, not win rates" and are based on "10 measured matchups". No win-rate figures by game length exist on any page I read.
- Results over 133 heroes: 57 show a shape (Early peak 25, Mid peak 7, Late peak 25); 74 say "No measured separation" (the page text says no phase leads "by more than that sample can resolve"); 2 (Cecilion, Khaleed) show a shape that their own prose contradicts, so I left them UNKNOWN.
- Counter-style sentences repeat the same signal ("X is strongest in the early game", "weakest once matches pass 16 minutes").
- Only 10 matchups per hero, no patch breakdown, so treat these as weak evidence. They may include pre-2.2.16 data.
- Pages also have "Win Rate and Pick Rate by Rank" (rank, not game length), but I did not record it.
- Strengths/weaknesses text: there is no dedicated strengths/weaknesses field. The nearest are "Counter Picks" / "Heroes X Counters" lists (hero names) and prose such as "avoid her when anti-heal..." I did not store the counter lists. Prose that bears on timing went into `spike_reason`.

## Reworked in 2.2.16: Masha and Bruno

- **Masha**: page says 2.2.16 "rebuilt Masha from an assassin-split-pusher into a berserker". It does not say whether the phase panel mixes old and new versions. I labelled the panel's Early peak but set confidence low. hard_cc (Savage Maul stun) and engage come from the page text, which describes the new kit. frontline stays UNKNOWN because the old kit was a split-pusher.
- **Bruno**: page says the 2.2.16 rework turned Worldie into a long-range hook and changed Flying Tackle. The page gives "No measured separation", so power_spike is UNKNOWN. hard_cc Y uses the post-rework ult wording ("stunned, slowed hard, and knocked back"). Confidence low.
- Other 2.2.16 changes the pages mention, none called a rework, so these rows keep their normal confidence but their phase data may predate the change: Paquito (Enhanced Jab early burst trimmed), Hylos (Thickened Blood flipped), Kalea (walk-up strengthened), Lukas (buffed), Yi Sun-shin (Traceless cooldown up), Miya (passive shadow hit trimmed), Aldous (delay shortened), Karina (Dance of Blades cooldown cut), Argus (crit identity), Sun (a build trimmed), Alpha (early-mid changes), Kagura (umbrella speed), Hanabi (bounce damage falls with each bounce).
- Older reworks named by pages (no action taken): Freya (Nov 2025), Grock (revamp, Dec 2025 change), Helcurt (2024), Hilda/Johnson/Zilong (2.1.30-2.1.40), Dyrroth/Wanwan/Aulus (2.1.67), Kaja (2.1.95), Marcel (2.1.88), Yin (2.1.88), Eudora (2.1.47). Hanzo's page says "Hanzo's rework flipped his risk model" without a patch, so its timing is unknown.

## Conflicts and judgement calls

Page contradicts itself (phase panel versus prose):
- Cecilion: build text says weak through minute 6 and winning at minute 20; the counter text says strongest early and weakest after 16. power_spike UNKNOWN.
- Khaleed: prose "peaks around 20 minutes" versus panel Mid peak, Late dip. power_spike UNKNOWN.
- Kagura: panel Early peak versus prose spike at minutes 9-12. Labelled Early, low confidence.
- Fanny: panel Late peak versus "can end games by the 10-minute mark" and a 7-9 minute item spike. Labelled Late.
- Lapu-Lapu: panel Early peak versus "weak in the early lane". Labelled Early.
- Guinevere, Marcel, Masha, Hirara: panel Early peak while item checkpoints sit at minutes 7-11. Labelled Early.
- Valentina: tier badge D versus prose "situational A-tier mid" (not used in the table).

Frontline and engage disagreements:
- Gloo ("parasite tank, not a frontliner"), Esmeralda ("frontline-adjacent brawler, not a true tank"), Khufra ("anti-mobility tool pretending to be a frontline"), Edith: Tank class, durable, but page hedges, so UNKNOWN.
- Johnson: Tank class, but the page says he is not a frontliner, so N.
- Tigreal: page says "not a tank you blind-pick because you want a front line" and lists no stun or knock-up from his skills, yet the class badge is Tank and Control is 100. I set frontline, hard_cc and engage to Y from kit-knowledge, confidence low. Treat these with care.
- Hylos: Specialty Initiator, page "not a tank in the classical engage sense". engage UNKNOWN. Silvanna: Specialty Initiator, page "not a general-purpose initiator". engage UNKNOWN.
- Baxia: hard_cc Y rests on one weak sentence ("roll past everyone and stun the marksman") plus kit-knowledge.
- Luo Yi: hard_cc Y rests on "does not just stun. She displaces."

Class order and spelling:
- Dual-class heroes (Alice, Esmeralda, Fredrinn and others) show the first class in the same order as the heroes list. The stats page tags a different first class for some; `hero_roles.csv` already documents this.
- Hero names follow `hero_roles.csv`. The S18 stats file spells two differently: "Yi Sun-Shin" (table: Yi Sun-shin) and "Lapu-lapu" (table: Lapu-Lapu). Join on the table spelling after normalising case.

Data quality:
- MLBBHub dates are inconsistent on every page ("Updated" Aug-Oct 2026, stats "last refreshed" 6-7 Nov 2026, footer "Oct 2026"). The patch label is 2.2.16a throughout.
## UNKNOWN damage_type (22)

Akai, Bane, Barats, Cici, Edith, Estes, Franco, Gatotkaca, Helcurt, Hilda, Hirara, Johnson, Kalea, Khufra, Lolita, Marcel, Obsidia, Phoveus, Sora, Suyou, Tigreal, X.Borg.

## Suggested follow-ups

- Read a second source (official hero pages or the wiki skill text) for engage, sustained_dps and waveclear_push, and to confirm hard_cc on the 17 kit-knowledge rows.
- Recheck the 7 patch-sensitive heroes (Masha, Bruno, Paquito, Hylos, Kalea, Lukas, Yi Sun-shin) once MLBBHub's phase panel refreshes after 2.2.16.
- If the analyser needs win rate by game length, MLBBHub does not give it; it would need per-game data with durations from MPL scoreboards.
