// Assemble index.html for the draft simulator. Run: node build.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.DraftModel = require(path.join(ROOT, 'src/model.js'));
const M = global.DraftModel;
const N = ROOT + '/data/research/btr_tlid/';
const R = ROOT + '/data/research/simulator/';

function parseCSV(t) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const h = rows.shift();
  return rows.filter(r => r.length === h.length).map(r => Object.fromEntries(h.map((k, i) => [k, r[i].trim()])));
}
const read = p => fs.existsSync(p) ? parseCSV(fs.readFileSync(p, 'utf8')) : [];

// Ban history
const ALL = JSON.parse(fs.readFileSync(ROOT + '/data/allteams.json', 'utf8'));
const games = ALL.games;
// League hero table and player pools
const stats = read(R + 'hero_stats_id_s18.csv').filter(r => r.hero);
const pools = ALL.pools;
const league = {}; let totalPicks = 0;
stats.forEach(r => { league[r.hero] = { picks: +r.picks || 0, bans: r.bans === '' ? null : +r.bans, winRate: r.win_rate === '' ? null : +r.win_rate }; totalPicks += +r.picks || 0; });
const nLeagueGames = Math.round(totalPicks / 10);
// Team games = largest per-player game total in the pools
const perPlayer = {};
pools.forEach(r => { const k = r.team + '|' + r.player; perPlayer[k] = (perPlayer[k] || 0) + (+r.games || 0); });
const teamGames = {};
Object.keys(perPlayer).forEach(k => { const t = k.split('|')[0]; teamGames[t] = Math.max(teamGames[t] || 0, perPlayer[k]); });

// Hero roles
const roleRows = read(R + 'hero_roles.csv');
const heroes = [];
const seen = new Set();
roleRows.forEach(r => {
  if (!r.hero || seen.has(r.hero)) return; seen.add(r.hero);
  const unknown = /UNKNOWN/i.test(r.lanes) || !r.lanes;
  const low = /low/i.test(r.confidence);
  const all = unknown ? [] : r.lanes.split('|').map(x => x.replace('?', '').trim()).filter(Boolean);
  const lanes = low ? [] : all;            // only confirmed lanes drive the lane check
  heroes.push({ n: r.hero, role: /UNKNOWN/i.test(r.role) ? '' : r.role, lanes, guess: low ? all : [], conf: r.confidence });
});
// Any hero seen in data but missing from the roles table still has to be pickable
const extra = new Set();
games.forEach(g => ['blue', 'red'].forEach(s => g.bans[s].forEach(h => extra.add(h))));
Object.keys(league).forEach(h => extra.add(h));
pools.forEach(r => extra.add(r.hero));
extra.forEach(h => { if (!seen.has(h)) { seen.add(h); heroes.push({ n: h, role: '', lanes: [], guess: [], conf: 'none' }); } });
heroes.sort((a, b) => a.n.localeCompare(b.n));

// Composition traits, team records, game lengths, composition test results
const traits = {};
read(R + 'hero_traits.csv').forEach(r => {
  if (!r.hero) return; const u = v => (/UNKNOWN/i.test(v || '') ? '' : (v || ''));
  traits[r.hero] = { tags: u(r.specialty_tags) ? r.specialty_tags.split('|').map(x => x.trim()) : [], dmg: u(r.damage_type), spike: u(r.power_spike), front: u(r.frontline), cc: u(r.hard_cc), engage: u(r.engage), dps: u(r.sustained_dps), wave: u(r.waveclear_push), conf: r.confidence };
});
read(ROOT + '/data/research/patch/hero_objective_traits.csv').forEach(r => { if (!r.hero) return; const num = v => (/^[0-3]$/.test((v || '').trim()) ? (v || '').trim() : ''); const t = traits[r.hero] || (traits[r.hero] = { tags: [], dmg: '', spike: '', front: '', cc: '', engage: '', dps: '', wave: '', conf: '' }); t.siege = num(r.turret_push); t.obj = num(r.early_objective); });
const per = {}; pools.forEach(r => { const k = r.team + '|' + r.player; const o = per[k] || (per[k] = { g: 0, w: 0 }); o.g += +r.games; o.w += +r.wins; });
const teamRec = {}; Object.keys(per).forEach(k => { const t = k.split('|')[0], o = teamRec[t] || (teamRec[t] = { g: 0, w: 0 }); if (per[k].g > o.g) { o.g = per[k].g; o.w = per[k].w; } });
const base = {}; Object.keys(teamRec).forEach(t => { base[t] = (teamRec[t].w + 5) / (teamRec[t].g + 10); });
const sb = read(R + 'game_scoreboards.csv'), lenBy = {}, seen2 = {};
sb.forEach(r => { const k = r.match_id + '-' + r.game_no + '-' + r.team; if (seen2[k]) return; seen2[k] = 1; const p = r.duration.split(':'); const sec = (+p[0]) * 60 + (+p[1] || 0); (lenBy[r.team] = lenBy[r.team] || []).push(sec); });
const avgLen = {}; Object.keys(ALL.rec).forEach(t => { const a = lenBy[t] || []; avgLen[t] = a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null; });
let evalcomp = null; try { evalcomp = JSON.parse(fs.readFileSync(ROOT + '/data/results/evalcomp_results.json', 'utf8')); } catch (e) {}
const bt = JSON.parse(fs.readFileSync(ROOT + '/data/results/backtest_results.json', 'utf8'));
const bantest = JSON.parse(fs.readFileSync(ROOT + '/data/results/bantest_results.json', 'utf8'));
let picktest = null; try { picktest = JSON.parse(fs.readFileSync(ROOT + '/data/results/picktest_results.json', 'utf8')); } catch (e) {}
let shifttest = null; try { const a = JSON.parse(fs.readFileSync(ROOT + '/data/results/shifttest_results.json', 'utf8')); shifttest = { n: a[0].n, off: a.find(x => x.strength === 0), on: a.find(x => x.strength === 0.7) }; } catch (e) {}
const BA = JSON.parse(fs.readFileSync(ROOT + '/data/results/bantest_all_results.json', 'utf8'));
const oos = JSON.parse(fs.readFileSync(ROOT + '/data/results/bantest_oos.json', 'utf8'));

