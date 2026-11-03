/* OfficeDirect · pagina de categorie mobilă: „Hârtie copiator”
   Filtre cu numere reale pe fiecare valoare, alegeri rapide după nevoie, sortare, încărcare progresivă.
   Starea filtrelor stă în URL, deci linkurile prefiltrate și Back de pe produs păstrează lista. */

const LIST = { id: 'plp_hartie_copiator', name: 'Categorie - Hârtie copiator' };
const ITEMS = Object.keys(window.EXTRA_P || {});
// Demo pentru clientul cu cont (?revine=1): hârtia din comenzile lui anterioare
const member = params.has('revine');
const PURCHASED = member ? ['double-a', 'xerox-business'] : [];
const PAGE = 24;

/* ---------- Filtre: aceleași valori pe care le arată cardul (M.033) ---------- */
const inRange = (n, a, b) => n >= a && n <= b;
const FACETS = [
  { key: 'fmt', label: 'Format', kind: 'pills', values: [['A4', 'A4'], ['A3', 'A3'], ['A5', 'A5']], test: (p, v) => p.fmt === v },
  { key: 'gsm', label: 'Gramaj', kind: 'rows',
    hint: 'Gramajul arată cât de groasă e coala. 80 g/mp e hârtia obișnuită de imprimantă.',
    values: [['70-80', '70-80 g/mp', 'Hârtie obișnuită de birou'], ['90-120', '90-120 g/mp', 'Mai rigidă, pentru oferte și prezentări'], ['160-250', '160-250 g/mp', 'Carton subțire, pentru coperți'], ['280-350', '280-350 g/mp', 'Carton gros, pentru diplome și invitații']],
    test: (p, v) => { const [a, b] = v.split('-').map(Number); return inRange(p.gsm, a, b); } },
  { key: 'pack', label: 'Coli în top', kind: 'pills', values: [['125-150', '125-150'], ['200-250', '200-250'], ['500', '500'], ['1000', '1.000']],
    test: (p, v) => { const [a, b = a] = v.split('-').map(Number); return inRange(p.sheets, a, b); } },
  { key: 'tip', label: 'Tip', kind: 'rows', values: [['alba', 'Albă'], ['reciclata', 'Reciclată']],
    test: (p, v) => v === 'reciclata' ? p.recycled : !p.recycled },
  { key: 'vol', label: 'Pentru firme', kind: 'rows', values: [['da', 'Cu preț de volum', 'Prețul pe top scade de la 25-50 de topuri']], test: p => !!p.tiers },
  { key: 'brand', label: 'Brand', kind: 'rows', collapse: 6, values: [], test: (p, v) => p.brand === v },
  { key: 'pret', get label() { return `Preț ${vatLabel()}`; }, kind: 'rows', values: [['0-25', 'Sub 25 lei'], ['25-50', '25-50 lei'], ['50-100', '50-100 lei'], ['100-9999', 'Peste 100 lei']],
    test: (p, v) => { const [a, b] = v.split('-').map(Number); return vatPrice(p.price) >= a && vatPrice(p.price) < b; } },
  { key: 'stoc', label: 'Disponibilitate', kind: 'rows', values: [['da', 'Doar produse în stoc']], test: p => p.stock !== 0 },
  // Clientul cu cont: produsele pe care le-a mai comandat (nu apare în foaia de filtre, doar ca alegere rapidă)
  { key: 'mine', label: 'Comandate de tine', kind: 'hidden', values: [['da', 'Comandate de tine']], test: p => PURCHASED.some(k => P[k] === p) },
];
// Brandurile, de la cel mai des întâlnit
const brandCount = {};
ITEMS.forEach(id => { brandCount[P[id].brand] = (brandCount[P[id].brand] || 0) + 1; });
FACETS.find(f => f.key === 'brand').values = Object.keys(brandCount).sort((a, b) => brandCount[b] - brandCount[a] || a.localeCompare(b, 'ro')).map(b => [b, b]);
const facetOf = key => FACETS.find(f => f.key === key);
const labelOf = (key, v) => facetOf(key).values.find(x => x[0] === v)?.[1] || v;

