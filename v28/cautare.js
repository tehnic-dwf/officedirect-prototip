/* OfficeDirect · pagina de rezultate ale căutării (constatările 11-15; M.050-M.055, M.183-M.185)
   Termenul rămâne în câmp, cu X. O greșeală se corectează în tăcere: titlul și câmpul arată direct termenul bun, fără mesaje despre sistem.
   Rezultatele se pot restrânge la o categorie și se ordonează implicit după relevanță, nu după vânzări.
   Pentru „retur”, „livrare”, „factura”, „program” apare răspunsul înaintea produselor.
   Fără rezultate: căutări care merg, categorii, produse cumpărate des și telefonul. Starea stă în URL (q, cat, sort, n). */

const LIST = { id: 'cautare_rezultate', name: 'Căutare - rezultate' };
const PAGE = 24;
const url = new URLSearchParams(location.search);
const raw = (url.get('q') || '').trim().slice(0, 100);

/* ---------- Sortare: relevanța e implicită (constatarea 12); epuizatele rămân la final ---------- */
const SORTS = [
  { key: 'rel', label: 'Relevanță' },
  { key: 'best', label: 'Cele mai vândute', cmp: (a, b) => ORDER.get(a) - ORDER.get(b) },
  { key: 'pret-asc', label: 'Preț crescător', cmp: (a, b) => P[a].price - P[b].price },
  { key: 'pret-desc', label: 'Preț descrescător', cmp: (a, b) => P[b].price - P[a].price },
];
let sort = SORTS.some(s => s.key === url.get('sort')) ? url.get('sort') : 'rel';

const res = raw ? searchCatalog(raw) : { ids: [], fixes: [], dropped: [], scopes: [] };
const answers = raw ? searchAnswers(raw) : [];
const term = res.fixed || res.kept || raw;
let scope = res.scopes.some(([c]) => c === url.get('cat')) ? url.get('cat') : '';
let shown = Math.max(PAGE, Math.ceil((Number(url.get('n')) || PAGE) / PAGE) * PAGE);

const results = () => {
  const ids = scope ? res.ids.filter(id => subOf(id) === scope) : res.ids;
  const s = SORTS.find(x => x.key === sort);
  return s.cmp ? ids.slice().sort((a, b) => ((P[a].stock === 0) - (P[b].stock === 0)) || s.cmp(a, b)) : ids;
};

function syncUrl() {
  const u = new URLSearchParams({ q: raw });
  if (scope) u.set('cat', scope);
  if (sort !== 'rel') u.set('sort', sort);
  if (shown > PAGE) u.set('n', shown);
  if (params.has('debug')) u.set('debug', '1');
  history.replaceState(history.state, '', location.pathname + '?' + u.toString());
}
function afterClose(fn) {
  if (history.state && history.state.layer) addEventListener('popstate', () => setTimeout(fn, 0), { once: true });
  else fn();
}

/* ---------- Câmpul păstrează termenul, cu X pentru o căutare nouă (constatarea 14, M.053, M.185) ---------- */
// După o corectură, câmpul arată termenul bun, ca titlul: clientul vede doar ce a găsit
q.value = q.defaultValue = res.ids.length || answers.length ? term : raw;
clearBtn.hidden = !q.value;
document.title = raw ? `„${term}” · Căutare OfficeDirect` : 'Căutare · OfficeDirect';
// Căutarea intră în „recente” (măsurarea „search” s-a făcut deja la trimitere)
if (raw) { state.recent = [raw, ...state.recent.filter(t => t.toLowerCase() !== raw.toLowerCase())].slice(0, 5); store.set('recent', state.recent); }

/* ---------- Titlu și număr ---------- */
function renderHead() {
  const total = res.ids.length;
  const title = $('#srp-title');
  if (!raw) title.textContent = 'Ce cauți?';
  else if (!total && !answers.length) title.innerHTML = `Nu am găsit „${esc(raw)}”`;
  else title.innerHTML = `<span class="sr-only">Rezultate pentru </span>„${esc(term)}”`;
  const n = results().length;
  const label = produseN(scope ? n : total);
  $('#srp-count').textContent = total ? label[0].toUpperCase() + label.slice(1) : '';
}

/* ---------- Răspunsul rapid ---------- */
function renderAnswers() {
  $('#srp-answer').innerHTML = answers.map(a => `<section class="ans" aria-labelledby="ans-${a.key}">
      <i class="ph ${a.icon}" aria-hidden="true"></i>
      <div><h2 class="ans__title" id="ans-${a.key}">${a.text}</h2><p class="ans__text">${a.body}</p>
      <a class="ans__link" href="${a.href}" data-answer="${a.key}">${a.cta}<i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
    </section>`).join('');
}