// Matchup rules: your own examples first, then the researched table (if present). Dash heroes come from hero_mobility.csv.
const K = ROOT + '/data/research/patch/';
const userRules = [
  { t: 'syn', a: 'Gloo', b: 'Alice', s: 2, why: 'Gloo picked makes Alice a viable or priority pick', src: 'your examples', conf: 'user' },
  { t: 'counter', a: 'Esmeralda', b: 'Paquito', s: 2, why: 'Esmeralda is a good counter to Paquito', src: 'your examples', conf: 'user' },
  { t: 'counter', a: 'Dyrroth', b: 'Esmeralda', s: 3, why: 'Dyrroth is a very good counter to Esmeralda', src: 'your examples', conf: 'user' },
  { t: 'counter', a: 'Freya', b: 'Esmeralda', s: 2, why: 'Esmeralda left open makes Freya likely (read as Freya answering Esmeralda)', src: 'your examples', conf: 'user' }
];
const seenR = new Set(); const rules = [];
const dataRules = read(K + 'matchup_rules.csv').filter(r => r.hero_a && r.hero_b && /^(counter|synergy)$/.test(r.type)).map(r => {
  const t = r.type === 'synergy' ? 'syn' : 'counter', conf = (r.confidence || '').toLowerCase(), hasSrc = !!(r.source_url || '').trim();
  return { t, a: r.hero_a, b: r.hero_b, s: t === 'syn' ? 1 : Math.max(1, Math.min(3, +r.strength || 1)), why: r.reason, src: (r.source_url || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || 'no source', conf,
    defaultOff: t === 'syn' ? !hasSrc : conf === 'low' };
});
const userKeys = new Set(userRules.map(r => r.t + '|' + r.a + '|' + r.b));
userRules.concat(dataRules).forEach(r => {
  const k = r.t + '|' + r.a + '|' + r.b; if (seenR.has(k)) return;
  // your direction wins when the researched table says the opposite
  if (r.t === 'counter' && !userKeys.has(k) && userKeys.has('counter|' + r.b + '|' + r.a)) return;
  seenR.add(k); rules.push(r);
});
const mobility = {}; read(K + 'hero_mobility.csv').forEach(r => { if (r.hero) mobility[r.hero] = { dash: parseInt(r.dash_count, 10) || 0, punishes: /^yes$/i.test(r.punishes_dash || '') }; });
mobility.Phoveus = Object.assign({ dash: 0 }, mobility.Phoveus, { punishes: true });
let patch = { date: '2026-11-04', phaseW: 0.35, note: 'provisional: playoffs start' }; try { patch = JSON.parse(fs.readFileSync(ROOT + '/data/patch.json', 'utf8')); } catch (e) {}
console.log('rules', rules.length, '(default off:', rules.filter(r => r.defaultOff).length + ')', '| mobility', Object.keys(mobility).length, '| patch', JSON.stringify(patch));
const PO = JSON.parse(fs.readFileSync(ROOT + '/data/playoff_bans.json', 'utf8')); PO.id = ALL.playoffId;
const TEAMNAMES = { TLID: 'Team Liquid Indonesia', BTR: 'Bigetron by Vitality', AE: 'Alter Ego', NAVI: 'Natus Vincere', ONIC: 'ONIC Esports', EVOS: 'EVOS Esports', RRQ: 'RRQ Hoshi', GEEK: 'Geek Fam ID', DEWA: 'Dewa United Esports' };
const teamList = Object.keys(ALL.rec).sort((a, b) => (ALL.rec[b].w / (ALL.rec[b].w + ALL.rec[b].l)) - (ALL.rec[a].w / (ALL.rec[a].w + ALL.rec[a].l))).map(c => ({ code: c, name: TEAMNAMES[c] || c, w: ALL.rec[c].w, l: ALL.rec[c].l }));
const M8 = [['RORA', 'Aurora Gaming PH', 'MPL PH champion'], ['FLCP', 'Team Falcons PH', 'MPL PH runner-up'], ['SRG', 'Selangor Red Giants', 'MPL MY'], ['REY', 'Team Rey', 'MPL MY'], ['FLCM', 'Team Falcons', 'MPL MENA'], ['AUR', 'Aurora Gaming', 'Turkiye'], ['TS', 'Team Spirit', 'EECA'], ['MGLZ', 'The MongolZ', 'Mongolia'],
  ['LEON', 'Leon Esports', 'Wild Card, Thailand'], ['DFYG', 'DianFengYaoGuai', 'Wild Card, China'], ['GZG', 'Guangzhou Gaming', 'Wild Card, China'], ['AURV', 'Aurevia Team', 'Wild Card, EECA'], ['YNDX', 'Team Yandex', 'Wild Card, EECA'], ['FUT', 'FUT Esports', 'Wild Card, Turkiye'], ['TEC', 'Titan Esports Club', 'Wild Card, MENA']];
teamList.forEach(t => { t.m8 = t.code === 'BTR' || t.code === 'NAVI'; });
M8.forEach(m => teamList.push({ code: m[0], name: m[1], w: null, l: null, m8: true, note: m[2] }));
// PH playoff ban lists as team history for the two PH teams at M8 (other PH teams are renamed so they never mix with ID teams)
const PHCODE = { FLCN: 'FLCP', RORA: 'RORA' };
const phGames = PO.ph.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).map((g, i) => ({ id: 'PH-' + i, date: g.date, blue: PHCODE[g.t1] || 'PH-' + g.t1, red: PHCODE[g.t2] || 'PH-' + g.t2, winner: PHCODE[g.winner] || 'PH-' + g.winner, bans: { blue: g.b1, red: g.b2 } }));
// MPL Malaysia S18 drafts (read from mlbbhub.com/mpl/my/drafts). Team Rey = TR, Selangor Red Giants = SRG are the two M8 teams; the other MY teams get a MY- prefix so they never mix with ID/PH teams.
const MYCODE = { SRG: 'SRG', TR: 'REY' }, myCode = c => MYCODE[c] || 'MY-' + c;
const myRaw = fs.readFileSync(ROOT + '/data/my_all.txt', 'utf8').split('\n').filter(l => l && l[0] !== '#').map((l, i) => { const r = l.split('|'); return { i, date: r[0], t1: r[1], b1: r[2].split(','), t2: r[3], b2: r[4].split(','), winner: r[5] }; })
  .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.i - b.i));
