import {moduleCompletion} from './module-completion';
import { courseModules } from '../data/course';
import { freeTemplate } from '../lib/free-template';
import { moduleTemplate } from '../lib/course-template';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
const form = document.querySelector<HTMLFormElement>('#editor-form')!;
const title = document.querySelector<HTMLInputElement>('#entry-title')!;
const description = document.querySelector<HTMLInputElement>('#entry-description')!;
const category = document.querySelector<HTMLSelectElement>('#entry-category')!;
const type = document.querySelector<HTMLSelectElement>('#entry-type')!;
const date = document.querySelector<HTMLInputElement>('#entry-date')!;
const body = document.querySelector<HTMLTextAreaElement>('#entry-body')!;
const preview = document.querySelector<HTMLElement>('#editor-preview')!;
const status = document.querySelector<HTMLElement>('#editor-status')!;
const selectedModule = courseModules.find(module => module.id === new URLSearchParams(location.search).get('modulo'));
const key = selectedModule ? `wdl:cisco-nb2:draft:v1:${import.meta.env.BASE_URL}:${selectedModule.id}` : `wdl:draft:v1:${import.meta.env.BASE_URL}`;
const moduleSelector = document.querySelector<HTMLSelectElement>('#module-selector')!;
moduleSelector.value = selectedModule?.id ?? '';
moduleSelector.addEventListener('change', () => {
  const url = new URL(location.href);
  moduleSelector.value ? url.searchParams.set('modulo', moduleSelector.value) : url.searchParams.delete('modulo');
  location.assign(url);
});
const now = new Date();
date.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
type.value = 'notes';
body.value = type.value === 'labs' ? '## Objetivo\n\n¿Qué quiero comprobar?\n\n## Entorno\n\nEquipo, sistema y archivos de práctica.\n\n## Procedimiento\n\n1. Primer paso.\n\n## Evidencias\n\nCapturas y observaciones.\n\n## Conclusiones y límites\n\n¿Qué puedo afirmar y qué falta verificar?\n' : freeTemplate;
if (selectedModule) {
  title.value = `Módulo ${selectedModule.number}: ${selectedModule.title}`;
  description.value = selectedModule.objective;
  body.value = moduleTemplate(selectedModule);
}
function loadDraft(){
try {
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved?.version === 1) {
    for (const [element, field] of [[title,'title'],[description,'description'],[category,'category'],[type,'type'],[date,'date'],[body,'body']] as const) {
      if (typeof saved[field] === 'string') element.value = saved[field];
    }
    status.textContent = 'Borrador local recuperado.';
  }
} catch { status.textContent = 'No se pudo recuperar el borrador local.'; }
}
loadDraft();
document.addEventListener('study-draft-restored', event=>{
  if((event as CustomEvent).detail===key){loadDraft();render();}
});
category.value = 'Redes'; type.value = 'notes';
function render() {
  preview.innerHTML = DOMPurify.sanitize(marked.parse(body.value, { async: false }), { USE_PROFILES: { html: true }, FORBID_TAGS: ['form','input','button','style'], FORBID_ATTR: ['style'] });
  preview.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') ?? '';
    if (!src.startsWith('https://')) { const note = document.createElement('p'); note.className = 'callout'; note.textContent = `[Imagen del proyecto: ${image.alt || src}]`; image.replaceWith(note); }
    else { image.referrerPolicy = 'no-referrer'; image.loading = 'lazy'; }
  });
}
render();
form.addEventListener('input', () => {
  render();
  try {
    localStorage.setItem(key, JSON.stringify({ version: 1, title: title.value, description: description.value, category: category.value, type: type.value, date: date.value, body: body.value }));
    document.dispatchEvent(new Event('study-note-saved'));
    status.textContent = 'Borrador guardado en este navegador.';
  } catch { status.textContent = 'No se pudo guardar el borrador. Descarga el Markdown antes de salir.'; }
});
const markdown = () => `---\ntitle: ${JSON.stringify(title.value.trim())}\ndescription: ${JSON.stringify(description.value.trim())}\ndate: ${date.value}\ncategory: ${JSON.stringify(category.value)}\ntags: []\ndraft: true\nexample: false\n---\n\n${body.value}\n`;
form.addEventListener('submit', event => {
  event.preventDefault();
  const slug = title.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-apunte';
  const url = URL.createObjectURL(new Blob([markdown()], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${date.value}-${slug}.md`; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = `Archivo preparado. Guárdalo en src/content/${type.value}/ y cambia draft a false cuando quieras publicarlo.`;
});
document.querySelector('#copy-markdown')?.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try { await navigator.clipboard.writeText(markdown()); status.textContent = 'Markdown copiado al portapapeles.'; }
  catch { status.textContent = 'El navegador no permitió copiar. Usa Descargar Markdown.'; }
});

if(selectedModule)moduleCompletion(document.querySelector<HTMLButtonElement>('#complete-module')!,()=>selectedModule,status);