/* ---------- Alegeri rapide după nevoie (M.169, PLP-17): scurtături spre filtrele reale ---------- */
const INTENTS = [
  ...(member ? [{ id: 'mine', label: 'Comandate de tine', set: { mine: ['da'] } }] : []),
  { id: 'zilnic', label: 'Pentru imprimare zilnică', set: { fmt: ['A4'], gsm: ['70-80'] } },
  { id: 'a3', label: 'Format A3', set: { fmt: ['A3'] } },
  { id: 'volum', label: 'Cu preț de volum', set: { vol: ['da'] } },
  { id: 'prezentari', label: 'Pentru prezentări', set: { gsm: ['90-120'] } },
  { id: 'carton', label: 'Carton, de la 160 g/mp', set: { gsm: ['160-250', '280-350'] } },
  { id: 'reciclata', label: 'Reciclată', set: { tip: ['reciclata'] } },
];

/* ---------- Sortare (M.031, PLP-19): produsele epuizate rămân mereu la final (PLP-30) ---------- */
// O coală A3 are suprafața a două coli A4, una A5 jumătate: comparăm corect topuri de formate diferite
const A4EQ = { A3: 2, A4: 1, A5: .5 };
const per100 = p => p.price / (p.sheets / 100 * (A4EQ[p.fmt] || 1));
const SORTS = [
  { key: 'best', label: 'Cele mai vândute', note: 'În ultimele 30 de zile', cmp: (a, b) => a.rank - b.rank },
  { key: 'pret-asc', label: 'Preț crescător', cmp: (a, b) => a.price - b.price },
  { key: 'pret-desc', label: 'Preț descrescător', cmp: (a, b) => b.price - a.price },
  { key: 'pret-100', label: 'Cel mai mic preț pe 100 de coli', note: 'Calculat la suprafața unei coli A4, ca să compari corect A3, A4 și A5', cmp: (a, b) => per100(a) - per100(b) },
];

/* ---------- Stare din URL ---------- */
const url = new URLSearchParams(location.search);
const emptySel = () => Object.fromEntries(FACETS.map(f => [f.key, new Set()]));
let sel = emptySel();
FACETS.forEach(f => (url.get(f.key) || '').split(',').filter(v => f.values.some(x => x[0] === v)).forEach(v => sel[f.key].add(v)));
let sort = SORTS.some(s => s.key === url.get('sort')) ? url.get('sort') : 'best';
// Interval de preț scris de mână (M.040), pe lângă intervalele fixe
const numOr = v => (v === null || v === '' || isNaN(Number(v)) ? null : Number(v));
let range = { min: numOr(url.get('pmin')), max: numOr(url.get('pmax')) };
let draftRange = { ...range };
let shown = Math.max(PAGE, Math.min(96, Number(url.get('n')) || PAGE));
let draft = null;
let lastAdded = null;

const cloneSel = s => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, new Set(v)]));
const activeCount = (s, r = s === draft ? draftRange : range) => Object.values(s).reduce((n, v) => n + v.size, 0) + (r.min !== null || r.max !== null ? 1 : 0);
// SAU în interiorul unui filtru, ȘI între filtre (PLP-11); `skip` dă numerele pe valori (fațete)
function matches(id, s, skip, r = s === draft ? draftRange : range) {
  const p = P[id];
  if (skip !== 'pret' && ((r.min !== null && vatPrice(p.price) < r.min) || (r.max !== null && vatPrice(p.price) > r.max))) return false;
  return FACETS.every(f => f.key === skip || !s[f.key].size || [...s[f.key]].some(v => f.test(p, v)));
}
const results = s => ITEMS.filter(id => matches(id, s));
const countFor = (s, key, v) => ITEMS.filter(id => matches(id, s, key) && facetOf(key).test(P[id], v)).length;

// „82 de produse”, „12 produse”, „1 produs”
function produse(n) {
  if (n === 0) return 'niciun produs';
  if (n === 1) return '1 produs';
  return `${n}${n >= 20 && (n % 100 === 0 || n % 100 >= 20) ? ' de' : ''} produse`;
}

