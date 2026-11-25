type Note = { title: string; body: string };

const keyPrefix = `wdl:linux:day:v1:${import.meta.env.BASE_URL}:`;
const notes = new Map<number, Note>();
const form = document.querySelector<HTMLFormElement>('#linux-day-form')!;
const dayInput = document.querySelector<HTMLInputElement>('#linux-day')!;
const days = document.querySelector<HTMLUListElement>('#linux-days')!;
const empty = document.querySelector<HTMLParagraphElement>('#linux-empty')!;
const editor = document.querySelector<HTMLElement>('#linux-entry')!;
const heading = document.querySelector<HTMLHeadingElement>('#linux-entry-heading')!;
const title = document.querySelector<HTMLInputElement>('#linux-title')!;
const body = document.querySelector<HTMLTextAreaElement>('#linux-notes')!;
const download = document.querySelector<HTMLButtonElement>('#linux-download')!;
const status = document.querySelector<HTMLParagraphElement>('#linux-status')!;
let activeDay: number | undefined;

function isDay(day: number) {
  return Number.isSafeInteger(day) && day > 0;
}

try {
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(keyPrefix)) continue;
    const day = Number(key.slice(keyPrefix.length));
    if (!isDay(day)) continue;
    try {
      const note: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (note && typeof note === 'object' && 'title' in note && 'body' in note &&
          typeof note.title === 'string' && typeof note.body === 'string') {
        notes.set(day, { title: note.title, body: note.body });
      }
    } catch {
      status.textContent = 'No se pudo recuperar uno de los días guardados.';
    }
  }
} catch {
  status.textContent = 'El almacenamiento del navegador no está disponible. Puedes descargar tus apuntes.';
}

document.addEventListener('study-draft-restored', event=>{
  const key=(event as CustomEvent).detail;
  if(typeof key!=='string' || !key.startsWith(keyPrefix))return;
  const day=Number(key.slice(keyPrefix.length));
  if(!isDay(day))return;
  const note=JSON.parse(localStorage.getItem(key) ?? 'null');
  if(note){notes.set(day,note);if(activeDay===day)openDay(day);else renderDays();}
});

function renderDays() {
  days.replaceChildren();
  for (const [day, note] of [...notes].sort(([first], [second]) => first - second)) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button secondary';
    button.textContent = note.title.trim() ? `Día ${day} · ${note.title.trim()}` : `Día ${day}`;
    if (day === activeDay) button.setAttribute('aria-current', 'true');
    button.addEventListener('click', () => openDay(day));
    item.append(button);
    days.append(item);
  }
  empty.hidden = notes.size > 0;
  days.hidden = notes.size === 0;
}

function openDay(day: number) {
  activeDay = day;
  sessionStorage.setItem(keyPrefix+'open',String(day));
  dayInput.value = String(day);
  heading.textContent = `Día ${day}`;
  const note = notes.get(day);
  title.value = note?.title ?? '';
  body.value = note?.body ?? '';
  editor.hidden = false;
  status.textContent = `Día ${day} abierto.`;
  renderDays();
  document.dispatchEvent(new Event('linux-day-opened'));
  body.focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const day = dayInput.valueAsNumber;
  if (isDay(day)) openDay(day);
});

editor.addEventListener('input', () => {
  if (activeDay === undefined) return;
  const note = { title: title.value, body: body.value };
  notes.set(activeDay, note);
  renderDays();
  try {
    localStorage.setItem(`${keyPrefix}${activeDay}`, JSON.stringify(note));
    document.dispatchEvent(new Event('study-note-saved'));
    status.textContent = `Día ${activeDay} guardado en este navegador.`;
  } catch {
    status.textContent = 'No se pudo guardar. Descarga el Markdown antes de cerrar la página.';
  }
});

download.addEventListener('click', () => {
  if (activeDay === undefined) return;
  const dayTitle = title.value.trim() ? ` · ${title.value.trim()}` : '';
  const markdown = `# Linux · Día ${activeDay}${dayTitle}\n\n${body.value}\n`;
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `linux-dia-${activeDay}.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

renderDays();

const requestedDay=Number(new URLSearchParams(location.search).get('dia') || sessionStorage.getItem(keyPrefix+'open'));
if(isDay(requestedDay))openDay(requestedDay);
const pos=new URLSearchParams(location.search).get('pos');
if(pos!==null && /^\d+$/.test(pos)){
  const start=Math.min(Number(pos),body.value.length);
  const end=body.value.indexOf('\n',start);
  body.focus();body.setSelectionRange(start,end<0?body.value.length:end);body.scrollIntoView({block:'center'});
}

document.querySelector('#linux-delete')!.addEventListener('click',()=>{
  if (!activeDay || !confirm('¿Borrar el apunte de Linux del día '+activeDay+' de este navegador?')) return;
  const key=keyPrefix+activeDay;
  localStorage.setItem('wdl:recovered:v1:'+key,'1');
  localStorage.removeItem(key);
  localStorage.removeItem('wdl:cisco-summary:v1:'+import.meta.env.BASE_URL+':linux:Día '+activeDay);
  sessionStorage.removeItem(keyPrefix+'open');
  location.replace(location.pathname);
});
