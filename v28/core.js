/* OfficeDirect · cod comun pentru paginile mobile v28 (catalog, coș, căutare, foi, carduri, măsurare)
   Prețuri, stocuri, culori și praguri de volum verificate pe officedirect.ro la 29.10.2026 (cu TVA 21%).
   Coșul și istoricul sunt locale: prototipul nu plasează comenzi.
   Măsurare: evenimente GA4 ecommerce în dataLayer; ?debug=1 le afișează pe ecran. */

const VAT = 1.21;
const SHIP_BUC = 200;
const SHIP_RO = 300;
const SITE = 'https://www.officedirect.ro/';

const CATS = {
  'Hârtie': 'produse-din-hartie', 'Arhivare': 'organizare-si-arhivare', 'Curățenie': 'curatenie-si-protocol',
  'Afișare': 'sisteme-de-afisare', 'Accesorii': 'accesorii-pentru-birou', 'Scris': 'instrumente-de-scris',
  'Tehnică': 'tehnica-de-birou', 'IT': 'accesorii-it',
};
const COLOR = {
  'negru': '#1F1F22', 'bleumarin': '#1F2A5A', 'albastru': '#2F6FD1', 'roșu': '#D7262F', 'verde': '#2E9B4F',
  'galben': '#F2C230', 'portocaliu': '#F07A1A', 'turcoaz': '#1FB3B0', 'alb': '#FFFFFF', 'violet': '#7B4FC2',
  'gri': '#9A9AA0', 'bordo': '#7A1E35', 'fucsia': '#D63E9B', 'mov': '#6B3FA0', 'gri închis': '#55565C',
  'roz': '#F2A1C0', 'verde deschis': '#8BD17C', 'verde închis': '#1E5E3A',
};
const BIB = ['negru', 'bleumarin', 'albastru', 'roșu', 'verde', 'galben', 'portocaliu', 'turcoaz', 'alb', 'violet', 'gri', 'bordo', 'fucsia'];

const P = {
  'ik-eco': { brand: 'IK', cat: 'Hârtie', name: 'Hârtie copiator IK Eco A4, 80 g/mp', unit: 'Top de 500 de coli', price: 16.99, old: 18.99, url: 'produse-din-hartie/hartie-multifunctionala/hartie-copiator-ik-eco-a4-80-g-mp-500-coli-top' },
  'double-a': { best: true, brand: 'Double A', cat: 'Hârtie', name: 'Hârtie Double A Premium A4, 80 g/mp', unit: 'Top de 500 de coli', price: 24.99, tiers: [[50, 23.99], [100, 22.99], [300, 21.99]], url: 'produse-din-hartie/hartie-multifunctionala/hartie-absolut-paper-a4-80-g-mp-clone' },
  'xerox-premier': { brand: 'Xerox', cat: 'Hârtie', name: 'Hârtie Xerox Premier A4, 80 g/mp', unit: 'Top de 500 de coli', price: 22.99, url: 'produse-din-hartie/hartie-multifunctionala/hartie-xerox-premier-a4-80-g-mp' },
  'xerox-business': { brand: 'Xerox', cat: 'Hârtie', name: 'Hârtie Xerox Business A4, 80 g/mp', unit: 'Top de 500 de coli', price: 21.99, tiers: [[50, 20.99], [100, 19.99], [300, 18.99]], url: 'produse-din-hartie/hartie-multifunctionala/hartie-xerox-business-a4-80-g-mp' },
  'go-paper': { brand: 'Go Paper', cat: 'Hârtie', name: 'Hârtie Go Paper Premium A4, 80 g/mp', unit: 'Top de 500 de coli', price: 18.99, url: 'produse-din-hartie/hartie-multifunctionala/hartie-copiator-go-paper-premium-a4-80-g-mp-500-coli-top' },
  'etichete': { brand: 'Fleks-ko', cat: 'Hârtie', name: 'Etichete autocolante albe, colțuri drepte', unit: 'Top de 100 de coli', price: 42.90, per: [100, 'coală'], tiers: [[10, 39.90], [50, 36.90]], url: 'produse-din-hartie/etichete-autocolante/etichete-autocolante-albe-colturi-drepte-100-coli-top-fleks-ko' },

  'biblioraft-5': { brand: 'Accenta', cat: 'Arhivare', name: 'Biblioraft A4, 5 cm, plastifiat', unit: '1 bucată', price: 9.49, colors: BIB, tiers: [[25, 8.99], [100, 8.49], [200, 7.99]], url: 'organizare-si-arhivare/bibliorafturi/biblioraft-plastifiat-interior-exterior-pp-5-cm-accenta' },
  'biblioraft-75-culori': { brand: 'Accenta', cat: 'Arhivare', name: 'Biblioraft A4, 7,5 cm, plastifiat', unit: '1 bucată', price: 9.49, colors: BIB, tiers: [[25, 8.99], [100, 8.49], [200, 7.99]], url: 'organizare-si-arhivare/bibliorafturi/biblioraft-plastifiat-pp-75mm-accenta' },
  'dosar-accenta': { brand: 'Accenta', cat: 'Arhivare', name: 'Dosar plastic cu șină și găuri', unit: 'Set de 25 de bucăți', price: 19.99, per: [25, 'dosar'], colors: ['negru', 'bleumarin', 'albastru', 'roșu', 'verde', 'galben', 'portocaliu', 'mov', 'violet', 'alb', 'bordo', 'gri', 'gri închis', 'roz', 'verde deschis', 'verde închis'], tiers: [[4, 18.75], [12, 17.50], [24, 16.25]], url: 'organizare-si-arhivare/dosare-din-plastic/dosar-plastic-cu-sina-si-gauri-accenta-25-buc-set' },
  'file-noki': { brand: 'Noki', cat: 'Arhivare', name: 'File de protecție transparente, 38 microni', unit: 'Set de 100 de bucăți', price: 12.99, per: [100, 'filă'], tiers: [[30, 12.25], [60, 11.49]], url: 'organizare-si-arhivare/file-protectie-documente/file-protectie-transparente-100buc-set' },
  'container-drect': { brand: 'D.Rect', cat: 'Arhivare', name: 'Container de arhivare pentru 5 bibliorafturi', unit: '1 bucată', price: 11.99, tiers: [[50, 10.99], [150, 9.99]], url: 'organizare-si-arhivare/cutii-de-arhivare-alonje/container-arhivare-5-bibliorafturi-drect' },

  'hartie-igienica': { brand: 'Smartline', cat: 'Curățenie', name: 'Hârtie igienică mini jumbo, 2 straturi', unit: 'Set de 12 role', price: 74.90, per: [12, 'rolă'], tiers: [[5, 69.90], [10, 64.90]], url: 'curatenie-si-protocol/hartie-igienica/hartie-igienica-mini-jumbo-smartline-2-straturi-95-m-rola-12-role-set' },
  'servetele': { brand: 'Accenta', cat: 'Curățenie', name: 'Servețele pliate în V pentru dispenser', unit: 'Bax de 20 de seturi', price: 119.80, old: 139.80, per: [20, 'set'], url: 'curatenie-si-protocol/prosoape-hartie/servetele-dispenser-in-v-21x25-cm-2-straturi-150-buc-set-20-seturi-bax-accenta' },
  'prosop': { best: true, brand: 'Accenta', cat: 'Curățenie', name: 'Prosop de hârtie, 100 m, 2 straturi', unit: '1 rolă', price: 14.90, old: 16.90, url: 'curatenie-si-protocol/prosoape-hartie/prosop-hartie-accenta-100-m-2-straturi' },
  'manusi': { brand: '', sub: 'Protecție', cat: 'Curățenie', name: 'Mănuși din nitril', unit: 'Cutie de 100 de bucăți', price: 32.90, per: [100, 'buc.'], url: 'curatenie-si-protocol/manusi-si-masca-protectie/manusi-din-nitril-100-buc-set' },
  'odorizant': { brand: 'Eyfel', cat: 'Curățenie', name: 'Odorizant de cameră cu bețișoare, 120 ml', unit: '1 bucată', price: 25.90, url: 'curatenie-si-protocol/odorizante/odorizant-de-camera-cu-betisoare-eyfel-120-ml' },

  'tabla': { brand: 'Accenta', cat: 'Afișare', name: 'Tablă magnetică albă, 120 × 240 cm', unit: '1 bucată', price: 429.90, url: 'sisteme-de-afisare/table-magnetice/tabla-magnetica-accenta-120x240-cm' },
  'display-l': { stock: 0, brand: 'Accenta', cat: 'Afișare', name: 'Display de prezentare în formă de L, A4', unit: '1 bucată', price: 19.90, old: 20.90, url: 'sisteme-de-afisare/display-uri-de-prezentare/display-plastic-pentru-prezentare-forma-l-a4-transparent-portrait-accenta' },
  'marker-pilot': { brand: 'Pilot', cat: 'Afișare', name: 'Marker whiteboard reîncărcabil V-Board Master M', unit: '1 bucată', price: 6.90, colors: ['negru', 'albastru', 'roșu', 'verde', 'portocaliu'], url: 'instrumente-de-scris/markere-flipchart-si-whiteboard/marker-whiteboard-reincarcabil-pilot-v-board-master' },

  'folie-laminare': { brand: 'Accenta', cat: 'Accesorii', name: 'Folie de laminare A4, 80 microni', unit: 'Top de 100 de bucăți', price: 20.99, old: 24.99, per: [100, 'folie'], url: 'tehnica-de-birou/folii-laminare/folie-laminare-a4-80-microni-accenta-100-buc-top' },
  'capse': { brand: 'Kangaro', cat: 'Accesorii', name: 'Capse 24/6', unit: 'Cutie de 1.000 de bucăți', price: 2.30, url: 'accesorii-pentru-birou/capse-decapsatoare/capse-24-6-1000-buc-cutie-kangaro' },
  'tesa': { brand: 'tesa', cat: 'Accesorii', name: 'Bandă adezivă transparentă, 48 mm × 66 m', unit: '1 rolă', price: 6.49, tiers: [[36, 5.89]], url: 'accesorii-pentru-birou/benzi-adezive-dispencere/banda-adeziva-transparenta-48mm-x-66m-43-microni-tesa-4280' },
  'pix-bic': { brand: 'BIC', cat: 'Scris', name: 'Pix BIC Round Stic Classic, 1 mm', unit: '1 bucată', price: 1.25, url: 'instrumente-de-scris/pixuri-fara-mecanism/pix-fara-mecanism-bic-round-stic-classic' },

  // Din lista „Cele mai noi produse” de pe officedirect.ro, cu stoc verificat
  'nou-calendar': { brand: 'Paperland', cat: 'Hârtie', name: 'Calendar triptic de birou 2027', unit: '1 bucată', price: 6.90, isNew: true, url: 'produse-din-hartie/agende-birou/calendar-triptic-de-birou-2024' },
  'nou-dosar-multi': { brand: 'Accenta', cat: 'Arhivare', name: 'Dosar plastic cu șină și multiperforații', unit: 'Set de 25 de bucăți', price: 24.99, per: [25, 'dosar'], colors: ['negru', 'bleumarin', 'albastru', 'roșu', 'verde', 'galben', 'portocaliu', 'mov', 'turcoaz', 'verde închis', 'gri'], tiers: [[4, 22.25], [12, 19.75], [24, 17.25]], isNew: true, url: 'organizare-si-arhivare/dosare-din-plastic/dosar-plastic-cu-sina-si-multiperforatii-accenta-25-buc-set' },
  'nou-tabla-90': { brand: '', sub: 'Sisteme de afișare', cat: 'Afișare', name: 'Tablă magnetică, 90 × 120 cm', unit: '1 bucată', price: 149.90, isNew: true, url: 'sisteme-de-afisare/table-magnetice/tabla-magnetica-economica-90x120cm' },
  'nou-baterii': { brand: 'Varta', cat: 'IT', name: 'Baterii alcaline Longlife Power AAA', unit: 'Set de 24 de bucăți', price: 82.26, per: [24, 'baterie'], isNew: true, url: 'accesorii-it/baterii-acumulatori-incarcatoare/baterii-alcaline-varta-longlife-power-lr3-aaa-24-buc-set' },
  'nou-lampa': { stock: 3, brand: 'AddLiving', cat: 'Accesorii', name: 'Lampă de birou cu LED, Romantic Copper', unit: '1 bucată', price: 104.90, isNew: true, url: 'accesorii-pentru-birou/lampi-de-birou/lampa-de-birou-cu-led-addliving-romantic-copper' },
  'nou-cablu': { brand: 'Gembird', cat: 'IT', name: 'Cablu de rețea FTP, categoria 6, 15 m', unit: '1 bucată', price: 41.90, isNew: true, url: 'accesorii-it/cabluri-si-accesorii/cablu-de-retea-utp-patch-categoria-6-gembird-15-m' },
};

