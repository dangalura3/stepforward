// Composition rating and win prediction for the draft simulator.
// Every weight here is a design choice taken from the research rules (see analyst_draft_thinking.md), not a fitted value.
(function (root) {
  'use strict';

  // ---------- hero features ----------
  var SPIKE = { 'early': [1, .6, .1], 'early-mid': [1, 1, .3], 'mid': [.5, 1, .6], 'mid-late': [.2, .9, 1], 'late': [.1, .5, 1] };
  // Heroes whose skill-triggered enhanced basic attacks now hit turrets (official patch 2.2.16 notes).
  var TURRET_REGEN = { 'Sun': 1, 'Gusion': 1, 'Thamuz': 1, 'Dyrroth': 1, 'Masha': 1 };
  var yn = function (v) { v = (v || '').toString().trim().toUpperCase(); return v === 'Y' || v === 'YES' ? 1 : (v === 'N' || v === 'NO' ? 0 : null); };

  // T: traits row {tags:[], dmg, spike, front, cc, engage, dps, wave}, R: roles row {role, lanes}
  function feats(T, R, name) {
    var role = (R && R.role) || '', tags = ((T && T.tags) || []).map(function (x) { return x.toLowerCase(); });
    var has = function (t) { return tags.some(function (x) { return x.indexOf(t) >= 0; }); };
    var known = 0, total = 0;
    var pick = function (v, fb) { total++; if (v !== null && v !== undefined) { known++; return v; } return fb; };
    var f = { name: name || '' };
    f.front = pick(T ? yn(T.front) : null, role === 'Tank' ? 1 : role === 'Fighter' ? 0.5 : 0);
    f.cc = pick(T ? yn(T.cc) : null, has('crowd') ? 0.8 : (role === 'Support' || role === 'Tank' ? 0.5 : 0.2));
    f.engage = pick(T ? yn(T.engage) : null, has('initiator') ? 1 : has('charge') ? 0.5 : (role === 'Tank' ? 0.5 : 0));
    f.dps = pick(T ? yn(T.dps) : null, role === 'Marksman' ? 1 : (has('damage') ? 0.5 : 0));
    f.wave = pick(T ? yn(T.wave) : null, has('push') ? 1 : (role === 'Mage' || role === 'Marksman' ? 0.6 : 0.2));
    f.burst = has('burst') ? 1 : (role === 'Assassin' ? 0.8 : role === 'Mage' ? 0.5 : 0);
    f.poke = has('poke') ? 1 : 0;
    f.catchx = (has('chase') || has('reap') || has('finisher') || role === 'Assassin') ? 1 : 0;
    f.peel = (has('regen') || has('support') || has('guard') || role === 'Support') ? 1 : (role === 'Tank' ? 0.5 : 0);
    var sp = T && T.spike ? T.spike.toLowerCase().replace(/\s+/g, '') : '';
    total++; if (SPIKE[sp]) known++;
    f.curve = SPIKE[sp] || (role === 'Marksman' ? SPIKE['late'] : role === 'Assassin' ? SPIKE['early-mid'] : role === 'Tank' ? SPIKE['mid'] : SPIKE['mid']);
    var d = T && T.dmg ? T.dmg.toLowerCase() : '';
    total++; if (d) known++;
    f.dmg = d.indexOf('mixed') === 0 || d.indexOf('true') === 0 ? [0.5, 0.5] : d.indexOf('magic') === 0 ? [0, 1] : d.indexOf('phys') === 0 ? [1, 0] :
      (role === 'Mage' ? [0, 1] : role === 'Tank' || role === 'Support' ? [0.25, 0.25] : [1, 0]);
    f.known = total ? known / total : 0;
    // Map objectives (Golden Turret, Healing Turtle). Sourced scores (0 to 3) where a source described the hero, otherwise a guess from hero class.
    var sv = T && T.siege !== undefined && T.siege !== '' && T.siege !== null ? +T.siege / 3 : null, ov = T && T.obj !== undefined && T.obj !== '' && T.obj !== null ? +T.obj / 3 : null;
    f.siege = sv !== null && !isNaN(sv) ? sv : Math.min(1, (has('push') ? 0.8 : role === 'Marksman' ? 0.6 : role === 'Mage' ? 0.5 : role === 'Fighter' ? 0.4 : role === 'Tank' || role === 'Assassin' ? 0.3 : 0.1) + (TURRET_REGEN[name] ? 0.3 : 0));
    f.obj = ov !== null && !isNaN(ov) ? ov : 0.5 * f.burst + 0.5 * f.curve[0];
    f.objKnown = ((sv !== null && !isNaN(sv)) || (ov !== null && !isNaN(ov))) ? 1 : 0;
    return f;
  }

  var REF = { mean: 76.7, sd: 5.8 }; // centre and spread of raw ratings over the 108 real Season 18 lineups (set by evalcomp.js)
  var sat = function (x, t) { return 100 * Math.min(1, x / t); };


  // Best role-pattern pairs in a lineup (research rule 15: score patterns, not fixed hero pairs).
  var PATTERNS = [
    { id: 'Engage + follow-up', say: function (a, b) { return a + ' starts the fight and ' + b + ' finishes it'; }, s: function (a, b) { return a.engage * Math.max(b.burst, b.catchx); } },
    { id: 'Lockdown + damage', say: function (a, b) { return a + ' locks targets down so ' + b + ' deals free damage'; }, s: function (a, b) { return Math.min(1, a.cc) * b.dps; } },
    { id: 'Frontline + carry', say: function (a, b) { return a + ' takes the hits while ' + b + ' fights behind'; }, s: function (a, b) { return a.front * b.dps * 0.85; } },
    { id: 'Peel + carry', say: function (a, b) { return a + ' protects ' + b; }, s: function (a, b) { return a.peel * b.dps * 0.9; } },
    { id: 'CC + burst chain', say: function (a, b) { return a + ' sets up ' + b + '\'s burst'; }, s: function (a, b) { return Math.min(1, a.cc) * b.burst * 0.9; } }
  ];
  function pairCombos(fs) {
    var cand = [];
    for (var i = 0; i < fs.length; i++) for (var j = 0; j < fs.length; j++) {
      if (i === j) continue;
      var best = null; PATTERNS.forEach(function (pt) { var v = pt.s(fs[i], fs[j]); if (!best || v > best.v) best = { v: v, id: pt.id, text: pt.say(fs[i].name, fs[j].name) }; });
      if (best && best.v > 0.3) cand.push({ a: i, b: j, v: best.v, id: best.id, text: best.text });
    }
    cand.sort(function (x, y) { return y.v - x.v; });
    var used = {}, list = [];
    cand.forEach(function (c) { if (list.length >= 3) return; var k = Math.min(c.a, c.b) + '-' + Math.max(c.a, c.b); if (used[k]) return; used[k] = 1; list.push(c); });
    var total = 0; list.forEach(function (c) { total += c.v; });
    var seen = {}, count = 0;
    cand.forEach(function (c) { var k = Math.min(c.a, c.b) + '-' + Math.max(c.a, c.b); if (c.v >= 0.6 && !seen[k]) { seen[k] = 1; count++; } });
    return { list: list, total: total, count: count };
  }

  // heroes: array of feature objects for the picked heroes (1 to 5)
  function profile(fs) {
    var n = fs.length || 1, S = function (k) { return fs.reduce(function (a, f) { return a + f[k]; }, 0); };
    var sum = { front: S('front'), cc: S('cc'), engage: S('engage'), dps: S('dps'), wave: S('wave'), burst: S('burst'), poke: S('poke'), catchx: S('catchx'), peel: S('peel'), siege: S('siege'), obj: S('obj') };
    var curve = [0, 0, 0]; fs.forEach(function (f) { for (var i = 0; i < 3; i++) curve[i] += f.curve[i]; });
    curve = curve.map(function (x) { return x / n; });
    var p = 0, m = 0; fs.forEach(function (f) { p += f.dmg[0]; m += f.dmg[1]; });
    var mix = p + m > 0 ? 100 * Math.min(1, 2 * Math.min(p, m) / (p + m)) : 50;
    var combos = pairCombos(fs);
    var full = fs.length >= 5;
    var scale = full ? 1 : 5 / Math.max(fs.length, 1);
    var comp = {
      Frontline: sat(sum.front * scale, 2.2), 'Hard CC': sat(sum.cc * scale, 4), 'Engage or catch': sat(Math.max(sum.engage, sum.catchx) * scale, 3),
      Burst: sat(sum.burst * scale, 2.5), 'Steady damage': sat(sum.dps * scale, 2.5), 'Wave clear and push': sat(sum.wave * scale, 3.2),
      'Peel and sustain': sat(sum.peel * scale, 2.5), 'Turret pressure': sat(sum.siege * scale, 2.6), 'Early objectives': sat(sum.obj * scale, 2.4), 'Damage mix': mix,
      'Teamfight combos': fs.length < 2 ? 0 : sat(combos.count * (10 / (fs.length * (fs.length - 1) / 2)), 6)
    };
    if (!full) Object.keys(comp).forEach(function (kk) { if (kk !== 'Damage mix') comp[kk] = Math.min(comp[kk], 100); });
    var W = { Frontline: .15, 'Hard CC': .15, 'Engage or catch': .12, Burst: .08, 'Steady damage': .15, 'Wave clear and push': .09, 'Peel and sustain': .07, 'Turret pressure': .06, 'Early objectives': .06, 'Damage mix': .09, 'Teamfight combos': .12 };
    var rating = 0, ws = 0; Object.keys(W).forEach(function (kk) { rating += W[kk] * comp[kk]; ws += W[kk]; });
    rating = rating / ws;
    var rel = Math.max(0, Math.min(100, 50 + 18 * (rating - REF.mean) / REF.sd));
    var early = 100 * curve[0], mid = 100 * curve[1], late = 100 * curve[2];
    var arch = {
      'Front-to-back teamfight': 0.35 * comp['Engage or catch'] + 0.3 * comp.Frontline + 0.2 * comp['Hard CC'] + 0.15 * comp['Steady damage'],
      'Poke and siege': 0.4 * sat(sum.poke * scale, 2) + 0.2 * comp['Wave clear and push'] + 0.2 * comp['Turret pressure'] + 0.1 * comp['Steady damage'] + 0.1 * Math.max(early, mid),
      'Catch and pick-off': 0.4 * sat(sum.catchx * scale, 1.5) + 0.3 * comp.Burst + 0.2 * comp['Hard CC'] + 0.1 * Math.max(early, mid),
      'Protect and late scaling': 0.4 * late + 0.3 * comp['Peel and sustain'] + 0.2 * comp.Frontline + 0.1 * comp['Steady damage'],
      'Early tempo and snowball': 0.4 * early + 0.2 * comp.Burst + 0.2 * sat(sum.catchx * scale, 1.5) + 0.2 * comp['Early objectives']
    };
    var archList = Object.keys(arch).map(function (a) { return { name: a, score: arch[a] }; }).sort(function (a, b) { return b.score - a.score; });
    var known = fs.length ? fs.reduce(function (a, f) { return a + f.known; }, 0) / fs.length : 0;
    var missing = [];
    if (full) {
      if (sum.front < 0.9) missing.push('no real frontline');
      if (sum.cc < 0.9) missing.push('little hard crowd control');
      if (Math.max(sum.engage, sum.catchx) < 0.9) missing.push('no engage or catch hero');
      if (mix < 40) missing.push('almost all one damage type');
      if (sum.wave < 0.7) missing.push('weak wave clear');
      if (sum.peel < 0.7) missing.push('little peel or sustain');
      if (sum.siege < 1.2) missing.push('little turret pressure');
    }
    return { rating: rel, raw: rating, combos: combos.list, comp: comp, curve: { early: early, mid: mid, late: late }, arch: archList, missing: missing, known: known, objKnown: fs.reduce(function (a, f) { return a + (f.objKnown || 0); }, 0), n: fs.length, sums: sum };
  }

  // Lav's matchup table (one analyst, low weight): returns >0 if style A has the edge.
  var COUNTERS = { 'Front-to-back teamfight': { 'Catch and pick-off': -1, 'Protect and late scaling': -1 }, 'Poke and siege': { 'Protect and late scaling': 1, 'Catch and pick-off': 0.5 } };
  function styleEdge(a, b) {
    var x = (COUNTERS[a] && COUNTERS[a][b]) || 0, y = (COUNTERS[b] && COUNTERS[b][a]) || 0;
    return x - y;
  }

  var logit = function (p) { p = Math.min(0.97, Math.max(0.03, p)); return Math.log(p / (1 - p)); };
  var expit = function (z) { return 1 / (1 + Math.exp(-z)); };
  var W = { team: 0.8, hero: 6.0, comp: 0.02, style: 0.12, side: 0.3, temp: 0.4 }; // temp: one shrink factor chosen on 54 games so the model does not overstate (see evalcomp.js)

  // A and B: { profile, base (season win rate), heroEv (mean of shrunk hero win rate minus 0.5) }
  function winProb(A, B, opt) {
    opt = opt || {};
    var parts = {
      team: W.team * (logit(A.base) - logit(B.base)),
      hero: W.hero * (A.heroEv - B.heroEv),
      comp: W.comp * (A.profile.rating - B.profile.rating),
      style: W.style * 100 / 100 * styleEdge(A.profile.arch[0].name, B.profile.arch[0].name),
      side: opt.aBlue === true ? W.side : (opt.aBlue === false ? -W.side : 0)
    };
    if (opt.only) { var z0 = 0; opt.only.forEach(function (k) { z0 += parts[k]; }); return { p: expit(z0), parts: parts }; }
    var z = W.temp * (parts.team + parts.hero + parts.comp + parts.style + parts.side);
    return { p: Math.min(0.65, Math.max(0.35, expit(z))), raw: expit(z), parts: parts };
  }

  var api = { feats: feats, profile: profile, styleEdge: styleEdge, winProb: winProb, W: W, logit: logit, expit: expit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DraftComp = api;
})(typeof window !== 'undefined' ? window : this);
