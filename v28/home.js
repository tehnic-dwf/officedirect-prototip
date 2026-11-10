/* OfficeDirect · homepage mobil v28: prim ecran, carusele, module pentru clienții care revin */

// Categoriile prototipate local deschid pagina din prototip; restul merg pe site
const LOCAL_CATS = { 'produse-din-hartie': 'categorie.html' };
const catHref = cat => LOCAL_CATS[cat] || SITE + cat;

const TABS = [
  { key: 'hartie', label: 'Hârtie', cat: 'produse-din-hartie', more: 'Toată hârtia copiator', ids: ['double-a', 'ik-eco', 'xerox-business', 'xerox-premier', 'go-paper', 'etichete'] },
  { key: 'arhivare', label: 'Arhivare', cat: 'organizare-si-arhivare', more: 'Tot pentru arhivare', ids: ['biblioraft-5', 'dosar-accenta', 'file-noki', 'biblioraft-75-culori', 'container-drect'] },
  { key: 'curatenie', label: 'Curățenie', cat: 'curatenie-si-protocol', more: 'Toată curățenia și protocolul', ids: ['hartie-igienica', 'prosop', 'servetele', 'manusi', 'odorizant'] },
  { key: 'afisare', label: 'Afișare', cat: 'sisteme-de-afisare', more: 'Toate sistemele de afișare', ids: ['marker-pilot', 'display-l', 'tabla'] },
  { key: 'accesorii', label: 'Accesorii', cat: 'accesorii-pentru-birou', more: 'Toate accesoriile de birou', ids: ['folie-laminare', 'capse', 'tesa', 'pix-bic'] },
];
const NEW_POOL = ['nou-dosar-multi', 'nou-tabla-90', 'nou-baterii', 'nou-lampa', 'nou-cablu', 'nou-calendar'];

