/* OfficeDirect · comandă rapidă după cod (v28)
   De ce: în ultimele 12 luni, 5,3% din căutările pe site au fost coduri OfficeDirect (GA4, 04.11.2025-03.11.2026),
   aproape toate pe desktop, de la clienți care revin (circa 2.900 de oameni, în medie 18 căutări de cod fiecare).
   Le căutau unul câte unul. Aici le scriu sau le lipesc pe toate, verifică lista și pun tot în coș deodată.
   Lista acceptă: „cod cantitate” pe rând (spațiu, tab din Excel, punct și virgulă, „x”), mai multe coduri pe un rând,
   cod fără cantitate (= 1) și nume de produs. Problemele (cod greșit, stoc 0, culoare, set) apar primele și se rezolvă pe loc. */

const CTX = { list: 'comanda_rapida', listName: 'Comandă rapidă' };
const EXAMPLE = '323071715 20\n1500003 10\n304030914 5\n32307171 2\n311060909 1\n301111242 50\npix bic 30\n323071715 5';
// Exemplu pentru fila „Din comenzile tale” (în magazin vin din contul clientului)
const PAST = [
  { title: 'Comanda din 14 octombrie 2026', items: [['double-a', 10], ['capse', 5], ['file-noki', 4], ['tesa', 6], ['prosop', 12], ['hartie-igienica', 2]] },
  { title: 'Comanda din 16 septembrie 2026', items: [['ik-eco', 20], ['pix-bic', 30], ['etichete', 1], ['folie-laminare', 2]] },
  { title: 'Lista de favorite „Birou lunar”', items: [['xerox-business', 10], ['servetele', 1], ['manusi', 2], ['odorizant', 2], ['marker-pilot', 6]] },
];

let rows = [];
let listSource = null;   // numele listei din care a venit comanda (?lista=)
let lastReady = [];     // ce a intrat ultima dată în coș, pentru „Salvează ca listă”   // { uid, src, code, id, q, color, setChoice, status }
let uid = 0;

/* ---------- Citirea listei ---------- */
const CODE_RE = /^\d{7}$|^\d{9}$/;
function parse(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    // „5 x 323071715”, „323071715 x 5”, „323071715;5”, „323071715\t5”
    const toks = line.replace(/[;,\t|]+/g, ' ').replace(/(\d)\s*[x×*]\s*(\d)/gi, '$1 $2').split(/\s+/).filter(Boolean);
    const codeIdx = toks.map((t, i) => (/^\d{5,14}$/.test(t) ? i : -1)).filter(i => i >= 0);
    if (codeIdx.length) {
      // Fiecare cod ia numărul scurt de după el (sau de dinainte, dacă rândul începe cu cantitatea)
      codeIdx.forEach((ci, k) => {
        const next = toks[ci + 1], prev = toks[ci - 1];
        let q = 1;
        if (next && /^\d{1,4}$/.test(next)) q = Number(next);
        else if (k === 0 && prev && /^\d{1,4}$/.test(prev)) q = Number(prev);
        out.push({ src: line, code: toks[ci], q });
      });
      continue;
    }
    // Rând cu nume: ultimul număr scurt e cantitatea („pix bic 30”), dacă nu e lipit de o unitate
    const m = line.match(/^(.*\D)\s+(\d{1,4})$/);
    out.push({ src: line, name: (m ? m[1] : line).trim(), q: m ? Number(m[2]) : 1 });
  }
  return out;
}
const words = s => norm(s).replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 1);
function byName(name) {
  const w = words(name);
  if (!w.length) return [];
  return Object.keys(P).filter(id => {
    const hay = norm([P[id].name, P[id].brand, P[id].unit].filter(Boolean).join(' ')).replace(/[^a-z0-9 ]+/g, ' ');
    return w.every(x => hay.split(/\s+/).some(h => h.startsWith(x)));
  });
}
function resolve(item) {
  const r = { uid: ++uid, src: item.src, q: Math.max(1, Math.min(9999, item.q || 1)), color: null, setChoice: null };
  if (item.code) {
    r.code = item.code;
    if (!CODE_RE.test(item.code)) return { ...r, status: 'format' };
    r.id = byCode(item.code);
    if (!r.id) return { ...r, status: 'missing' };
  } else {
    const found = byName(item.name);
    r.name = item.name;
    if (found.length === 1) r.id = found[0];
    else if (found.length > 1) return { ...r, status: 'pick', options: found.slice(0, 4) };
    else return { ...r, status: 'missing' };
  }
  return check(r);
}
function check(r) {
  const p = P[r.id];
  if (p.stock === 0) r.status = 'stock';
  else if (p.colors && !r.color) r.status = 'color';
  else if (p.per && /^(Set|Bax)\b/.test(p.unit) && r.q >= p.per[0] && r.q % p.per[0] === 0 && !r.setChoice) r.status = 'set';
  else r.status = 'ok';
  return r;
}
// Același produs de două ori se adună într-un singur rând
function merge(list) {
  const out = [];
  for (const r of list) {
    const twin = r.id && r.status !== 'pick' && out.find(o => o.id === r.id && o.status !== 'pick' && o.color === r.color);
    if (twin) { twin.q = Math.min(9999, twin.q + r.q); twin.merged = (twin.merged || 1) + 1; check(twin); } else out.push(r);
  }
  return out;
}

