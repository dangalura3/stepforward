# GitHub issue to create (assignment step: "add one GitHub issue for a v2 improvement")

Create it on GitHub: repo → **Issues** → **New issue**. Copy the title and body below.

**Title:** v2: LLM-written "Explain this draft" (server-side key, with a safe fallback)

**Body:**

### Problem
The current "Explain this draft" button fills in a fixed template from the numbers on screen. It is safe and free, but the wording is repetitive and it cannot answer follow-up questions.

### Proposal
Add an optional LLM explanation:
- A small serverless function (Netlify Function) receives only the numbers already on screen (teams, top-3 guesses with percentages, win split) and asks an LLM to explain them in 3-5 plain sentences.
- The API key lives only in Netlify environment variables (never in `src/`, `site/` or git). `.env.example` already documents `ANTHROPIC_API_KEY`.
- If the function fails or the key is missing, the page falls back to the current template text.

### Acceptance criteria
- [ ] No key appears in the repo, the built site or the browser network tab.
- [ ] The function rejects bodies larger than 2 KB or with unknown fields (input validation).
- [ ] Rate limit of N calls per minute per visitor.
- [ ] The text never states a number that was not in the request.
- [ ] Fallback template text still works with the function turned off.
- [ ] A unit test covers the "numbers only come from the request" rule.

### Risks
Cost per call; prompt injection through free-text fields (so only fixed numeric fields are sent); an LLM can sound more certain than the model is, so the closing line "This is a prediction, not a promise." stays.

Labels: `enhancement`, `v2`