// Variante de prim ecran pentru comparație (?hero=a|b|c|d): rămâne doar cea aleasă
// Varianta o alege scriptul din <head> (clasa hv-*); o citim de acolo, ca să nu poată diferi
const HERO_V = (document.documentElement.className.match(/\bhv-([a-s])\b/) || [, 's'])[1];  // S implicită din 10.11.2026 (decizia Georgianei); G rămâne la ?hero=g
// S: fotografia benzii, la alegere (Pexels, licență gratuită; se descarcă local după ce e aleasă)
// Implicit e fotografia C (bibliorafturi), aleasă de Georgiana pe 09.11.2026 și salvată local; A și B rămân doar pentru comparație
const S_PHOTOS = {
  a: { id: 37514316, pos: '50% 45%' },  // produse colorate pe birou bleumarin
  b: { id: 7718706, pos: '40% 50%' },   // compoziție premium, gri închis, accent portocaliu
};
const hsImg = document.getElementById('hs-img');
const sAlt = hsImg && S_PHOTOS[params.get('foto')];
if (sAlt) {
  hsImg.removeAttribute('srcset');
  hsImg.src = `https://images.pexels.com/photos/${sAlt.id}/pexels-photo-${sAlt.id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
  hsImg.style.objectPosition = sAlt.pos;
}
// Runda 5 (m, n, o): primesc panoul lui G (căutarea și blocul pentru firme), cu căutările cele mai dese din GA4 pe chips
const slot = document.querySelector(`[data-hero="${HERO_V}"] [data-sheet]`);
if (slot) {
  const sheet = document.querySelector('[data-hero="g"] .hp__sheet');
  slot.replaceWith(sheet);
  const chips = [['Biblioraft', 'biblioraft'], ['Hârtie A4', null], ['Capsator', 'capsator'], ['Plicuri', 'plicuri'], ['Etichete', 'etichete'], ['Toner', 'toner']];
  // P: blocul pentru firme coboară sub categorii, ca primul ecran să fie căutare + categorii
  const fslot = document.querySelector(`[data-hero="${HERO_V}"] [data-firma-slot]`);
  if (fslot) fslot.replaceWith(sheet.querySelector('.hero__guest'));
  sheet.querySelector('.he__chips').innerHTML = chips.map(([t, q]) => `<li><a class="he__chip" href="${q ? 'cautare.html?q=' + q : 'categorie.html?fmt=A4'}">${t}</a></li>`).join('');
}
document.querySelectorAll('[data-hero]').forEach(el => { if (el.dataset.hero !== HERO_V) el.remove(); });
if (document.querySelector('.hb__search')) document.querySelector('.hb__search').append(document.getElementById('hsearch'));
if (HERO_V === 'c') document.querySelector('#noutati #feature')?.remove();

const savedTab = store.get('tab', 'hartie', sessionStorage);

state.tab = TABS.some(t => t.key === savedTab) ? savedTab : 'hartie';

if (params.has('revine') && !state.viewed.length) state.viewed = ['biblioraft-5', 'double-a', 'prosop'];

// Noutățile se amestecă uniform (Fisher-Yates) o dată pe sesiune, ca poziția să nu decidă singură performanța
let newOrder = store.get('newOrder', null, sessionStorage);
if (!Array.isArray(newOrder) || newOrder.length !== NEW_POOL.length || newOrder.some(id => !P[id])) {
  const a = [...NEW_POOL];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  newOrder = a;
  store.set('newOrder', newOrder, sessionStorage);
}

/* ---------- Rail-uri cu progres ---------- */
function bindProgress(rail) {
  const bar = rail.parentElement.querySelector('.rail__progress span');
  if (!bar || rail.dataset.progress) return;
  rail.dataset.progress = '1';
  let raf;
  const update = () => { raf = null; const p = Math.min(1, (rail.scrollLeft + rail.clientWidth) / rail.scrollWidth); bar.style.setProperty('--p', p.toFixed(3)); };
  rail.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  new ResizeObserver(update).observe(rail);
  update();
  rail._updateProgress = update;
}

/* ---------- Tab-uri ---------- */
const tabsEl = $('#ess-tabs');
const ink = $('.tabs__ink');
const railEl = $('#ess-rail');
const moreEl = $('#ess-more');
function renderTabs() {
  tabsEl.insertAdjacentHTML('beforeend', TABS.map(t => `<button class="tab" type="button" role="tab" id="tab-${t.key}" aria-controls="ess-panel" aria-selected="${t.key === state.tab}" tabindex="${t.key === state.tab ? 0 : -1}" data-tab="${t.key}">${t.label}</button>`).join(''));
}
function moveInk() {
  const b = $(`[data-tab="${state.tab}"]`, tabsEl);
  if (!b) return;
  ink.style.width = b.offsetWidth + 'px';
  ink.style.transform = `translateX(${b.offsetLeft}px)`;
}
function renderRail(animate) {
  const t = TABS.find(x => x.key === state.tab);
  railEl.dataset.list = `hp_reaprovizionare_${t.key}`;
  railEl.dataset.listName = `Homepage - Reaprovizionare - ${t.label}`;
  const html = t.ids.filter(inStock).map((id, i) => cardHTML(id, i + 1, 'best')).join('') +
    `<li class="card card--more"><a href="${catHref(t.cat)}"><i class="ph ph-arrow-right" aria-hidden="true"></i>${t.more}</a></li>`;
  const swap = () => {
    railEl.innerHTML = html;
    $('#ess-panel').setAttribute('aria-labelledby', 'tab-' + t.key);
    railEl.scrollLeft = 0;
    moreEl.href = catHref(t.cat);
    moreEl.setAttribute('aria-label', t.more);
    observeCards(railEl);
    railEl._updateProgress?.();
  };
  if (!animate || reduce.matches) return swap();
  railEl.classList.add('is-swapping');
  setTimeout(() => { swap(); requestAnimationFrame(() => railEl.classList.remove('is-swapping')); }, 160);
}
function selectTab(key, focus) {
  if (key === state.tab) return;
  state.tab = key;
  store.set('tab', key, sessionStorage);
  $$('.tab', tabsEl).forEach(b => { const on = b.dataset.tab === key; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  moveInk();
  const b = $(`[data-tab="${key}"]`, tabsEl);
  b.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
  if (focus) b.focus({ preventScroll: true });
  renderRail(true);
}
tabsEl.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) selectTab(b.dataset.tab); });
tabsEl.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const i = TABS.findIndex(t => t.key === state.tab);
  const n = e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
  selectTab(TABS[n].key, true);
});
addEventListener('resize', () => { tabsEl.classList.add('no-anim'); moveInk(); requestAnimationFrame(() => tabsEl.classList.remove('no-anim')); });

/* ---------- Noutăți ---------- */
function renderNew() {
  const rail = $('#new-rail');
  rail.innerHTML = newOrder.filter(inStock).map((id, i) => cardHTML(id, i + 2, 'new')).join('') +
    `<li class="card card--more"><a href="${SITE}" data-proto="noutati"><i class="ph ph-arrow-right" aria-hidden="true"></i>Toate produsele noi</a></li>`;
  observeCards(rail);
}


/* ---------- Tabelul de volum (praguri reale de pe PDP) ---------- */
function renderTier() {
  const p = P['biblioraft-5'];
  const rows = [[1, p.price], ...p.tiers];
  $('#tier-rows').innerHTML = rows.map(([q, v], i) => {
    const save = Math.floor((1 - v / p.price) * 100);
    const label = i === 0 ? `1-${rows[1][0] - 1}` : `${q}+`;
    return `<tr class="${i === rows.length - 1 ? 'is-best' : ''}"><td>${label} buc.</td><td>${lei(v)}</td><td>${lei(net(v))}</td><td>${save ? `-${save}%` : '<span class="sr-only">fără reducere</span>'}</td></tr>`;
  }).join('');
}
new IntersectionObserver(([en], obs) => { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.disconnect(); } }, { threshold: .4 }).observe($('.tier'));

/* ---------- Campania din slotul 1 ---------- */
function promoPayload() {
  const f = $('#feature');
  return { promotion_id: f.dataset.promo, promotion_name: f.dataset.promoName, creative_slot: f.dataset.slot || 'hp_noutati_1', items: [gaItem('nou-calendar', { list: 'hp_noutati', listName: 'Homepage - Nou în catalog', index: 1 })] };
}
let promoTimer;
new IntersectionObserver(([en], obs) => {
  if (en.isIntersecting) promoTimer = setTimeout(() => { track('view_promotion', promoPayload()); obs.disconnect(); }, 1000);
  else clearTimeout(promoTimer);
}, { threshold: .5 }).observe($('#feature'));
const renderInline = () => $$('[data-price-inline]').forEach(el => { el.textContent = `${pLei(P[el.dataset.priceInline].price)} ${vatLabel()}`; });
renderInline();


function renderResume() {
  const sec = $('#resume');
  const ids = state.viewed.filter(id => P[id] && inStock(id));
  sec.hidden = !ids.length;
  if (!ids.length) return;
  $('#resume-list').innerHTML = ids.map((id, i) => {
    const q = qtyOf(id);
    const p = P[id];
    return `<li class="mini" data-card="${id}" data-index="${i + 1}">
      <img src="${img(id)}" alt="" width="64" height="64" loading="lazy">
      <span><a class="mini__name" href="${pdpHref(id)}" data-select="${id}">${p.name}</a><span class="mini__price">${pLei(p.price)} ${vatTag()}${q ? `<span class="mini__in"> · ${q} în coș</span>` : ''}</span>${p.old ? `<span class="mini__was">${wasHTML(p)}</span>` : ''}</span>
      <button class="mini__add" type="button" data-add="${id}" aria-label="${p.colors ? `Alege culoarea: ${p.name}` : q ? `Adaugă încă una: ${p.name}` : `Adaugă în coș: ${p.name}`}"><i class="ph ph-plus" aria-hidden="true"></i></button>
    </li>`;
  }).join('');
  observeCards($('#resume-list'));
}
$('#resume-clear').addEventListener('click', () => { state.viewed = []; store.set('viewed', []); renderResume(); });

$('.finder__form').addEventListener('submit', e => {
  const term = $('#printer').value.trim();
  if (!term) { e.preventDefault(); $('#printer').focus(); return; }
  track('search', null, { search_term: term, search_type: 'cartuse' });
});

/* ---------- Reia ultima comandă: firmele cumpără des aceleași produse ---------- */
const LAST_ORDER = { date: '14 octombrie', items: [['double-a', 10], ['biblioraft-5|verde', 12], ['capse', 5], ['tesa', 6], ['prosop', 4], ['file-noki', 2], ['servetele', 3]] };
const member = params.has('revine');
function renderAgain() {
  const box = $('.hero__member');
  if (!box) return;
  $('.hero__guest').hidden = member;
  // Clientul care revine știe deja ce e OfficeDirect: îl întrebăm direct ce comandă
  // Prezentarea magazinului (descriere, rating) e pentru clientul nou; cel care revine vede direct ultima comandă
  if (member && $('#he-title')) { $('#he-title').textContent = 'Ce comanzi azi pentru birou?'; $$('.he__lead, .hp__lead, .hp__rating, .hp__facts').forEach(el => el.setAttribute('hidden', '')); }
  box.hidden = !member;
  if (!member) return;
  const n = LAST_ORDER.items.length;
  const total = round2(LAST_ORDER.items.reduce((s, [k, q]) => s + q * unitPrice(k.split('|')[0], q), 0));
  box.innerHTML = `<div class="again">
    <p class="again__kicker">Ultima comandă, ${LAST_ORDER.date}</p>
    <p class="again__sum">${n} produse · ${pLei(total)} ${vatLabel()}</p>
    <ul class="again__thumbs">${LAST_ORDER.items.slice(0, 4).map(([k]) => `<li><img src="${img(k.split('|')[0])}" alt="" width="40" height="40"></li>`).join('')}${n > 4 ? `<li>+${n - 4}</li>` : ''}</ul>
    <button class="btn btn--primary btn--block" type="button" data-reorder>Comandă din nou</button>
    <a class="again__link" href="${SITE}index.php?route=account/order">Vezi toate comenzile</a>
  </div>`;
}
// Pune o listă întreagă în coș dintr-un tap: ultima comandă sau lista de birou
function addList(list, ctx, message) {
  const items = list.map(([k, q], i) => {
    const [id, color] = k.split('|');
    const before = state.cart[id] || 0;
    state.cart[k] = (state.cart[k] || 0) + q;
    refreshCard(id, before);
    return gaItem(id, { ...ctx, index: i + 1 }, q, color);
  });
  store.set('cart', state.cart);
  renderResume();
  renderCart(true);
  track('add_to_cart', { currency: 'RON', value: round2(items.reduce((s, it) => s + it.price * it.quantity, 0)), items });
  announce(message);
  open('sheet-cos');
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-reorder]')) addList(LAST_ORDER.items, { list: 'hp_reia_comanda', listName: 'Homepage - Reia comanda' }, `Am pus în coș cele ${LAST_ORDER.items.length} produse din ultima comandă.`);
  else if (e.target.closest('[data-kit]')) addList(KIT, { list: 'hp_lista_birou', listName: 'Homepage - Lista de birou' }, 'Am pus lista de birou în coș.');
});

/* ---------- Vitrina și lista de birou (variantele F și H) ---------- */
const WALL = ['double-a', 'biblioraft-75-culori', 'nou-calendar', 'prosop', 'tesa', 'nou-baterii'];
const KIT = [['double-a', 5, 'Hârtie A4'], ['pix-bic', 20, 'Pix BIC'], ['capse', 3, 'Capse 24/6'], ['tesa', 4, 'Bandă adezivă'], ['prosop', 6, 'Prosop de hârtie']];

/* ---------- Blocul pentru firme din primul ecran (?firma=1, 2, 3), măsurat ca promoție ---------- */
const FIRMA = [...$$('[data-firma]')].find(el => getComputedStyle(el).display !== 'none');
if (FIRMA) {
  // Prețurile de volum vin din catalog, ca să rămână aceleași cu pagina produsului
  const da = P['double-a'];
  const rows = [[1, da.price], ...da.tiers.filter(([q]) => q !== 100)];
  const t1 = $('#hf1-tiers');
  if (t1) { t1.style.setProperty('--n', rows.length); t1.innerHTML = rows.map(([q, v], i) => `<span>${q === 1 ? '1 top' : `${q}+ topuri`}<b>${money.format(v)}</b>${i ? `<em>-${Math.floor((1 - v / da.price) * 100)}%</em>` : ''}</span>`).join(''); }
  const kitSum = round2(KIT.reduce((s, [id, q]) => s + q * unitPrice(id, q), 0));
  const sub = $('#hf3-sub');
  if (sub) sub.innerHTML = `${KIT.map(([, , label]) => label).join(', ')}: <b>${pLei(kitSum)}</b> ${vatLabel()}`;
  const th = $('#hf3-thumbs');
  if (th) th.innerHTML = KIT.map(([id, q]) => `<li><img src="${img(id)}" alt="" width="40" height="40"><span>${q}</span></li>`).join('');
  const promo = { promotion_id: FIRMA.dataset.firma, promotion_name: 'Prim ecran - pentru firme', creative_slot: 'hp_prim_ecran' };
  if (!member) track('view_promotion', promo);
  FIRMA.addEventListener('click', e => { if (e.target.closest('a, button')) track('select_promotion', promo); });
}

function renderWall() {
  const wall = $('.hf__wall');
  if (!wall) return;
  wall.innerHTML = WALL.filter(inStock).map((id, i) => `<li data-card="${id}" data-index="${i + 1}"><a href="${pdpHref(id)}" data-select="${id}"><img src="${img(id)}" alt="" width="120" height="120"><span class="hf__price">${P[id].isNew ? '<b>Nou</b> ' : ''}${pLei(P[id].price)}</span><span class="sr-only">${P[id].name}</span></a></li>`).join('');
  observeCards(wall);
}
const STRIP = ['double-a', 'biblioraft-75-culori', 'prosop', 'nou-calendar'];
function renderStrip() {
  const strip = $('.hp__strip');
  if (!strip) return;
  strip.innerHTML = STRIP.filter(inStock).map((id, i) => `<li data-card="${id}" data-index="${i + 1}"><a href="${pdpHref(id)}" data-select="${id}"><img src="${img(id)}" alt="" width="72" height="72"><span>${pLei(P[id].price)}</span><span class="sr-only">${P[id].name}</span></a></li>`).join('');
  observeCards(strip);
}
function renderKit() {
  const list = $('.kit__lines');
  if (!list) return;
  let total = 0;
  list.innerHTML = KIT.map(([id, q, label], i) => {
    const line = round2(q * unitPrice(id, q));
    total += line;
    return `<li data-card="${id}" data-index="${i + 1}"><img src="${img(id)}" alt="" width="40" height="40"><span class="kit__name">${label}</span><span class="kit__qty">${q} ×</span><span class="kit__line">${pLei(line)}</span></li>`;
  }).join('');
  $('.kit__sum').textContent = `${pLei(round2(total))} ${vatLabel()}`;
  observeCards(list);
}


/* ---------- Video în primul ecran: copertă imediat, filmul abia după încărcare ---------- */
// Nu pornește la mișcare redusă sau la economie de date; se oprește când iese din ecran
const heroVideo = document.querySelector('.hp__scene video[data-src]');
if (heroVideo && !reduce.matches && !navigator.connection?.saveData) {
  addEventListener('load', () => {
    heroVideo.src = heroVideo.dataset.src;
    heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'), { once: true });
    new IntersectionObserver(([en]) => { en.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause(); }).observe(heroVideo);
  }, { once: true });
}


/* ---------- Pornire ---------- */
hooks.cart.push(renderResume);
// Comutatorul cu / fără TVA: cardurile se redesenează din core.js; aici, restul prețurilor din pagină
hooks.vat.push(renderResume, renderInline, renderWall, renderStrip, renderKit, () => {
  const sum = $('.again__sum');
  if (sum) sum.textContent = `${LAST_ORDER.items.length} produse · ${pLei(round2(LAST_ORDER.items.reduce((s, [k, q]) => s + q * unitPrice(k.split('|')[0], q), 0)))} ${vatLabel()}`;
});
renderTabs();
renderRail(false);
renderNew();
renderResume();
renderAgain();
renderWall();
renderStrip();
renderKit();
renderTier();
$$('.rail').forEach(bindProgress);
const startInk = () => { tabsEl.classList.add('no-anim'); moveInk(); requestAnimationFrame(() => tabsEl.classList.remove('no-anim')); };
startInk();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(startInk);
restoreScroll();
