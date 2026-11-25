import {bookId, bookPrefix} from '../lib/books';
import {moduleCompletion} from './module-completion';
import { courseModules } from '../data/course';
import { freeTemplate } from '../lib/free-template';
import { moduleTemplate } from '../lib/course-template';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
const form = document.querySelector<HTMLFormElement>('#editor-form')!;
const title = document.querySelector<HTMLInputElement>('#entry-title')!;
const description = document.querySelector<HTMLInputElement>('#entry-description')!;
const category = document.querySelector<HTMLInputElement>('#entry-category')!;
const type = document.querySelector<HTMLInputElement>('#entry-type')!;
const date = document.querySelector<HTMLInputElement>('#entry-date')!;
const body = document.querySelector<HTMLTextAreaElement>('#entry-body')!;
const preview = document.querySelector<HTMLElement>('#editor-preview')!;
const status = document.querySelector<HTMLElement>('#editor-status')!;
const selectedModule = courseModules.find(module => module.id === new URLSearchParams(location.search).get('modulo'));
const book = bookId(new URLSearchParams(location.search).get('libro'));
if (book) {
  document.querySelector<HTMLElement>('#network-picker')!.hidden = true;
  document.querySelector('#editor-heading')!.textContent = 'Apuntes del libro';
  document.querySelector<HTMLAnchorElement>('#all-notes')!.hash = 'otros';
}
const key = book ? bookPrefix(import.meta.env.BASE_URL) + book : selectedModule ? `wdl:cisco-nb2:draft:v1:${import.meta.env.BASE_URL}:${selectedModule.id}` : `wdl:draft:v1:${import.meta.env.BASE_URL}`;
const moduleSelector = document.querySelector<HTMLSelectElement>('#module-selector')!;
moduleSelector.value = selectedModule?.id ?? '';
moduleSelector.addEventListener('change', () => {
  const url = new URL(location.href);
  url.search = '';
  moduleSelector.value ? url.searchParams.set('modulo', moduleSelector.value) : url.searchParams.delete('modulo');
  location.assign(url);
});
const now = new Date();
date.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
body.value = book ? '' : freeTemplate;
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
    if (type.value === 'notes') type.value = 'Apunte';
    status.textContent = 'Borrador local recuperado.';
  }
} catch { status.textContent = 'No se pudo recuperar el borrador local.'; }
}
loadDraft();
document.addEventListener('study-draft-restored', event=>{
  if((event as CustomEvent).detail===key){loadDraft();render();}
});
category.value = book ? 'Otros' : 'Redes';
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
const markdown = () => `---\ntitle: ${JSON.stringify(title.value.trim())}\ndescription: ${JSON.stringify(description.value.trim())}\ndate: ${date.value}\ncategory: ${JSON.stringify(category.value)}\ntype: ${JSON.stringify(type.value)}\ntags: []\ndraft: true\nexample: false\n---\n\n${body.value}\n`;
form.addEventListener('submit', event => {
  event.preventDefault();
  const slug = title.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-apunte';
  const url = URL.createObjectURL(new Blob([markdown()], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${date.value}-${slug}.md`; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = book ? 'Markdown del libro preparado.' : `Archivo preparado. Guárdalo en src/content/notes/ y cambia draft a false cuando quieras publicarlo.`;
});
document.querySelector('#copy-markdown')?.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try { await navigator.clipboard.writeText(markdown()); status.textContent = 'Markdown copiado al portapapeles.'; }
  catch { status.textContent = 'El navegador no permitió copiar. Usa Descargar Markdown.'; }
});

if(selectedModule)moduleCompletion(document.querySelector<HTMLButtonElement>('#complete-module')!,()=>selectedModule,status);

const pos=new URLSearchParams(location.search).get('pos');
if(pos!==null && /^\d+$/.test(pos)){
  const start=Math.min(Number(pos),body.value.length);
  const end=body.value.indexOf('\n',start);
  body.focus();body.setSelectionRange(start,end<0?body.value.length:end);body.scrollIntoView({block:'center'});
}

document.querySelector('#delete-note')!.addEventListener('click',()=>{
  if (!confirm('¿Borrar el apunte «'+(title.value || 'Sin título')+'» de este navegador?')) return;
  localStorage.setItem('wdl:recovered:v1:'+key,'1');
  localStorage.removeItem(key);
  localStorage.removeItem('wdl:cisco-summary:v1:'+import.meta.env.BASE_URL+':'+(book?'libro:'+book:selectedModule?.id || 'libre'));
  location.assign(document.querySelector<HTMLAnchorElement>('#all-notes')!.href);
});
