import { validReading, editionDate, type Reading } from '../lib/daily-reading';
const panel = document.querySelector<HTMLElement>('#daily')!;
const current = panel.querySelector<HTMLElement>('#daily-article')!;
const archive = panel.querySelector<HTMLElement>('#daily-archive')!;
const status = panel.querySelector<HTMLElement>('#daily-state')!;
const save = panel.querySelector<HTMLButtonElement>('#daily-save')!;
const refresh = panel.querySelector<HTMLButtonElement>('#daily-refresh')!;
const prefix = 'wdl:reading:v1:' + import.meta.env.BASE_URL + ':';
let active: Reading | undefined;
const saved = new Map<string,Reading>();
function article(target: HTMLElement, item: Reading, archived = false) {
  const meta = document.createElement('small');
  meta.textContent = archived ? item.date + ' · ' + item.topic : item.topic;
  const title = document.createElement('h3'); title.textContent = item.title;
  const summary = document.createElement('p'); summary.textContent = item.summary;
  const practice = document.createElement('p'); practice.textContent = 'Para probarlo: ' + item.practice;
  const link = document.createElement('a'); link.href = item.url; link.className = 'text-link'; link.textContent = item.source;
  target.replaceChildren(meta,title,summary,practice,link);
}
function render() {
  if (active) {
    current.hidden = false;
    article(current,active);
    panel.querySelector('#daily-date')!.textContent = active.date;
    save.disabled = saved.has(active.date);
    save.textContent = save.disabled ? 'Lectura guardada' : 'Guardar lectura';
  }
  archive.replaceChildren();
  for (const item of [...saved.values()].sort((a,b) => b.date.localeCompare(a.date))) {
    const entry = document.createElement('article'); article(entry,item,true); archive.append(entry);
  }
  panel.querySelector('#saved-count')!.textContent = String(saved.size);
}
function restore() {
  try {
    for (const key of Object.keys(localStorage).filter(key => key.startsWith(prefix))) {
      try {
        const item: unknown = JSON.parse(localStorage.getItem(key) || 'null');
        if (!validReading(item)) continue;
        if (key === prefix+'current' && (!active || active.date < item.date)) active = item;
        if (key === prefix+'saved:'+item.date) saved.set(item.date,item);
      } catch { /* Other saved readings are still usable. */ }
    }
  } catch { status.textContent = 'No se puede leer el almacenamiento de este navegador.'; }
  render();
}
async function update() {
  if (refresh.disabled) return;
  refresh.disabled = true;
  try {
    const endpoint = panel.dataset.dev === 'true' ? '/__daily-reading' : panel.dataset.feed!;
    const res = await fetch(endpoint,{cache:'no-store'});
    if (!res.ok) throw new Error();
    const item: unknown = await res.json();
    if (!validReading(item) || item.date > editionDate(new Date())) throw new Error();
    if (!active || item.date > active.date) {
      active = item; render();
      try { localStorage.setItem(prefix+'current',JSON.stringify(item)); } catch { /* The reading is visible for this session. */ }
    }
    status.textContent = active.date < editionDate(new Date()) ? 'Se muestra la última lectura disponible mientras llega la nueva.' : 'Edición de las 8:00 a. m. de Colombia.';
  } catch { status.textContent = active ? 'La actualización está pendiente. Puedes leer o guardar la edición visible.' : 'No se pudo cargar la lectura. Vuelve a intentar.'; }
  finally { refresh.disabled = false; }
}
save.addEventListener('click', () => {
  if (!active) return;
  try {
    localStorage.setItem(prefix+'saved:'+active.date,JSON.stringify(active));
    saved.set(active.date,active); render(); status.textContent = 'Lectura guardada en este navegador.';
  } catch { status.textContent = 'El navegador no pudo guardar la lectura.'; }
});
refresh.addEventListener('click',update);
window.addEventListener('storage', event => { if (event.key?.startsWith(prefix)) restore(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) void update(); });
setInterval(() => { if (!document.hidden) void update(); },60_000);
restore(); void update();