function syncUrl() {
  const u = new URLSearchParams();
  FACETS.forEach(f => { if (sel[f.key].size) u.set(f.key, [...sel[f.key]].join(',')); });
  if (range.min !== null) u.set('pmin', range.min);
  if (range.max !== null) u.set('pmax', range.max);
  if (sort !== 'best') u.set('sort', sort);
  const total = results(sel).length;
  if (shown > PAGE && total > PAGE) u.set('n', Math.min(shown, Math.ceil(total / PAGE) * PAGE));
  if (params.has('debug')) u.set('debug', '1');
  const qs = u.toString();
  history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : ''));
}
// După închiderea unei foi, istoricul face un pas înapoi; actualizăm URL-ul abia după el
function afterClose(fn) {
  if (history.state && history.state.layer) addEventListener('popstate', () => setTimeout(fn, 0), { once: true });
  else fn();
}

/* ---------- Lista ---------- */
const grid = $('#plp-grid');
const B2B_AFTER = 6;
const b2bTile = `<li class="plp-b2b" data-promo="plp_cont_firma" data-promo-name="Cont de firmă - categorie" data-slot="plp_b2b_6">
    <p class="plp-b2b__title">Comanzi hârtie în fiecare lună?</p>
    <p class="plp-b2b__text">Cu un cont de firmă ai factură pe CUI, plătești prin ordin de plată și refaci o comandă din istoric dintr-o atingere.</p>
    <a class="plp-b2b__cta" href="https://www.officedirect.ro/index.php?route=account/register">Creează cont de firmă</a>
  </li>`;

function sorted(ids) {
  const s = SORTS.find(x => x.key === sort);
  return ids.slice().sort((a, b) => ((P[a].stock === 0) - (P[b].stock === 0)) || s.cmp(P[a], P[b]));
}
function render() {
  const all = sorted(results(sel));
  const total = all.length;
  const list = all.slice(0, shown);
  grid.innerHTML = list.map((id, i) => cardHTML(id, i + 1) + (i === B2B_AFTER - 1 && total > B2B_AFTER && !member ? b2bTile : '')).join('');
  observePromo();
  observeCards(grid);
  const n = activeCount(sel);
  const label = n ? `${produse(total)} din ${ITEMS.length}` : produse(ITEMS.length);
  $('#plp-count').textContent = label[0].toUpperCase() + label.slice(1);
  $('#filtre-count').hidden = !n;
  $('#filtre-count').textContent = n;
  $('#btn-filtre').setAttribute('aria-label', n ? `Filtre, ${n} aplicate` : 'Filtre');
  $('#sort-label').textContent = SORTS.find(x => x.key === sort).label;
  renderActive();
  renderIntents();
  // Zero rezultate: pentru fiecare filtru activ, câte produse ar rămâne fără el (M.170)
  $('#empty').hidden = total > 0;
  if (!total) {
    const opts = FACETS.flatMap(f => [...sel[f.key]].map(v => {
      const s = cloneSel(sel); s[f.key].delete(v);
      return { k: f.key, v, n: ITEMS.filter(id => matches(id, s, null, range)).length };
    }));
    if (range.min !== null || range.max !== null) opts.push({ k: 'range', v: '', n: ITEMS.filter(id => matches(id, sel, null, { min: null, max: null })).length });
    opts.sort((a, b) => b.n - a.n);
    $('#empty-text').textContent = 'Scoate un filtru ca să vezi produse:';
    $('#empty-options').innerHTML = opts.filter(o => o.n).slice(0, 3).map(o => `<li><button class="btn btn--secondary btn--block" type="button" data-undo="${o.k}|${esc(o.v)}">Scoate „${esc(o.k === 'range' ? rangeLabel() : labelOf(o.k, o.v))}” <span class="empty__n">${produse(o.n)}</span></button></li>`).join('');
  }
  // Mai multe produse, cu progres
  const more = $('#more');
  more.hidden = total === 0;
  $('#more-text').textContent = `Ai văzut ${Math.min(shown, total)} din ${produse(total)}`;
  $('#more-fill').style.transform = `scaleX(${total ? Math.min(shown, total) / total : 0})`;
  const left = total - shown;
  $('#more-btn').hidden = left <= 0;
  $('#more-btn').textContent = `Vezi încă ${Math.min(PAGE, left)}`;
}

