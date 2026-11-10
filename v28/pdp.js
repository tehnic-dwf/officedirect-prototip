/* OfficeDirect · pagina de produs mobilă (produs.html?id=…)
   Orice produs din catalog se deschide aici. Galeria, specificațiile, codul și disponibilitatea vin de pe paginile live (pdp-data.js);
   câteva produse au și conținutul scris de noi din descrierea producătorului (DETAILS): beneficii, descriere, compatibilitate.
   Buy box în ordinea deciziei: preț, compatibilitate, culoare, prețuri de volum, cantitate cu buton, total. Sub el: livrare cu dată, plată, retur. */

const pid = P[params.get('id')] ? params.get('id') : 'double-a';
const p = P[pid];
const isPaper = !!p.fmt;
const L = (window.PDP_D || {})[pid] || {};

// Conținut scris din descrierile de pe officedirect.ro (30.10.2026), cu diacritice și fără formulele de marketing ale site-ului
const TN_B023_PRINTERS = ['HL-B2000D', 'HL-B2080DW', 'DCP-B7500D', 'DCP-B7520DW', 'MFC-B7715DW'];
const DETAILS = {
  'double-a': {
    title: 'Hârtie Double A Premium, A4, 80 g/mp, 500 coli/top',
    facts: [
      'Clasa A: cea mai albă și netedă, cu contrast puternic la tipar',
      'Tăiată precis, fără blocaje în copiatoarele rapide',
      'Opacă, se poate tipări pe ambele fețe',
      'Fără acizi, documentele rezistă la arhivare',
    ],
    specs: [['Format', 'A4 (210 × 297 mm)'], ['Gramaj', '80 g/mp'], ['Coli în top', '500'], ['Clasa', 'A, după scara C.I.E.'], ['Potrivită pentru', 'Copiator, fax, imprimantă laser și inkjet']],
    desc: [
      'Hârtie de copiator și imprimantă de clasa A, cu suprafață netedă și grad ridicat de alb. Tonerul se transferă uniform, așa că și copiile sunt clare și detaliate, ca originalul.',
      'Conținutul mare de fibre îi dă opacitate: textul de pe o față nu se vede pe cealaltă, deci poți tipări față-verso. Tăierea precisă reduce praful și blocajele, chiar și în aparatele de mare viteză.',
      'Nu conține acizi, așa că documentele arhivate își păstrează aspectul mult timp. Clasa de alb arată contrastul dintre hârtie și cerneală: cu cât hârtia e mai albă, cu atât negrul pare mai intens. Clasele, de la cea mai albă: A, B, C.',
    ],
  },
  'xerox-business': {
    title: 'Hârtie Xerox Business, A4, 80 g/mp, 500 coli/top',
    facts: [
      'Clasa B de alb: contrast bun pentru documentele de zi cu zi, la un preț mai mic decât clasa A',
      'Notată de Xerox cu 4 din 5 la laser și copiator, 3 din 5 la inkjet',
      'Tăiată precis, lasă puțin praf de hârtie în aparat',
    ],
    specs: [['Format', 'A4 (210 × 297 mm)'], ['Gramaj', '80 g/mp'], ['Coli în top', '500'], ['Clasa', 'B, după scara C.I.E.'], ['Potrivită pentru', 'Imprimantă laser și inkjet, copiator'], ['Cod Xerox', '003R91820']],
    desc: [
      'Hârtie albă de birou pentru imprimantele laser și inkjet și pentru copiatoare. Gramajul de 80 g/mp e cel obișnuit pentru documente, oferte și facturi tipărite.',
      'Clasa B de luminozitate dă un contrast bun între hârtie și toner. Pentru prezentări sau documente care trebuie să arate impecabil, alege clasa A; pentru volum mare de tipărit zilnic, clasa B e alegerea economică.',
    ],
  },
  'biblioraft-5': {
    facts: [
      'Carton rigid de 2,4 mm, plastifiat pe ambele fețe: stă drept pe raft și nu se îndoaie sub documente',
      'Bordură metalică la bază și la colțuri, care îl apără de uzură',
      'Mecanism din metal nichelat, cu pârghie, se deschide la 180°',
      'Orificiu pe cotor, ca să-l scoți ușor de pe raft, și buzunar cu etichetă inclusă',
    ],
    specs: [['Lățime cotor', '5 cm'], ['Dimensiuni', '285 × 320 mm'], ['Grosime copertă', '2,4 mm'], ['Greutate', '410 g'], ['Material', 'Carton plastifiat cu polipropilenă, interior și exterior']],
    desc: [
      'Biblioraft A4 pentru arhivarea documentelor, din carton rigid dublu plastifiat. Plastifierea pe interior și exterior îl face ușor de curățat și rezistent la uzură, iar bordura metalică de la bază și colțuri îl protejează când e tras de pe raft.',
      'Mecanismul cu pârghie, din metal nichelat, prinde ferm documentele și se deschide la 180°. Pe cotor are un orificiu de prindere și un buzunar din plastic pentru etichetă, pe care o poți schimba oricând. Primești un biblioraft în culoarea aleasă.',
    ],
  },
  'folie-laminare': {
    facts: [
      'Grosime de 80 microni, pentru documente folosite des',
      'Finisaj lucios, care scoate în evidență culorile și contrastul',
      'Protejează de umezeală, praf și raze UV: documentul nu se rupe și nu se îndoaie',
      'Colțuri ușor rotunjite; intră în laminator cu latura lipită înainte',
    ],
    specs: [['Format', 'A4 (210 × 297 mm)'], ['Grosime', '80 microni'], ['Finisaj', 'Lucios, transparent'], ['Dimensiuni pachet', '305 × 220 × 18 mm']],
    promoEnd: '2026-11-01',
  },
  's-52339': {
    title: 'Cartuș toner Brother TN-B023 original, negru, 2.000 de pagini',
    compat: TN_B023_PRINTERS,
    facts: [
      'Tipărește aproximativ 2.000 de pagini A4, la o acoperire de 5% (standardul ISO/IEC 19752)',
      'Toner original Brother, negru, pentru imprimantele laser monocrom din seria B',
      'Cilindrul DR-B023 se cumpără separat și ține cam 12.000 de pagini, adică 6 tonere',
    ],
    specs: [['Tip', 'Toner laser, negru'], ['Randament', '2.000 de pagini la 5% acoperire'], ['Cod producător', 'TN-B023'], ['Se folosește cu', 'Cilindru DR-B023']],
    with: ['s-52335'],
  },
  's-52335': {
    compat: TN_B023_PRINTERS,
    facts: [
      'Ține aproximativ 12.000 de pagini A4',
      'Se schimbă separat de toner: un cilindru ține cam 6 tonere TN-B023',
      'Original Brother, pentru imprimantele laser monocrom din seria B',
    ],
    specs: [['Tip', 'Unitate cilindru (drum)'], ['Randament', '12.000 de pagini'], ['Cod producător', 'DR-B023'], ['Se folosește cu', 'Toner TN-B023']],
    with: ['s-52339'],
    deee: 0.95,
  },
};
const D = DETAILS[pid] || {};
const isCartridge = /^(Cartuș|Unitate cilindru)/.test(p.name);

