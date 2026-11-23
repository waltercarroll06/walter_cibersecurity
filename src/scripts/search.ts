import { searchEntries, type SearchEntry } from '../lib/search';
const form = document.querySelector<HTMLFormElement>('#search-form')!;
const query = document.querySelector<HTMLInputElement>('#query')!;
const category = document.querySelector<HTMLSelectElement>('#category')!;
const results = document.querySelector<HTMLElement>('#search-results')!;
const status = document.querySelector<HTMLElement>('#search-status')!;
const params = new URLSearchParams(location.search);
query.value = params.get('q') ?? ''; category.value = params.get('categoria') ?? '';
let index: SearchEntry[] = [];
let ready = false;
function render() {
  if (!ready) return;
  const found = searchEntries(index, query.value, category.value);
  results.replaceChildren();
  status.textContent = found.length ? `${found.length} resultado${found.length === 1 ? '' : 's'}` : 'Sin resultados. Prueba otra palabra o cambia el tema.';
  found.forEach(entry => {
    const card = document.createElement('article'); card.className = 'entry-card';
    const label = document.createElement('span'); label.className = 'tag'; label.textContent = `${entry.category} · ${entry.type}`;
    const title = document.createElement('h2');
    const link = document.createElement('a'); link.href = entry.url; link.textContent = entry.title; title.append(link);
    const description = document.createElement('p'); description.textContent = entry.description;
    card.append(label, title, description); results.append(card);
  });
  const url = new URL(location.href); url.search = '';
  if (query.value) url.searchParams.set('q', query.value);
  if (category.value) url.searchParams.set('categoria', category.value);
  history.replaceState({}, '', url);
}
form.addEventListener('submit', event => { event.preventDefault(); render(); });
query.addEventListener('input', render); category.addEventListener('change', render);
try {
  const response = await fetch(form.dataset.index!);
  if (!response.ok) throw new Error('index');
  index = await response.json(); ready = true; render();
} catch { status.textContent = 'No se pudo cargar el buscador. Recarga la página para volver a intentarlo.'; }
