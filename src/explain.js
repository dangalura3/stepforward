// "Explain this draft": turns numbers already on screen into a short, plain-English paragraph.
// No AI model, no network, no keys: it is a template filled with the model's own output.
// Used by the page (window.DraftExplain) and by tests (require).
(function (root) {
  var CLOSING = 'This is a prediction, not a promise.';

  function pct(x) { return Math.round(x * 100) + '%'; }

  // info = { done, team, type ('ban'|'pick'), n, top: [{ hero, p }], blueTeam, redTeam, pBlue (0..1 or null) }
  function explain(info) {
    if (!info || info.done) return 'The draft is finished. Press Undo to go back to a step and see the guesses for it.';
    var top = (info.top || []).filter(function (x) { return x && x.hero && typeof x.p === 'number'; });
    if (!top.length) return 'Start the draft first.';

    var s = [];
    s.push(info.team + ' is up for ' + info.type + ' number ' + info.n + '.');

    s.push(info.type === 'ban'
      ? 'A ban blocks a hero so the other team cannot use it.'
      : 'A pick locks a hero in for that team.');

    var names = top.slice(0, 3).map(function (x) { return x.hero + ' (' + pct(x.p) + ')'; });
    var best = top[0];
    s.push('From past games, the model\'s best guess is ' + names[0] +
      (names.length > 1 ? ', then ' + names.slice(1).join(' and ') : '') + '.');

    if (best.p < 0.4) s.push('Even the best guess is only ' + pct(best.p) + ', so many other heroes are still possible.');

    if (typeof info.pBlue === 'number') {
      var pb = Math.round(info.pBlue * 100), pr = 100 - pb;
      var close = Math.abs(pb - 50) <= 5;
      s.push('Looking at the heroes picked so far, the draft gives ' + info.blueTeam + ' about ' + pb + '% and ' + info.redTeam + ' about ' + pr + '% to win' + (close ? ', which is close to a coin flip.' : '.'));
    }

    s.push(CLOSING);
    return s.join(' ');
  }

  var api = { explain: explain, CLOSING: CLOSING };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DraftExplain = api;
})(typeof window !== 'undefined' ? window : this);
