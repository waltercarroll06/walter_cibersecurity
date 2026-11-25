import { parseProgress, type Progress } from '../lib/progress';
const inputs = [...document.querySelectorAll<HTMLInputElement>('[data-task]')];
const ids = inputs.map(input => input.dataset.task!);
const key = `wdl:cisco-nb2:roadmap:v1:${import.meta.env.BASE_URL}`;
const status = document.querySelector<HTMLElement>('#storage-status')!;
let completed = new Set<string>();
const update = () => {
  inputs.forEach(input => { input.checked = completed.has(input.dataset.task!); });
  document.querySelector('#progress-label')!.textContent = `${completed.size} de ${ids.length} temas`;
  document.querySelector('#progress-percent')!.textContent = `${Math.round(completed.size / ids.length * 100)}%`;
  document.querySelector<HTMLProgressElement>('#total-progress')!.value = completed.size;
  document.querySelectorAll<HTMLElement>('[data-stage]').forEach(stage => {
    const tasks = [...stage.querySelectorAll<HTMLInputElement>('[data-task]')];
    const count = tasks.filter(task => task.checked).length;
    const finished=count===tasks.length && count>0;
    stage.classList.toggle('completed',finished);
    stage.querySelector('.stage-count')!.textContent = finished ? '✓ Completado' : `${count} / ${tasks.length}`;
    const toggle = stage.querySelector<HTMLInputElement>('[data-module-toggle]')!;
    toggle.checked = count === tasks.length;
    toggle.indeterminate = count > 0 && count < tasks.length;
  });
  const modules = [...document.querySelectorAll<HTMLInputElement>('[data-module-toggle]')];
  document.querySelector('#modules-progress')!.textContent = `${modules.filter(toggle => toggle.checked).length} de ${modules.length} módulos completados`;
};
document.querySelectorAll<HTMLInputElement>('[data-module-toggle]').forEach(toggle => toggle.addEventListener('change', () => {
  toggle.closest('[data-stage]')!.querySelectorAll<HTMLInputElement>('[data-task]').forEach(task => {
    toggle.checked ? completed.add(task.dataset.task!) : completed.delete(task.dataset.task!);
  });
  update(); save();
}));
const data = (): Progress => ({ version: 1, completed: [...completed], updatedAt: new Date().toISOString() });
const save = () => {
  try { localStorage.setItem(key, JSON.stringify(data())); status.textContent = 'Progreso guardado en este navegador.'; }
  catch { status.textContent = 'No se pudo guardar en este navegador.'; }
};
function restoreProgress(){
  try {
    const raw=localStorage.getItem(key);
    completed=new Set(raw?parseProgress(raw,ids).completed:[]);
    update();
  }catch{status.textContent='No se pudo leer el progreso guardado.';}
}
restoreProgress();
window.addEventListener('pageshow',restoreProgress);
inputs.forEach(input => input.addEventListener('change', () => {
  input.checked ? completed.add(input.dataset.task!) : completed.delete(input.dataset.task!);
  update(); save();
}));
window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  try { completed = new Set(event.newValue ? parseProgress(event.newValue, ids).completed : []); update(); }
  catch { status.textContent = 'El cambio de otra pestaña no tiene un formato válido.'; }
});
