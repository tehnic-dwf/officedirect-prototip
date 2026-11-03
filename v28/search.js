/* OfficeDirect · motorul de căutare din prototip (constatările 11, 12, 15; M.047, M.048, M.051, M.054, M.055, M.182, M.183)
   Caută în tot catalogul local (homepage, „Hârtie copiator” și produsele pentru termenii frecvenți din search-data.js).
   - Cuvintele se potrivesc de la începutul lor, nu din mijloc: „lut” nu mai găsește „Absolut”, „plută” sau „Domestos”.
   - Singularul și pluralul se reduc la aceeași rădăcină: „biblioraft” = „bibliorafturi”, „pix” = „pixuri”.
   - Numerele se potrivesc exact: „biblioraft 5 cm” nu aduce bibliorafturile de 7,5 cm.
   - Codurile se potrivesc cu sau fără cratimă și spațiu: „TN-B023” = „TNB023” = „tnb 023”.
   - O greșeală de 1-2 litere se corectează în tăcere: clientul vede direct produsele, iar corectura merge doar în GA4.
   - Tipul produsului din termen urcă primul: la „carton alb”, cartonul stă înaintea dosarelor din carton alb.
   Pe site, aceeași logică stă în motorul de căutare (de ex. sinonime și toleranță la greșeli în indexul de produse). */

// Subcategoria afișată în sugestii și în filtrele căutării, după adresa produsului
const SUBS = {
  'hartie-multifunctionala': 'Hârtie copiator', 'hartie-colotech-printare-color': 'Hârtie copiator', 'agende-birou': 'Calendare și agende',
  'etichete-autocolante': 'Etichete autocolante', 'bibliorafturi': 'Bibliorafturi', 'dosare-din-plastic': 'Dosare din plastic',
  'file-protectie-documente': 'File de protecție', 'cutii-de-arhivare-alonje': 'Cutii de arhivare', 'hartie-igienica': 'Hârtie igienică',
  'prosoape-hartie': 'Prosoape și șervețele', 'manusi-si-masca-protectie': 'Mănuși', 'odorizante': 'Odorizante', 'table-magnetice': 'Table magnetice',
  'display-uri-de-prezentare': 'Display-uri', 'markere-flipchart-si-whiteboard': 'Markere whiteboard', 'folii-laminare': 'Folii de laminare',
  'capse-decapsatoare': 'Capse', 'benzi-adezive-dispencere': 'Benzi adezive', 'pixuri-fara-mecanism': 'Pixuri și rollere',
  'baterii-acumulatori-incarcatoare': 'Baterii', 'lampi-de-birou': 'Lămpi de birou', 'cabluri-si-accesorii': 'Cabluri',
};
const subOf = id => { const p = P[id]; return p.kind === 'carton' ? 'Carton' : p.sub || SUBS[p.url.split('/')[1]] || p.cat; };

// Termenii căutați des (GA4, mobil, 30 de zile) și termenii testați în audit: apar la atingerea câmpului și ca completări
const POPULAR = ['hârtie A4', 'biblioraft', 'lipici', 'stilou', 'plastilină', 'laminator', 'toner', 'carton alb', 'folie laminare', 'pix',
  'carioci', 'capsator', 'capse 24/6', 'biblioraft 5 cm', 'biblioraft 7,5 cm', 'hârtie A3', 'lut modelaj', 'pix cu gel', 'dosar plastic',
  'marker whiteboard', 'creion mecanic', 'foarfecă', 'hârtie reciclată', 'hârtie 80 g'];

// Sinonime: cuvântul clientului → cuvintele din catalog (constatarea 12). O expresie din mai multe cuvinte cere toate cuvintele.
const SYN = {
  imprimanta: ['copiator', 'multifunctionala'], xerox: [], argila: ['lut'], registrator: ['biblioraft'], scotch: [['banda', 'adeziva']],
  aracet: ['lipici'], adeziv: ['lipici'], evidentiator: ['textmarker'], guma: ['radiera'], radiera: ['guma'], cerneala: ['patroane'],
  tus: ['patroane'], whiteboard: ['magnetica'], plastelina: ['plastilina'],
};
// Cuvinte fără greutate și unități: nu sunt obligatorii, doar ajută la ordonare
const STOP = new Set(['de', 'cu', 'si', 'la', 'din', 'pentru', 'pt', 'in', 'pe', 'al', 'ale', 'un', 'o', 'sau', 'x', 'buc', 'bucati', 'bucata']);
const UNITS = new Set(['cm', 'mm', 'g', 'gr', 'mp', 'ml', 'kg', 'm', 'l', 'gsm', 'grame', 'microni', 'coli', 'culori', 'pagini', 'k']);

