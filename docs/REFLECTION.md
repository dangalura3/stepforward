# Reflection: StepForward

Danilo S. Galura Jr. · Week 4 Graded Mini Project · 22 November 2026

## What I built

StepForward is a web app that predicts the next ban and pick in Mobile Legends professional drafts. The user chooses two teams and records the draft step by step. The app shows its top five suggestions for each move, gives the reasons, and checks itself against what the team really chose. It also shows a win chance for each side. It runs in the browser, has 26 JavaScript tests and 22 Python tests, and is published through GitHub Actions to GitHub Pages.

## What I learned

1. **Honest testing matters more than a clever model.** I tested each idea on games the model had not seen. The real ban was the model's first guess 23% of the time and was in its top five 49% of the time. Random guessing would give about 1% and 5%. Winner prediction was right in 31 of 54 games, which is close to a coin flip. I kept that result in the app and labelled it.
2. **Real users changed how I see the problem.** I asked three MLBB fans. All three try to guess drafts, and all three have used other tools. Two said those tools are too slow or too complicated under the 20-second timer. This taught me that speed and simplicity matter as much as accuracy. The sample is small, so I treat it as an early signal only. I have not yet tested whether a stranger can finish a draft unaided, so I cannot say the app is easy to use.
3. **AI is a fast assistant, but I must check its work.** Claude wrote most of the code. During a review, some accuracy numbers in my documents did not match my results files, so we corrected them. Since then I check every number against its source before I use it.

## Challenges

- I have no programming background. GitHub, the automatic checks and the deployment took the most effort.
- My Netlify team paused production deploys, so I moved the live site to GitHub Pages.
- Some leagues have no readable draft data, so the model says little about them. Pick predictions are not validated yet. Hero pictures are still initial badges because I do not have an approved image source.

## What I would improve in version 2

- Add an LLM-written explanation of each draft, with the key kept on a server (GitHub issue #1).
- Add hero pictures, a team win-rate view and a short buff and nerf summary, as the interviewees asked.
- Test with five fans on their phones and fix what confuses them.
- Refresh the data after every match day.

## Why this matters to me

I work in banking operations and I want to move toward AI in financial services. This project gave me practice in habits that work will need: define the user, measure against a baseline, state the limits, and ship something that works.