const FILLERS = ['capse', 'pix-bic', 'tesa', 'prosop', 'file-noki', 'folie-laminare', 'container-drect'];
// Produse care se folosesc împreună: primele propuse în „Completează comanda”
const COMPLEMENT = {
  'biblioraft-5': ['file-noki', 'container-drect'], 'biblioraft-75-culori': ['file-noki', 'container-drect'],
  'dosar-accenta': ['file-noki'], 'nou-dosar-multi': ['file-noki'], 'double-a': ['capse', 'tesa'], 'ik-eco': ['capse', 'tesa'],
  'xerox-business': ['capse'], 'xerox-premier': ['capse'], 'go-paper': ['capse'], 'marker-pilot': ['nou-tabla-90'],
  'hartie-igienica': ['prosop'], 'servetele': ['prosop'],
};
// Răspunsuri pentru căutările despre comandă: „retur”, „livrare”, „factura”, „program” (constatarea 15, M.054, M.182)
// Textele sunt cele din foaia „Livrare, plată și retur” și din footer, verificate pe officedirect.ro
const ANSWERS = [
  { key: 'retur', keys: ['retur', 'returnare', 'returnez', 'return', 'schimb', 'schimbare'], icon: 'ph-arrow-u-up-left', text: 'Retur în 30 de zile',
    body: 'Gratuit pentru coletele sub 10\u00a0kg.', href: SITE + 'politica-de-retur', cta: 'Vezi politica de retur' },
  { key: 'livrare', keys: ['livrare', 'livrari', 'transport', 'curier', 'locker', 'easybox', 'colet', 'expediere', 'awb', 'comanda'], icon: 'ph-truck', text: 'Livrare în 24-48 de ore',
    body: 'Gratuită de la 200\u00a0lei în București, 300\u00a0lei în țară și 100\u00a0lei la locker. Data exactă o vezi înainte să plasezi comanda.', href: SITE + 'livrare', cta: 'Toate condițiile de livrare' },
  { key: 'plata', keys: ['factura', 'facturare', 'facturi', 'cui', 'plata', 'op', 'ordin', 'card', 'ramburs', 'firma', 'proforma', 'tva'], icon: 'ph-receipt', text: 'Factură pe firmă, plată prin OP',
    body: 'Factura se emite pe CUI-ul firmei. Plătești prin ordin de plată, card online sau ramburs fără taxă până la 5.000\u00a0lei.', href: SITE + 'plata', cta: 'Vezi metodele de plată' },
  { key: 'contact', keys: ['contact', 'telefon', 'program', 'suport', 'ajutor', 'email', 'mail', 'operator'], icon: 'ph-phone', text: 'Te ajutăm luni-vineri, 8:30-17:30',
    body: 'Sună-ne sau scrie-ne pe chat: un coleg îți răspunde în programul de lucru.', href: 'tel:0213303454', cta: 'Sună la 021\u00a0330\u00a034\u00a054' },
];

// Produsele din categorii (plp-data.js) și din căutare (search-data.js) se adaugă la catalog; cele care există deja aici își păstrează poza
for (const [k, v] of Object.entries({ ...(window.EXTRA_P || {}), ...(window.SEARCH_P || {}) })) {
  if (P[k]) { const { img: _img, ...rest } = v; P[k] = { ...P[k], ...rest }; } else P[k] = v;
}
// Paginile se abonează la schimbările de coș (de ex. homepage-ul redesenează „Văzute recent”)
const hooks = { cart: [], vat: [] };

