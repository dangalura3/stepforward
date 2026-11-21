// Unit tests for the Bradley-Terry team strength model and series maths (src/bt.js, src/comp.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const BT = require(path.resolve(__dirname, '../src/bt.js'));
const C = require(path.resolve(__dirname, '../src/comp.js'));

test('series maths: fair coin, best of 3, is 50%', () => {
  assert.ok(Math.abs(BT.seriesP(0.5, 2, 2) - 0.5) < 1e-12);
});

test('series maths: one game left equals the single-game chance', () => {
  assert.ok(Math.abs(BT.seriesP(0.6, 1, 1) - 0.6) < 1e-12);
  assert.equal(BT.seriesP(0.3, 0, 2), 1);
  assert.equal(BT.seriesP(0.3, 2, 0), 0);
});

test('series maths: a better team is favoured more in longer series', () => {
  assert.ok(BT.seriesP(0.6, 4, 4) > BT.seriesP(0.6, 2, 2));
  assert.ok(BT.seriesP(0.6, 2, 2) > 0.6);
});

test('expit and logit are inverses', () => {
  for (const p of [0.1, 0.35, 0.5, 0.8]) assert.ok(Math.abs(BT.expit(C.logit(p)) - p) < 1e-9);
});

test('Bradley-Terry fit ranks the team that wins more above the other', () => {
  const results = [];
  for (let i = 0; i < 40; i++) results.push({ a: 'STRONG', b: 'WEAK', win: i % 5 ? 'a' : 'b', blue: i % 2 ? 'a' : 'b' });
  const fit = BT.fit(results, { iters: 8000, burn: 2000 });
  assert.deepEqual(fit.teams.slice().sort(), ['STRONG', 'WEAK']);
  assert.ok(fit.draws.length > 100);
  const a = fit.idx.STRONG, b = fit.idx.WEAK;
  const wins = fit.draws.filter(d => d[a] > d[b]).length / fit.draws.length;
  assert.ok(wins > 0.9, 'P(STRONG > WEAK) = ' + wins);
});

test('win model weights are the documented ones', () => {
  assert.deepEqual(C.W, { team: 0.8, hero: 6, comp: 0.02, style: 0.12, side: 0.3, temp: 0.4 });
});
