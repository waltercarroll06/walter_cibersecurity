import {courseModules} from '../data/course';
import {parseProgress} from '../lib/progress';
export function moduleCompletion(button:HTMLButtonElement, choose:()=>typeof courseModules[number], status:HTMLElement){
  const progressKey='wdl:cisco-nb2:roadmap:v1:'+import.meta.env.BASE_URL;
  const ids=courseModules.flatMap(m=>m.topics.map(t=>t.id));
  const topics=()=>choose().topics.map(t=>t.id);
  const progress=()=>{const raw=localStorage.getItem(progressKey);return new Set(raw?parseProgress(raw,ids).completed:[]);};
  function refreshProgress(){
    button.hidden=false;
    try{const done=progress();button.disabled=topics().every(id=>done.has(id));button.textContent=button.disabled?'Módulo completado':'Completar módulo';}
    catch{button.disabled=true;status.textContent='No se pudo leer el avance guardado.';}
  }
  button.addEventListener('click',()=>{
    try{
      const done=progress();topics().forEach(id=>done.add(id));
      localStorage.setItem(progressKey,JSON.stringify({version:1,completed:[...done],updatedAt:new Date().toISOString()}));
      refreshProgress();status.textContent='Módulo completado en tu plan de estudio.';
    }catch{status.textContent='No se pudo guardar el avance.';}
  });
  window.addEventListener('pageshow',refreshProgress);
  window.addEventListener('storage',refreshProgress);
  refreshProgress();
  return refreshProgress;
}
