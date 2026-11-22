// Input validation tests: bad text typed into the app must be rejected, never crash or be trusted.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const S = require(path.resolve(__dirname, '..', 'src/sim.js'));

test('draft-order box rejects junk, empty text and HTML', () => {
  ['', 'garbage', '<img src=x onerror=alert(1)>', 'bb rr', null, undefined].forEach((bad) => {
    assert.throws(() => S.parseOrder(bad), Error, 'should reject ' + String(bad));
  });
});

test('draft-order box rejects an order without 5 bans and 5 picks per side', () => {
  assert.throws(() => S.parseOrder('bB rB bP rP'), /5 bans and 5 picks/);
});

test('the default order is accepted and has 20 steps', () => {
  assert.equal(S.parseOrder(S.DEFAULT_ORDER).length, 20);
});

test('a used hero and a finished draft are refused, and nothing changes', () => {
  const d = S.newDraft(S.parseOrder(S.DEFAULT_ORDER), { blue: 'ONIC', red: 'EVOS' });
  assert.equal(S.apply(d, 'Khufra'), true);
  assert.equal(S.apply(d, 'Khufra'), false);       // already used
  assert.equal(d.idx, 1);                            // second try changed nothing
  const names = Array.from({ length: 19 }, (_, i) => 'Hero' + i);
  names.forEach((n) => assert.equal(S.apply(d, n), true));
  assert.equal(S.done(d), true);
  assert.equal(S.apply(d, 'Extra'), false);          // draft full
});