/* ---------- Filtre aplicate, fiecare cu X (M.036, M.037) ---------- */
const rangeLabel = (r = range) => r.min !== null && r.max !== null ? `${r.min}-${r.max} lei` : r.min !== null ? `peste ${r.min} lei` : `până la ${r.max} lei`;
function renderActive() {
  const chips = FACETS.flatMap(f => [...sel[f.key]].map(v => `<li><button class="achip" type="button" data-remove="${f.key}|${esc(v)}" aria-label="Scoate filtrul ${esc(labelOf(f.key, v))}">${esc(labelOf(f.key, v))}<i class="ph ph-x" aria-hidden="true"></i></button></li>`));
  if (range.min !== null || range.max !== null) chips.push(`<li><button class="achip" type="button" data-remove="range|" aria-label="Scoate intervalul de preț">${rangeLabel()}<i class="ph ph-x" aria-hidden="true"></i></button></li>`);
  $('#active').hidden = !chips.length;
  $('#active-list').innerHTML = (chips.length > 1 ? '<li><button class="link achip--clear" type="button" data-clear-all>Șterge tot</button></li>' : '') + chips.join('');
}
function renderIntents() {
  const any = activeCount(sel) > 0;
  $('#intents').hidden = any;
  if (any) return;
  $('#intents').innerHTML = INTENTS.map(t => {
    const s = cloneSel(sel);
    Object.entries(t.set).forEach(([k, vs]) => vs.forEach(v => s[k].add(v)));
    const n = results(s).length;
    return n ? `<li><button class="intent" type="button" data-intent="${t.id}">${t.label}<span class="intent__n">${n}</span></button></li>` : '';
  }).join('');
}
function trackFilters(how) {
  const f = [...FACETS.filter(x => sel[x.key].size).map(x => `${x.key}:${[...sel[x.key]].join('.')}`), ...(range.min !== null || range.max !== null ? [`pret_interval:${range.min ?? ''}-${range.max ?? ''}`] : [])].join('|');
  track('filter_apply', null, { filter_source: how, filters: f || 'niciunul', results: results(sel).length, item_list_id: LIST.id });
}
function apply(how, keepCount) {
  if (!keepCount) shown = PAGE;
  render();
  syncUrl();
  trackFilters(how);
}

document.addEventListener('click', e => {
  const rm = e.target.closest('[data-remove]');
  if (rm) { const [k, v] = rm.dataset.remove.split('|'); if (k === 'range') range = { min: null, max: null }; else sel[k].delete(v); lastAdded = null; apply('chip_activ'); $('#btn-filtre').focus({ preventScroll: true }); return; }
  if (e.target.closest('[data-clear-all]') || e.target.closest('#empty-reset')) { sel = emptySel(); range = { min: null, max: null }; lastAdded = null; apply('sterge_tot'); return; }
  const undo = e.target.closest('[data-undo]');
  if (undo) { const [k, v] = undo.dataset.undo.split('|'); if (k === 'range') range = { min: null, max: null }; else sel[k].delete(v); apply('zero_rezultate'); return; }
  const intent = e.target.closest('[data-intent]');
  if (intent) {
    const t = INTENTS.find(x => x.id === intent.dataset.intent);
    Object.entries(t.set).forEach(([k, vs]) => vs.forEach(v => { sel[k].add(v); lastAdded = [k, v]; }));
    track('select_content', null, { content_type: 'filtru_rapid', content_id: t.label });
    apply('filtru_rapid');
    $('#active-list .achip')?.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest('#more-btn')) {
    const first = shown;
    shown += PAGE;
    render();
    syncUrl();
    track('load_more', null, { item_list_id: LIST.id, shown: Math.min(shown, results(sel).length) });
    // Focusul trece pe primul produs nou, ca tastatura și cititorul de ecran să nu sară la început
    $$('.card', grid)[first]?.querySelector('.card__name a')?.focus({ preventScroll: true });
    return;
  }
});

/* ---------- Foaia de filtre: alegi mai multe, vezi câte rămân, aplici o dată (M.039, PLP-10) ---------- */
const filtersEl = $('#filters');
const openGroups = new Set(['fmt', 'gsm', 'pack', 'tip', 'vol', 'brand']);
let brandsAll = false, brandQuery = '';

