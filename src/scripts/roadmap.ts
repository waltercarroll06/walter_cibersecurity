import { parseProgress, type Progress } from '../lib/progress';
const inputs = [...document.querySelectorAll<HTMLInputElement>('[data-task]')];
const ids = inputs.map(input => input.dataset.task!);
const key = `wdl:roadmap:v1:${import.meta.env.BASE_URL}`;
const status = document.querySelector<HTMLElement>('#storage-status')!;
let completed = new Set<string>();
const update = () => {
  inputs.forEach(input => { input.checked = completed.has(input.dataset.task!); });
  document.querySelector('#progress-label')!.textContent = `${completed.size} de ${ids.length} habilidades`;
  document.querySelector('#progress-percent')!.textContent = `${Math.round(completed.size / ids.length * 100)}%`;
  document.querySelector<HTMLProgressElement>('#total-progress')!.value = completed.size;
  document.querySelectorAll<HTMLElement>('[data-stage]').forEach(stage => {
    const tasks = [...stage.querySelectorAll<HTMLInputElement>('input')];
    stage.querySelector('.stage-count')!.textContent = `${tasks.filter(task => task.checked).length} / ${tasks.length}`;
  });
};
const data = (): Progress => ({ version: 1, completed: [...completed], updatedAt: new Date().toISOString() });
const save = () => {
  try { localStorage.setItem(key, JSON.stringify(data())); status.textContent = 'Progreso guardado en este navegador.'; }
  catch { status.textContent = 'No se pudo guardar en este navegador. Exporta un respaldo antes de salir.'; }
};
try {
  const raw = localStorage.getItem(key);
  if (raw) completed = new Set(parseProgress(raw, ids).completed);
} catch { status.textContent = 'No se pudo leer el progreso guardado. Puedes importar un respaldo.'; }
update();
inputs.forEach(input => input.addEventListener('change', () => {
  input.checked ? completed.add(input.dataset.task!) : completed.delete(input.dataset.task!);
  update(); save();
}));
document.querySelector('#export-progress')?.addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data(), null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'walter-roadmap.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Respaldo preparado para descargar.';
});
document.querySelector<HTMLInputElement>('#import-progress')?.addEventListener('change', async event => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; if (!file) return;
  try {
    if (file.size > 100_000) throw new Error('El archivo es demasiado grande para ser un respaldo.');
    const progress = parseProgress(await file.text(), ids);
    completed = new Set(progress.completed); update(); save();
  } catch (error) { status.textContent = error instanceof Error ? error.message : 'No se pudo importar el archivo.'; }
  input.value = '';
});
window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  try { completed = new Set(event.newValue ? parseProgress(event.newValue, ids).completed : []); update(); }
  catch { status.textContent = 'El cambio de otra pestaña no tiene un formato válido.'; }
});
