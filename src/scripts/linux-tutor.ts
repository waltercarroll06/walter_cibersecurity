import {jobs,startSummary,currentJob,cancelSummary,saveJob} from './summary-jobs';
export {};
const tutor = document.querySelector<HTMLElement>('#linux-tutor')!;
const button = (id: string) => tutor.querySelector<HTMLButtonElement>('#linux-' + id)!;
const summary = button('summary'), explain = button('explain'), cancel = button('cancel'), connect = button('connect');
const connection = tutor.querySelector<HTMLElement>('#linux-connection')!;
const status = tutor.querySelector<HTMLElement>('#linux-ai-status')!;
const answer = tutor.querySelector<HTMLElement>('#linux-answer')!;
const command = tutor.querySelector<HTMLTextAreaElement>('#linux-command')!;
const notes = document.querySelector<HTMLTextAreaElement>('#linux-notes')!;
const dayHeading = document.querySelector<HTMLElement>('#linux-entry-heading')!;
let ready = false;
const dayKey=()=> 'linux:'+dayHeading.textContent;
const commandKey='linux:command';
const pending=()=>jobs().find(j=>j.state==='pending' && j.module.startsWith('linux:'));

function controls() {
  const ciscoBusy=jobs().some(j=>j.state==='pending');
  summary.disabled = ciscoBusy || !ready || !dayHeading.textContent;
  explain.disabled = ciscoBusy || !ready || !command.value.trim();
  cancel.hidden = !pending();
  connect.disabled = !!pending() || tutor.dataset.dev !== 'true';
}
async function check() {
  ready = false;
  controls();
  if (tutor.dataset.dev !== 'true') { connection.textContent = 'Abre el laboratorio con npm.cmd run dev para usar Ollama.'; return; }
  connection.textContent = 'Comprobando el modelo local…';
  try {
    const res = await fetch('/__local-ai/status');
    const data = await res.json();
    ready = res.ok && data.ready === true;
    connection.textContent = data.message || data.error;
  } catch { connection.textContent = 'No se pudo contactar con el tutor. Abre Ollama y comprueba la conexión.'; }
  controls();
}
async function ask(action: 'linux-summary' | 'linux-command') {
  if (!ready || jobs().some(j=>j.state==='pending'))return;
  const summarizing = action === 'linux-summary';
  const text = (summarizing ? notes.value : command.value).trim();
  if (!text || text.length > 18000) { status.textContent = 'La consulta debe contener entre 1 y 18.000 caracteres.'; return; }
  const title = summarizing ? dayHeading.textContent ?? 'Linux' : 'Comando de Linux';
  await startSummary(summarizing?dayKey():commandKey,title,text,action);
}
function showJob(){
  controls();
  const job=[currentJob(dayKey()),currentJob(commandKey)].filter(j=>!!j).sort((a,b)=>b.started-a.started)[0];
  if(!job){answer.hidden=true;status.textContent='';return;}
  if(job.state==='pending'){answer.hidden=true;status.textContent='La IA sigue trabajando. Puedes cambiar de sección.';return;}
  if(job.state==='error'){answer.hidden=true;status.textContent=job.text || 'No se pudo completar la consulta.';return;}
  tutor.querySelector('#linux-answer-title')!.textContent=job.module===commandKey?'Explicación del comando':'Resumen · '+dayHeading.textContent;
  tutor.querySelector('#linux-answer-text')!.textContent=job.text || '';
  answer.hidden=false;status.textContent='Respuesta lista.';
  if(job.unread)saveJob({...job,unread:false});
}
document.addEventListener('linux-day-opened',showJob);
document.addEventListener('summary-change',showJob);
window.addEventListener('pageshow',showJob);
showJob();
command.addEventListener('input', controls);
connect.addEventListener('click', check);
cancel.addEventListener('click', () => {const job=pending();if(job)void cancelSummary(job.id);});
summary.addEventListener('click', () => ask('linux-summary'));
explain.addEventListener('click', () => ask('linux-command'));
void check();