const fold = s => norm(String(s))
  .replace(/(\d),(\d)/g, '$1.$2')
  .replace(/(\d)\s*(cm|mm|ml|kg|gr|g|m|l|k)\b/g, '$1 $2')
  .replace(/(\d)x(\d)/g, '$1 $2');
function tokens(s) {
  const f = fold(s);
  const out = [];
  // Codurile cu cratimă intră și lipite: „tn-b023” → „tnb023”
  for (const m of f.matchAll(/[a-z0-9]+(?:-[a-z0-9]+)+/g)) out.push(m[0].replace(/-/g, ''));
  for (let t of f.split(/[^a-z0-9.]+/)) { t = t.replace(/^\.+|\.+$/g, ''); if (t) out.push(t); }
  // Cifra cu unitatea ei intră și împreună: „80 g/mp” → „80g”, „5 cm” → „5cm” (așa „5 cm” nu găsește „5 bibliorafturi”)
  for (const m of f.matchAll(UNIT_RE)) out.push(m[1] + m[2]);
  return out;
}
const UNIT_RE = /(\d+(?:\.\d+)?) (cm|mm|ml|kg|g|m|l|k|microni|coli|culori)\b/g;
const isNum = t => /^\d+(\.\d+)?$/.test(t);
function stem(w) {
  if (/\d/.test(w) || w.length <= 3) return w;
  if (w.endsWith('oare')) return w.slice(0, -4) + 'or';
  if (w.endsWith('oane')) return w.slice(0, -4) + 'on';
  for (const s of ['urilor', 'urile', 'ului', 'elor', 'ilor', 'uri', 'ele', 'ile', 'ul', 'le', 'ii', 'ei', 'e', 'i', 'a', 'u']) {
    if (w.endsWith(s) && w.length - s.length >= 3) return w.slice(0, -s.length);
  }
  return w;
}

/* ---------- Indexul: fiecare rădăcină știe în ce produse apare și cu ce greutate ---------- */
// Tipul produsului (primul cuvânt din nume) cântărește cel mai mult; apoi codul, numele, brandul, subcategoria, atributele
const W = { type: 6, code: 5, name: 4, brand: 4, sub: 3, attr: 2, tag: 2, cat: 1.5 };
const IDX = new Map();      // rădăcină → Map(id → greutate)
const DF = new Map();       // cuvânt întreg → în câte produse apare (pentru corectură)
const SHOW = new Map();     // cuvânt fără diacritice → forma cu diacritice, pentru „Ai vrut să spui…”
const ORDER = new Map();    // ordinea din catalog (cele mai vândute primele) pentru egalități
const TYPE = new Map();     // id → rădăcina tipului
function addWords(id, text, field) {
  const raw = String(text).split(/[\s,/()]+/).filter(Boolean);
  raw.forEach(r => { const k = norm(r).replace(/[^a-z0-9.-]/g, ''); if (k && !SHOW.has(k)) SHOW.set(k, r.replace(/[,.]$/, '')); });
  for (const t of tokens(text)) {
    const s = stem(t);
    if (!IDX.has(s)) IDX.set(s, new Map());
    const m = IDX.get(s);
    m.set(id, Math.max(m.get(id) || 0, W[field]));
    if (!DF.has(t)) DF.set(t, new Set());
    DF.get(t).add(id);
  }
}
Object.keys(P).forEach((id, i) => {
  const p = P[id];
  ORDER.set(id, p.rank ?? 100 + i);
  const first = p.name.split(/\s+/).find(w => !/^\d/.test(w)) || '';
  TYPE.set(id, stem(tokens(first)[0] || ''));
  addWords(id, first, 'type');
  addWords(id, p.name, 'name');
  if (p.brand) addWords(id, p.brand, 'brand');
  addWords(id, subOf(id), 'sub');
  addWords(id, p.cat, 'cat');
  // La hârtie, atributele (format, gramaj, coli) stau în rândul de atribute, nu în nume: cântăresc cât numele
  addWords(id, [p.meta, p.unit].filter(Boolean).join(' '), p.kind ? 'name' : 'attr');
  if (p.code || p.alias) addWords(id, [p.code, p.alias].filter(Boolean).join(' '), 'code');
  // Hârtia și cartonul nereciclate sunt albe, chiar dacă numele nu o spune
  if (p.kind) addWords(id, p.recycled ? 'reciclată' : 'albă alb', 'tag');
});
const VOCAB = [...IDX.keys()];
const INFL = new Set(['e', 'i', 'a', 'u', 'ul', 'le', 'ii', 'ei', 'ea', 'uri', 'ele', 'ile', 'ului', 'elor', 'ilor', 'urile', 'urilor']);
const WORDS = [...DF.keys()].filter(w => !isNum(w) && w.length >= 3);