/* ---------- Stare locală validată (poate lipsi: mod privat, stocare blocată, date vechi) ---------- */
const store = {
  get(k, d, s = localStorage) { try { const v = s.getItem('od28:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v, s = localStorage) { try { s.setItem('od28:' + k, JSON.stringify(v)); } catch { /* fără stocare */ } },
};
const params = new URLSearchParams(location.search);
const validKey = k => { const [id, color] = k.split('|'); const p = P[id]; return !!p && (p.colors ? p.colors.includes(color) : color === undefined); };
const rawCart = store.get('cart', {});
const rawViewed = store.get('viewed', []);
const rawRecent = store.get('recent', []);
const state = {
  cart: Object.fromEntries(Object.entries(rawCart && typeof rawCart === 'object' ? rawCart : {}).filter(([k, n]) => validKey(k) && Number.isInteger(n) && n > 0 && n <= 9999)),
  viewed: Array.isArray(rawViewed) ? rawViewed.filter(id => P[id]).slice(0, 8) : [],
  recent: Array.isArray(rawRecent) ? rawRecent.filter(x => typeof x === 'string').slice(0, 5) : [],
  variant: null,
};


const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const lei = n => money.format(n) + ' lei';
const round2 = n => Math.round(n * 100) / 100;
const net = n => round2(n / VAT);
/* ---------- Un singur preț pe ecran: cu TVA (implicit) sau fără TVA, la alegerea clientului ----------
   Baza e scrisă mereu lângă preț („cu TVA” / „fără TVA”), ca să nu existe două prețuri de comparat pe același card.
   Alegerea se ține minte pe toate paginile. Totalurile din coș rămân defalcate (subtotal fără TVA, TVA, total cu TVA). */
let vatMode = store.get('vat') === 'fara' ? 'fara' : 'cu';
const vatPrice = n => (vatMode === 'fara' ? net(n) : n);
const pLei = n => lei(vatPrice(n));
const vatLabel = () => (vatMode === 'fara' ? 'fără TVA' : 'cu TVA');
const vatTag = () => `<span class="vat-tag">${vatLabel()}</span>`;
function vatSwitchHTML() {
  return `<div class="vat" role="group" aria-label="Prețuri afișate">${[['cu', 'Cu TVA'], ['fara', 'Fără TVA']].map(([k, l]) =>
    `<button type="button" data-vat="${k}" aria-pressed="${vatMode === k}">${l}</button>`).join('')}</div>`;
}
function renderVatSwitches() { $$('[data-vat-switch]').forEach(el => { el.innerHTML = vatSwitchHTML(); }); }
const img = id => P[id]?.img || `img/p/${id}.jpg`;
// Fiecare produs are pagina lui în prototip (produs.html); acolo se ajunge din carduri, căutare și liste
const pdpHref = id => `produs.html?id=${encodeURIComponent(id)}`;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const srStatus = $('#sr-status');
let srTimer;
function announce(text) { clearTimeout(srTimer); srStatus.textContent = ''; srTimer = setTimeout(() => { srStatus.textContent = text; }, 60); }

const keyOf = (id, color) => (color ? `${id}|${color}` : id);
const qtyOf = id => Object.entries(state.cart).reduce((s, [k, n]) => s + (k.split('|')[0] === id ? n : 0), 0);
function unitPrice(id, q) {
  let u = P[id].price;
  if (P[id].tiers) for (const [min, v] of P[id].tiers) if (q >= min) u = v;
  return u;
}

/* ---------- Măsurare GA4 ---------- */
window.dataLayer = window.dataLayer || [];
const debugOn = params.has('debug');
const debugList = $('#debug-list');
if (debugOn) $('#debug').hidden = false;
function gaItem(id, ctx = {}, qty = 1, color) {
  const p = P[id];
  return {
    item_id: id, item_name: p.name, item_brand: p.brand || undefined, item_category: p.cat,
    item_variant: color, price: unitPrice(id, qty), quantity: qty,
    item_list_id: ctx.list, item_list_name: ctx.listName, index: ctx.index,
    ...(p.isNew ? { item_launch: 'nou-in-catalog' } : {}),
  };
}
function track(event, ecommerce, extra = {}) {
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ...extra, ...(ecommerce ? { ecommerce } : {}) });
  if (!debugOn) return;
  const items = ecommerce?.items || [];
  const what = items.length ? items.map(i => `${i.item_id}${i.item_variant ? '/' + i.item_variant : ''}${i.index != null ? '#' + i.index : ''}`).join(', ') : JSON.stringify(extra);
  const li = document.createElement('li');
  li.textContent = `${event} · ${ecommerce?.item_list_id || ecommerce?.promotion_id || items[0]?.item_list_id || ''} · ${what}`;
  debugList.prepend(li);
  while (debugList.children.length > 8) debugList.lastChild.remove();
}
function ctxOf(el) {
  const card = el.closest('[data-card]');
  const list = el.closest('[data-list]');
  return card && list ? { list: list.dataset.list, listName: list.dataset.listName, index: Number(card.dataset.index) } : {};
}

// Afișări: card vizibil cel puțin 50% timp de 1 s, trimise în loturi, o dată pe listă și poziție
const seen = new Set();
const pending = new Map();
let flushTimer;
const timers = new WeakMap();
const impressionIO = new IntersectionObserver(entries => {
  for (const en of entries) {
    const el = en.target;
    if (en.isIntersecting) {
      timers.set(el, setTimeout(() => {
        const ctx = ctxOf(el);
        const key = `${ctx.list}:${el.dataset.card}:${ctx.index}`;
        if (seen.has(key) || !ctx.list) return;
        seen.add(key);
        if (!pending.has(ctx.list)) pending.set(ctx.list, []);
        pending.get(ctx.list).push(gaItem(el.dataset.card, ctx));
        clearTimeout(flushTimer);
        flushTimer = setTimeout(flushImpressions, 400);
      }, 1000));
    } else clearTimeout(timers.get(el));
  }
}, { threshold: .5 });
function flushImpressions() {
  for (const [list, items] of pending) track('view_item_list', { item_list_id: list, item_list_name: items[0].item_list_name, items });
  pending.clear();
}
function observeCards(root) { $$('[data-card]', root).forEach(el => impressionIO.observe(el)); }

/* ---------- Carduri de produs ---------- */
function perUnit(p, price = p.price) { return p.per ? `${lei(round2(vatPrice(price) / p.per[0]))}/${p.per[1]}` : ''; }

// Procentul se rotunjește mereu în jos (10,53% devine -10%), ca reducerea să nu pară mai mare decât e.
// Prețul tăiat și procentul, la fel pe carduri, în „Văzute recent”, în coș și în sugestii (M.168, G-37)
function wasHTML(p) {
  if (!p.old) return '';
  const off = Math.floor((1 - p.price / p.old) * 100);
  return `<s class="price__old"><span class="sr-only">preț anterior </span>${pLei(p.old)}</s><span class="price__off"><span class="sr-only">reducere </span>-${off}%</span>`;
}
function priceHTML(id) {
  const p = P[id];
  // Un singur preț, cu baza scrisă lângă el; dedesubt reducerea (în aceeași bază), apoi prețul pe unitate, gri
  return `<p class="price"><span class="price__main">${money.format(vatPrice(p.price))} <small>lei</small></span>${vatTag()}</p>${p.old ? `<p class="price__was">${wasHTML(p)}</p>` : ''}
    ${p.per ? `<p class="card__per">${perUnit(p)}</p>` : ''}${volHTML(p)}${stockHTML(p)}`;
}
// Prețul de volum pe card: un rând de informație, fără buton (council 03.11.2026, P1). Cantitatea se alege pe pagina produsului;
// un buton „+ Adaugă 50” punea ~1.200 lei în coș dintr-o atingere (M.029, PLP-28). Același termen ca pe pagina produsului (G-37)
function volHTML(p) {
  if (!p.tiers || p.stock === 0) return '';
  const [one, many] = unitWord(p);
  const [n, v] = p.tiers[0];
  return `<p class="card__vol">De la ${cate(n, many)}: <b>${pLei(v)}/${one}</b></p>`;
}

// Un singur rând, ca toate cardurile din listă să rămână la aceeași înălțime
// Sub buton: pragul de volum ca a doua acțiune („sau ia 50 de topuri la preț mai mic”); prețul pe unitate stă în blocul de preț
const unitWord = p => p.fmt ? ['top', 'topuri'] : ['buc.', 'buc.'];
const cate = (n, w) => `${n}${n >= 20 && (n % 100 === 0 || n % 100 >= 20) ? ' de' : ''} ${w}`;
function hintHTML(id) {
  const p = P[id];
  const per = '';
  if (!p.tiers || p.stock === 0) return per;
  const [one, many] = unitWord(p);
  const q = qtyOf(id);
  const cur = [...p.tiers].reverse().find(([min]) => q >= min);
  if (cur) return per + `<p class="hint is-on"><i class="ph ph-check" aria-hidden="true"></i><span><span class="sr-only">Ai prețul de volum: </span>${pLei(cur[1])}/${one}</span></p>`;
  const next = p.tiers.find(([min]) => q < min);
  // Înainte de adăugare, prețul de volum e deja în blocul de preț; după adăugare, rândul spune cât mai e până la prag
  if (q) return per + `<p class="hint">Încă ${cate(next[0] - q, many)} pentru ${pLei(next[1])}/${one}</p>`;
  return per;
}



function buyHTML(id) {
  const p = P[id];
  if (p.stock === 0) return `<button class="add add--notify" type="button" data-notify="${id}" aria-label="Anunță-mă când revine în stoc: ${p.name}"><i class="ph ph-bell" aria-hidden="true"></i>Anunță-mă</button>`;
  if (p.colors) {
    const q = qtyOf(id);
    return `<button class="add add--choose" type="button" data-choose="${id}" aria-haspopup="dialog" aria-label="Alege culoarea: ${p.name}${q ? `, ${q} în coș` : ''}">Alege culoarea${q ? `<span class="add__count" aria-hidden="true">${q}</span>` : ''}</button>`;
  }
  const q = state.cart[id] || 0;
  if (!q) return `<button class="add" type="button" data-add="${id}" aria-label="Adaugă în coș: ${p.name}"><i class="ph ph-plus" aria-hidden="true"></i>Adaugă în coș</button>`;
  return stepHTML(id, q, `data-qty="${id}"`, p.name);
}
function stepHTML(id, q, inputAttr, name) {
  return `<div class="step" role="group" aria-label="Cantitate în coș: ${name}">
    <button type="button" data-dec="${id}" aria-label="${q === 1 ? `Scoate din coș: ${name}` : 'Scade cantitatea'}"><i class="ph ${q === 1 ? 'ph-trash' : 'ph-minus'}" aria-hidden="true"></i></button>
    <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" value="${q}" ${inputAttr} aria-label="Cantitate">
    <button type="button" data-inc="${id}" aria-label="Crește cantitatea"><i class="ph ph-plus" aria-hidden="true"></i></button>
  </div>`;
}

// Pe card brandul are rândul lui, deci nu-l repetăm în nume: „Hârtie Double A Premium A4” devine „Hârtie Premium A4”
const shortName = p => p.brand ? p.name.replace(new RegExp(`\\s${p.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|,)`, 'i'), '') : p.name;
// Ambalajul, scurt: „Top de 500 de coli” devine „500 coli”; „1 bucată” nu spune nimic, deci dispare
const shortUnit = u => u === '1 bucată' ? '' : u.replace(/^\S+ de ([\d.]+)(?: de)? (\S+)$/, (_, n, w) => `${n} ${w === 'bucăți' ? 'buc.' : w}`);
/* ---------- Etichete pe card (M.167, M.168, M.172, M.137, G-43, PLP-31) ----------
   Nimic peste poză: fiecare informație stă lângă ce explică.
   - Reducerea: lângă prețul tăiat („-11%”). Se calculează din prețul de referință (cel mai mic din ultimele 30 de zile).
   - Stocul: sub preț, lângă buton („Ultimele 3 buc. în stoc”, doar sub 6 bucăți reale; „Stoc epuizat”).
   - „Cel mai vândut” (top 3 în categorie după bucăți vândute în ultimele 30 de zile) sau „Nou” (intrat în ultimele 90 de zile): un rând mic sub nume,
     ca numele să rămână aliniate între carduri. */
const LOW_STOCK = 5;
// Produsele epuizate nu apar în nicio listă de pe homepage (M.014, H-07, PLP-30); „Stoc epuizat” rămâne doar în căutare și pe pagina produsului
const inStock = id => P[id].stock !== 0;
// Locul etichetelor: implicit C, o singură etichetă sus pe poză, cu spațiu rezervat (produsul coboară, nu e acoperit).
// Pentru comparație rămân ?eticheta=a (sub nume și sub preț), b (pe poză, jos), d (bandă sus pe poză)
const BADGE_V = /^[abcd]$/.test(params.get('eticheta')) ? params.get('eticheta') : 'c';
document.documentElement.classList.add('be-' + BADGE_V);
// Varianta de contrast, de comparat: ?contrast=1 o pornește, ?contrast=0 o oprește; rămâne activă cât navighezi în sesiune
if (params.has('contrast')) store.set('contrast', params.get('contrast') === '1', sessionStorage);
if (store.get('contrast', false, sessionStorage)) document.documentElement.classList.add('hi-ct');
// O singură etichetă pe poză (B, C, D), în ordinea: epuizat, ultimele bucăți, cel mai vândut, nou.
// `list` e lista în care stă cardul: în „Cele mai cumpărate” nu repetăm „Cel mai vândut”, în „Nou în catalog” nu repetăm „Nou”
function badgeOf(p, list) {
  if (p.stock === 0) return ['out', 'Stoc epuizat'];
  if (p.stock > 0 && p.stock <= LOW_STOCK) return ['low', `Ultimele ${p.stock} buc.`];
  if (p.best && list !== 'best') return ['best', 'Cel mai vândut'];
  if (p.isNew && !p.best && list !== 'new') return ['new', 'Nou'];
  return null;
}
// În lista din categorie și căutare, poza e mică: eticheta stă ca text deasupra numelui, nu peste produs
function tagHTML(p, list) {
  const l = badgeOf(p, list);
  return l ? `<span class="card__tag flag--${l[0]}">${l[1]}</span>` : '';
}
function mediaBadgeHTML(p, list) {
  if (BADGE_V === 'a') return '';
  const l = badgeOf(p, list);
  return l ? `<span class="mbadge flag--${l[0]}">${l[1]}</span>` : '';
}
function flagHTML(p, list) {
  if (BADGE_V !== 'a' && !document.body.matches('[data-page="pdp"]')) return '';
  if (p.stock === 0) return '';
  if (p.best && list !== 'best') return '<p class="card__flag"><span class="flag flag--best">Cel mai vândut</span></p>';
  if (p.isNew && !p.best && list !== 'new') return '<p class="card__flag"><span class="flag flag--new">Nou</span></p>';
  return '';
}
function stockHTML(p) {
  if (BADGE_V !== 'a') return '';
  if (p.stock === 0) return '<p class="card__stock"><span class="flag flag--out">Stoc epuizat</span></p>';
  if (p.stock > 0 && p.stock <= LOW_STOCK) return `<p class="card__stock"><span class="flag flag--low">Ultimele ${p.stock} buc. în stoc</span></p>`;
  return '';
}
function cardHTML(id, index, list) {
  const p = P[id];
  const url = pdpHref(id);
  // Cinci rânduri aliniate între carduri (subgrid): poză, nume cu atribute, preț, buton, prag de volum.
  // În „Nou în catalog” pragul lipsește: lista e pentru descoperire, iar un singur prag lăsa gol sub toate butoanele (M.005).
  // Numele și atributele stau în același rând, ca un nume pe două rânduri la vecin să nu lase o gaură între nume și atribute
  // Câte culori are produsul, ca text neutru în atribute, nu ca etichetă (M.167)
  const meta = p.meta ?? [p.brand || p.sub, shortUnit(p.unit), p.colors && cate(p.colors.length, 'culori')].filter(Boolean).join(' · ');
  return `<li class="card${p.stock === 0 ? ' is-out' : ''}" data-card="${id}" data-index="${index}">
    <div class="card__media">
      <a class="card__img" href="${url}" data-select="${id}" tabindex="-1" aria-hidden="true">
        <img src="${img(id)}" alt="" loading="lazy" width="450" height="450" class="is-loading" onload="this.classList.remove('is-loading')">
      </a>
      ${mediaBadgeHTML(p, list)}
    </div>
    <div class="card__head">
      ${tagHTML(p, list)}
      <h3 class="card__name"><a href="${url}" data-select="${id}">${p.cardName || (p.meta != null ? p.name : shortName(p))}</a></h3>
      <div class="card__info">${BADGE_V === 'a' ? flagHTML(p, list) : ''}<p class="card__meta">${meta ? meta.split(' · ').map(s => `<span class="nw">${s}</span>`).join(' · ') : ''}</p></div>
    </div>
    <div data-price="${id}">${priceHTML(id)}</div>
    <div class="buy" data-buy="${id}">${buyHTML(id)}</div>
    ${list === 'new' ? '' : `<div class="card__extra" data-hint="${id}">${hintHTML(id)}</div>`}
  </li>`;
}

/* ---------- Coș local ---------- */
function cartTotals() {
  let count = 0, total = 0;
  const byId = {};
  for (const [k, n] of Object.entries(state.cart)) { const id = k.split('|')[0]; byId[id] = (byId[id] || 0) + n; count += n; }
  for (const [k, n] of Object.entries(state.cart)) { const id = k.split('|')[0]; total += n * unitPrice(id, byId[id]); }
  return { count, total: round2(total), byId };
}
function refreshCard(id, before) {
  const p = P[id];
  const q = state.cart[id] || 0;
  $$(`[data-buy="${id}"]`).forEach(el => {
    if (p.colors) { el.innerHTML = buyHTML(id); return; }
    const step = $('.step', el);
    if (!q || !before || !step) { el.innerHTML = buyHTML(id); return; }
    const inp = $('[data-qty]', step);
    if (document.activeElement !== inp) inp.value = q;
    const dec = $('[data-dec]', step);
    dec.setAttribute('aria-label', q === 1 ? `Scoate din coș: ${p.name}` : 'Scade cantitatea');
    $('.ph', dec).className = `ph ${q === 1 ? 'ph-trash' : 'ph-minus'}`;
  });
  $$(`[data-hint="${id}"]`).forEach(el => { el.innerHTML = hintHTML(id); });
}

function setQty(key, q, origin, opts = {}) {
  const [id, color] = key.split('|');
  const before = state.cart[key] || 0;
  q = Math.max(0, Math.min(9999, Math.floor(q) || 0));
  if (q === before) return;
  if (q === 0) delete state.cart[key]; else state.cart[key] = q;
  store.set('cart', state.cart);

  const active = document.activeElement;
  const wasInCard = active && active.closest(`[data-buy="${id}"]`);
  const scope = origin?.closest('[data-buy]');
  const ctx = opts.ctx || (origin ? ctxOf(origin) : {});
  refreshCard(id, before);
  hooks.cart.forEach(f => f());
  renderCart(q > before);
  const { total } = cartTotals();
  const label = color ? `${P[id].name}, ${color}` : P[id].name;
  announce(q ? `${label}: ${q} în coș. Total ${lei(total)} cu TVA.` : `${label} a fost scos din coș.`);
  const delta = Math.abs(q - before);
  track(q > before ? 'add_to_cart' : 'remove_from_cart', { currency: 'RON', value: round2(delta * unitPrice(id, q || before)), items: [gaItem(id, ctx, delta, color)] });
  if (q > before && before === 0 && !openLayer && suggest.hidden) {
    const from = opts.flyFrom || origin?.closest('[data-card]')?.querySelector('.card__img img') || origin?.closest('.mini, li')?.querySelector('img');
    flyToCart(from);
    toast(id, color, q);
  }
  // În liste re-randate (coș, văzute recent, sugestii) focusul revine pe butonul produsului
  const listEl = origin?.closest('[data-list]');
  if (origin && !origin.isConnected && listEl?.isConnected && !wasInCard) {
    const again = $(`[data-add="${id}"], [data-choose="${id}"]`, listEl) || $(`[data-list="${listEl.dataset.list}"] [data-add="${id}"]`);
    (again || cartBtn).focus({ preventScroll: true });
  }
  if (P[id].colors && (wasInCard || opts.ctx)) {
    const btn = (scope && $(`[data-choose="${id}"]`, scope)) || $(`[data-choose="${id}"]`);
    btn?.focus({ preventScroll: true });
  } else if (wasInCard && (q === 0 || before === 0)) {
    const target = q === 0 ? $(`[data-add="${id}"]`, scope) : $(`[data-inc="${id}"]`, scope);
    target?.focus({ preventScroll: true });
  }
}

document.addEventListener('click', e => {
  const tierAdd = e.target.closest('[data-tier-add]');
  if (tierAdd) {
    const id = tierAdd.dataset.tierAdd, n = Number(tierAdd.dataset.q);
    track('tier_select', null, { item_id: id, threshold: n, item_list_id: ctxOf(tierAdd).list });
    if (P[id].colors) { openVariant(id, tierAdd); state.variant.qty = n; renderVariant(); return; }
    return setQty(id, Math.max(n, state.cart[id] || 0), tierAdd);
  }
  const notify = e.target.closest('[data-notify]');
  if (notify) { track('notify_me', null, { item_id: notify.dataset.notify }); note('Îți scriem pe email când produsul revine în stoc.'); return; }
  const add = e.target.closest('[data-add]');
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const choose = e.target.closest('[data-choose]');
  if (add) {
    const id = add.dataset.add;
    if (P[id].colors) return openVariant(id, add);
    return setQty(id, (state.cart[id] || 0) + 1, add);
  }
  if (choose) return openVariant(choose.dataset.choose, choose);
  if (inc && !inc.closest('#variant-body')) return setQty(inc.dataset.inc, (state.cart[inc.dataset.inc] || 0) + 1, inc);
  if (dec && !dec.closest('#variant-body')) return setQty(dec.dataset.dec, (state.cart[dec.dataset.dec] || 0) - 1, dec);
  const sel = e.target.closest('[data-select]');
  if (sel) {
    const ctx = ctxOf(sel);
    track('select_item', { item_list_id: ctx.list, item_list_name: ctx.listName, items: [gaItem(sel.dataset.select, ctx)] });
    remember(sel.dataset.select);
    // Pagina de produs leagă adăugarea în coș de lista din care a venit clientul
    if (ctx.list) store.set('from', { id: sel.dataset.select, ...ctx }, sessionStorage);
  }
  const promo = e.target.closest('[data-promo]');
  if (promo && typeof promoPayload === 'function') track('select_promotion', promoPayload());
  const content = e.target.closest('.quick a, .solve__tile, .hero__guest a, .hero a:not([data-promo])');
  if (content) track('select_content', null, { content_type: content.closest('.quick') ? 'categorie_rapida' : content.closest('.solve') ? 'zona_birou' : 'hero_cta', content_id: content.textContent.trim() });
  const proto = e.target.closest('[data-proto]');
  if (proto) {
    e.preventDefault();
    note(proto.dataset.proto === 'chat'
      ? 'În magazin, aici se deschide chatul OfficeDirect existent.'
      : 'În magazin, linkul duce la pagina „Noutăți”, care se creează în OpenCart.');
  }
});
document.addEventListener('change', e => {
  const inp = e.target.closest('[data-qty]');
  if (inp) setQty(inp.dataset.qty, Number(inp.value.replace(/\D/g, '')), inp);
});
document.addEventListener('keydown', e => {
  const inp = e.target.closest?.('[data-qty], [data-vqty]');
  if (inp && e.key === 'Enter') { e.preventDefault(); inp.blur(); }
});
document.addEventListener('input', e => {
  const inp = e.target.closest('[data-qty], [data-vqty]');
  if (inp) inp.value = inp.value.replace(/\D/g, '');
});

/* ---------- Animația „zbor” spre coș ---------- */
const cartBtn = $('.bar__cart');
const countEl = $('.bar__count');
function flyToCart(fromImg) {
  if (reduce.matches || !fromImg || !fromImg.getBoundingClientRect || !fromImg.isConnected || cartBtn.hidden) return;
  const a = fromImg.getBoundingClientRect();
  const b = cartBtn.getBoundingClientRect();
  if (!a.width) return;
  const ghost = document.createElement('img');
  ghost.src = fromImg.currentSrc || fromImg.src;
  ghost.className = 'fly';
  ghost.alt = '';
  const size = 64;
  ghost.style.left = `${a.left + a.width / 2 - size / 2}px`;
  ghost.style.top = `${a.top + a.height / 2 - size / 2}px`;
  document.body.append(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  ghost.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * .45}px, ${dy * .45 - 70}px) scale(.8)`, opacity: 1, offset: .45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.22)`, opacity: .5 },
  ], { duration: 640, easing: 'cubic-bezier(.45,0,.2,1)' }).finished.then(() => ghost.remove(), () => ghost.remove());
}

