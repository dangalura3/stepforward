// Tests for "Explain this draft" (src/explain.js). Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const E = require(path.resolve(__dirname, '..', 'src/explain.js'));

const base = { team: 'ONIC', type: 'ban', n: 1, blueTeam: 'ONIC', redTeam: 'EVOS', pBlue: null,
  top: [{ hero: 'Khufra', p: 0.21 }, { hero: 'Rafaela', p: 0.15 }, { hero: 'Marcel', p: 0.1 }] };

test('always ends with the "not a promise" sentence when it explains a draft', () => {
  assert.ok(E.explain(base).endsWith(E.CLOSING));
  assert.ok(E.explain(Object.assign({}, base, { type: 'pick', n: 3, pBlue: 0.6 })).endsWith(E.CLOSING));
});

test('uses only the numbers it is given', () => {
  const t = E.explain(base);
  assert.match(t, /Khufra \(21%\)/);
  assert.match(t, /Rafaela \(15%\)/);
  assert.match(t, /Marcel \(10%\)/);
  assert.doesNotMatch(t, /win/);            // no win chance when no pBlue was given
});

test('shows the win chance for both sides, and calls a 52/48 split a coin flip', () => {
  const t = E.explain(Object.assign({}, base, { pBlue: 0.52 }));
  assert.match(t, /ONIC about 52% and EVOS about 48%/);
  assert.match(t, /coin flip/);
  assert.doesNotMatch(E.explain(Object.assign({}, base, { pBlue: 0.62 })), /coin flip/);
});

test('warns when even the best guess is low', () => {
  assert.match(E.explain(base), /only 21%/);
  assert.doesNotMatch(E.explain(Object.assign({}, base, { top: [{ hero: 'Khufra', p: 0.6 }] })), /only/);
});

test('handles "no prediction yet" and "draft finished"', () => {
  assert.equal(E.explain(Object.assign({}, base, { top: [] })), 'Start the draft first.');
  assert.equal(E.explain({}), 'Start the draft first.');
  assert.match(E.explain({ done: true }), /finished/);
});