PO.my = myRaw.filter(g => g.date >= '2026-10-28').map(g => ({ date: g.date, t1: g.t1, b1: g.b1, t2: g.t2, b2: g.b2, winner: g.winner }));   // playoffs: best-of-5/7 series start 28 Oct
const myReg = myRaw.filter(g => g.date < '2026-10-28');
const myGames = myRaw.map((g, i) => ({ id: 'MY-' + i, date: g.date, blue: myCode(g.t1), red: myCode(g.t2), winner: myCode(g.winner), bans: { blue: g.b1, red: g.b2 } }));
const regionGames = phGames.concat(myGames).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
const rd = f => { try { return JSON.parse(fs.readFileSync(ROOT + '/data/results/' + f, 'utf8')); } catch (e) { return null; } };
let regression = null; try { regression = JSON.parse(fs.readFileSync(ROOT + '/data/results/regression_results.json', 'utf8')); } catch (e) {}
let daytest = null; try { daytest = JSON.parse(fs.readFileSync(ROOT + '/data/results/daytest_results.json', 'utf8')); } catch (e) {}
const POT = JSON.parse(fs.readFileSync(ROOT + '/data/results/playofftest_results.json', 'utf8'));
const shareOf = (lists) => { const c = {}; lists.forEach(l => l.forEach(h => { c[h] = (c[h] || 0) + 1; })); return h => (lists.length ? (c[h] || 0) / lists.length : 0); };
const regLists = []; games.filter(g => !/^Playoffs/.test(g.stage || '')).forEach(g => { regLists.push(g.bans.blue); regLists.push(g.bans.red); });
const idLists = []; PO.id.forEach(g => { idLists.push(g.b1); idLists.push(g.b2); });
const phLists = []; PO.ph.forEach(g => { phLists.push(g.b1); phLists.push(g.b2); });
const myPLists = []; PO.my.forEach(g => { myPLists.push(g.b1); myPLists.push(g.b2); }); const myRLists = []; myReg.forEach(g => { myRLists.push(g.b1); myRLists.push(g.b2); });
const sReg = shareOf(regLists), sId = shareOf(idLists), sPh = shareOf(phLists), sMyP = shareOf(myPLists), sMyR = shareOf(myRLists);
const bothH = {}; idLists.concat(phLists, myPLists).forEach(l => l.forEach(h => { bothH[h] = (bothH[h] || 0) + 1; }));
const poTable = Object.keys(bothH).sort((a, b) => bothH[b] - bothH[a]).slice(0, 18).map(h => ({ hero: h, reg: Math.round(100 * 2 * sReg(h)) / 10 * 5 / 5, idp: 0, php: 0 }));
poTable.forEach(r => { r.reg = Math.round(100 * 2 * sReg(r.hero) / 2 * 10) / 10; r.idp = Math.round(100 * sId(r.hero)); r.php = Math.round(100 * sPh(r.hero)); r.myp = Math.round(100 * sMyP(r.hero)); r.myr = Math.round(100 * sMyR(r.hero)); r.reg = Math.round(100 * sReg(r.hero)); });
console.log('playoff table', poTable.length, '| ph games', PO.ph.length, '| id games', PO.id.length, '| reg lists', regLists.length);
const lowRoles = heroes.filter(h => !h.lanes.length).length;
const app = {
  bt: ALL.bt.map(r => ({ a: r.a, b: r.b, win: r.win, blue: r.blue })), btNoSide: ALL.bt.filter(r => !r.blue).length, teams: teamList,
  rules, mobility, patch, phGames: regionGames, regression, daytest, halfLife: 45,
  playoff: { ph: PO.ph, id: PO.id, my: PO.my, beta: POT.beta, k: POT.k, table: poTable, test: POT, regGames: regLists.length / 2, myReg: myReg.length, myPo: PO.my.length, regtest: rd('regtest_results.json') },
  habit: { hab: rd('habtest_results.json'), fit: rd('habfit_results.json'), my: rd('mytest_results.json') },
  traits, base, avgLen, evalcomp, picktest, shifttest, record: teamRec, games, heroes, imgs: (function () { try { return JSON.parse(fs.readFileSync(ROOT + '/data/hero_img.json', 'utf8')); } catch (e) { return {}; } })(), params: oos.params, bantest: { n: BA.later.cur.n, h1: BA.later.cur.h1, h3: BA.later.cur.h3, h5: BA.later.cur.h5, ll: BA.later.cur.ll / BA.later.cur.n, llOld: BA.later.cur.ll / BA.later.cur.n, oos: true }, bantestAll: BA,
  pick: { league, nLeagueGames, pools: pools.map(r => ({ team: r.team, player: r.player, lane: r.lane, hero: r.hero, games: +r.games, wins: +r.wins })), teamGames },
  pickNotes: { poolRows: pools.length, text: 'League and player numbers are MLBBHub Season 18 totals as of 7 Nov 2026 morning (before the final). ' + lowRoles + ' of ' + heroes.length + ' heroes have no confirmed lane, so the lane check skips them.' }
};
console.log('games', games.length, '| heroes', heroes.length, '| lowRoles', lowRoles, '| pools', pools.length, '| leagueGames', nLeagueGames, '| teamGames', JSON.stringify(teamGames));

fs.mkdirSync(ROOT + '/.build', { recursive: true });
fs.writeFileSync(ROOT + '/.build/app_data.json', JSON.stringify(app));
let html = fs.readFileSync(ROOT + '/src/index.template.html', 'utf8');
html = html.replace('/*MODEL*/', () => fs.readFileSync(ROOT + '/src/model.js', 'utf8'))
  .replace('/*COMP*/', () => fs.readFileSync(ROOT + '/src/comp.js', 'utf8'))
  .replace('/*BT*/', () => fs.readFileSync(ROOT + '/src/bt.js', 'utf8'))
  .replace('/*SIM*/', () => fs.readFileSync(ROOT + '/src/sim.js', 'utf8'))
  .replace('/*EXPLAIN*/', () => fs.readFileSync(ROOT + '/src/explain.js', 'utf8'))
  .replace('/*DATA*/', () => JSON.stringify(app));
fs.mkdirSync(ROOT + '/site', { recursive: true });
fs.writeFileSync(ROOT + '/site/index.html', html);
console.log('built', html.length, 'bytes');