/* ---------- Afișarea ---------- */
const QO_ORDER = { format: 0, missing: 0, pick: 1, color: 1, set: 1, stock: 2, ok: 3 };
const isReady = r => r.status === 'ok';
const lineTotal = r => round2(vatPrice(unitPrice(r.id, r.q)) * r.q);
function nextTier(r) {
  const p = P[r.id];
  if (!p.tiers) return '';
  const [one, many] = unitWord(p);
  const cur = [...p.tiers].reverse().find(([min]) => r.q >= min);
  const next = p.tiers.find(([min]) => r.q < min);
  if (cur && !next) return `<p class="qo__tier is-on"><i class="ph ph-check" aria-hidden="true"></i>Cel mai bun preț: ${pLei(cur[1])}/${one}</p>`;
  if (cur) return `<p class="qo__tier is-on"><i class="ph ph-check" aria-hidden="true"></i>Preț de volum ${pLei(cur[1])}/${one}. Încă ${cate(next[0] - r.q, many)} pentru ${pLei(next[1])}</p>`;
  return `<p class="qo__tier">Încă ${cate(next[0] - r.q, many)} pentru ${pLei(next[1])}/${one}</p>`;
}
function problemHTML(r) {
  const p = r.id && P[r.id];
  switch (r.status) {
    case 'format': return `<p class="qo__err" id="err-${r.uid}">Codul <b>${esc(r.code)}</b> are ${r.code.length} cifre. Codurile OfficeDirect au 7 sau 9.</p>${fixHTML(r)}`;
    case 'missing': return r.code
      ? `<p class="qo__err" id="err-${r.uid}">Nu găsim codul <b>${esc(r.code)}</b> în catalog. Verifică cifrele.</p>${fixHTML(r)}`
      : `<p class="qo__err" id="err-${r.uid}">Nu găsim un produs pentru „${esc(r.name)}”. Încearcă un cuvânt mai scurt sau codul.</p>${fixHTML(r)}`;
    case 'pick': return `<fieldset class="qo__pick"><legend>„${esc(r.name)}” se potrivește cu mai multe produse. Care e?</legend>
      ${r.options.map(id => `<label class="qo__opt"><input type="radio" name="pick-${r.uid}" value="${id}" data-pick="${r.uid}"><img src="${img(id)}" alt="" width="40" height="40"><span>${esc(P[id].name)}<small>${esc(P[id].unit)} · ${pLei(P[id].price)} ${vatLabel()}</small></span></label>`).join('')}</fieldset>`;
    case 'stock': return `<p class="qo__err qo__err--soft">Nu e în stoc acum, așa că nu intră în coș.</p><button class="text-btn" type="button" data-notify="${r.id}">Anunță-mă când revine</button>`;
    case 'color': return `<label class="qo__label qo__label--need" for="col-${r.uid}">Alege culoarea, ca să intre în coș</label>
      <select class="qo__select" id="col-${r.uid}" data-color="${r.uid}"><option value="">Alege</option>${p.colors.map(c => `<option>${c}</option>`).join('')}</select>`;
    case 'set': {
      const n = p.per[0], sets = r.q / n;
      return `<fieldset class="qo__pick qo__pick--set"><legend>Ai scris ${r.q}. Produsul se vinde la set de ${n}. Cât vrei?</legend>
        <button class="btn btn--secondary" type="button" data-set="${r.uid}" data-n="${sets}">${cate(sets, sets === 1 ? 'set' : 'seturi')} (${cate(r.q, p.per[1] === 'dosar' ? 'dosare' : 'buc.')})</button>
        <button class="btn btn--secondary" type="button" data-set="${r.uid}" data-n="${r.q}">${cate(r.q, 'seturi')}</button></fieldset>`;
    }
    default: return '';
  }
}
function fixHTML(r) {
  return `<form class="qo__fix" data-fix="${r.uid}" novalidate><label class="sr-only" for="fix-${r.uid}">Codul corect</label>
    <input class="field__input" id="fix-${r.uid}" value="${esc(r.code || r.name || '')}" placeholder="Codul corect" autocomplete="off" aria-invalid="true" aria-describedby="err-${r.uid}">
    <button class="btn btn--secondary" type="submit">Verifică</button></form>`;
}
function rowHTML(r) {
  const p = r.id && r.status !== 'pick' ? P[r.id] : null;
  const head = p
    ? `<img class="qo__img" src="${img(r.id)}" alt="" width="56" height="56">
       <div class="qo__info"><a class="qo__name" href="${pdpHref(r.id)}">${esc(p.name)}${r.color ? `, ${esc(r.color)}` : ''}</a>
       <p class="qo__meta">${p.code ? `Cod ${p.code} · ` : ''}${esc(p.unit)}${r.merged ? ` · adunat din ${r.merged} rânduri` : ''}${r.name && !r.code ? ` · găsit după „${esc(r.name)}”` : ''}</p></div>`
    : `<span class="qo__img qo__img--empty" aria-hidden="true"><i class="ph ph-info"></i></span>
       <div class="qo__info"><p class="qo__name">Rândul „${esc(r.src)}”</p></div>`;
  const ok = isReady(r);
  return `<li class="qo__row is-${r.status}" data-row="${r.uid}">
    ${head}
    <button class="icon-btn qo__del" type="button" data-del="${r.uid}" aria-label="Scoate din listă: ${esc(p ? p.name : r.src)}"><i class="ph ph-x" aria-hidden="true"></i></button>
    ${p && r.status !== 'stock' ? `<div class="qo__buy">
      <div class="step" role="group" aria-label="Cantitate: ${esc(p.name)}">
        <button type="button" data-rdec="${r.uid}" aria-label="Scade cantitatea"${r.q <= 1 ? ' disabled' : ''}><i class="ph ph-minus" aria-hidden="true"></i></button>
        <input type="text" inputmode="numeric" pattern="[0-9]*" value="${r.q}" maxlength="4" data-rq="${r.uid}" aria-label="Cantitate">
        <button type="button" data-rinc="${r.uid}" aria-label="Crește cantitatea"><i class="ph ph-plus" aria-hidden="true"></i></button>
      </div>
      <p class="qo__line">${ok ? `<b>${lei(lineTotal(r))}</b><small>${pLei(unitPrice(r.id, r.q))}/${/^1 /.test(p.unit) ? 'buc.' : p.unit.split(' ')[0].toLowerCase()}, ${vatLabel()}</small>` : '<small class="qo__wait"><i class="ph ph-info" aria-hidden="true"></i>încă nu intră în coș</small>'}</p>
    </div>` : ''}
    <div class="qo__extra">${ok ? nextTier(r) : problemHTML(r)}</div>
  </li>`;
}
// Ordinea (problemele sus) se face doar la verificare; la editare rândul rămâne pe loc, ca focusul să nu sară
const sortRows = () => rows.sort((a, b) => QO_ORDER[a.status] - QO_ORDER[b.status]);
function render(focusUid) {
  const ready = rows.filter(isReady), todo = rows.filter(r => !isReady(r) && r.status !== 'stock');
  const out = rows.filter(r => r.status === 'stock');
  $('#qo-res').hidden = !rows.length;
  $('#qo-res-title').textContent = `${listSource ? `Din „${listSource}”` : 'Lista ta'}: ${rows.length} ${rows.length === 1 ? 'rând' : 'rânduri'}`;
  $('#qo-sum').innerHTML = [
    ready.length && `<span class="qo__pill is-ok"><i class="ph ph-check" aria-hidden="true"></i>${ready.length} gata de pus în coș</span>`,
    todo.length && `<span class="qo__pill is-todo">${todo.length} de verificat</span>`,
    out.length && `<span class="qo__pill">${out.length} fără stoc</span>`,
  ].filter(Boolean).join('');
  $('#qo-rows').innerHTML = rows.map(rowHTML).join('');
  const total = round2(ready.reduce((s, r) => s + lineTotal(r), 0));
  const units = ready.reduce((s, r) => s + r.q, 0);
  $('#qo-bar').hidden = !rows.some(r => r.status !== 'stock');
  $('#qo-bar-t').innerHTML = ready.length
    ? `<b>${lei(total)} <small>${vatLabel()}</small></b><span>${ready.length} ${ready.length === 1 ? 'produs' : 'produse'}, ${units} buc.${todo.length ? ` <em class="qo__pill is-todo">${todo.length} de verificat</em>` : ''}</span>`
    : `<span>Rezolvă rândurile de mai sus ca să le pui în coș.</span>`;
  $('#qo-add').disabled = !ready.length;
  $('#qo-add').textContent = ready.length ? `Adaugă ${ready.length} în coș` : 'Adaugă în coș';
  if (focusUid) { const row = $(`[data-row="${focusUid}"]`); (row && ($('select, .qo__fix input, [data-set], .qo__pick input', row) || $('[data-rq]', row) || row.querySelector('a, button')))?.focus({ preventScroll: false }); }
}

