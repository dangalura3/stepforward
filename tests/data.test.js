// Data and repository hygiene tests.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/allteams.json'), 'utf8'));

test('every game has two different teams, a winner, and five bans each without repeats', () => {
  assert.ok(ALL.games.length >= 150);
  for (const g of ALL.games) {
    assert.notEqual(g.blue, g.red);
    assert.ok([g.blue, g.red].includes(g.winner), 'winner is one of the teams in ' + g.id);
    for (const side of ['blue', 'red']) {
      assert.equal(g.bans[side].length, 5, g.id + ' ' + side);
      assert.equal(new Set(g.bans[side]).size, 5, g.id + ' ' + side + ' repeats a ban');
    }
  }
});

test('the built site exists and has the expected pages', () => {
  for (const f of ['index.html', 'habits.html', 'formulas.html', 'programs.html']) {
    const p = path.join(ROOT, 'site', f);
    assert.ok(fs.existsSync(p), f + ' missing - run: npm run build');
  }
  const html = fs.readFileSync(path.join(ROOT, 'site/index.html'), 'utf8');
  assert.match(html, /StepForward/);
  assert.match(html, /<meta name="viewport"/);
});

test('no secrets are hardcoded in the repository', () => {
  const bad = [/sk-ant-[A-Za-z0-9_-]{10,}/, /sk-[A-Za-z0-9]{32,}/, /ghp_[A-Za-z0-9]{30,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /(api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/i];
  const skip = new Set(['node_modules', '.git', '.build', '__pycache__']);
  const hits = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(js|html|json|md|py|toml|yml|yaml|txt|csv|cursorrules)$/.test(e.name) && e.name !== '.cursorrules' && e.name !== '.env.example') continue;
      if (e.name === 'data.test.js') continue;
      const t = fs.readFileSync(p, 'utf8');
      bad.forEach(re => { if (re.test(t)) hits.push(path.relative(ROOT, p) + ' ~ ' + re); });
    }
  })(ROOT);
  assert.deepEqual(hits, []);
});

test('built site has the AI-capability line, accuracy box and explain button', () => {
  const html = fs.readFileSync(path.join(ROOT, 'site/index.html'), 'utf8');
  assert.ok(html.includes('id="aiCap"') && html.includes('classification and ranking'));
  assert.ok(html.includes('id="accBox"') && html.includes('How accurate is it?'));
  assert.ok(html.includes('Explain this draft') && html.includes('DraftExplain'));
});