function shipMessage(total) {
  const buc = round2(SHIP_BUC - total), ro = round2(SHIP_RO - total);
  if (ro <= 0) return { text: 'Ai livrare gratuită în toată țara.', short: 'Ai livrare gratuită în toată țara.', done: true };
  if (buc <= 0) return { text: `Livrare gratuită în București. Încă <b>${lei(ro)}</b> pentru restul țării.`, short: `Livrare gratuită în București. Încă ${lei(ro)} pentru restul țării.`, done: false };
  return { text: `Încă <b>${lei(buc)}</b> până la livrare gratuită în București și <b>${lei(ro)}</b> în țară.`, short: `Mai ai ${lei(buc)} până la livrare gratuită în București.`, done: false };
}
function renderCart(bump) {
  const { count, total } = cartTotals();
  countEl.textContent = count;
  countEl.hidden = count === 0;
  cartBtn.setAttribute('aria-label', count ? `Coșul meu, ${count} ${count === 1 ? 'produs' : 'produse'}, ${lei(total)} cu TVA` : 'Coșul meu, gol');
  if (bump && !reduce.matches) setTimeout(() => { cartBtn.classList.remove('is-bump'); void cartBtn.offsetWidth; cartBtn.classList.add('is-bump'); }, 520);
  renderCartSheet();
}

