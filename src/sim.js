// Draft simulator engine for BTR vs TLID (MPL ID Season 18).
// Depends on DraftModel (model.js) for ban statistics. No other dependencies.
(function (root) {
  'use strict';
  var M = root.DraftModel || (typeof require !== 'undefined' ? require('./model.js') : null);

  // Pro format: 3 bans each, 3 picks each, 2 more bans each, 2 final picks each.
  // First letter = side (b blue, r red), second = action (B ban, P pick). Exact order is an assumption: editable in the app.
  var DEFAULT_ORDER = 'bB rB bB rB bB rB | bP rP rP bP bP rP | rB bB rB bB | rP bP bP rP';
  var LANES = ['EXP', 'Jungle', 'Mid', 'Gold', 'Roam'];

  function parseOrder(str) {
    var steps = [], phase = 0;
    String(str).split(/\s+/).filter(Boolean).forEach(function (tok) {
      if (tok === '|') { phase++; return; }
      var s = tok[0].toLowerCase(), a = tok[1];
      if ((s !== 'b' && s !== 'r') || (a !== 'B' && a !== 'P')) throw new Error('Bad step "' + tok + '". Use bB, rB, bP or rP.');
      steps.push({ side: s === 'b' ? 'blue' : 'red', type: a === 'B' ? 'ban' : 'pick', phase: phase });
    });
    var c = { 'blue-ban': 0, 'red-ban': 0, 'blue-pick': 0, 'red-pick': 0 };
    steps.forEach(function (s) { c[s.side + '-' + s.type]++; });
    if (c['blue-ban'] !== 5 || c['red-ban'] !== 5 || c['blue-pick'] !== 5 || c['red-pick'] !== 5)
      throw new Error('The order needs 5 bans and 5 picks for each side (found blue ' + c['blue-ban'] + '/' + c['blue-pick'] + ', red ' + c['red-ban'] + '/' + c['red-pick'] + ').');
    return steps;
  }

  function newDraft(steps, teams, locked) {
    return { steps: steps, idx: 0, teams: teams, bans: { blue: [], red: [] }, picks: { blue: [], red: [] }, locked: locked || [], hist: [] };
  }
  function done(d) { return d.idx >= d.steps.length; }
  function usedSet(d) {
    var u = {}; d.locked.forEach(function (h) { u[h] = 1; });
    ['blue', 'red'].forEach(function (s) { d.bans[s].forEach(function (h) { u[h] = 1; }); d.picks[s].forEach(function (h) { u[h] = 1; }); });
    return u;
  }
  function apply(d, hero) {
    if (done(d)) return false;
    if (usedSet(d)[hero]) return false;
    var st = d.steps[d.idx];
    (st.type === 'ban' ? d.bans : d.picks)[st.side].push(hero);
    d.hist.push(d.idx); d.idx++;
    return true;
  }
  function undo(d) {
    if (!d.idx) return null;
    d.idx--; var st = d.steps[d.idx];
    return (st.type === 'ban' ? d.bans : d.picks)[st.side].pop();
  }
  function other(side) { return side === 'blue' ? 'red' : 'blue'; }

  // ---------- ban prediction ----------
  // Chance that `hero` sits at list position j for `team` (same weighting as DraftModel.teamProbs).
  function posProbs(history, team, side, opp, par, j) {
    var mine = (par.teamGames || []).concat(history).filter(function (g) { return M.teamSide(g, team); });
    var num = {}, den = 0, n = mine.length;
    mine.forEach(function (g, i) {
      var s = M.teamSide(g, team);
      var w = Math.pow(par.decay, n - 1 - i) * (s === side ? 1 : par.sideW) * (M.oppOf(g, team) === opp ? par.h2hW : 1) * M.phaseMult(g, par) * (M.dayMult ? M.dayMult(g, par) : 1);
      var h = g.bans[s][j]; if (h) num[h] = (num[h] || 0) + w; den += w;
    });
    var out = {}; Object.keys(num).forEach(function (h) { out[h] = num[h] / (den || 1); });
    return out;
  }
  function normalise(list) {
    var t = 0; list.forEach(function (x) { t += x.p; });
    list.forEach(function (x) { x.p = t > 0 ? x.p / t : 0; });
    return list;
  }
  // ---------- reasons (drafter's view) ----------
  // Each reason: { k: kind, t: short text, s: strength 0..1 }. Only the strongest two are kept. These explain the odds; they do not add to them.
  function topPlayer(item) { var best = null; ((item && item.pool) || []).forEach(function (r) { if (!best || r.games > best.games) best = r; }); return best; }
  function pc0(x) { return Math.round(x * 100) + '%'; }
  function banReasons(h, o) {
    var rs = [], oi = o.oppItem[h], pl = topPlayer(oi), lg = o.lg;
    if (oi && pl && oi.rate >= 0.1 && pl.games >= 3) rs.push({ k: 'target', t: pl.player + ' plays it (' + pl.games + ' games, ' + Math.round(100 * pl.wins / pl.games) + '% WR)', s: Math.min(1, oi.rate / 0.25) * 0.9 });
    var L = oi && oi.league; if (L && L.bans) { var share = L.bans / lg; if (share >= 0.15) rs.push({ k: 'meta', t: 'banned in ' + pc0(share) + ' of league games', s: Math.min(1, share / 0.6) * 0.8 }); }
    if (o.overall[h] >= 0.2) rs.push({ k: 'habit', t: o.team + ' bans it in ' + pc0(o.overall[h]) + ' of its lists' + (o.pos[h] > 0.25 ? ', often as ban #' + (o.j + 1) : ''), s: Math.min(1, o.overall[h] / 0.4) });
    if (o.ex && o.ex[h] >= 0.25) rs.push({ k: 'playoff', t: 'in ' + pc0(o.ex[h]) + ' of playoff ban lists', s: Math.min(1, o.ex[h] / 0.5) * 0.7 });
    var pr = (o.why || []).filter(function (t) { return /^counters /.test(t); })[0]; if (pr) rs.push({ k: 'protect', t: pr.replace('counters your ', 'it counters your ').replace(/^counters /, 'it counters '), s: 0.8 });
    var dn = (o.why || []).filter(function (t) { return /^pairs with their/.test(t); })[0]; if (dn) rs.push({ k: 'deny', t: dn.replace('pairs with their', 'partner of their'), s: 0.6 });
    rs.sort(function (a, b) { return b.s - a.s; }); return rs.slice(0, 2);
  }
  function pickReasons(x, o) {
    var rs = [], pl = topPlayer(x);
    if (pl && pl.games >= 3) rs.push({ k: 'signature', t: pl.player + ' plays it (' + pl.games + ' games, ' + Math.round(100 * pl.wins / pl.games) + '% WR)', s: Math.min(1, pl.games / 10) * 0.9 });
    var L = x.league; if (L && L.picks) { var r = L.picks / (2 * o.lg); if (r >= 0.1) rs.push({ k: 'meta', t: 'picked in ' + pc0(r) + ' of league teams' + (L.winRate ? ', ' + L.winRate + '% WR' : ''), s: Math.min(1, r / 0.25) * 0.6 }); }
    var c = (o.why || []).filter(function (t) { return /^counters /.test(t) && !/open\)/.test(t); })[0]; if (c) rs.push({ k: 'counter', t: c.replace('counters', 'counter-pick vs'), s: 0.85 });
    var co = (o.why || []).filter(function (t) { return /^counters .*open\)/.test(t); })[0]; if (co && !c) rs.push({ k: 'counter', t: co.replace('counters', 'answers').replace(' (still open)', ' if it stays open'), s: 0.5 });
    var sy = (o.why || []).filter(function (t) { return /^pairs with /.test(t); })[0]; if (sy) rs.push({ k: 'combo', t: sy.replace('pairs with', 'combo with'), s: 0.6 });
    if (o.up > 0.005 && o.upFrom.length) rs.push({ k: 'replace', t: 'replaces banned ' + o.upFrom.slice(0, 2).join(', '), s: Math.min(1, o.up / 0.05) * 0.8 });
    if (o.oppRate > 0.15) rs.push({ k: 'deny', t: 'denies ' + o.opp + ' (' + pc0(o.oppRate) + ' of their games)', s: Math.min(1, o.oppRate / 0.5) * 0.7 });
    var ln = o.lanes; if (ln && ln.length >= 2 && o.m < 3) rs.push({ k: 'flex', t: 'flex: fits ' + ln.slice(0, 3).join('/') + ', hides the lane', s: 0.4 });
    rs.sort(function (a, b) { return b.s - a.s; }); return rs.slice(0, 2);
  }

  // Previous game of this same series (same two teams, same date): which bans did `team` use, and did it win?
  // ctx.habit = { repeatWin, repeatLoss } are the log-boosts for repeating those bans. Off when ctx.habit is missing.
  function repeatInfo(ctx, team, opp, side) {
    var hb = ctx.habit, par = ctx.par; if (!hb || !par || !par.curDate) return null;
    var hist = ctx.history || [];
    for (var i = hist.length - 1; i >= 0; i--) {
      var g = hist[i]; if (g.date !== par.curDate) { if (g.date < par.curDate) break; continue; }
      var s = M.teamSide(g, team); if (!s || M.oppOf(g, team) !== opp) continue;
      var won = g.winner === team, w = won ? hb.repeatWin : hb.repeatLoss; if (!w) return null;
      var set = {}; (g.bans[s] || []).forEach(function (h) { set[h] = 1; });
      return { set: set, w: w, won: won };
    }
    return null;
  }
  // Hot-hero habit (unvalidated): ctx.habit.hot = { team: { strength, heroes: [..] } }. Returns { hero: log-boost } for that team, scaled by `scale`.
  function hotFor(ctx, team, scale) {
    var out = {}, hb = ctx.habit, h = hb && hb.hot && hb.hot[team]; if (!h || !h.strength) return out;
    (h.heroes || []).forEach(function (x) { out[x] = h.strength * scale; }); return out;
  }
  function predictBan(d, ctx) {
    var st = d.steps[d.idx], side = st.side, team = d.teams[side], opp = d.teams[other(side)];
    var j = d.bans[side].length, par = ctx.par, used = usedSet(d);
    var overall = M.teamProbs(ctx.history, team, side, opp, par, false);
    var pos = posProbs(ctx.history, team, side, opp, par, j);
    var tO = 0, tP = 0; Object.keys(overall).forEach(function (h) { if (!used[h]) tO += overall[h]; });
    Object.keys(pos).forEach(function (h) { if (!used[h]) tP += pos[h]; });
    var wp = ctx.posWeight == null ? 0.35 : ctx.posWeight;
    var oppItem = {}; ((ctx.hier && ctx.hier[opp]) || []).forEach(function (x) { oppItem[x.hero] = x; });
    var lgG = ctx.nLeagueGames || 200, exL = par.extra && par.extraBeta ? par.extra.list : null;
    var list = [], noLane = [];
    var rep = repeatInfo(ctx, team, opp, side), hotOpp = hotFor(ctx, opp, 0.6);
    var oppSets = d.picks[other(side)].map(function (x) { return lanesOf(ctx, x); });
    var R = ctx.R, mw = ctx.matchW == null ? 1 : ctx.matchW, mineP = d.picks[side], theirP = d.picks[other(side)], myMap = {};
    if (R && mw > 0 && ctx.hier && ctx.hier[team]) ctx.hier[team].forEach(function (x) { myMap[x.hero] = x.rate; });
    if (R && mw > 0) { Object.keys(R.counter).concat(Object.keys(R.syn)).forEach(function (h) { if (!(h in overall) && !used[h]) overall[h] = 0.004; }); }
    Object.keys(overall).forEach(function (h) {
      if (used[h]) return;
      var a = tO ? overall[h] / tO : 0, b = tP ? (pos[h] || 0) / tP : 0;
      var p = (1 - wp) * a + wp * b;
      var why = [], mu = 0;
      if (R && mw > 0) { mu = clampMu(MU_GAMMA_BAN * mw * banMatchup(h, mineP, theirP, myMap, R, why)); p *= Math.exp(mu); }
      // Drafter habit: lean towards the five bans this team used in the previous game of the same series (stronger after a win).
      if (hotOpp[h]) { p *= Math.exp(hotOpp[h]); why.push(opp + ' is hot on it'); }
      if (rep && rep.set[h]) { p *= Math.exp(rep.w); why.push('banned last game' + (rep.won ? ' (won it)' : ' (lost it)')); }
      // A ban only makes sense if the other team could still play the hero: skip heroes with no free lane left on their side.
      if (theirP.length && ctx.laneCheck !== false && !canFill(oppSets.concat([lanesOf(ctx, h)]))) { noLane.push(h); return; }
      if (pos[h] > 0.15) why.push('often ' + team + '\'s ban #' + (j + 1));
      if (overall[h] > 0.3) why.push('in ' + Math.round(overall[h] * 100) + '% of ' + team + ' lists');
      list.push({ hero: h, p: p, mu: mu, why: why, reasons: banReasons(h, { oppItem: oppItem, lg: lgG, overall: overall, pos: pos, j: j, team: team, ex: exL, why: why }) });
    });
    list.sort(function (x, y) { return y.p - x.p; });
    list = normalise(list); list.noLane = noLane;
    return list;
  }

  // ---------- picks: lane feasibility ----------
  function lanesOf(ctx, hero) { var r = ctx.roles && ctx.roles[hero]; return r && r.lanes && r.lanes.length ? r.lanes : null; }
  // Can these heroes (each with a set of possible lanes; null = unknown) fill distinct lanes?
  function canFill(sets) {
    var taken = {};
    function go(i) {
      if (i === sets.length) return true;
      var s = sets[i] || LANES;
      for (var k = 0; k < s.length; k++) {
        var l = s[k]; if (taken[l]) continue;
        taken[l] = 1; if (go(i + 1)) { delete taken[l]; return true; } delete taken[l];
      }
      return false;
    }
    return go(0);
  }

  // ---------- hierarchy ----------
  // data: { league: {hero:{picks,bans,winRate}}, nLeagueGames, pools: [{team,player,lane,hero,games,wins}], teamGames:{team:N} }
  // live: { observed: {team:{hero:count}}, games: {team:count}, adjust: {team:{hero:mult}} }
  function buildHierarchy(team, data, live, heroes) {
    live = live || { observed: {}, games: {}, adjust: {} };
    var K = 10, N = (data.teamGames && data.teamGames[team]) || 0;
    var counts = {}, byHero = {};
    (data.pools || []).forEach(function (r) {
      if (r.team !== team) return;
      counts[r.hero] = (counts[r.hero] || 0) + (+r.games || 0);
      (byHero[r.hero] = byHero[r.hero] || []).push({ player: r.player, lane: r.lane, games: +r.games || 0, wins: +r.wins || 0 });
    });
    var obs = (live.observed && live.observed[team]) || {}, og = (live.games && live.games[team]) || 0;
    var adj = (live.adjust && live.adjust[team]) || {};
    var lg = data.nLeagueGames || 1, out = [];
    heroes.forEach(function (h) {
      var L = data.league && data.league[h];
      var pi = L && L.picks ? L.picks / (2 * lg) : 0; // chance the hero is in a given team's five
      var c = (counts[h] || 0) + (obs[h] || 0);
      var rate = (c + K * pi) / (N + og + K);
      var m = adj[h] || 1;
      out.push({ hero: h, rate: rate * m, rawRate: rate, adj: m, games: N + og, pool: byHero[h] || [], teamPicks: counts[h] || 0, live: obs[h] || 0,
        league: L || null });
    });
    out.sort(function (a, b) { return b.rate - a.rate; });
    out.forEach(function (x, i) { x.rank = i + 1; x.tier = i < 6 ? 'S' : i < 16 ? 'A' : i < 30 ? 'B' : 'C'; });
    return out;
  }



  // ---------- matchup rules (counters and synergies) ----------
  // rules: [{t:'counter', a, b, s, off?}] means a counters b; [{t:'syn', a, b, s}] means a and b work well together (both ways). s = 1 minor, 2 solid, 3 hard.
  // mobility: {hero: {dash: n, punishes: bool}}: heroes that punish dashes become counters of heroes with 2+ dashes.
  function buildRules(rules, mobility) {
    var R = { counter: {}, counteredBy: {}, syn: {}, list: [] };
    function addC(a, b, s, src) { (R.counter[a] = R.counter[a] || {})[b] = Math.max(s, (R.counter[a] || {})[b] || 0); (R.counteredBy[b] = R.counteredBy[b] || {})[a] = Math.max(s, (R.counteredBy[b] || {})[a] || 0); }
    function addS(a, b, s) { (R.syn[a] = R.syn[a] || {})[b] = Math.max(s, (R.syn[a] || {})[b] || 0); (R.syn[b] = R.syn[b] || {})[a] = Math.max(s, (R.syn[b] || {})[a] || 0); }
    (rules || []).forEach(function (r) { if (r.off || !r.a || !r.b || !(r.s > 0)) return; if (r.t === 'syn') addS(r.a, r.b, r.s); else addC(r.a, r.b, r.s); R.list.push(r); });
    if (mobility) Object.keys(mobility).forEach(function (p) {
      if (!mobility[p].punishes) return;
      Object.keys(mobility).forEach(function (h) { var m = mobility[h]; if (h === p || !(m.dash >= 2)) return; var s = m.dash >= 3 ? 2 : 1; if (!(R.counter[p] && R.counter[p][h])) { addC(p, h, s); R.list.push({ t: 'counter', a: p, b: h, s: s, derived: true, why: p + ' punishes dashes; ' + h + ' has ' + m.dash }); } });
    });
    return R;
  }
  var COUNTER_ADD = 0.012, MU_GAMMA = 0.30, MU_GAMMA_BAN = 0.25, MU_CAP = 1.6;
  function clampMu(x) { return Math.max(-MU_CAP, Math.min(MU_CAP, x)); }
  // Picking x for `mine` against `theirs`. oppMap = chance each hero is in the opponent's five. goneSet = banned or picked.
  function pickMatchup(x, mine, theirs, goneSet, thr, R, oppLeft, why) {
    var sum = 0, direct = 0;
    mine.forEach(function (m) { var s = R.syn[m] && R.syn[m][x]; if (s) { sum += s; why.push('pairs with ' + m); } });
    theirs.forEach(function (q) {
      var s1 = R.counter[x] && R.counter[x][q]; if (s1) { sum += s1; direct += s1; why.push('counters ' + q); }
      var s2 = R.counter[q] && R.counter[q][x]; if (s2) { sum -= s2; why.push('weak vs ' + q); }
    });
    var ant = Math.min(1, oppLeft / 3), antSum = 0;
    if (ant > 0) {
      Object.keys(R.counter[x] || {}).forEach(function (b) { if (goneSet[b]) return; var w = Math.min(1, thr(b) / 0.3); if (w > 0.25) { antSum += R.counter[x][b] * 0.5 * w * ant; why.push('counters ' + b + ' (still open)'); } });
      Object.keys(R.counteredBy[x] || {}).forEach(function (c) { if (goneSet[c]) return; var w = Math.min(1, thr(c) / 0.3); if (w > 0.25) { antSum -= R.counteredBy[x][c] * 0.35 * w * ant; why.push(c + ' (open) counters it'); } });
    }
    sum += Math.max(-1.5, Math.min(1.5, antSum));   // many open heroes can not pile up without limit
    return { sum: sum, direct: direct };
  }
  // Banning c for a team that has `mine` picked, `theirs` is the opponent's picks; myMap = chance each hero is in my five.
  function banMatchup(c, mine, theirs, myMap, R, why) {
    var sum = 0;
    mine.forEach(function (m) { var s = R.counter[c] && R.counter[c][m]; if (s) { sum += s; why.push('counters your ' + m); } });
    Object.keys(R.counter[c] || {}).forEach(function (h) { if (mine.indexOf(h) >= 0) return; var w = Math.min(1, (myMap[h] || 0) / 0.3); if (w > 0.25) { sum += R.counter[c][h] * 0.5 * w; why.push('counters ' + h); } });
    theirs.forEach(function (q) { var s = R.syn[q] && R.syn[q][c]; if (s) { sum += s * 0.6; why.push('pairs with their ' + q); } });
    return sum;
  }

  // ---------- ban effect on picks ----------
  // When a hero is gone (banned or locked), the team still needs someone in that slot. Part of that hero's pick chance
  // moves to (1) the other heroes the same player has played and (2) heroes that share its lane.
  // hier: list from buildHierarchy. gone: heroes that cannot be picked. Returns { add: {hero: amount}, from: {hero: [banned heroes feeding it]} }.
  var LANE_W = 0.35;
  function banShift(hier, gone, ctx, strength) {
    var out = { add: {}, from: {} };
    if (!strength || !gone || !gone.length) return out;
    var goneSet = {}; gone.forEach(function (h) { goneSet[h] = 1; });
    var byHero = {}, byPlayer = {};
    hier.forEach(function (x) {
      byHero[x.hero] = x;
      (x.pool || []).forEach(function (r) { (byPlayer[r.player] = byPlayer[r.player] || []).push({ hero: x.hero, games: r.games }); });
    });
    gone.forEach(function (b) {
      var hb = byHero[b]; if (!hb || !(hb.rate > 0.01)) return;
      var mass = hb.rate * strength, score = {};
      // players who use b: their other heroes, weighted by games
      var tg = 0; (hb.pool || []).forEach(function (r) { tg += r.games; });
      (hb.pool || []).forEach(function (r) {
        var others = (byPlayer[r.player] || []).filter(function (o) { return o.hero !== b && !goneSet[o.hero]; });
        var tot = 0; others.forEach(function (o) { tot += o.games; });
        if (!tot) return;
        others.forEach(function (o) { score[o.hero] = (score[o.hero] || 0) + (tg ? r.games / tg : 1) * (o.games / tot); });
      });
      // heroes sharing a lane with b
      var bl = lanesOf(ctx, b);
      if (!bl && hb.pool && hb.pool.length) bl = hb.pool.map(function (r) { return String(r.lane || '').replace(/^./, function (c) { return c.toUpperCase(); }); }).filter(Boolean);
      if (bl) {
        var mates = [], tr = 0;
        hier.forEach(function (x) {
          if (x.hero === b || goneSet[x.hero]) return;
          var xl = lanesOf(ctx, x.hero); if (!xl) return;
          if (xl.some(function (l) { return bl.indexOf(l) >= 0; })) { mates.push(x); tr += x.rawRate; }
        });
        mates.forEach(function (x) { score[x.hero] = (score[x.hero] || 0) + LANE_W * (x.rawRate / (tr || 1)); });
      }
      var ts = 0; Object.keys(score).forEach(function (h) { ts += score[h]; });
      if (!ts) return;
      Object.keys(score).forEach(function (h) {
        out.add[h] = (out.add[h] || 0) + mass * score[h] / ts;
        (out.from[h] = out.from[h] || []).push(b);
      });
    });
    return out;
  }

  // ---------- pick prediction ----------
  function predictPick(d, ctx) {
    var st = d.steps[d.idx], side = st.side, team = d.teams[side], opp = d.teams[other(side)];
    var used = usedSet(d), mine = d.picks[side], m = mine.length;
    var hier = ctx.hier[team], oppHier = ctx.hier[opp], oppMap = {};
    oppHier.forEach(function (x) { oppMap[x.hero] = x.rate; });
    var picked = mine.map(function (h) { return lanesOf(ctx, h); });
    var den = ctx.denial == null ? 0.5 : ctx.denial;
    var list = [];
    var gone = d.bans.blue.concat(d.bans.red, d.locked || []);
    var shift = banShift(hier, gone, ctx, ctx.banShift == null ? 0.7 : ctx.banShift);
    var hotMine = hotFor(ctx, team, 1);
    var R = ctx.R, mw = ctx.matchW == null ? 1 : ctx.matchW, theirs = d.picks[other(side)], oppLeft = 5 - theirs.length;
    var thr = function (h) { return Math.max(oppMap[h] || 0, 0.6 * ((ctx.contest && ctx.contest[h]) || 0)); };
    hier.forEach(function (x) {
      if (used[x.hero]) return;
      var why = [];
      var feas = canFill(picked.concat([lanesOf(ctx, x.hero)]));
      var p = x.rate + (shift.add[x.hero] || 0);
      var mu = 0;
      if (R && mw > 0) {
        var pm = pickMatchup(x.hero, mine, theirs, used, thr, R, oppLeft, why);
        mu = clampMu(MU_GAMMA * mw * pm.sum); p *= Math.exp(mu);
        // A direct counter-pick is a reason to leave the usual pool, so it also adds a little chance of its own (less if the team has never shown the hero).
        if (pm.direct > 0) p += COUNTER_ADD * mw * pm.direct * (x.teamPicks > 0 ? 1 : (x.league && x.league.picks ? 0.5 : 0.25));
      }
      if (shift.add[x.hero] > 0.005) { var fr = shift.from[x.hero]; why.push('up: ' + fr.slice(0, 2).join(', ') + ' gone'); }
      if (hotMine[x.hero]) { p *= Math.exp(hotMine[x.hero]); why.push('hot hero for ' + team); }
      if (!feas) { p *= 0.05; why.push('lane already covered'); }
      var early = m < 3 ? 1 : 0.4;
      var oppRate = oppMap[x.hero] || 0;
      if (oppRate > 0.15) { p *= 1 + den * early * Math.min(1, oppRate / 0.5); why.push('denies ' + opp + ' (rank ' + (oppHier.filter(function (z) { return z.rate > oppRate; }).length + 1) + ')'); }
      if (x.teamPicks > 0) why.push(team + ' picks: ' + x.teamPicks); else if (x.league) why.push('league pick rate');
      if (x.live) why.push('seen ' + x.live + 'x in your log');
      var fl = lanesOf(ctx, x.hero);
      list.push({ hero: x.hero, p: p, mu: mu, why: why, rank: x.rank, tier: x.tier, up: shift.add[x.hero] || 0, upFrom: shift.from[x.hero] || [], reasons: pickReasons(x, { lg: ctx.nLeagueGames || 200, why: why, up: shift.add[x.hero] || 0, upFrom: shift.from[x.hero] || [], oppRate: oppRate, opp: opp, lanes: fl, m: m }) });
    });
    list.sort(function (a, b) { return b.p - a.p; });
    return normalise(list);
  }

  function predictNext(d, ctx) {
    if (done(d)) return null;
    return d.steps[d.idx].type === 'ban' ? predictBan(d, ctx) : predictPick(d, ctx);
  }

  var api = { DEFAULT_ORDER: DEFAULT_ORDER, LANES: LANES, parseOrder: parseOrder, newDraft: newDraft, done: done, usedSet: usedSet, apply: apply, undo: undo,
    predictBan: predictBan, predictPick: predictPick, predictNext: predictNext, buildHierarchy: buildHierarchy, banShift: banShift, buildRules: buildRules, canFill: canFill, other: other };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DraftSim = api;
})(typeof window !== 'undefined' ? window : this);