function renderFilters() {
  filtersEl.innerHTML = FACETS.filter(f => f.kind !== 'hidden').map(f => {
    let values = f.values;
    let extra = '';
    if (f.key === 'brand') {
      const q = norm(brandQuery);
      const filtered = q ? values.filter(([v]) => norm(v).includes(q)) : values;
      values = brandsAll || q ? filtered : filtered.slice(0, f.collapse);
      extra = `<label class="fsearch"><span class="sr-only">Caută un brand</span><i class="ph ph-magnifying-glass" aria-hidden="true"></i><input type="search" data-brand-q placeholder="Caută un brand" value="${esc(brandQuery)}" autocomplete="off"></label>`;
    }
    const open = openGroups.has(f.key);
    const items = values.map(([v, label, desc]) => {
      const on = draft[f.key].has(v);
      const n = countFor(draft, f.key, v);
      const off = !on && n === 0;
      if (f.kind === 'pills') return `<button class="fpill" type="button" data-f="${f.key}" data-v="${esc(v)}" aria-pressed="${on}" ${off ? 'disabled' : ''}>${label}<span class="fcount">${n}</span></button>`;
      return `<label class="frow${off ? ' is-off' : ''}"><input type="checkbox" data-f="${f.key}" data-v="${esc(v)}" ${on ? 'checked' : ''} ${off ? 'disabled' : ''}><span class="fbox" aria-hidden="true"><i class="ph ph-check"></i></span><span class="frow__text">${esc(label)}${desc ? `<small>${desc}</small>` : ''}</span><span class="fcount">${n}</span></label>`;
    }).join('');
    const more = f.key === 'brand' && !brandQuery && f.values.length > f.collapse
      ? `<button class="link fmore" type="button" data-brands-toggle>${brandsAll ? 'Arată mai puține' : `Vezi toate cele ${f.values.length} de branduri`}</button>` : '';
    if (f.key === 'pret') extra = `<div class="frange"><label><span>De la</span><input type="text" inputmode="numeric" data-range="min" value="${draftRange.min ?? ''}" placeholder="0" aria-label="Preț minim, în lei"><span class="frange__u">lei</span></label><label><span>Până la</span><input type="text" inputmode="numeric" data-range="max" value="${draftRange.max ?? ''}" placeholder="140" aria-label="Preț maxim, în lei"><span class="frange__u">lei</span></label></div>`;
    const selCount = draft[f.key].size + (f.key === 'pret' && (draftRange.min !== null || draftRange.max !== null) ? 1 : 0);
    return `<section class="fgroup">
      <h3><button class="fgroup__head" type="button" aria-expanded="${open}" data-group="${f.key}">${f.label}${selCount ? `<span class="fgroup__n">${selCount}</span>` : ''}<i class="ph ph-caret-down" aria-hidden="true"></i></button></h3>
      <div class="fgroup__body" ${open ? '' : 'hidden'}>
        ${f.hint ? `<p class="fgroup__hint">${f.hint}</p>` : ''}${extra}
        <div class="${f.kind === 'pills' ? 'fpills' : 'frows'}">${items || '<p class="fgroup__hint">Niciun brand nu se potrivește.</p>'}</div>${more}
      </div>
    </section>`;
  }).join('');
  const n = results(draft).length;
  const btn = $('#filters-apply');
  btn.textContent = n ? `Vezi ${produse(n)}` : 'Niciun produs';
  btn.disabled = n === 0;
  $('#filters-clear').hidden = !activeCount(draft);
}
// Pregătim o copie de lucru la deschidere; X și Back o aruncă, „Vezi N produse” o aplică
$('#btn-filtre').addEventListener('click', () => { draft = cloneSel(sel); draftRange = { ...range }; brandsAll = false; brandQuery = ''; renderFilters(); });
filtersEl.addEventListener('click', e => {
  const head = e.target.closest('[data-group]');
  if (head) { const k = head.dataset.group; openGroups.has(k) ? openGroups.delete(k) : openGroups.add(k); renderFilters(); $(`[data-group="${k}"]`, filtersEl).focus(); return; }
  if (e.target.closest('[data-brands-toggle]')) { brandsAll = !brandsAll; renderFilters(); $('[data-brands-toggle]', filtersEl)?.focus(); return; }
  const pill = e.target.closest('.fpill');
  if (pill) { toggleDraft(pill.dataset.f, pill.dataset.v); renderFilters(); $(`.fpill[data-f="${pill.dataset.f}"][data-v="${pill.dataset.v}"]`, filtersEl)?.focus(); }
});
filtersEl.addEventListener('change', e => {
  if (e.target.closest('[data-range]')) { renderFilters(); return; }
  const box = e.target.closest('input[type="checkbox"][data-f]');
  if (!box) return;
  toggleDraft(box.dataset.f, box.dataset.v);
  renderFilters();
  $(`input[data-f="${box.dataset.f}"][data-v="${CSS.escape(box.dataset.v)}"]`, filtersEl)?.focus();
});
filtersEl.addEventListener('input', e => {
  const rg = e.target.closest('[data-range]');
  if (rg) {
    rg.value = rg.value.replace(/\D/g, '');
    draftRange[rg.dataset.range] = numOr(rg.value);
    const n = results(draft).length;
    const btn = $('#filters-apply');
    btn.textContent = n ? `Vezi ${produse(n)}` : 'Niciun produs';
    btn.disabled = n === 0;
    return;
  }
  if (!e.target.matches('[data-brand-q]')) return;
  brandQuery = e.target.value;
  const pos = e.target.selectionStart;
  renderFilters();
  const inp = $('[data-brand-q]', filtersEl);
  inp.focus(); inp.setSelectionRange(pos, pos);
});
function toggleDraft(k, v) {
  if (draft[k].has(v)) draft[k].delete(v); else { draft[k].add(v); lastAdded = [k, v]; }
}
$('#filters-clear').addEventListener('click', () => { draft = emptySel(); draftRange = { min: null, max: null }; renderFilters(); });
$('#filters-apply').addEventListener('click', () => {
  sel = cloneSel(draft);
  range = { ...draftRange };
  shown = PAGE;
  close();
  render();
  afterClose(() => { syncUrl(); trackFilters('foaie_filtre'); });
});