/* ---------- Pașii ---------- */
function verify(text, source) {
  const items = parse(text);
  if (!items.length) { note('Scrie cel puțin un cod sau un nume de produs.'); $('#qo-text').focus(); return; }
  rows = merge([...rows, ...items.map(resolve)]);
  sortRows();
  $('#qo-done').hidden = true;
  render();
  const ready = rows.filter(isReady).length, todo = rows.length - ready;
  announce(`Am verificat ${items.length} ${items.length === 1 ? 'rând' : 'rânduri'}: ${ready} gata, ${todo} de verificat.`);
  track('quick_order_check', null, { source, lines: items.length, ready, problems: todo });
  const res = $('#qo-res');
  res.focus({ preventScroll: true });
  res.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
}
const rowOf = el => rows.find(r => r.uid === Number(el));
function setRowQ(r, q) { r.q = Math.max(1, Math.min(9999, q || 1)); r.setChoice = r.setChoice && r.q === r.setChoice ? r.setChoice : null; check(r); }

function addAll() {
  const ready = rows.filter(isReady);
  if (!ready.length) return;
  for (const r of ready) { const key = keyOf(r.id, r.color); state.cart[key] = Math.min(9999, (state.cart[key] || 0) + r.q); }
  store.set('cart', state.cart);
  renderCart(true);
  const total = round2(ready.reduce((s, r) => s + lineTotal(r), 0));
  track('add_to_cart', { currency: 'RON', value: round2(ready.reduce((s, r) => s + unitPrice(r.id, r.q) * r.q, 0)), items: ready.map((r, i) => gaItem(r.id, { ...CTX, index: i }, r.q, r.color || undefined)) });
  lastReady = ready.map(r => [keyOf(r.id, r.color || undefined), r.q]);
  rows = rows.filter(r => !isReady(r));
  const left = rows.length;
  const done = $('#qo-done');
  done.innerHTML = `<div class="qo__ok">
      <i class="ph ph-check-circle" aria-hidden="true"></i>
      <h2 class="h2" id="qo-done-title">Am pus ${ready.length} ${ready.length === 1 ? 'produs' : 'produse'} în coș</h2>
      <p class="qo__units">${ready.reduce((s, r) => s + r.q, 0)} bucăți în total</p>
      <p>${lei(total)} ${vatLabel()}. ${shipMessage(cartTotals().total).short}</p>
      <ul class="qo__thumbs">${ready.slice(0, 6).map(r => `<li><img src="${img(r.id)}" alt="" width="44" height="44"><span>${r.q}</span></li>`).join('')}</ul>
      <a class="btn btn--primary btn--block" href="#" data-open="sheet-cos">Vezi coșul</a>
      ${listSource ? '' : `<form class="qo__savelist" id="qo-savelist" novalidate>
        <label class="qo__label" for="qo-ln">Comanzi des aceleași produse? Salvează-le ca listă</label>
        <div class="lsave__row"><input class="field__input" id="qo-ln" value="Comanda din ${new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(new Date())}" maxlength="40" autocomplete="off"><button class="btn btn--secondary" type="submit">Salvează</button></div>
      </form>`}
      <button class="text-btn" type="button" id="qo-new">Fă altă listă</button>
    </div>${left ? `<p class="qo__left">${left === 1 ? 'Un rând a rămas în listă, nu a intrat în coș.' : `${left} rânduri au rămas în listă, nu au intrat în coș.`}</p>` : ''}`;
  done.hidden = false;
  render();
  $('#qo-bar').hidden = true;
  if (!left) $('#qo-res').hidden = true;
  announce(`Am pus ${ready.length} produse în coș.`);
  done.focus({ preventScroll: true });
  done.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Evenimente ---------- */
$('#qo-form').addEventListener('submit', e => { e.preventDefault(); const t = $('#qo-text').value; verify(t, 'lipire'); });
$('#qo-example').addEventListener('click', () => { $('#qo-text').value = EXAMPLE; verify(EXAMPLE, 'exemplu'); });
$('#qo-file').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { const t = String(rd.result).split(/\r?\n/).filter(l => /\d{7}/.test(l) || /[a-z]/i.test(l) && !/^(cod|code|sku)/i.test(l)).join('\n'); $('#qo-text').value = t; verify(t, 'fisier'); };
  rd.readAsText(f);
  e.target.value = '';
});
$('#qo-more').addEventListener('submit', e => {
  e.preventDefault();
  const c = $('#qo-more-code').value.trim(), q = $('#qo-more-q').value.replace(/\D/g, '') || '1';
  if (!c) { $('#qo-more-code').focus(); return; }
  verify(`${c} ${q}`, 'rand');
  $('#qo-more-code').value = ''; $('#qo-more-q').value = '1';
  $('#qo-more-code').focus();
});
$('#qo-add').addEventListener('click', addAll);
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-fix]');
  if (!f) return;
  e.preventDefault();
  const r = rowOf(f.dataset.fix), v = $('input', f).value.trim();
  if (!v) return;
  const fresh = resolve(/^\d+$/.test(v) ? { src: v, code: v, q: r.q } : { src: v, name: v, q: r.q });
  Object.assign(r, { ...fresh, uid: r.uid });
  rows = merge(rows.filter(x => x !== r).concat(r));
  render(r.uid);
  announce(isReady(r) ? `Găsit: ${P[r.id].name}.` : 'Tot nu găsim produsul.');
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-del], [data-rinc], [data-rdec], [data-set], #qo-new, [data-past], [data-ulist], [role="tab"]');
  if (!t) return;
  if (t.matches('[role="tab"]')) return selectTab(t);
  if (t.id === 'qo-new') { rows = []; listSource = null; $('#qo-done').hidden = true; $('#qo-text').value = ''; render(); $('#qo-text').focus(); return; }
  if (t.dataset.ulist) { const l = listsAll().find(x => x.id === t.dataset.ulist); if (l) { selectTab($('#tab-cod')); fromList(l, 'lista_din_fila'); } return; }
  if (t.dataset.past != null) {
    const o = PAST[t.dataset.past];
    const text = o.items.map(([id, q]) => `${P[id].code} ${q}`).join('\n');
    $('#qo-text').value = text;
    selectTab($('#tab-cod'));
    verify(text, 'comanda_anterioara');
    return;
  }
  const r = rowOf(t.dataset.del || t.dataset.rinc || t.dataset.rdec || t.dataset.set);
  if (!r) return;
  if (t.dataset.del) {
    const i = rows.indexOf(r); rows.splice(i, 1); render();
    announce('Rândul a fost scos din listă.');
    ($$('[data-del]')[Math.min(i, rows.length - 1)] || $('#qo-text')).focus();
    return;
  }
  const say = () => announce(isReady(r) ? `Cantitate ${r.q}, ${lei(lineTotal(r))} ${vatLabel()}.` : `Cantitate ${r.q}.`);
  if (t.dataset.rinc) { setRowQ(r, r.q + 1); render(); $(`[data-rinc="${r.uid}"]`)?.focus(); say(); return; }
  if (t.dataset.rdec) { setRowQ(r, r.q - 1); render(); ($(`[data-rdec="${r.uid}"]:not([disabled])`) || $(`[data-rinc="${r.uid}"]`))?.focus(); say(); return; }
  if (t.dataset.set) { r.q = Number(t.dataset.n); r.setChoice = r.q; check(r); render(r.uid); announce(`Cantitate: ${r.q}.`); }
});
document.addEventListener('change', e => {
  const sel = e.target.closest('[data-color]');
  if (sel) { const r = rowOf(sel.dataset.color); r.color = sel.value || null; check(r); render(r.uid); return; }
  const pick = e.target.closest('[data-pick]');
  if (pick) { const r = rowOf(pick.dataset.pick); r.id = pick.value; delete r.options; check(r); rows = merge(rows.filter(x => x !== r).concat(r)); render(r.uid); return; }
  const qi = e.target.closest('[data-rq]');
  if (qi) { const r = rowOf(qi.dataset.rq); setRowQ(r, Number(qi.value.replace(/\D/g, ''))); render(); $(`[data-rq="${r.uid}"]`)?.focus(); announce(isReady(r) ? `Cantitate ${r.q}, ${lei(lineTotal(r))} ${vatLabel()}.` : `Cantitate ${r.q}.`); }
});
document.addEventListener('keydown', e => { if (e.target.matches?.('[data-rq]') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); } });
document.addEventListener('input', e => { if (e.target.matches?.('[data-rq], #qo-more-q')) e.target.value = e.target.value.replace(/\D/g, ''); });
hooks.vat.push(() => render());