/* ---------- Titlu, brand, cod, drumul înapoi ---------- */
const title = D.title || (isPaper ? `${p.name}, ${p.fmt}, ${p.gsm} g/mp, ${p.sheets} coli` : p.name);
// Cifra rămâne pe același rând cu unitatea („80 g/mp”, „500 coli”)
const nb = s => s.replace(/(\d) (g\/mp|coli|cm|mm|g|kg|ml|m|microni|de pagini|culori)/g, '$1 $2');
document.title = `${title} · OfficeDirect`;
const brandEl = $('#pdp-brand');
brandEl.textContent = p.brand || '';
brandEl.hidden = !p.brand;
brandEl.href = serpHref(p.brand || '');
$('#pdp-title').textContent = nb(title);
const code = L.code || p.code;
$('#pdp-code').textContent = code ? `Cod produs ${code}` : '';
$('#pdp-code').hidden = !code;
const seg = p.url.split('/');
$('#crumbs').innerHTML = isPaper
  ? '<li><a href="index.html">Acasă</a></li><li><a href="https://www.officedirect.ro/produse-din-hartie">Produse din hârtie</a></li><li><a href="categorie.html">Hârtie copiator</a></li>'
  : `<li><a href="index.html">Acasă</a></li><li><a href="${SITE + seg[0] + '/' + seg[1]}">${esc(subOf(pid))}</a></li>`;

