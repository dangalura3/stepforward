// Unit tests for the draft engine (src/sim.js) and the ban model (src/model.js).
// Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.DraftModel = require(path.join(ROOT, 'src/model.js'));
const S = require(path.join(ROOT, 'src/sim.js'));
const ALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/allteams.json'), 'utf8'));
const PATCH = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/patch.json'), 'utf8'));
const steps = S.parseOrder(S.DEFAULT_ORDER);

test('draft order has 20 steps: 10 bans and 10 picks, blue bans first', () => {
  assert.equal(steps.length, 20);
  assert.equal(steps.filter(s => s.type === 'ban').length, 10);
  assert.equal(steps.filter(s => s.type === 'pick').length, 10);
  assert.deepEqual([steps[0].side, steps[0].type], ['blue', 'ban']);
  assert.equal(steps.filter(s => s.side === 'blue').length, 10);
});

test('a hero can only be used once in a draft', () => {
  const d = S.newDraft(steps, { blue: 'BTR', red: 'TLID' });
  assert.equal(S.apply(d, 'Khufra'), true);
  assert.equal(S.apply(d, 'Khufra'), false);
  assert.equal(d.idx, 1);
  assert.deepEqual(S.usedSet(d), { Khufra: 1 });
});

test('undo steps back and frees the hero', () => {
  const d = S.newDraft(steps, { blue: 'BTR', red: 'TLID' });
  S.apply(d, 'Khufra'); S.undo(d);
  assert.equal(d.idx, 0);
  assert.equal(S.usedSet(d).Khufra, undefined);
});

test('draft is done after 20 different heroes', () => {
  const d = S.newDraft(steps, { blue: 'BTR', red: 'TLID' });
  assert.equal(S.done(d), false);
  for (let i = 0; i < 20; i++) S.apply(d, 'H' + i);
  assert.equal(S.done(d), true);
});

test('lane feasibility: two junglers cannot cover five lanes', () => {
  assert.equal(S.canFill([['Jungle'], ['EXP'], ['Mid'], ['Gold'], ['Roam']]), true);
  assert.equal(S.canFill([['Jungle'], ['Jungle'], ['EXP'], ['Mid'], ['Gold']]), false);
});

function banCtx(history, date) {
  const par = { decay: 0.95, sideW: 0.6, h2hW: 1.5, k: 4, patchDate: PATCH.date, curDate: date, phaseW: PATCH.phaseW };
  return { history, par, posWeight: 0.35, nLeagueGames: 200 };
}

test('ban prediction is a sorted probability list that skips used heroes', () => {
  const g = ALL.games[ALL.games.length - 1], hist = ALL.games.slice(0, -1);
  const d = S.newDraft(steps, { blue: g.blue, red: g.red });
  S.apply(d, g.bans.blue[0]);
  const list = S.predictBan(d, banCtx(hist, g.date));
  assert.ok(list.length > 20);
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].p >= list[i].p);
  const sum = list.reduce((a, x) => a + x.p, 0);
  assert.ok(Math.abs(sum - 1) < 1e-6, 'probabilities sum to 1, got ' + sum);
  assert.equal(list.find(x => x.hero === g.bans.blue[0]), undefined);
});

test('walk-forward: the real ban is in the model top 5 far more often than chance', () => {
  const games = ALL.games, from = Math.max(20, games.length - 40);
  let n = 0, hit = 0;
  for (let idx = from; idx < games.length; idx++) {
    const g = games[idx], hist = games.slice(0, idx);
    const d = S.newDraft(steps, { blue: g.blue, red: g.red });
    let pi = 0;
    while (!S.done(d)) {
      const st = d.steps[d.idx];
      if (st.type === 'pick') { S.apply(d, 'PICK' + pi++); continue; }
      const actual = g.bans[st.side][d.bans[st.side].length];
      const list = S.predictBan(d, banCtx(hist, g.date));
      n++; if (list.slice(0, 5).some(x => x.hero === actual)) hit++;
      S.apply(d, actual);
    }
  }
  // Chance is about 5/130 = 4%. The project measured about 50%; the test only guards against collapse.
  assert.ok(n > 300);
  assert.ok(hit / n > 0.30, 'top-5 hit rate ' + (hit / n).toFixed(3));
});
