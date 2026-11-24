import { syncStudyNotes } from './study-sync';
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
let loading=false;
let usedEdition='';
let empty=false;
let failedMessage='';
function refreshState(){
  refresh.disabled=loading || empty || usedEdition===editionDate(new Date()) || panel.dataset.dev!=='true' || !profileId() || profileId()==='error';
}
async function update(manual=false) {
  if(loading)return;
  if(panel.dataset.dev!=='true'){refreshState();status.textContent='Abre el laboratorio local para buscar novedades con tus apuntes.';return;}
  loading=true;refreshState();
  let id=profileId();
  try {
    if(manual){
      status.textContent='Revisando tus apuntes y buscando novedades…';
      await syncStudyNotes(true);
      id=profileId();
    }
    if(!id || id==='error'){status.textContent=id==='error'?'No se pudieron sincronizar tus apuntes.':'Comprobando tus apuntes…';return;}
    const response=await fetch('/__daily-reading?profile='+encodeURIComponent(id),manual
      ? {method:'POST',headers:{'X-Walter-Lab':'local'},cache:'no-store'}
      : {cache:'no-store'});
    const result=await response.json();
    if(id!==profileId())return;
    if(!response.ok)throw new Error(result.error || 'No se pudo consultar el diario.');
    empty=result.empty===true;
    usedEdition=result.used ? result.edition : '';
    if(validReading(result.item) && result.item.date<=editionDate(new Date())){
      active=result.item as PersonalReading;
      try{localStorage.setItem(prefix+'current',JSON.stringify(active));}catch{/* Reading stays visible. */}
    }
    render();
    if(result.used || manual)failedMessage='';
    status.textContent=result.used?'Ya usaste tu recarga. Tendrás otra a las 8:00 a. m. de Colombia.'
      :empty?'Escribe un apunte con tus propias palabras para buscar una lectura relacionada.'
      :failedMessage || 'Tienes una recarga disponible.';
  }catch(error){
    const message=error instanceof Error?error.message:'No se pudo actualizar el diario.';
    if(manual)failedMessage=message;
    status.textContent=message;
  }finally{
    loading=false;refreshState();
    if(id!==profileId())void update();
  }
}
save.addEventListener('click', () => {
  if (!active) return;
  try {
    localStorage.setItem(prefix+'saved:'+identity(active),JSON.stringify(active));
    saved.set(identity(active),active); render(); status.textContent = 'Lectura guardada en este navegador.';
  } catch { status.textContent = 'El navegador no pudo guardar la lectura.'; }
});
refresh.addEventListener('click',()=>void update(true));
window.addEventListener('storage', event => { if (event.key?.startsWith(prefix)) restore(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) void update(); });
setInterval(() => { if (!document.hidden) void update(); },60_000);
document.addEventListener('study-profile-ready',()=>{restore();void update();});
restore(); void update();
