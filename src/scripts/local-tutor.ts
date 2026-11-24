const panel = document.querySelector<HTMLElement>('.tutor-panel')!;
const connect = document.querySelector<HTMLButtonElement>('#ai-connect')!;
const connection = document.querySelector<HTMLElement>('#ai-connection')!;
const state = document.querySelector<HTMLElement>('#ai-status')!;
const summary = document.querySelector<HTMLButtonElement>('#ai-summary')!;
const objectives = document.querySelector<HTMLButtonElement>('#ai-objectives')!;
const cancel = document.querySelector<HTMLButtonElement>('#ai-cancel')!;
const fileInput = document.querySelector<HTMLInputElement>('#ai-image')!;
const image = document.querySelector<HTMLImageElement>('#ai-image-preview')!;
const resultPanel = document.querySelector<HTMLElement>('#ai-result-panel')!;
const result = document.querySelector<HTMLTextAreaElement>('#ai-result')!;
const add = document.querySelector<HTMLButtonElement>('#ai-add')!;
const notes = document.querySelector<HTMLTextAreaElement>('#entry-body')!;
let ready = false;
let controller: AbortController | undefined;
let objectUrl: string | undefined;
let imageData: string | undefined;
let action: 'summary' | 'objectives' = 'summary';
const buttons = () => { summary.disabled = !ready || !!controller; objectives.disabled = !ready || !imageData || !!controller; connect.disabled = !!controller; fileInput.disabled = !!controller; cancel.hidden = !controller; add.disabled = !!controller; };
async function check() {
  ready = false; buttons();
  if (panel.dataset.dev !== 'true') { connection.textContent = 'La IA local funciona al abrir el proyecto con npm.cmd run dev. No está activa en la versión estática publicada.'; connect.disabled = true; return; }
  connection.textContent = 'Comprobando Ollama…';
  try {
    const response = await fetch('/__local-ai/status');
    const data = await response.json();
    ready = response.ok && data.ready === true;
    connection.textContent = data.message ?? data.error ?? 'No se pudo comprobar Ollama.';
  } catch { connection.textContent = 'No se encontró la conexión local. Reinicia npm.cmd run dev y abre Ollama.'; }
  buttons();
}
connect.addEventListener('click', check);
fileInput.addEventListener('change', async () => {
  imageData = undefined; image.hidden = true;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  const file = fileInput.files?.[0]; buttons(); if (!file) return;
  if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { state.textContent = 'Elige PNG, JPEG o WebP de hasta 5 MB.'; fileInput.value = ''; return; }
  try {
    const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
    if (fileInput.files?.[0] !== file) return;
    imageData = data; objectUrl = URL.createObjectURL(file); image.src = objectUrl; image.hidden = false;
    state.textContent = 'Captura preparada. Pulsa Leer objetivos de la foto para consultarla.';
  } catch { state.textContent = 'No se pudo abrir la imagen.'; }
  buttons();
});
async function generate(kind: typeof action) {
  if (controller || !ready) return;
  const text = kind === 'summary' ? notes.value : '';
  if (kind === 'summary' && (text.trim().length < 30 || text.length > 18000)) { state.textContent = 'El resumen admite entre 30 y 18.000 caracteres. Divide los apuntes largos en varias sesiones.'; return; }
  if (kind === 'objectives' && !imageData) { state.textContent = 'Selecciona una captura primero.'; return; }
  controller = new AbortController(); buttons();
  state.textContent = 'La IA está trabajando en tu equipo. La primera respuesta puede tardar mientras se carga el modelo…';
  panel.setAttribute('aria-busy','true');
  try {
    const response = await fetch('/__local-ai/generate', {method:'POST',headers:{'Content-Type':'application/json','X-Walter-Lab':'local'},signal:controller.signal,body:JSON.stringify({action:kind,title:document.querySelector<HTMLInputElement>('#entry-title')!.value,text,...(kind === 'objectives' ? {image:imageData} : {})})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'No se pudo generar la respuesta.');
    if (typeof data.text !== 'string') throw new Error('La respuesta no tiene un formato válido.');
    action = kind; result.value = data.text; resultPanel.hidden = false;
    state.textContent = data.truncated ? 'La respuesta alcanzó el límite de longitud. Revísala; puede estar incompleta.' : 'Respuesta lista. Revísala y corrige lo que necesites antes de añadirla.';
  } catch (error) { state.textContent = controller.signal.aborted ? 'Consulta cancelada. Tus apuntes no se han modificado.' : error instanceof Error ? error.message : 'No se pudo conectar con la IA.'; }
  finally { controller = undefined; panel.setAttribute('aria-busy','false'); buttons(); }
}
summary.addEventListener('click', () => generate('summary'));
objectives.addEventListener('click', () => generate('objectives'));
cancel.addEventListener('click', () => controller?.abort());
add.addEventListener('click', () => {
  if (!result.value.trim()) return;
  const heading = action === 'summary' ? 'Resumen asistido por IA' : 'Objetivos extraídos de una captura';
  notes.value += `\n\n## ${heading}\n\n${result.value.trim()}\n`;
  notes.dispatchEvent(new Event('input',{bubbles:true}));
  resultPanel.hidden = true; result.value = '';
  state.textContent = 'Respuesta añadida al final. Revisa el estado de guardado del editor y descarga una copia de tus apuntes.';
});
document.querySelector('#ai-download')?.addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([result.value],{type:'text/markdown;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'respuesta-tutor-local.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
});
window.addEventListener('pagehide', () => { controller?.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); });
void check();
