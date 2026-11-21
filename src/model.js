// Draft ban predictor for BTR vs TLID (MPL ID Season 18).
// Pure functions, no dependencies. Used by build.js (backtest) and by the web page.
// Data meaning (see draft_semantics.md): each team has a list of 5 bans printed under it
// on MLBBHub. Blue side = the team printed first. Ownership of the list is inferred.
(function (root) {
  'use strict';

  var DEFAULTS = { decay: 0.95, sideW: 0.6, h2hW: 1.5, k: 4 };

  // Turn CSV rows (ban rows only) into a chronological list of games.
  function buildGames(rows) {
    var by = {};
    rows.forEach(function (r) {
      if (r.action !== 'ban') return;
      var g = by[r.game_id] || (by[r.game_id] = {
        id: r.game_id, date: r.date, series: r.series, gameNo: +r.game_no || 0,
        stage: r.stage, blue: r.blue_team, red: r.red_team, winner: r.winner || '',
        bans: { blue: [], red: [] }
      });
      g.bans[r.side][(+r.step_no) - 1] = r.hero;
    });
    var out = Object.keys(by).map(function (k) { return by[k]; })
      .filter(function (g) { return g.bans.blue.length === 5 && g.bans.red.length === 5; });
    out.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      var ma = +(a.id.match(/S18-(\d+)/) || [0, 0])[1], mb = +(b.id.match(/S18-(\d+)/) || [0, 0])[1];
      if (ma !== mb) return ma - mb;
      return a.gameNo - b.gameNo;
    });
    return out;
  }

  function teamSide(g, team) { return g.blue === team ? 'blue' : (g.red === team ? 'red' : null); }
  function oppOf(g, team) { return g.blue === team ? g.red : g.blue; }

  // Recency-weighted league frequency of heroes in lists printed on one side (or both if side null).
  function leaguePrior(history, side, firstOnly, halfLife) {
    var n = history.length, tot = 0, p = {};
    history.forEach(function (g, i) {
      var w = Math.pow(0.5, (n - 1 - i) / (halfLife || 30));
      ['blue', 'red'].forEach(function (s) {
        if (side && s !== side) return;
        var list = g.bans[s];
        if (firstOnly) { p[list[0]] = (p[list[0]] || 0) + w; tot += w; }
        else { list.forEach(function (h) { p[h] = (p[h] || 0) + w; }); tot += w; }
      });
    });
    Object.keys(p).forEach(function (h) { p[h] /= (tot || 1); });
    return p;
  }

  // Probability each hero is in `team`'s list (or is its first ban) for a game on `side` vs `opp`.
  // Patch awareness: when the game being predicted is on or after par.patchDate, earlier games count only par.phaseW as much.
  function phaseMult(g, par) {
    if (!par || par.phaseW == null || !par.patchDate || !par.curDate) return 1;
    return (par.curDate >= par.patchDate && g.date < par.patchDate) ? par.phaseW : 1;
  }
  // Day-based patch decay: w(t) = exp(-lambda * t), t = age of the game in days (par.lambda per day, par.curDate = today).
  function dayMult(g, par) {
    if (!par || !par.lambda || !par.curDate || !g.date) return 1;
    var t = (Date.parse(par.curDate) - Date.parse(g.date)) / 86400000;
    return t > 0 ? Math.exp(-par.lambda * t) : 1;
  }
  function teamProbs(history, team, side, opp, par, firstOnly) {
    par = par || DEFAULTS;
    var mine = (par.teamGames || []).concat(history).filter(function (g) { return teamSide(g, team); });
    var prior = leaguePrior(history, side, firstOnly);
    // Playoff-meta prior: blend in how heroes are banned in playoff games of the whole league (par.extra, par.extraBeta).
    var ex = par.extra && par.extraBeta ? (firstOnly ? par.extra.first : par.extra.list) : null;
    if (ex) {
      var b = par.extraBeta, mixed = {}, ks = {};
      Object.keys(prior).forEach(function (h) { ks[h] = 1; }); Object.keys(ex).forEach(function (h) { ks[h] = 1; });
      Object.keys(ks).forEach(function (h) { mixed[h] = (1 - b) * (prior[h] || 0) + b * (ex[h] || 0); });
      prior = mixed;
    }
    var num = {}, den = 0, n = mine.length;
    mine.forEach(function (g, i) {
      var s = teamSide(g, team);
      var w = Math.pow(par.decay, n - 1 - i) * (s === side ? 1 : par.sideW) * (oppOf(g, team) === opp ? par.h2hW : 1) * phaseMult(g, par) * dayMult(g, par);
      var list = g.bans[s];
      if (firstOnly) { num[list[0]] = (num[list[0]] || 0) + w; }
      else { list.forEach(function (h) { num[h] = (num[h] || 0) + w; }); }
      den += w;
    });
    var heroes = {};
    Object.keys(prior).forEach(function (h) { heroes[h] = 1; });
    Object.keys(num).forEach(function (h) { heroes[h] = 1; });
    var out = {};
    Object.keys(heroes).forEach(function (h) {
      out[h] = ((num[h] || 0) + par.k * (prior[h] || 0)) / (den + par.k || 1);
    });
    return out;
  }

  function topN(probs, n) {
    return Object.keys(probs).map(function (h) { return { hero: h, p: probs[h] }; })
      .sort(function (a, b) { return b.p - a.p || (a.hero < b.hero ? -1 : 1); }).slice(0, n);
  }

  // Full prediction for one team in one game.
  function predictTeam(history, team, side, opp, par) {
    var list = teamProbs(history, team, side, opp, par, false);
    var first = teamProbs(history, team, side, opp, par, true);
    var games = history.filter(function (g) { return teamSide(g, team); }).length;
    return { team: team, side: side, opp: opp, gamesUsed: games, bans: topN(list, 8), first: topN(first, 4) };
  }

  // Walk-forward backtest. Predict each BTR/TLID list using only earlier games.
  function backtest(games, teams, par, opts) {
    opts = opts || {};
    var minHist = opts.minHist || 8, items = [];
    games.forEach(function (g, idx) {
      var hist = games.slice(0, idx);
      teams.forEach(function (t) {
        var side = teamSide(g, t);
        if (!side) return;
        var prior = hist.filter(function (h) { return teamSide(h, t); }).length;
        if (prior < minHist) return;
        items.push({ idx: idx, game: g, team: t, side: side, opp: oppOf(g, t), hist: hist });
      });
    });
    return items;
  }

  function score(items, predictFn) {
    var hits = 0, first1 = 0, first3 = 0, n = 0;
    items.forEach(function (it) {
      var actual = it.game.bans[it.side];
      var p = predictFn(it);
      var top5 = topN(p.list, 5).map(function (x) { return x.hero; });
      top5.forEach(function (h) { if (actual.indexOf(h) >= 0) hits++; });
      var f = topN(p.first, 3).map(function (x) { return x.hero; });
      if (f[0] === actual[0]) first1++;
      if (f.indexOf(actual[0]) >= 0) first3++;
      n++;
    });
    return { n: n, hit5: hits / (5 * n), first1: first1 / n, first3: first3 / n };
  }

  // Build the playoff prior from games [{b1:[5 heroes], b2:[5 heroes]}]: share of lists containing each hero, and share of first bans.
  // agg (optional): [{ n: games covered, bans: {hero: games banned} }] season totals from other regions; each counts as `aggW` ban lists.
  function playoffPrior(games, agg, aggW) {
    var list = {}, first = {}, n = 0;
    games.forEach(function (g) {
      [g.b1, g.b2].forEach(function (l) {
        n++; l.forEach(function (h) { list[h] = (list[h] || 0) + 1; }); first[l[0]] = (first[l[0]] || 0) + 1;
      });
    });
    var nFirst = n;
    (agg || []).forEach(function (r) {
      var w = aggW == null ? 40 : aggW; if (!r || !r.n || w <= 0) return;
      Object.keys(r.bans).forEach(function (h) { list[h] = (list[h] || 0) + w * r.bans[h] / (2 * r.n); }); n += w;
    });
    Object.keys(list).forEach(function (h) { list[h] /= (n || 1); }); Object.keys(first).forEach(function (h) { first[h] /= (nFirst || 1); });
    return { list: list, first: first, n: n };
  }

  var api = { DEFAULTS: DEFAULTS, buildGames: buildGames, teamSide: teamSide, oppOf: oppOf,
    playoffPrior: playoffPrior, leaguePrior: leaguePrior, phaseMult: phaseMult, dayMult: dayMult, teamProbs: teamProbs, topN: topN, predictTeam: predictTeam,
    backtest: backtest, score: score };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DraftModel = api;
})(typeof window !== 'undefined' ? window : this);