/* ---------- File (tabs) ---------- */
function selectTab(tab) {
  if (tab.id === 'tab-ist') $('#qo-done').hidden = true;
  $$('.qo__tabs [role="tab"]').forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; });
  tab.focus();
}
// Un link cu #liste deschide direct a doua filă (listele tale și comenzile de dinainte)
if (location.hash === '#liste' && !params.get('lista') && !params.get('coduri')) { selectTab($('#tab-ist')); $('#tab-ist').blur(); scrollTo(0, 0); }
$('.qo__tabs').addEventListener('keydown', e => {
  const tabs = $$('.qo__tabs [role="tab"]'), i = tabs.indexOf(document.activeElement);
  if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); return selectTab(e.key === 'Home' ? tabs[0] : tabs[tabs.length - 1]); }
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]);
});
function renderPast() {
  const mine = listsAll();
  $('#qo-lists').innerHTML = mine.length
    ? mine.map(l => `<li class="qo__order"><p class="qo__order-t">${esc(l.name)}</p>
        <p class="qo__order-m">${cate(l.items.length, l.items.length === 1 ? 'produs' : 'produse')} · ${lei(listTotal(l))} ${vatLabel()} la prețul de azi</p>
        <ul class="qo__thumbs">${l.items.slice(0, 6).map(([k, q]) => `<li><img src="${img(k.split('|')[0])}" alt="" width="44" height="44"><span>${q}</span></li>`).join('')}</ul>
        <button class="btn btn--secondary btn--block" type="button" data-ulist="${l.id}">Pune lista la verificat</button></li>`).join('') + '<li><a class="lsave__all" href="liste.html">Modifică listele</a></li>'
    : `<li class="qo__nolists">Încă nu ai liste. Apasă inima pe produsele pe care le comanzi des și le găsești aici, cu cantitatea obișnuită. <a href="liste.html?liste=demo">Vezi un exemplu</a></li>`;
}
renderPast();
hooks.lists.push(renderPast);
$('#qo-past').innerHTML = PAST.filter(o => !o.title.startsWith('Lista')).map((o, i) => {
  const total = o.items.reduce((s, [id, q]) => s + vatPrice(unitPrice(id, q)) * q, 0);
  return `<li class="qo__order"><p class="qo__order-t">${o.title}</p>
    <p class="qo__order-m">${o.items.length} produse · ${lei(round2(total))} ${vatLabel()} la prețul de azi</p>
    <ul class="qo__thumbs">${o.items.map(([id, q]) => `<li><img src="${img(id)}" alt="" width="44" height="44"><span>${q}</span></li>`).join('')}</ul>
    <button class="btn btn--secondary btn--block" type="button" data-past="${i}">Pune produsele în listă</button></li>`;
}).join('');

