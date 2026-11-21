// Bayesian Bradley-Terry team strength with a blue-side bonus, fitted in the browser by a simple random-walk Metropolis sampler.
// Mirrors /home/claude/analysis/s2_strength_series.py. results: [{a, b, win: 'a'|'b', blue: 'a'|'b'|null}]
(function (root) {
  'use strict';
  function rng(seed) { var s = seed >>> 0; return function () { s += 0x6D2B79F5; var t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function fit(results, opt) {
    opt = opt || {}; var iters = opt.iters || 36000, burn = opt.burn || 8000, thin = opt.thin || 10, tau = opt.tau || 1, step = opt.step || 0.12;
    var teams = [], idx = {};
    results.forEach(function (r) { [r.a, r.b].forEach(function (t) { if (!(t in idx)) { idx[t] = teams.length; teams.push(t); } }); });
    var K = teams.length, n = results.length, A = new Int16Array(n), B = new Int16Array(n), Y = new Uint8Array(n), SD = new Int8Array(n);
    results.forEach(function (r, i) { A[i] = idx[r.a]; B[i] = idx[r.b]; Y[i] = r.win === 'a' ? 1 : 0; SD[i] = r.blue === 'a' ? 1 : (r.blue === 'b' ? -1 : 0); });
    var rand = rng(opt.seed || 12345);
    function normal() { var u = 1 - rand(), v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function logpost(th) {
      var ll = 0, h = th[K];
      for (var i = 0; i < n; i++) { var z = th[A[i]] - th[B[i]] + SD[i] * h; ll += (Y[i] ? z : 0) - (z > 0 ? z + Math.log1p(Math.exp(-z)) : Math.log1p(Math.exp(z))); }
      var pr = 0; for (var k = 0; k < K; k++) pr += th[k] * th[k]; return ll - 0.5 * pr / (tau * tau) - 0.5 * h * h;
    }
    var th = new Float64Array(K + 1), lp = logpost(th), draws = [], prop = new Float64Array(K + 1);
    for (var it = 0; it < iters; it++) {
      for (var j = 0; j <= K; j++) prop[j] = th[j] + step * normal();
      var lq = logpost(prop);
      if (Math.log(rand()) < lq - lp) { var t = th; th = prop; prop = t; lp = lq; }
      if (it >= burn && (it - burn) % thin === 0) draws.push(Float64Array.from(th));
    }
    var extra = (opt.teams || []).filter(function (t) { return !(t in idx); });
    if (extra.length) {
      draws = draws.map(function (d) { var e = new Float64Array(K + 1 + extra.length); e.set(d); for (var j = 0; j < extra.length; j++) e[K + 1 + j] = tau * normal(); return e; });
      extra.forEach(function (t, j) { idx[t] = K + 1 + j; });
    }
    return { teams: teams, idx: idx, K: K, n: n, draws: draws, noData: extra };
  }
  function expit(x) { return 1 / (1 + Math.exp(-x)); }
  // chance team a beats team b in one game; blue = 'a' | 'b' | null. extra = extra log-odds toward a (optional)
  function pGame(f, a, b, blue, extra) {
    var ia = f.idx[a], ib = f.idx[b]; if (ia == null || ib == null) return null;
    var s = blue === 'a' ? 1 : (blue === 'b' ? -1 : 0), ex = extra || 0;
    return f.draws.map(function (d) { return expit(d[ia] - d[ib] + s * d[f.K] + ex); });
  }
  function comb(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  // P(a wins series) when a needs na more wins and b needs nb more wins, single game chance p
  function seriesP(p, na, nb) {
    if (na <= 0) return 1; if (nb <= 0) return 0;
    var tot = 0; for (var l = 0; l < nb; l++) tot += comb(na - 1 + l, l) * Math.pow(p, na) * Math.pow(1 - p, l); return tot;
  }
  function summarise(arr) { var s = arr.slice().sort(function (x, y) { return x - y; }), n = s.length, m = 0; s.forEach(function (x) { m += x; }); return { mean: m / n, lo: s[Math.floor(0.025 * (n - 1))], hi: s[Math.floor(0.975 * (n - 1))] }; }
  var api = { fit: fit, pGame: pGame, seriesP: seriesP, summarise: summarise, expit: expit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DraftBT = api;
})(typeof window !== 'undefined' ? window : this);