/* ---------- Foaia de sortare ---------- */
function renderSorts() {
  $('#sorts').innerHTML = SORTS.map(s => `<label class="srow"><input type="radio" name="sort" value="${s.key}" ${s.key === sort ? 'checked' : ''}><span class="srow__dot" aria-hidden="true"></span><span class="srow__text">${s.label}${s.note ? `<small>${s.note}</small>` : ''}</span></label>`).join('');
}
$('#btn-sort').addEventListener('click', renderSorts);
$('#sorts').addEventListener('change', e => {
  sort = e.target.value;
  close();
  render();
  afterClose(() => { syncUrl(); track('sort_apply', null, { sort_type: sort, item_list_id: LIST.id }); });
});

/* ---------- Blocul pentru firme se măsoară ca promoție (view_promotion / select_promotion) ---------- */
const promoSeen = new Set();
const promoIO = new IntersectionObserver(entries => entries.forEach(en => {
  const el = en.target;
  if (en.isIntersecting) el._t = setTimeout(() => { if (promoSeen.has(el.dataset.promo)) return; promoSeen.add(el.dataset.promo); track('view_promotion', { promotion_id: el.dataset.promo, promotion_name: el.dataset.promoName, creative_slot: el.dataset.slot }); }, 1000);
  else clearTimeout(el._t);
}), { threshold: .5 });
function observePromo() { $$('.plp-b2b', grid).forEach(el => promoIO.observe(el)); }
document.addEventListener('click', e => { const pr = e.target.closest('.plp-b2b__cta'); if (pr) { const el = pr.closest('[data-promo]'); track('select_promotion', { promotion_id: el.dataset.promo, promotion_name: el.dataset.promoName, creative_slot: el.dataset.slot }); } });

/* ---------- Bara de filtre: umbră doar când e lipită sub header ---------- */
new IntersectionObserver(([en]) => $('#plp-bar').classList.toggle('is-stuck', !en.isIntersecting), { rootMargin: '-57px 0px 0px 0px' }).observe($('.plp__sentinel'));

/* ---------- Pornire ---------- */
// La comutarea cu / fără TVA, filtrul de preț se aplică pe prețul afișat
hooks.vat.push(render);
render();
if (activeCount(sel) || sort !== 'best') track('filter_apply', null, { filter_source: 'url_intrare', filters: FACETS.filter(x => sel[x.key].size).map(x => `${x.key}:${[...sel[x.key]].join('.')}`).join('|') || 'niciunul', sort_type: sort, results: results(sel).length, item_list_id: LIST.id });
restoreScroll();