function renderCartSheet() {
  const body = $('#cart-body');
  const keys = Object.keys(state.cart);
  if (!keys.length) {
    body.innerHTML = `<p class="cart-empty">Coșul e gol. Începe cu produsele de bază sau caută după cod.</p>
      <a class="btn btn--secondary btn--block" href="#esentiale" data-close>Vezi produsele de bază</a>`;
    return;
  }
  const { total, byId } = cartTotals();
  const totalNet = round2(keys.reduce((s, k) => { const id = k.split('|')[0]; return s + state.cart[k] * net(unitPrice(id, byId[id])); }, 0));
  const m = shipMessage(total);
  // Completare până la livrare gratuită (M.186, M.189): produse mici, fără variante, care nu sunt deja în coș
  const left = round2(SHIP_BUC - total);
  const inCart = Object.keys(byId);
  const pool = [...new Set([...inCart.flatMap(id => COMPLEMENT[id] || []), ...FILLERS])].filter(id => !qtyOf(id) && !P[id].colors && P[id].stock !== 0);
  const fitting = left > 0 ? pool.filter(id => P[id].price <= left) : pool;
  const fill = m.done ? [] : (fitting.length ? fitting : pool).slice(0, 3);
  body.innerHTML = `<p class="ship-line${m.done ? ' is-done' : ''}"><i class="ph ph-truck" aria-hidden="true"></i><span>${m.text}</span></p>` +
    keys.map(k => {
      const [id, color] = k.split('|');
      const q = state.cart[k], u = unitPrice(id, byId[id]);
      return `<div class="cart-line">
        <img src="${img(id)}" alt="" width="56" height="56">
        <p>${P[id].name}<small>${color ? `${color} · ` : ''}${q} × ${pLei(u)}${u < P[id].price ? ' · preț de volum' : ''}</small></p>
        <strong>${lei(round2(q * vatPrice(u)))}</strong>
      </div>`;
    }).join('') +
    `<div class="cart-sum">
      <p><span>Subtotal fără TVA</span><span>${lei(totalNet)}</span></p>
      <p><span>TVA 21%</span><span>${lei(round2(total - totalNet))}</span></p>
      <p class="is-total"><span>Total cu TVA</span><span>${lei(total)}</span></p>
    </div>
    <a class="btn btn--primary btn--block" href="${SITE}index.php?route=checkout/cart">Finalizează comanda</a>` +
    (fill.length ? `<p class="suggest__label">Completează comanda</p>
      <ul class="cart-fill" data-list="hp_cos_completare" data-list-name="Coș - completează comanda">${fill.map((id, i) => `<li class="mini" data-card="${id}" data-index="${i + 1}">
        <img src="${img(id)}" alt="" width="64" height="64">
        <span><span class="mini__name">${P[id].name}</span><span class="mini__price">${pLei(P[id].price)} ${vatTag()}</span>${P[id].old ? `<span class="mini__was">${wasHTML(P[id])}</span>` : ''}</span>
        <button class="mini__add" type="button" data-add="${id}" aria-label="Adaugă în coș: ${P[id].name}"><i class="ph ph-plus" aria-hidden="true"></i></button>
      </li>`).join('')}</ul>` : '');
}