/* ---------- Potrivirea unui cuvânt: exact, de la început (în timp ce scrii), plural ---------- */
function lookup(t) {
  const s = stem(t);
  const hits = new Map();
  const put = (k, f) => IDX.get(k).forEach((w, id) => hits.set(id, Math.max(hits.get(id) || 0, w * f)));
  if (IDX.has(s)) put(s, 1);
  if (isNum(t)) return hits;                  // numerele: doar exact („5” nu găsește „7.5”)
  if (s.length < 3 && !/\d/.test(s)) return hits;
  // Un cuvânt început („bibl”, „caps”) se completează; unul întreg („capse”, „lut”) nu se extinde la alte cuvinte („capsator”)
  const whole = DF.has(t);
  for (const k of VOCAB) {
    if (k === s) continue;
    if (k.startsWith(s) && !whole) put(k, .8);
    // Cuvântul scris e mai lung decât rădăcina doar cu o terminație de plural sau articol („plastilinele” → „plastilin”)
    else if (s.startsWith(k) && k.length >= 4 && !/\d/.test(k) && INFL.has(s.slice(k.length))) put(k, .7);
  }
  return hits;
}
// Un termen al clientului, cu sinonimele lui: o expresie sinonimă cere toate cuvintele ei
function termHits(t) {
  const hits = lookup(t);
  for (const alt of SYN[t] || []) {
    const parts = Array.isArray(alt) ? alt : [alt];
    const maps = parts.map(lookup);
    maps[0].forEach((w, id) => { if (maps.every(m => m.has(id))) hits.set(id, Math.max(hits.get(id) || 0, w * .9)); });
  }
  return hits;
}

/* ---------- Corectura: distanța dintre cuvinte (litere lipsă, în plus, schimbate sau inversate) ---------- */
function dist(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      best = Math.min(best, d[i][j]);
    }
    if (best > max) return max + 1;
  }
  return d[a.length][b.length];
}
function correct(t) {
  const max = t.length >= 8 ? 2 : t.length >= 4 ? 1 : 0;
  if (!max) return null;
  let best = null, bd = max + 1, bdf = 0;
  for (const w of [...WORDS, ...Object.keys(SYN)]) {
    const d = dist(t, w, max);
    const df = DF.get(w)?.size || 1;
    if (d < bd || (d === bd && df > bdf)) { best = w; bd = d; bdf = df; }
  }
  return bd <= max ? best : null;
}

