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
let active: AbortController | undefined;

function controls() {
  summary.disabled = !ready || !!active || !dayHeading.textContent;
  explain.disabled = !ready || !!active || !command.value.trim();
  cancel.hidden = !active;
  connect.disabled = !!active || tutor.dataset.dev !== 'true';
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
  if (!ready || active) return;
  const summarizing = action === 'linux-summary';
  const text = (summarizing ? notes.value : command.value).trim();
  if (!text || text.length > 18000) { status.textContent = 'La consulta debe contener entre 1 y 18.000 caracteres.'; return; }
  const title = summarizing ? dayHeading.textContent ?? 'Linux' : 'Comando de Linux';
  active = new AbortController();
  controls();
  answer.hidden = true;
  status.textContent = 'Gemma está preparando la respuesta en tu equipo…';
  try {
    const res = await fetch('/__local-ai/generate', { method: 'POST', headers: {'Content-Type':'application/json','X-Walter-Lab':'local'}, signal: active.signal, body: JSON.stringify({action,title,text}) });
    const data = await res.json();
    if (!res.ok || typeof data.text !== 'string') throw new Error(data.error || 'No llegó una respuesta válida.');
    tutor.querySelector('#linux-answer-title')!.textContent = summarizing ? 'Resumen · ' + title : 'Explicación del comando';
    tutor.querySelector('#linux-answer-text')!.textContent = data.text;
    answer.hidden = false;
    status.textContent = data.truncated ? 'La respuesta alcanzó el límite de longitud.' : 'Respuesta lista.';
  } catch (err) { status.textContent = active?.signal.aborted ? 'Consulta cancelada.' : (err instanceof Error ? err.message : 'Ollama no pudo responder.'); }
  finally { active = undefined; controls(); }
}
document.addEventListener('linux-day-opened', () => { active?.abort(); answer.hidden = true; status.textContent = ''; controls(); });
command.addEventListener('input', controls);
connect.addEventListener('click', check);
cancel.addEventListener('click', () => active?.abort());
summary.addEventListener('click', () => ask('linux-summary'));
explain.addEventListener('click', () => ask('linux-command'));
void check();