/* ---------- Galerie ---------- */
let color = null;
const general = L.g && L.g.length ? L.g : [img(pid)];
// La produsele cu culori, prima poză devine cea a culorii alese (M.064)
const gallery = () => (color && L.c && L.c[color] ? [L.c[color], ...general] : general);
const galTrack = $('#gal-track');
const dots = $('#gal-dots');
function renderGallery() {
  const list = gallery();
  $('#gal').classList.toggle('is-multi', list.length > 1);
  galTrack.innerHTML = list.map((src, i) => `<li><button class="gal__slide" type="button" data-zoom="${i}" aria-label="Mărește poza ${i + 1} din ${list.length}">
      <img src="${src}" alt="${i ? '' : esc(title)}" width="900" height="900" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}><i class="ph ph-magnifying-glass-plus gal__z" aria-hidden="true"></i></button></li>`).join('');
  dots.innerHTML = list.length > 1 ? list.map((_, i) => `<span${i ? '' : ' class="is-on"'}></span>`).join('') : '';
  galTrack.scrollLeft = 0;
}
const slideAt = () => { const first = galTrack.firstElementChild; return first ? Math.round(galTrack.scrollLeft / (first.getBoundingClientRect().width + 8)) : 0; };
galTrack.addEventListener('scroll', () => requestAnimationFrame(() => { const i = slideAt(); $$('span', dots).forEach((d, k) => d.classList.toggle('is-on', k === i)); }), { passive: true });
renderGallery();
// „Cel mai vândut” / „Nou” stau pe rândul brandului, nu pe poză; reducerea și stocul sunt în preț și în blocul de livrare
$('#pdp-brand').insertAdjacentHTML('afterend', flagHTML(p, false));

/* ---------- Poza mare, cu trecere între poze ---------- */
const viewerImg = $('#viewer-img');
let vIndex = 0;
function showViewer(i) {
  const list = gallery();
  vIndex = (i + list.length) % list.length;
  viewerImg.src = list[vIndex];
  viewerImg.alt = title;
  $('#viewer-stage').classList.remove('is-zoomed');
  $('#viewer-prev').hidden = $('#viewer-next').hidden = list.length < 2;
  $('#viewer-hint').textContent = list.length > 1 ? `${vIndex + 1} din ${list.length} · atinge ca să mărești` : 'Atinge poza ca s-o mărești';
}
galTrack.addEventListener('click', e => {
  const b = e.target.closest('[data-zoom]');
  if (!b) return;
  showViewer(Number(b.dataset.zoom));
  open('viewer');
  track('image_zoom', null, { item_id: pid, image_index: vIndex + 1 });
});
$('#viewer-prev').addEventListener('click', () => showViewer(vIndex - 1));
$('#viewer-next').addEventListener('click', () => showViewer(vIndex + 1));
$('#viewer-stage').addEventListener('click', e => {
  const stage = $('#viewer-stage');
  const r = viewerImg.getBoundingClientRect();
  const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
  stage.classList.toggle('is-zoomed');
  if (stage.classList.contains('is-zoomed')) {
    stage.scrollLeft = fx * stage.scrollWidth - stage.clientWidth / 2;
    stage.scrollTop = fy * stage.scrollHeight - stage.clientHeight / 2;
  }
});

/* ---------- Buy box ---------- */
let qty = 1;
const from = store.get('from', null, sessionStorage);
const ctx = from && from.id === pid ? { list: from.list, listName: from.listName, index: from.index } : {};
const unit = n => unitPrice(pid, n);
const base = p.price;
const out = p.stock === 0;
const [one, many] = isPaper ? ['top', 'topuri'] : ['buc.', 'buc.'];
const rows = p.tiers ? [[1, base], ...p.tiers] : null;
const tierOf = n => [...rows].reverse().find(([min]) => n >= min)[0];
const dateFmt = new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });

// Prețul pe 100 de coli (sau pe bucată) stă lipit de prețul mare, ca „adică …”: e același preț, socotit altfel, nu un preț redus.
// Se recalculează când alegi un prag de volum, ca să nu contrazică pragurile (PDP-12)
const unitLine = price => `adică ${perUnit(p, price).replace('/', ' / ')}`;
function priceHTMLpdp() {
  const off = p.old ? Math.floor((1 - base / p.old) * 100) : 0;
  const ends = D.promoEnd && new Date(D.promoEnd + 'T23:59:59') > new Date() ? new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(new Date(D.promoEnd)) : '';
  return `<div class="pprice">
      <p class="price"><span class="price__main">${money.format(vatPrice(base))} <small>lei</small></span>${vatTag()}</p>
      ${p.per ? `<p class="pprice__unit" id="pprice-unit">${unitLine(base)}</p>` : ''}
      ${off ? `<div class="pgroup pgroup--sale">
        <p class="pgroup__t">Reducere -${off}%</p>
        <p class="pgroup__line">Preț anterior <s>${pLei(p.old)}</s>, economisești <b>${lei(round2(vatPrice(p.old) - vatPrice(base)))}</b>${ends ? `, până pe ${ends}` : ''}</p>
        <p class="pprice__note">Prețul anterior e cel mai mic din cele 30 de zile dinaintea reducerii.</p>
      </div>` : ''}
      ${D.deee ? `<p class="pprice__note">Prețul include ${pLei(D.deee)} pentru colectarea deșeurilor electrice (DEEE).</p>` : ''}
    </div>`;
}
// Tonerul și cilindrul: cu ce imprimante merg, înainte de buton (constatarea 26)
function compatHTML() {
  if (!D.compat) return '';
  return `<div class="compat">
      <p class="compat__title"><i class="ph ph-printer" aria-hidden="true"></i>Se potrivește cu imprimantele Brother</p>
      <ul class="compat__list">${D.compat.map(m => `<li>${m}</li>`).join('')}</ul>
      <p class="compat__hint">Modelul e scris pe eticheta din față a imprimantei.</p>
    </div>`;
}
function colorsHTML() {
  if (!p.colors || out) return '';
  return `<fieldset class="pcolors" id="pcolors">
    <legend>Culoare: <b id="pcolor-name">${color || 'alege una'}</b></legend>
    <div class="pcolors__list">${p.colors.map(c => `<label class="pcolor"><input type="radio" name="pcolor" value="${esc(c)}" ${c === color ? 'checked' : ''}><span style="background:${COLOR[c]}" aria-hidden="true"></span><span class="sr-only">${esc(c)}</span></label>`).join('')}</div>
    <p class="pcolors__err" id="pcolors-err" hidden>Alege o culoare ca să adaugi în coș.</p>
  </fieldset>`;
}
// Prețurile de volum: atingi un prag și cantitatea se pune singură; pragul cel mai mare arată economia (M.158)
function tiersHTML() {
  if (!rows || out) return '';
  const cur = tierOf(qty);
  return `<div class="tiers">
    <p class="tiers__title">Preț de volum (lei/${one}, ${vatLabel()})</p>
    <ul class="tiers__list" style="--n:${rows.length}">${rows.map(([min, price]) => {
      const off = Math.floor((1 - price / base) * 100);
      return `<li><button class="tier${min === cur ? ' is-on' : ''}" type="button" data-tier="${min}" aria-pressed="${min === cur}" aria-label="De la ${min} ${min === 1 ? one : many}, ${pLei(price)} pe ${one} ${vatLabel()}${off ? `, cu ${off}% mai puțin` : ''}">
        <span class="tier__q">${min}+</span><span class="tier__p">${money.format(vatPrice(price))}</span>${off ? `<span class="tier__off">-${off}%</span>` : '<span class="tier__off" aria-hidden="true">&nbsp;</span>'}
      </button></li>`;
    }).join('')}</ul>
  </div>`;
}
function totalHTML() {
  const u = unit(qty);
  const total = round2(qty * u);
  const saved = round2(qty * (base - u));
  const next = p.tiers?.find(([min]) => qty < min);
  return `<p class="ptotal__sum"><span>${qty} × ${pLei(u)}</span><b>${lei(round2(qty * vatPrice(u)))}</b></p>
    <p class="ptotal__sub">Total ${vatLabel()}${saved > 0 ? ` · <span class="ptotal__save">plătești cu ${lei(round2(qty * (vatPrice(base) - vatPrice(u))))} mai puțin la prețul de volum</span>` : ''}</p>
    ${next ? `<button class="ptotal__next" type="button" data-tier="${next[0]}">Încă ${cate(next[0] - qty, many)} și plătești ${pLei(next[1])}/${one}<span>Pune ${next[0]} în coș: plătești cu ${lei(round2(next[0] * (vatPrice(u) - vatPrice(next[1]))))} mai puțin</span></button>` : ''}`;
}
// Disponibilitatea stă lângă buton (obiectivul: „prețul, disponibilitatea și condițiile nu se ascund”); detaliile de livrare rămân mai jos
function availHTML() {
  if (p.avail === 'furnizor') return `<p class="pavail pavail--wait"><i class="ph ph-clock-counter-clockwise" aria-hidden="true"></i><span><b>Se aduce de la furnizor</b> · data o vezi înainte să plasezi comanda</span></p>`;
  const low = p.stock > 0 && p.stock <= LOW_STOCK;
  return `<p class="pavail${low || p.avail === 'limitat' ? ' pavail--low' : ''}"><i class="ph ph-check-circle" aria-hidden="true"></i><span><b>${low ? `Ultimele ${p.stock} în stoc` : p.avail === 'limitat' ? 'Stoc limitat' : 'În stoc'}</b> · ajunge ${deliveryDate()}</span></p>`;
}
// Salvarea în listă: acțiune secundară, sub cumpărare (mov, nu portocaliu); ia culoarea și cantitatea alese acum
const saveLabel = () => { const n = listOf(pid).length; return `<i class="ph ph-heart" aria-hidden="true"></i>${n ? `Salvat în ${n === 1 ? 'listă' : n + ' liste'} · schimbă` : 'Salvează în listă'}`; };
document.addEventListener('click', e => { const b = e.target.closest('.psave'); if (b) { b.dataset.saveColor = color || ''; b.dataset.saveQ = qty; } }, true);
hooks.lists.push(() => { const b = $('.psave'); if (b) { b.innerHTML = saveLabel(); b.setAttribute('aria-pressed', listOf(pid).length > 0); } });
function inCartHTML() {
  const n = qtyOf(pid);
  return n ? `<i class="ph ph-check-circle" aria-hidden="true"></i><span>Ai ${n} în coș</span><a href="#" data-open="sheet-cos">Vezi coșul</a>` : '';
}
function renderBuy() {
  $('#buybox').innerHTML = `
    ${priceHTMLpdp()}
    ${compatHTML()}
    ${out ? `<div class="pout"><p class="pout__title">Stoc epuizat</p><p class="pout__text">Îți scriem pe email când revine.</p>
      <button class="btn btn--secondary btn--block" type="button" data-notify="${pid}"><i class="ph ph-bell" aria-hidden="true"></i>Anunță-mă când revine</button>
      ${$('#alt-rail').children.length ? '<a class="link" href="#alt-sec">Vezi alternative în stoc</a>' : ''}</div>` : `
    ${availHTML()}
    ${colorsHTML()}
    ${tiersHTML()}
    <div class="pbuy">
      <div class="step" role="group" aria-label="Cantitate">
        <button type="button" data-pq="-1" aria-label="Scade cantitatea"><i class="ph ph-minus" aria-hidden="true"></i></button>
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" value="${qty}" id="pq" aria-label="Cantitate">
        <button type="button" data-pq="1" aria-label="Crește cantitatea"><i class="ph ph-plus" aria-hidden="true"></i></button>
      </div>
      <button class="btn btn--primary" type="button" id="pb-add">Adaugă în coș</button>
    </div>
    <div class="ptotal" id="ptotal" aria-live="polite">${totalHTML()}</div>`}
    <button class="psave" type="button" data-save="${pid}" aria-pressed="${listOf(pid).length > 0}">${saveLabel()}</button>
    <p class="pincart" id="pincart" ${qtyOf(pid) ? '' : 'hidden'}>${inCartHTML()}</p>`;
  renderVatSwitches();
  updateBar();
  barIO.disconnect();
  if ($('#pb-add')) barIO.observe($('#pb-add'));
}
// Cantitatea se schimbă fără să redesenăm tot blocul, ca focusul să rămână pe loc
function setQ(n, from) {
  qty = Math.max(1, Math.min(9999, Math.floor(n) || 1));
  const inp = $('#pq');
  if (inp && (document.activeElement !== inp || from === 'input')) inp.value = qty;
  // Redesenăm totalul doar dacă s-a schimbat: altfel, la ieșirea din câmp, atingerea pe sugestia de prag s-ar pierde
  const html = totalHTML();
  if ($('#ptotal').dataset.html !== html) { $('#ptotal').innerHTML = html; $('#ptotal').dataset.html = html; }
  if (rows) {
    const cur = tierOf(qty);
    $$('.tier', $('#buybox')).forEach(b => { const on = Number(b.dataset.tier) === cur; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }
  updateBar();
}
function addToCart(btn) {
  if (p.colors && !color) {
    $('#pcolors-err').hidden = false;
    $('#pcolors').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
    $('#pcolors input').focus({ preventScroll: true });
    return;
  }
  const key = keyOf(pid, color);
  setQty(key, (state.cart[key] || 0) + qty, btn, { ctx, flyFrom: $('#gal-track img') });
}
$('#buybox').addEventListener('click', e => {
  const step = e.target.closest('[data-pq]');
  if (step) return setQ(qty + Number(step.dataset.pq));
  const tier = e.target.closest('[data-tier]');
  if (tier) {
    setQ(Number(tier.dataset.tier));
    track('tier_select', null, { item_id: pid, threshold: qty, item_list_id: 'pdp', source: tier.classList.contains('ptotal__next') ? 'total' : 'praguri' });
    return;
  }
  if (e.target.closest('#pb-add')) addToCart(e.target.closest('#pb-add'));
});
$('#buybox').addEventListener('input', e => {
  if (e.target.id === 'pq') { e.target.value = e.target.value.replace(/\D/g, ''); if (e.target.value) setQ(Number(e.target.value)); }
});
$('#buybox').addEventListener('change', e => {
  if (e.target.id === 'pq') setQ(Number(e.target.value), 'input');
  if (e.target.name === 'pcolor') {
    color = e.target.value;
    $('#pcolor-name').textContent = color;
    $('#pcolors-err').hidden = true;
    renderGallery();
    updateBar();
    track('select_content', null, { content_type: 'culoare', content_id: color, item_id: pid });
  }
});
hooks.vat.push(renderBuy);
hooks.cart.push(() => {
  const el = $('#pincart');
  if (el) { el.hidden = !qtyOf(pid); el.innerHTML = inCartHTML(); }
});

/* ---------- Livrare cu dată, plată, retur (constatările 28 și 29) ---------- */
// „24-48 de ore” devine o dată: două zile lucrătoare de azi, fără sâmbătă și duminică
function deliveryDate() {
  const d = new Date();
  let left = 2;
  while (left) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) left--; }
  return dateFmt.format(d);
}
function renderAssure() {
  const { total } = cartTotals();
  const ship = total >= SHIP_RO ? 'Ai deja livrare gratuită în toată țara' : `Gratuită de la ${SHIP_RO} lei, ${SHIP_BUC} lei în București`;
  const stockRow = out ? null
    : p.avail === 'furnizor' ? ['ph-truck', 'Se aduce de la furnizor', 'Data de livrare o vezi înainte să plasezi comanda']
    : ['ph-truck', `Ajunge până ${deliveryDate()}`, `${p.stock > 0 && p.stock <= LOW_STOCK ? `Ultimele ${p.stock} buc. în stoc. ` : p.avail === 'limitat' ? 'Stoc limitat. ' : ''}${ship}`];
  const items = [
    ...(stockRow ? [stockRow] : []),
    ...(L.nolocker || out ? [] : [['ph-package', 'Poți ridica din easybox sau FANbox', '']]),
    ['ph-bank', 'Plătești prin OP, card sau ramburs', 'Factură pe CUI; ramburs fără taxă până la 5.000 lei'],
    ['ph-arrow-u-up-left', 'Retur în 30 de zile', 'Gratuit pentru coletele sub 10 kg'],
  ];
  $('#assure').innerHTML = items.map(([icon, t, s]) => `<li><button type="button" data-open="sheet-livrare" aria-haspopup="dialog"><i class="ph ${icon}" aria-hidden="true"></i><span><b>${t}</b>${s ? `<small>${s}</small>` : ''}</span><i class="ph ph-caret-right" aria-hidden="true"></i></button></li>`).join('');
}
hooks.cart.push(renderAssure);

