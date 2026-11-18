/* OfficeDirect · Listele mele (10.11.2026)
   Catalogul firmei: liste cu numele lor (de exemplu „Comanda lunară”, „Curățenie”), fiecare produs cu cantitatea obișnuită.
   „Comandă lista” trimite lista în comanda rapidă, unde se verifică stocul, culorile și prețul de volum înainte de coș.
   Listele se țin local în prototip (localStorage); în magazin sunt în contul clientului și se pot împărți cu colegii.
   Demo: ?liste=demo pune două liste de exemplu, dacă nu ai niciuna. */

const LS_DEMO = [
  ['Comanda lunară', [['double-a', 10], ['capse', 5], ['tesa', 6], ['file-noki', 4], ['biblioraft-5|albastru', 10]]],
  ['Curățenie și protocol', [['hartie-igienica', 2], ['prosop', 12], ['servetele', 1], ['manusi', 2], ['odorizant', 2]]],
];
if (params.get('liste') === 'demo' && !listsAll().length) LS_DEMO.forEach(([n, items]) => listNew(n, items));

let openList = null;   // lista desfăcută (se vede ce conține)
let confirmDel = null; // lista care așteaptă confirmarea ștergerii
let renaming = null;

const unitShort = p => (/^1 /.test(p.unit) ? 'buc.' : p.unit.split(' ')[0].toLowerCase());
function itemHTML(l, [k, q]) {
  const [id, color] = k.split('|'), p = P[id];
  return `<li class="ls__item">
    <img src="${img(id)}" alt="" width="48" height="48">
    <p><a href="${pdpHref(id)}">${esc(p.name)}${color ? `, ${esc(color)}` : ''}</a><small>${p.code ? `Cod ${p.code} · ` : ''}${pLei(unitPrice(id, q))}/${unitShort(p)}</small></p>
    <button class="icon-btn ls__del" type="button" data-ldel="${l.id}|${k}" aria-label="Scoate din listă: ${esc(p.name)}"><i class="ph ph-x" aria-hidden="true"></i></button>
    <div class="step ls__step" role="group" aria-label="Cantitate obișnuită: ${esc(p.name)}">
      <button type="button" data-lq="${l.id}|${k}|-1" aria-label="Scade cantitatea"${q <= 1 ? ' disabled' : ''}><i class="ph ph-minus" aria-hidden="true"></i></button>
      <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" value="${q}" data-lqi="${l.id}|${k}" aria-label="Cantitate obișnuită">
      <button type="button" data-lq="${l.id}|${k}|1" aria-label="Crește cantitatea"><i class="ph ph-plus" aria-hidden="true"></i></button>
    </div>
  </li>`;
}
function listHTML(l) {
  const n = l.items.length, isOpen = openList === l.id;
  return `<section class="ls__list" id="lista-${l.id}" aria-labelledby="lt-${l.id}">
    <div class="ls__top">
      ${renaming === l.id
        ? `<form class="ls__rename" data-lrename="${l.id}" novalidate><label class="sr-only" for="lr-${l.id}">Numele listei</label><input class="field__input" id="lr-${l.id}" value="${esc(l.name)}" maxlength="40"><button class="btn btn--secondary" type="submit">Salvează</button></form>`
        : `<h2 class="ls__name" id="lt-${l.id}">${esc(l.name)}</h2>`}
      <p class="ls__meta">${n ? `${cate(n, n === 1 ? 'produs' : 'produse')} · ${lei(listTotal(l))} ${vatLabel()}, la prețul de azi` : 'Lista e goală. Salvează produse cu inima de pe ele.'}</p>
    </div>
    ${n ? `<ul class="qo__thumbs ls__thumbs" aria-hidden="true">${l.items.slice(0, 6).map(([k, q]) => `<li><img src="${img(k.split('|')[0])}" alt="" width="44" height="44"><span>${q}</span></li>`).join('')}${n > 6 ? `<li class="ls__more">+${n - 6}</li>` : ''}</ul>
    <a class="btn btn--dark btn--block" href="comanda-rapida.html?lista=${l.id}" data-lorder="${l.id}">Comandă lista</a>` : ''}
    <div class="ls__actions">
      ${n ? `<button class="text-btn" type="button" data-ltoggle="${l.id}" aria-expanded="${isOpen}" aria-controls="li-${l.id}">${isOpen ? 'Ascunde produsele' : 'Vezi și modifică produsele'}</button>
      <button class="text-btn" type="button" data-lcopy="${l.id}">Copiază codurile</button>` : ''}
      <button class="text-btn" type="button" data-lren="${l.id}">Redenumește</button>
      ${confirmDel === l.id
        ? `<span class="ls__confirm" role="group" aria-label="Confirmă ștergerea"><button class="text-btn ls__danger" type="button" data-ldelete="${l.id}">Da, șterge lista</button><button class="text-btn" type="button" data-lkeep>Renunță</button></span>`
        : `<button class="text-btn" type="button" data-lask="${l.id}">Șterge lista</button>`}
    </div>
    ${n ? `<ul class="ls__items" id="li-${l.id}"${isOpen ? '' : ' hidden'}>${l.items.map(it => itemHTML(l, it)).join('')}</ul>` : ''}
  </section>`;
}
function render(focusSel) {
  const all = listsAll();
  $('#ls-body').innerHTML = all.length
    ? `<div class="ls__new"><form id="ls-create" novalidate><label class="qo__label" for="ls-name">Listă nouă</label>
         <div class="lsave__row"><input class="field__input" id="ls-name" maxlength="40" placeholder="ex. Birou etaj 2" autocomplete="off"><button class="btn btn--secondary" type="submit">Creează</button></div></form></div>
       ${all.map(listHTML).join('')}`
    : `<section class="ls__empty" aria-labelledby="ls-empty-t">
        <h2 class="h2" id="ls-empty-t">Fă-ți catalogul biroului</h2>
        <ol class="ls__steps">
          <li><i class="ph ph-heart" aria-hidden="true"></i><span><b>Apasă inima</b> pe produsele pe care le comanzi des, în categorie, în căutare sau pe pagina produsului.</span></li>
          <li><i class="ph ph-stack" aria-hidden="true"></i><span><b>Alege cantitatea obișnuită</b> și lista: „Comanda lunară”, „Curățenie”, „Sala de ședințe”.</span></li>
          <li><i class="ph ph-lightning" aria-hidden="true"></i><span><b>Comandă lista întreagă</b> din comanda rapidă: verifici, apoi pui tot în coș.</span></li>
        </ol>
        <a class="btn btn--dark btn--block" href="categorie.html">Începe cu hârtia de birou</a>
        <a class="lsave__all" href="liste.html?liste=demo">Vezi un exemplu cu două liste</a>
      </section>`;
  if (focusSel) $(focusSel)?.focus({ preventScroll: true });
}
const parts = s => { const i = s.indexOf('|'); return [s.slice(0, i), s.slice(i + 1)]; };
function updateItem(lid, key, fn) {
  const all = listsAll(), l = all.find(x => x.id === lid);
  if (!l) return;
  const i = l.items.findIndex(([k]) => k === key);
  if (i < 0) return;
  fn(l, i);
  listsSave(all);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-ltoggle], [data-lcopy], [data-lren], [data-lask], [data-ldelete], [data-lkeep], [data-ldel], [data-lq], [data-lorder]');
  if (!t) return;
  const d = t.dataset;
  if (d.ltoggle) { openList = openList === d.ltoggle ? null : d.ltoggle; render(`[data-ltoggle="${d.ltoggle}"]`); return; }
  if (d.lorder) { track('list_order', null, { list_id: d.lorder, items: listsAll().find(l => l.id === d.lorder)?.items.length }); return; }
  if (d.lcopy) {
    const l = listsAll().find(x => x.id === d.lcopy);
    const lines = l.items.map(([k, q]) => { const p = P[k.split('|')[0]]; return `${p.code || p.name}\t${q}`; }).join('\n');
    (navigator.clipboard?.writeText(lines) || Promise.reject()).then(() => note('Am copiat codurile și cantitățile. Le poți lipi în Excel sau într-un email.'), () => note('Nu am putut copia. Deschide lista și copiază codurile de acolo.'));
    track('list_copy_codes', null, { list_id: l.id });
    return;
  }
  if (d.lren) { renaming = d.lren; render(`#lr-${d.lren}`); $(`#lr-${d.lren}`)?.select(); return; }
  if (d.lask) { confirmDel = d.lask; render(`[data-ldelete="${d.lask}"]`); return; }
  if (d.lkeep != null) { const id = confirmDel; confirmDel = null; render(`[data-lask="${id}"]`); return; }
  if (d.ldelete) { const name = listsAll().find(x => x.id === d.ldelete)?.name; listsSave(listsAll().filter(x => x.id !== d.ldelete)); confirmDel = null; render('#ls-name'); announce(`Lista „${name}” a fost ștearsă.`); return; }
  if (d.ldel) { const [lid, key] = parts(d.ldel); updateItem(lid, key, (l, i) => l.items.splice(i, 1)); render(`#li-${lid} [data-ldel], [data-ltoggle="${lid}"]`); announce('Produsul a fost scos din listă.'); return; }
  if (d.lq) { const [lid, rest] = parts(d.lq); const k = rest.slice(0, rest.lastIndexOf('|')), step = Number(rest.slice(rest.lastIndexOf('|') + 1)); let nq; updateItem(lid, k, (l, i) => { nq = l.items[i][1] = Math.max(1, Math.min(9999, l.items[i][1] + step)); }); render(`[data-lq="${d.lq}"]:not([disabled]), [data-lqi="${lid}|${k}"]`); announce(`Cantitate obișnuită: ${nq}.`); }
});
document.addEventListener('change', e => {
  const i = e.target.closest('[data-lqi]');
  if (!i) return;
  const [lid, key] = parts(i.dataset.lqi);
  updateItem(lid, key, (l, j) => { l.items[j][1] = Math.max(1, Math.min(9999, Number(i.value.replace(/\D/g, '')) || 1)); });
  render(`[data-lqi="${i.dataset.lqi}"]`);
});
document.addEventListener('input', e => { if (e.target.matches?.('[data-lqi]')) e.target.value = e.target.value.replace(/\D/g, ''); });
document.addEventListener('submit', e => {
  if (e.target.id === 'ls-create') {
    e.preventDefault();
    const n = $('#ls-name').value.trim();
    if (!n) { $('#ls-name').focus(); return; }
    const l = listNew(n); render(`#lt-${l.id}`); announce(`Lista „${l.name}” a fost creată.`);
    return;
  }
  const f = e.target.closest('[data-lrename]');
  if (f) {
    e.preventDefault();
    const v = $('input', f).value.trim();
    const all = listsAll(); const l = all.find(x => x.id === f.dataset.lrename);
    if (v && l) { l.name = v.slice(0, 40); listsSave(all); }
    renaming = null; render(`[data-lren="${f.dataset.lrename}"]`);
  }
});
hooks.vat.push(() => render());
render();
// Din altă pagină, cu #lista-<id>: lista se deschide și ajunge în ecran
const fromHash = location.hash.match(/^#lista-(.+)$/);
if (fromHash && listsAll().some(l => l.id === fromHash[1])) { openList = fromHash[1]; render(); $('#lista-' + fromHash[1]).scrollIntoView(); }