/* ---------- Comutatorul cu / fără TVA: redesenează prețurile pe loc, fără reîncărcare ---------- */
function setVat(mode, from) {
  if (mode === vatMode) return;
  const idx = from ? $$('[data-vat-switch]').indexOf(from.closest('[data-vat-switch]')) : -1;
  vatMode = mode;
  store.set('vat', mode);
  renderVatSwitches();
  $$('[data-price]').forEach(el => { el.innerHTML = priceHTML(el.dataset.price); });
  $$('[data-hint]').forEach(el => { el.innerHTML = hintHTML(el.dataset.hint); });
  renderCartSheet();
  if (state.variant) renderVariant();
  hooks.vat.forEach(f => f());
  // Focusul rămâne pe butonul apăsat, chiar dacă blocul s-a redesenat
  if (idx >= 0) $(`[data-vat="${mode}"]`, $$('[data-vat-switch]')[idx])?.focus({ preventScroll: true });
  announce(`Prețurile sunt afișate ${vatLabel()}.`);
  track('vat_toggle', null, { vat_mode: mode === 'fara' ? 'fara_tva' : 'cu_tva' });
}
document.addEventListener('click', e => { const b = e.target.closest('[data-vat]'); if (b) setVat(b.dataset.vat, b); });
// Comutatorul stă și în meniu, pe toate paginile
$('#menu .drawer__head')?.insertAdjacentHTML('afterend', '<div class="drawer__vat"><p>Prețuri</p><div data-vat-switch></div></div>');
renderVatSwitches();

/* ---------- Toast după adăugare (constatarea 34, M.079) ---------- */
let toastTimer;
const toastEl = $('#toast');
const armToast = () => { clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 6000); };
function showToast(html) {
  toastEl.classList.remove('toast--note');
  toastEl.innerHTML = html;
  toastEl.hidden = false;
  toastEl.style.animation = 'none'; void toastEl.offsetWidth; toastEl.style.animation = '';
  armToast();
}
['pointerenter', 'focusin', 'touchstart'].forEach(ev => toastEl.addEventListener(ev, () => clearTimeout(toastTimer), { passive: true }));
['pointerleave', 'focusout'].forEach(ev => toastEl.addEventListener(ev, armToast));
function toast(id, color, q) {
  const { total } = cartTotals();
  const m = shipMessage(total);
  showToast(`<img src="${img(id)}" alt="" width="44" height="44">
    <p class="toast__name">${q > 1 ? `${q} × ` : ''}${esc(P[id].name)}${color ? `, ${color}` : ''}</p>
    <a href="#" data-open="sheet-cos">Vezi coșul</a>
    <p class="toast__msg">${m.short}</p>`);
}
function note(text) { announce(text); showToast(`<i class="ph ph-info" aria-hidden="true" style="font-size:24px;color:#fff;justify-self:center"></i><p class="toast__msg" style="grid-area:name">${text}</p>`); toastEl.classList.add('toast--note'); }
function hideToast() { toastEl.hidden = true; }