/* ---------- Căutarea propriu-zisă ---------- */
// Întoarce produsele ordonate după relevanță, plus ce a corectat, ce a ignorat și subcategoriile cu numărul lor
function searchCatalog(raw, { exact = false } = {}) {
  let toks = tokens(raw).filter(t => !STOP.has(t));
  // „tnb 023” → „tnb023”, dacă așa există în catalog
  for (let i = 0; i < toks.length - 1; i++) if (IDX.has(toks[i] + toks[i + 1]) && !IDX.has(toks[i + 1])) { toks.splice(i, 2, toks[i] + toks[i + 1]); }
  // „80 g” se caută ca „80g”: cifra și unitatea nu mai sunt cuvinte separate
  for (const m of fold(raw).matchAll(UNIT_RE)) {
    const both = m[1] + m[2];
    if (!IDX.has(both)) continue;
    const i = toks.indexOf(m[1]); if (i > -1) toks.splice(i, 1);
    const j = toks.indexOf(m[2]); if (j > -1) toks.splice(j, 1);
    toks.push(both);
  }
  toks = [...new Set(toks)];
  const fixes = [];
  const terms = [];
  for (const t of toks) {
    if (UNITS.has(t)) { terms.push({ t, soft: true, hits: lookup(t) }); continue; }
    let hits = termHits(t);
    // Un cuvânt care nu există în catalog și nici nu începe un cuvânt din catalog e o greșeală, chiar dacă rădăcina lui găsește ceva („hartei”)
    const odd = !exact && t.length >= 5 && !/\d/.test(t) && !DF.has(t) && !SYN[t] && !WORDS.some(w => w.startsWith(t));
    if ((!hits.size || odd) && !exact && !isNum(t)) {
      const c = correct(t);
      if (c && c !== t && termHits(c).size) { fixes.push([t, c]); hits = termHits(c); terms.push({ t: c, from: t, hits }); continue; }
    }
    terms.push({ t, hits });
  }
  const req = terms.filter(x => !x.soft);
  // Toate cuvintele obligatorii trebuie găsite; dacă nu se poate, renunțăm la cele care nu există în catalog
  let used = req.filter(x => x.hits.size);
  const dropped = req.filter(x => !x.hits.size).map(x => x.from || x.t);
  let ids = used.length ? [...used[0].hits.keys()].filter(id => used.every(x => x.hits.has(id))) : [];
  // Nimic cu toate cuvintele: păstrăm combinația care dă cele mai multe produse fără un singur cuvânt
  if (!ids.length && used.length > 1) {
    let bestSet = null, bestIds = [];
    used.forEach((x, i) => {
      const rest = used.filter((_, j) => j !== i);
      const r = [...rest[0].hits.keys()].filter(id => rest.every(y => y.hits.has(id)));
      if (r.length > bestIds.length) { bestIds = r; bestSet = x; }
    });
    if (bestSet) { dropped.push(bestSet.from || bestSet.t); used = used.filter(x => x !== bestSet); ids = bestIds; }
  }
  const head = used.find(x => !isNum(x.t));
  const phrase = fold(raw).replace(/\s+/g, ' ').trim();
  const score = id => {
    let s = used.reduce((a, x) => a + x.hits.get(id), 0);
    terms.filter(x => x.soft).forEach(x => { if (x.hits.has(id)) s += .5; });
    if (head && TYPE.get(id) && (TYPE.get(id) === stem(head.t) || TYPE.get(id).startsWith(stem(head.t)))) s += 6;
    if (fold(P[id].name).includes(phrase)) s += 3;
    return s;
  };
  const scored = new Map(ids.map(id => [id, score(id)]));
  ids.sort((a, b) => ((P[a].stock === 0) - (P[b].stock === 0)) || (scored.get(b) - scored.get(a)) || (ORDER.get(a) - ORDER.get(b)));
  const subs = new Map();
  ids.forEach(id => subs.set(subOf(id), (subs.get(subOf(id)) || 0) + 1));
  // Textul arătat clientului: cuvintele lui, cu greșelile înlocuite și fără cuvintele ignorate
  const shownWord = t => { const d = SHOW.get(t); return d && d !== d.toUpperCase() ? d.toLowerCase() : t; };
  const rebuild = skip => raw.trim().split(/\s+/).map(w => {
    const ft = tokens(w);
    if (ft.some(t => skip.includes(t))) return null;
    const fx = fixes.find(([from]) => ft.includes(from));
    return fx ? shownWord(fx[1]) : w;
  }).filter(Boolean).join(' ');
  const lost = dropped.map(d => fold(d));
  return {
    ids, fixes, dropped,
    fixed: fixes.length ? rebuild([]) : null,
    kept: dropped.length ? rebuild(lost) : null,
    scopes: [...subs.entries()].sort((a, b) => b[1] - a[1]),
  };
}

/* ---------- Răspunsuri pentru căutările despre livrare, retur, plată, contact (constatarea 15) ---------- */
function searchAnswers(raw) {
  const toks = tokens(raw).filter(t => !STOP.has(t));
  return ANSWERS.filter(a => toks.some(t => a.keys.some(k => k === t || (t.length >= 3 && k.startsWith(t)) || (t.length >= 5 && dist(t, k, 1) <= 1))));
}

/* ---------- Completări: termeni frecvenți care încep cu ce ai scris, doar dacă au rezultate ---------- */
function searchComplete(raw, limit = 3) {
  const f = fold(raw).trim();
  if (!f) return [];
  const parts = f.split(/\s+/);
  return POPULAR.filter(term => {
    const ft = fold(term);
    if (ft === f) return false;
    const words = ft.split(/\s+/);
    return parts.every((p, i) => words[i] && (i < parts.length - 1 ? stem(words[i]) === stem(p) || words[i] === p : words[i].startsWith(p)));
  }).map(term => ({ term, n: searchCatalog(term).ids.length })).filter(x => x.n).slice(0, limit);
}

// „1 rezultat”, „14 rezultate”, „107 de rezultate”
const rezultate = n => n === 1 ? '1 rezultat' : `${n}${n >= 20 && (n % 100 === 0 || n % 100 >= 20) ? ' de' : ''} rezultate`;
const produseN = n => n === 0 ? 'niciun produs' : n === 1 ? '1 produs' : `${n}${n >= 20 && (n % 100 === 0 || n % 100 >= 20) ? ' de' : ''} produse`;
const serpHref = (term, extra = {}) => 'cautare.html?' + new URLSearchParams({ q: term, ...extra }).toString();
