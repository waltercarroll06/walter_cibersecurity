import { validReading, editionDate, type Reading, type PersonalReading } from '../lib/daily-reading';
const panel = document.querySelector<HTMLElement>('#daily')!;
const current = panel.querySelector<HTMLElement>('#daily-article')!;
const archive = panel.querySelector<HTMLElement>('#daily-archive')!;
const status = panel.querySelector<HTMLElement>('#daily-state')!;
const save = panel.querySelector<HTMLButtonElement>('#daily-save')!;
const refresh = panel.querySelector<HTMLButtonElement>('#daily-refresh')!;
const prefix = 'wdl:reading:v1:' + import.meta.env.BASE_URL + ':';
let active: PersonalReading | undefined;
const identity=(r:Reading)=>r.date+':'+r.url;
const profileId=()=>document.documentElement.dataset.studyProfile;

const saved = new Map<string,Reading>();
function article(target: HTMLElement, item: Reading, archived = false) {
  const meta = document.createElement('small');
  meta.textContent = archived ? item.date + ' · ' + item.topic : item.topic;
  const title = document.createElement('h3'); title.textContent = item.title;
  const summary = document.createElement('p'); summary.textContent = item.summary;
  const practice = document.createElement('p'); practice.textContent = 'Para probarlo: ' + item.practice;
  const link = document.createElement('a'); link.href = item.url; link.className = 'text-link'; link.textContent = item.source;
  target.replaceChildren(meta,title,summary,practice,link);
  const r=item as Partial<PersonalReading>;
  if(r.note && r.level && r.evidence) {
    const why=document.createElement('p');
    why.textContent='Por tu apunte «'+r.note+'»: «'+r.evidence+'». Nivel sugerido: '+r.level+'.';
    target.append(why);
  }
}
function render() {
  if (active) {
    current.hidden = false;
    article(current,active);
    panel.querySelector('#daily-date')!.textContent = active.date;
    save.disabled = saved.has(identity(active));
    save.textContent = save.disabled ? 'Lectura guardada' : 'Guardar lectura';
  }
  else {current.hidden=true; current.replaceChildren(); save.disabled=true; save.textContent='Guardar lectura'; panel.querySelector('#daily-date')!.textContent='';}
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
        const cached=item as PersonalReading;
        if (key === prefix+'current' && cached.profileId && cached.profileId===profileId() && cached.evidence && (!active || active.date<item.date)) active=cached;
        if (key.startsWith(prefix+'saved:')) saved.set(identity(item),item);
      } catch { /* Other saved readings are still usable. */ }
    }
  } catch { status.textContent = 'No se puede leer el almacenamiento de este navegador.'; }
  render();
}
async function update() {
  const id=profileId();
  if(active && active.profileId!==id){active=undefined;render();}
  if(panel.dataset.dev!=='true'){status.textContent='Abre el laboratorio local para preparar lecturas con tus apuntes.';return;}
  if(!id || id==='error'){status.textContent=id==='error'?'No se pudieron sincronizar tus apuntes con el laboratorio local.':'Comprobando tus apuntes…';return;}
  if(refresh.disabled) return;
  refresh.disabled=true;
  try {
    const res=await fetch('/__daily-reading?profile='+encodeURIComponent(id),{cache:'no-store'});
    if(id!==profileId())return;
    if(!res.ok)throw new Error();
    const item=await res.json();
    if(item.state==='empty'){active=undefined;render();status.textContent='Escribe tu primer apunte con tus propias palabras. A partir de él te recomendaremos una lectura.';return;}
    if(item.state==='pending'){status.textContent='Aún no hay una lectura verificada para estos apuntes. El laboratorio necesita Ollama e Internet para prepararla.';return;}
    if(!validReading(item) || (item as PersonalReading).profileId!==id || item.date>editionDate(new Date()))throw new Error();
    active=item as PersonalReading;
    render();
    try{localStorage.setItem(prefix+'current',JSON.stringify(item));}catch{/* Display remains available. */}
    status.textContent=active.date<editionDate(new Date())?'Última lectura disponible para tus apuntes.':'Edición de las 8:00 a. m. de Colombia.';
  } catch { status.textContent = active ? 'La actualización está pendiente. Puedes leer o guardar la edición visible.' : 'No se pudo cargar la lectura. Vuelve a intentar.'; }
  finally { refresh.disabled = false; if(id!==profileId()) void update(); }
}
save.addEventListener('click', () => {
  if (!active) return;
  try {
    localStorage.setItem(prefix+'saved:'+identity(active),JSON.stringify(active));
    saved.set(identity(active),active); render(); status.textContent = 'Lectura guardada en este navegador.';
  } catch { status.textContent = 'El navegador no pudo guardar la lectura.'; }
});
refresh.addEventListener('click',update);
window.addEventListener('storage', event => { if (event.key?.startsWith(prefix)) restore(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) void update(); });
setInterval(() => { if (!document.hidden) void update(); },60_000);
document.addEventListener('study-profile-ready',()=>{restore();void update();});
restore(); void update();