/* ---------- Alegerea culorii (M.029, PLP-28) ---------- */
function openVariant(id, origin) {
  const p = P[id];
  state.variant = { id, color: null, qty: 1, ctx: ctxOf(origin), from: origin.closest('[data-card]')?.querySelector('.card__img img') };
  renderVariant();
  open('sheet-varianta');
}
function renderVariant() {
  const v = state.variant;
  const p = P[v.id];
  const u = unitPrice(v.id, qtyOf(v.id) + v.qty);
  $('#variant-body').innerHTML = `
    <div class="vprod"><img src="${img(v.id)}" alt="" width="64" height="64"><p>${p.name}<small>${p.unit} · ${pLei(p.price)} ${vatLabel()}</small></p></div>
    <p class="vlabel" id="vlabel">Culoare: <b>${v.color || 'alege una'}</b></p>
    <div class="vswatches" role="radiogroup" aria-labelledby="vlabel">
      ${p.colors.map(c => `<button class="vswatch" type="button" role="radio" aria-checked="${c === v.color}" data-color="${c}" tabindex="${(v.color ? c === v.color : c === p.colors[0]) ? 0 : -1}"><i style="background:${COLOR[c]}" aria-hidden="true"></i>${c}</button>`).join('')}
    </div>
    <div class="vfoot">
    <div class="vqty">
      ${stepHTML(v.id, v.qty, 'data-vqty="1"', p.name).replace('Cantitate în coș', 'Cantitate').replace(/<button type="button" data-dec="[^"]+" aria-label="[^"]*"><i class="ph ph-(trash|minus)"/, `<button type="button" data-dec="${v.id}" aria-label="Scade cantitatea"${v.qty <= 1 ? ' disabled' : ''}><i class="ph ph-minus"`)}
      <p class="vtotal">Total ${vatLabel()}<b>${lei(round2(vatPrice(u) * v.qty))}</b></p>
    </div>
    ${p.tiers ? `<div class="vsheet-hint">${(() => { const q = qtyOf(v.id) + v.qty; const next = p.tiers.find(([m]) => q < m); return next ? `<p class="hint">De la ${next[0]} buc.: ${pLei(next[1])}/buc.</p>` : `<p class="hint is-on">Cel mai bun preț: ${pLei(u)}/buc.</p>`; })()}</div>` : ''}
    <button class="btn btn--primary btn--block vcta" type="button" data-vadd aria-disabled="${!v.color}"${v.color ? "" : " aria-describedby=\"vcta-note\""}>${v.color ? `Adaugă în coș · ${lei(round2(vatPrice(u) * v.qty))}` : 'Adaugă în coș'}</button>
    ${v.color ? '' : '<p class="vcta-note" id="vcta-note">Alege o culoare ca să adaugi în coș.</p>'}
    </div>`;
}
$('#variant-body').addEventListener('click', e => {
  const v = state.variant;
  if (!v) return;
  // Controalele din foaie se re-randează la fiecare clic: oprim evenimentul aici, ca să nu ajungă la handler-ul cardurilor
  if (e.target.closest('[data-color], [data-inc], [data-dec], [data-vadd]')) e.stopPropagation();
  const sw = e.target.closest('[data-color]');
  if (sw) { v.color = sw.dataset.color; renderVariant(); $(`[data-color="${CSS.escape(v.color)}"]`, $('#variant-body')).focus(); return; }
  if (e.target.closest('[data-inc]')) { v.qty = Math.min(9999, v.qty + 1); renderVariant(); $('#variant-body [data-inc]').focus(); return; }
  if (e.target.closest('[data-dec]')) { v.qty = Math.max(1, v.qty - 1); renderVariant(); const d = $('#variant-body [data-dec]'); (d.disabled ? $('#variant-body [data-inc]') : d).focus(); return; }
  if (e.target.closest('[data-vadd]')) {
    if (!v.color) { announce('Alege mai întâi o culoare.'); $('#variant-body .vswatch').focus(); return; }
    const key = keyOf(v.id, v.color);
    const from = v.from;
    close();
    setTimeout(() => setQty(key, (state.cart[key] || 0) + v.qty, null, { ctx: v.ctx, flyFrom: from }), reduce.matches ? 0 : 220);
  }
});
$('#variant-body').addEventListener('change', e => {
  if (e.target.matches('[data-vqty]') && state.variant) { state.variant.qty = Math.max(1, Number(e.target.value) || 1); renderVariant(); }
});
$('#variant-body').addEventListener('keydown', e => {
  const sw = e.target.closest('[data-color]');
  if (!sw || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const all = $$('[data-color]', $('#variant-body'));
  const i = all.indexOf(sw) + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1);
  all[(i + all.length) % all.length].click();
});

/* ---------- Văzute recent (constatarea 03) ---------- */
function remember(id) { state.viewed = [id, ...state.viewed.filter(x => x !== id)].slice(0, 8); store.set('viewed', state.viewed); }

/* ---------- Blocarea paginii sub straturi, fără salt de poziție ---------- */
// Straturile folosesc istoricul pentru Back; poziția paginii o restaurăm noi, nu browserul
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
// Poziția se salvează pe pagină (cu filtrele din URL), ca Back să revină exact unde erai pe fiecare pagină
const yKey = () => 'y:' + location.pathname + location.search;
addEventListener('pagehide', () => store.set(yKey(), locks ? lockY : scrollY, sessionStorage));
// Pagina rămâne pe loc sub straturi: doar oprim derularea, fără să schimbăm poziția (header-ul fix rămâne vizibil)
let lockY = 0, locks = 0;
function lockScroll() {
  if (locks++) return;
  lockY = scrollY;
  document.documentElement.classList.add('is-locked');
}
function unlockScroll() {
  if (--locks > 0) return;
  locks = 0;
  document.documentElement.classList.remove('is-locked');
  if (Math.abs(scrollY - lockY) > 1) scrollTo({ top: lockY, behavior: 'instant' });
}

/* ---------- Căutare: completări, răspunsuri, categorii, produse, căutări recente (constatarea 13; M.045, M.046, M.180, M.181) ----------
   Motorul (greșeli, plural, sinonime, atribute) stă în search.js; aici e doar ce vezi sub câmp. */
const bar = $('#bar');
const q = $('#q');
const suggest = $('#suggest');
const clearBtn = $('.search__clear');
const cancelBtn = $('.bar__cancel');
const menuBtn = $('.hdr [data-open="menu"]');
const hsearch = $('#hsearch');
const findBtn = $('.hdr__find');
let skipOpen = false;
function focusQuiet() { skipOpen = true; q.focus({ preventScroll: true }); skipOpen = false; }
// După închidere, focusul revine pe ce se vede: câmpul de sus sau iconița din header
const refocusSearch = () => bar.classList.contains('is-compact') ? findBtn.focus({ preventScroll: true }) : focusQuiet();

