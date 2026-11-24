import {courseModules} from '../data/course';
const base=import.meta.env.BASE_URL;
const prefix='wdl:cisco-summary:v1:'+base+':';
export type SummaryJob={id:string;module:string;state:'pending'|'ready'|'error';started:number;text?:string;unread?:boolean};
function read(key:string):SummaryJob|undefined{
  try{return JSON.parse(localStorage.getItem(key)??'null')??undefined;}catch{return undefined;}
}
export function jobs():SummaryJob[]{try{return Object.keys(localStorage).filter(k=>k.startsWith(prefix)).map(k=>read(k)).filter((j):j is SummaryJob=>!!j);}catch{return [];}}
export const currentJob=(module:string)=>read(prefix+module);
export function saveJob(job:SummaryJob){
  localStorage.setItem(prefix+job.module,JSON.stringify(job));
  document.dispatchEvent(new Event('summary-change'));
}
export function discardJob(module:string){
  localStorage.removeItem(prefix+module);
  document.dispatchEvent(new Event('summary-change'));
}
function headers(id:string){return {'X-Walter-Lab':'local','X-Walter-Job':id};}
export async function startSummary(module:string,title:string,text:string){
  const job:SummaryJob={id:crypto.randomUUID(),module,state:'pending',started:Date.now()};
  saveJob(job);
  const body=JSON.stringify({action:'summary',title,text});
  try{
    const res=await fetch('/__local-ai/generate',{method:'POST',headers:{...headers(job.id),'Content-Type':'application/json'},body,keepalive:new Blob([body]).size<64000});
    if(!res.ok && currentJob(module)?.id===job.id){
      const data=await res.json();
      saveJob({...job,state:'error',text:data.error || 'No se pudo iniciar el resumen.'});
    }
  }catch{/* Navigation can interrupt the acknowledgement after the server accepted the job. Poll its ID. */}
}
export function cancelSummary(id:string){return fetch('/__local-ai/job',{method:'DELETE',headers:headers(id)});}
let checking=false;
async function poll(){
  if(checking)return;
  checking=true;
  try{
    for(const job of jobs().filter(j=>j.state==='pending')){
      const res=await fetch('/__local-ai/job',{cache:'no-store',headers:headers(job.id)});
      const data=await res.json();
      if(currentJob(job.module)?.id!==job.id || currentJob(job.module)?.state!=='pending')continue;
      if(res.status===404 && Date.now()-job.started>15000)saveJob({...job,state:'error',text:'La consulta ya no está en el servidor. Puedes pedir el resumen de nuevo.'});
      if(res.ok && data.state==='ready')saveJob({...job,state:'ready',text:data.result.text,unread:true});
      if(res.ok && data.state==='error')saveJob({...job,state:'error',text:data.result?.error || 'Ollama no pudo terminar.'});
    }
  }catch{/* Reconnect on the next poll. */}finally{checking=false;}
}
function navigation(){
  const unread=jobs().filter(j=>j.unread && j.state==='ready');
  const badge=document.querySelector<HTMLElement>('#summary-badge');
  if(badge){badge.hidden=!unread.length;badge.textContent=String(unread.length);}
  const list=document.querySelector('#summary-inbox');
  if(list)list.replaceChildren(...unread.map(job=>{
    const link=document.createElement('a');
    const module=courseModules.find(m=>m.id===job.module);
    link.href=base.replace(/\/?$/,'/')+'nuevo/'+(module?'?modulo='+module.id:'')+'#tutor-title';
    link.className='button secondary';
    link.textContent=module?'Ver resumen del módulo '+module.number:'Ver resumen del apunte libre';
    return link;
  }));
}
if(document.querySelector('#study-sources')){
  document.addEventListener('summary-change',navigation);
  window.addEventListener('storage',event=>{if(event.key?.startsWith(prefix))document.dispatchEvent(new Event('summary-change'));});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)void poll();});
  window.addEventListener('pageshow',()=>{navigation();void poll();});
  setInterval(()=>{if(!document.hidden)void poll();},1500);
  navigation();void poll();
}