/* ---------- Lista ---------- */
const grid = $('#srp-grid');
function render() {
  const all = results();
  const total = all.length;
  grid.innerHTML = all.slice(0, shown).map((id, i) => cardHTML(id, i + 1)).join('');
  observeCards(grid);
  const any = res.ids.length > 0;
  $('#srp-bar').hidden = !any || res.scopes.length < 2;
  $('#srp-meta').hidden = !any;
  grid.hidden = !any;
  // Categoriile apar doar când rezultatele sunt în mai multe locuri
  $('#scopes').innerHTML = res.scopes.length > 1 ? [['', res.ids.length], ...res.scopes].map(([c, n]) =>
    `<li><button class="scope" type="button" data-scope="${esc(c)}" aria-pressed="${c === scope}">${c ? esc(c) : 'Toate'}<span class="scope__n">${n}</span></button></li>`).join('') : '';
  $('#sort-label').textContent = SORTS.find(x => x.key === sort).label;
  const more = $('#more');
  more.hidden = total <= PAGE;
  $('#more-text').textContent = `Ai văzut ${Math.min(shown, total)} din ${produseN(total)}`;
  $('#more-fill').style.transform = `scaleX(${total ? Math.min(shown, total) / total : 0})`;
  const left = total - shown;
  $('#more-btn').hidden = left <= 0;
  $('#more-btn').textContent = `Vezi încă ${Math.min(PAGE, left)}`;
  renderHead();
}

/* ---------- Fără rezultate (sau doar un răspuns): căutări care merg, categorii, produse cerute des ---------- */
function renderZero() {
  const none = !res.ids.length;
  const zero = $('#srp-zero');
  zero.hidden = !none;
  if (!none) return;
  const onlyAnswer = answers.length > 0;
  $('#srp-popular').innerHTML = POPULAR.slice(0, 8).map(t => `<a class="chip" href="${serpHref(t)}" data-popular>${esc(t)}</a>`).join('');
  $('#srp-zero-more').hidden = onlyAnswer;
  if (!onlyAnswer) {
    const best = Object.keys(P).filter(id => P[id].best && P[id].stock !== 0).slice(0, 4);
    $('#srp-best').innerHTML = best.map((id, i) => cardHTML(id, i + 1)).join('');
    observeCards($('#srp-best'));
  }
}

/* ---------- Interacțiuni ---------- */
document.addEventListener('click', e => {
  const sc = e.target.closest('[data-scope]');
  if (sc && !sc.closest('#suggest')) {
    scope = sc.dataset.scope;
    shown = PAGE;
    render();
    syncUrl();
    track('filter_apply', null, { filter_source: 'cautare_categorie', filters: scope ? `categorie:${scope}` : 'niciunul', results: results().length, item_list_id: LIST.id, search_term: raw });
    $(`.scope[aria-pressed="true"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
    return;
  }
  if (e.target.closest('#more-btn')) {
    const first = shown;
    shown += PAGE;
    render();
    syncUrl();
    track('load_more', null, { item_list_id: LIST.id, shown: Math.min(shown, results().length) });
    $$('.card', grid)[first]?.querySelector('.card__name a')?.focus({ preventScroll: true });
    return;
  }
  const ans = e.target.closest('#srp-answer [data-answer]');
  if (ans) { track('select_content', null, { content_type: 'raspuns_cautare', content_id: ans.dataset.answer, search_term: raw }); return; }
  const pop = e.target.closest('[data-popular]');
  if (pop) saveSearch(pop.textContent, 'zero_rezultate');
});

function renderSorts() {
  $('#sorts').innerHTML = SORTS.map(s => `<label class="srow"><input type="radio" name="sort" value="${s.key}" ${s.key === sort ? 'checked' : ''}><span class="srow__dot" aria-hidden="true"></span><span class="srow__text">${s.label}${s.note ? `<small>${s.note}</small>` : ''}</span></label>`).join('');
}
$('#btn-sort').addEventListener('click', renderSorts);
$('#sorts').addEventListener('change', e => {
  sort = e.target.value;
  shown = PAGE;
  close();
  render();
  afterClose(() => { syncUrl(); track('sort_apply', null, { sort_type: sort, item_list_id: LIST.id, search_term: raw }); });
});

new IntersectionObserver(([en]) => $('#srp-bar').classList.toggle('is-stuck', !en.isIntersecting), { rootMargin: '-57px 0px 0px 0px' }).observe($('.plp__sentinel'));

/* ---------- Pornire ---------- */
renderAnswers();
render();
renderZero();
// GA4: rezultatele afișate, cu corectura și categoria; căutările fără rezultat au evenimentul lor, urmărit lunar (constatarea 11)
if (raw) {
  track('view_search_results', null, {
    search_term: raw, search_results: res.ids.length, search_mode: res.fixes.length ? 'corectat' : res.dropped.length ? 'partial' : 'normal',
    ...(res.fixed ? { search_term_corrected: res.fixed } : {}), ...(scope ? { search_scope: scope } : {}), ...(answers.length ? { search_answer: answers.map(a => a.key).join(',') } : {}),
  });
  if (!res.ids.length) track('search_zero_results', null, { search_term: raw, ...(answers.length ? { search_answer: answers.map(a => a.key).join(',') } : {}) });
}
restoreScroll();