function openSuggest() {
  if (!suggest.hidden || skipOpen) return;
  hideToast();
  bar.classList.add('is-searching');
  hsearch.classList.add('is-open');
  cancelBtn.hidden = false;
  suggest.style.setProperty('--suggest-top', $('.hsearch__in').getBoundingClientRect().bottom + 'px');
  suggest.hidden = false;
  renderRecent();
  // Pe pagina de rezultate câmpul are deja termenul: sugestiile apar imediat, fără să rescrii
  renderLive();
  lockScroll();
  history.pushState({ layer: 'search' }, '');
}
function closeSuggest(fromHistory) {
  if (suggest.hidden) return;
  suggest.hidden = true;
  bar.classList.remove('is-searching');
  hsearch.classList.remove('is-open');
  cancelBtn.hidden = true;
  unlockScroll();
  if (!fromHistory && history.state && history.state.layer === 'search') history.back();
}
// La atingerea câmpului: ultimele 5 căutări și termenii căutați des (M.181)
function renderRecent() {
  const wrap = $('#suggest-recent');
  wrap.hidden = !state.recent.length;
  $('#suggest-recent-list').innerHTML = state.recent.map(t => `<li><a href="${serpHref(t)}"><i class="ph ph-clock-counter-clockwise" aria-hidden="true"></i>${esc(t)}</a></li>`).join('');
  $('#suggest-popular').innerHTML = POPULAR.slice(0, 6).map(t => `<a class="chip" href="${serpHref(t)}">${esc(t)}</a>`).join('');
  $('#suggest-help').innerHTML = ANSWERS.slice(0, 3).map(x => `<li><a href="${x.href}" data-answer="${x.key}"><i class="ph ${x.icon}" aria-hidden="true"></i>${x.text}</a></li>`).join('');
}
let searchTimer;
function renderLive() {
  const raw = q.value.trim();
  const live = $('#suggest-live');
  $('#suggest-idle').hidden = !!raw;
  live.hidden = !raw;
  if (!raw) return;
  const res = searchCatalog(raw);
  const total = res.ids.length;
  const answers = searchAnswers(raw);
  const shownTerm = res.fixed || res.kept || raw;
  // Primul rând: toate rezultatele, cu numărul lor (o corectură rămâne tăcută: produsele arată termenul bun)
  const sq = $('#suggest-query');
  sq.hidden = !total;
  sq.href = serpHref(raw);
  sq.innerHTML = `<i class="ph ph-magnifying-glass" aria-hidden="true"></i><b>Vezi ${total === 1 ? 'rezultatul' : `toate cele ${rezultate(total)}`}</b><i class="ph ph-arrow-right" aria-hidden="true"></i>`;
  // Completări: termeni căutați des care încep cu ce ai scris
  const typed = norm(raw);
  $('#suggest-terms').innerHTML = searchComplete(raw).map(({ term, n }) => {
    const rest = norm(term).startsWith(typed) ? `${esc(term.slice(0, raw.length))}<b>${esc(term.slice(raw.length))}</b>` : esc(term);
    return `<li><a href="${serpHref(term)}" data-term="${esc(term)}"><i class="ph ph-magnifying-glass" aria-hidden="true"></i><span>${rest}</span><small>${n}</small></a></li>`;
  }).join('');
  $('#suggest-answers').innerHTML = answers.map(a => `<li><a href="${a.href}" data-answer="${a.key}"><i class="ph ${a.icon}" aria-hidden="true"></i>${a.text}</a></li>`).join('');
  // Categoriile apar doar când rezultatele sunt în mai multe locuri: maximum 3 (constatarea 13)
  $('#suggest-cats').innerHTML = res.scopes.length > 1 ? res.scopes.slice(0, 3).map(([c, n]) => `<li><a href="${serpHref(raw, { cat: c })}" data-scope="${esc(c)}">în ${esc(c)}<span>${n}</span></a></li>`).join('') : '';
  $('#suggest-count').textContent = total ? 'Produse' : '';
  // Evidențiere care ignoră diacriticele: „hartie” marchează „Hârtie”
  const terms = tokens(shownTerm).filter(t => t.length > 1 && !UNITS.has(t));
  const fold1 = { a: '[aăâ]', i: '[iî]', s: '[sș]', t: '[tț]' };
  const pattern = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[aist]/g, c => fold1[c]);
  const mark = s => { let out = esc(s); terms.forEach(t => { out = out.replace(new RegExp(`(?<![\\p{L}\\d])(${pattern(t)})`, 'iu'), '<mark>$1</mark>'); }); return out; };
  // Ambalajul deosebește produsele cu același nume (bucata față de setul de 25)
  const pack = p => { const u = p.unit && shortUnit(p.unit); return u ? `${u} · ` : ''; };
  $('#suggest-products').innerHTML = total ? res.ids.slice(0, 5).map((id, i) => { const p = P[id]; return `<li data-card="${id}" data-index="${i + 1}">
      <a href="${pdpHref(id)}" data-select="${id}"><img src="${img(id)}" alt="" width="48" height="48"><span><b>${mark(p.name)}</b><small>${p.stock === 0 ? 'Stoc epuizat' : `${pack(p)}${pLei(p.price)} ${vatLabel()}`}</small>${p.old && p.stock !== 0 ? `<span class="mini__was">${wasHTML(p)}</span>` : ''}</span></a>
      ${p.stock === 0 ? `<button class="mini__add mini__add--notify" type="button" data-notify="${id}" aria-label="Anunță-mă când revine în stoc: ${p.name}"><i class="ph ph-bell" aria-hidden="true"></i></button>` : `<button class="mini__add" type="button" data-add="${id}" aria-label="${p.colors ? `Alege culoarea: ${p.name}` : `Adaugă în coș: ${p.name}`}"><i class="ph ph-plus" aria-hidden="true"></i></button>`}
    </li>`; }).join('')
    : (answers.length ? '' : `<li class="suggest__empty"><b>Nu am găsit „${esc(raw)}”</b><span class="chips">${POPULAR.slice(0, 6).map(t => `<a class="chip" href="${serpHref(t)}">${esc(t)}</a>`).join('')}</span></li>`);
}
q.addEventListener('focus', openSuggest);
q.addEventListener('click', openSuggest);
q.addEventListener('input', () => { if (q.value) openSuggest(); });
// Căutarea intră în „recente” și se măsoară: search_type spune de unde a venit (tastat, completare, recente, frecvente, categorie)
function saveSearch(term, type) {
  term = term.trim();
  if (!term) return;
  state.recent = [term, ...state.recent.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
  store.set('recent', state.recent);
  track('search', null, { search_term: term, ...(type ? { search_type: type } : {}) });
}
suggest.addEventListener('click', e => {
  const a = e.target.closest('#suggest-query, .chip, #suggest-recent-list a, [data-term], [data-scope], [data-answer]');
  if (!a) return;
  if (a.dataset.answer) { track('select_content', null, { content_type: 'raspuns_cautare', content_id: a.dataset.answer, search_term: q.value.trim() }); return; }
  if (a.dataset.term) return saveSearch(a.dataset.term, 'completare');
  if (a.dataset.scope) return saveSearch(q.value, 'categorie');
  saveSearch(a.id === 'suggest-query' ? q.value : a.textContent, a.closest('.chips') ? 'frecvente' : a.closest('#suggest-recent-list') ? 'recente' : 'tastat');
});
$('#recent-clear').addEventListener('click', () => { state.recent = []; store.set('recent', []); renderRecent(); focusQuiet(); });
q.addEventListener('input', () => { clearBtn.hidden = !q.value; clearTimeout(searchTimer); searchTimer = setTimeout(renderLive, 120); });
document.addEventListener('focusin', e => { if (!suggest.hidden && !bar.contains(e.target) && !hsearch.contains(e.target) && !suggest.contains(e.target) && !e.target.closest('.layer')) closeSuggest(); });
clearBtn.addEventListener('click', () => { q.value = ''; clearBtn.hidden = true; renderLive(); focusQuiet(); });
// „Anulează” revine la termenul paginii (pe rezultate rămâne termenul căutat, M.185)
cancelBtn.addEventListener('click', e => {
  q.value = q.defaultValue; clearBtn.hidden = !q.value; renderLive();
  closeSuggest();
  if (e.detail > 0) q.blur(); else refocusSearch();
});
findBtn.addEventListener('click', () => { openSuggest(); q.focus({ preventScroll: true }); });
$('#search').addEventListener('submit', e => {
  if (!q.value.trim()) { e.preventDefault(); focusQuiet(); return; }
  saveSearch(q.value, 'tastat');
});

/* ---------- Meniu și foi de jos: Back și Escape închid stratul (M.013) ---------- */
const scrim = $('#scrim');
let openLayer = null, lastFocus = null;
function open(id) {
  const el = document.getElementById(id);
  if (!el || openLayer === el) return;
  const replace = !!openLayer || !suggest.hidden;
  if (openLayer) close(true, true);
  if (!suggest.hidden) closeSuggest(true);
  hideToast();
  lastFocus = document.activeElement;
  el.hidden = false; el.classList.remove('is-out');
  scrim.hidden = false; scrim.classList.remove('is-out');
  openLayer = el;
  lockScroll();
  $$('body > :not(.layer):not(.scrim):not(script)').forEach(n => n.setAttribute('inert', ''));
  if (replace && history.state && history.state.layer) history.replaceState({ layer: id }, '');
  else history.pushState({ layer: id }, '');
  ($('[data-close]', el) || el).focus({ preventScroll: true });
}
function close(fromHistory, instant) {
  if (!openLayer) return;
  const el = openLayer;
  openLayer = null;
  $$('[inert]').forEach(n => n.removeAttribute('inert'));
  unlockScroll();
  const done = () => { el.hidden = true; el.classList.remove('is-out'); scrim.hidden = true; scrim.classList.remove('is-out'); };
  if (instant || reduce.matches) done();
  else { el.classList.add('is-out'); scrim.classList.add('is-out'); setTimeout(done, 200); }
  if (!fromHistory && history.state && history.state.layer) history.back();
  const back = lastFocus && lastFocus.isConnected && lastFocus.offsetParent ? lastFocus : cartBtn;
  back.focus({ preventScroll: true });
}
addEventListener('popstate', () => {
  if (openLayer) close(true);
  if (!suggest.hidden) { closeSuggest(true); q.blur(); }
});
document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open]');
  if (opener) { e.preventDefault(); return open(opener.dataset.open); }
  const closer = e.target.closest('[data-close]');
  if (closer && openLayer && openLayer.contains(closer)) {
    const href = closer.getAttribute('href');
    close();
    if (href && href.startsWith('#')) { e.preventDefault(); setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }), 240); }
  }
});
scrim.addEventListener('click', () => close());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (openLayer) close();
    else if (!suggest.hidden) { e.preventDefault(); closeSuggest(); refocusSearch(); }
    return;
  }
  if (e.key !== 'Tab' || !openLayer) return;
  const f = $$('a[href], button:not([hidden]):not([tabindex="-1"]), input:not([type="hidden"])', openLayer).filter(x => x.offsetParent);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// iOS aplică :active doar dacă pagina ascultă atingerile
document.addEventListener('touchstart', () => {}, { passive: true });

/* ---------- Header compact: iconița de căutare apare când câmpul iese din ecran ---------- */
// Pe homepage și pe rezultate, câmpul stă sub header; pe celelalte pagini căutarea e doar iconița din header
if (['home', 'serp'].includes(document.body.dataset.page)) new IntersectionObserver(([en]) => bar.classList.toggle('is-compact', !en.isIntersecting), { rootMargin: '-56px 0px 0px 0px' }).observe(hsearch);
else bar.classList.add('is-compact');

/* ---------- Pornire comună ---------- */
renderCart(false);
// Paginile își desenează conținutul, apoi cer revenirea la poziția salvată (Back de pe altă pagină)
function restoreScroll() {
  if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') scrollTo({ top: store.get(yKey(), 0, sessionStorage), behavior: 'instant' });
}
addEventListener('pageshow', e => { if (e.persisted) scrollTo({ top: store.get(yKey(), scrollY, sessionStorage), behavior: 'instant' }); });