track('quick_order_view', null, { source: params.get('coduri') ? 'cautare' : (document.referrer.includes('index') ? 'homepage' : 'direct') });
// Din „Listele mele”: ?lista=<id> pune lista la verificat, cu cantitățile și culorile salvate
function fromList(l, source) {
  listSource = l.name;
  const items = l.items.map(([k, q]) => { const [id, c] = k.split('|'); return check({ uid: ++uid, src: P[id].name, code: P[id].code, id, q, color: c || null, setChoice: q }); });
  rows = merge([...rows, ...items]);
  sortRows();
  $('#qo-done').hidden = true;
  render();
  const ready = rows.filter(isReady).length;
  announce(`Lista „${l.name}”: ${ready} gata de pus în coș, ${rows.length - ready} de verificat.`);
  track('quick_order_check', null, { source, lines: items.length, ready, problems: rows.length - ready });
  const res = $('#qo-res'); res.focus({ preventScroll: true }); res.scrollIntoView({ behavior: 'auto', block: 'start' });
}
const fromParam = params.get('lista') && listsAll().find(l => l.id === params.get('lista'));
if (fromParam) fromList(fromParam, 'lista');
// Din căutare: „cautare.html” trimite aici codurile lipite (?coduri=323071715:20,1500003:10)
if (params.get('coduri')) {
  const t = params.get('coduri').split(',').map(x => x.replace(':', ' ')).join('\n');
  $('#qo-text').value = t;
  verify(t, 'cautare');
}

document.addEventListener('submit', e => {
  if (e.target.id !== 'qo-savelist') return;
  e.preventDefault();
  const name = $('#qo-ln').value.trim();
  if (!name) { $('#qo-ln').focus(); return; }
  const l = listNew(name, lastReady);
  track('list_create', null, { source: 'comanda_rapida', items: l.items.length });
  e.target.outerHTML = `<p class="qo__saved" tabindex="-1"><i class="ph ph-check-circle" aria-hidden="true"></i>Am salvat lista „${esc(l.name)}”. <a href="liste.html#lista-${l.id}">Vezi lista</a></p>`;
  $('.qo__saved').focus();
  announce(`Am salvat lista „${l.name}”.`);
});