/* ---------- Bara fixă de cumpărare ---------- */
const buyBar = $('#pdp-bar');
function updateBar() {
  if (out) return;
  const ul = $('#pprice-unit'); if (ul) ul.textContent = unitLine(unit(qty));
  $('#pdp-bar-price').innerHTML = `<b>${lei(round2(qty * vatPrice(unit(qty))))}</b><span>${qty} × ${pLei(unit(qty))} · ${vatLabel()}</span>`;
}
const barIO = new IntersectionObserver(([en]) => {
  const show = !en.isIntersecting;
  buyBar.hidden = !show;
  document.body.classList.toggle('has-bar', show);
});
$('#pdp-bar-btn').addEventListener('click', e => addToCart(e.currentTarget));

/* ---------- De ce să-l alegi, specificații, descriere ---------- */
if (D.facts) {
  $('#facts-sec').hidden = false;
  $('#facts').innerHTML = D.facts.map(f => `<li><i class="ph ph-check" aria-hidden="true"></i><span>${nb(f)}</span></li>`).join('');
}
const A_SIZE = { A3: '297 × 420 mm', A4: '210 × 297 mm', A5: '148 × 210 mm' };
function specList() {
  const site = (L.s || []).filter(([k]) => k !== 'Ambalare');
  let list;
  if (isPaper) {
    const cls = site.find(([k]) => k === 'Clasa');
    list = [['Format', `${p.fmt} (${A_SIZE[p.fmt] || ''})`], ['Gramaj', `${p.gsm} g/mp`], ['Coli în top', String(p.sheets)],
      ['Tip', p.kind === 'carton' ? 'Carton' : p.recycled ? 'Hârtie reciclată' : 'Hârtie albă'],
      ...(cls ? [['Clasa', `${cls[1]}, după scara C.I.E.`]] : []), ...site.filter(([k]) => k === 'Potrivită pentru')];
  } else list = [['Ambalare', p.unit], ...site];
  if (p.colors) list.push(['Culori', `${p.colors.length} culori`]);
  // Specificațiile scrise de noi au prioritate; restul se completează din site
  const own = D.specs || [];
  const merged = [...own, ...list.filter(([k]) => !own.some(([o]) => o === k))];
  if (p.brand) merged.push(['Brand', p.brand]);
  if (code) merged.push(['Cod produs', code]);
  return merged;
}
$('#specs').innerHTML = specList().map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(nb(v))}</dd></div>`).join('');
if (D.desc) {
  $('#desc-sec').hidden = false;
  $('#desc').innerHTML = D.desc.map(t => `<p>${nb(t)}</p>`).join('');
  const more = $('#desc-more');
  more.hidden = D.desc.length < 3;
  if (more.hidden) $('#desc').classList.add('is-open');
  more.addEventListener('click', e => {
    const isOpen = $('#desc').classList.toggle('is-open');
    e.currentTarget.setAttribute('aria-expanded', isOpen);
    e.currentTarget.textContent = isOpen ? 'Arată mai puțin' : 'Citește toată descrierea';
  });
}

/* ---------- Se folosesc împreună / Alternative (M.076, M.190, constatarea 31) ---------- */
// La cartușe, recomandările vin din compatibilitate: cilindrul cu tonerul lui, fără alternative din alte imprimante
const paperComp = ['capse', 'tesa', 'biblioraft-5', 'file-noki', 'dosar-accenta'];
const comp = [...new Set([...(D.with || []), ...(COMPLEMENT[pid] || []), ...(isPaper ? paperComp : [])])].filter(x => x !== pid && P[x] && inStock(x)).slice(0, 6);
const alts = isCartridge ? [] : Object.keys(P).filter(x => x !== pid && inStock(x) && !comp.includes(x) && P[x].cat === p.cat && (isPaper
  ? P[x].fmt === p.fmt && Math.abs(P[x].gsm - p.gsm) <= 10 && P[x].kind === p.kind && P[x].price <= p.price * 1.6 && P[x].price >= p.price * 0.6
  : subOf(x) === subOf(pid))).sort((a, b) => (P[a].rank ?? 999) - (P[b].rank ?? 999)).slice(0, 8);
function rail(sec, el, ids) {
  if (!ids.length) return;
  $(sec).hidden = false;
  $(el).innerHTML = ids.map((x, i) => cardHTML(x, i + 1)).join('');
  observeCards($(el));
}
rail('#comp-sec', '#comp-rail', comp);
rail('#alt-sec', '#alt-rail', alts);
$('#alt-title').textContent = isPaper ? `Alternative: ${p.fmt}, ${p.gsm} g/mp` : `Alte ${subOf(pid).toLowerCase()}`;
if (isCartridge) $('#comp-title').textContent = 'Se folosește cu';

/* ---------- Pornire ---------- */
renderBuy();
renderAssure();
track('view_item', { currency: 'RON', value: base, items: [gaItem(pid, ctx)] });
remember(pid);
restoreScroll();
