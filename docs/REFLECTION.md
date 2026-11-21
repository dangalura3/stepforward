# Reflection (1 page) - DRAFT: rewrite in your own words before you submit

**What I built.** StepForward is a website that guesses what a Mobile Legends pro team will ban or pick next. You choose two teams, tap the heroes as the real draft happens, and it shows its top guesses, the reasons, and how often it was right. It runs fully in the browser, is tested by 16 JavaScript and 22 Python tests, and deploys through GitHub Actions to Netlify.

**What I learned**
1. **Data matters more than clever maths.** One clear improvement came from adding more *real* games (MPL Philippines and Malaysia playoffs), not from a fancier formula: the log-score improved from -3.520 to -3.317.
2. **Test honestly or fool yourself.** I tested every idea "walk-forward": predict game 50 using only games 1-49. That showed bans are predictable (about half of the real bans were in the top 5, random is about 4%) but **winners are not** - win prediction was about a coin flip. I kept that result in the app instead of hiding it.
3. **AI is a fast partner, not a boss.** Claude wrote most of the code, but it only became trustworthy after I asked for tests, sources and "don't make up numbers". A clear spec, a CLAUDE.md file and small commits kept the work on track.
4. **Plain English is a feature.** Because I needed to explain it to people who do not play the game, I rewrote labels, added full team names, and moved the suggestions right under the slot being filled.

**Challenges**
- Some regions (Türkiye, CIS, Myanmar) have no readable draft data, so the model cannot say much about them. I had to say so instead of guessing.
- I had to follow data-source rules: no scraping, single pages read by hand, every source written down.
- It is easy to keep adding features. I had to stop and finish the basics (tests, CI, README).
- I could not get hero pictures at first because of access limits; the app uses badges until image links are supplied.

**What I would improve in version 2**
- Add an AI **explainer** that turns the model's numbers into a sentence a caster could read out (the key would live on a server, never in the page).
- Refresh the data automatically after every match day, and add more regions as soon as they publish drafts.
- Run real user tests earlier, with five fans, and fix the confusing parts before adding features.
- Add hero pictures once I have permission or an official image source.

**Evidence I still owe** (delete this line when done): interview quotes and the usability results from `docs/IDEA_VALIDATION.md` steps 1, 2 and 6.
