import {courseModules} from '../data/course';
import { searchEntries, type SearchEntry } from '../lib/search';
const form = document.querySelector<HTMLFormElement>('#search-form')!;
const query = document.querySelector<HTMLInputElement>('#query')!;
const category = document.querySelector<HTMLSelectElement>('#category')!;
const results = document.querySelector<HTMLElement>('#search-results')!;
const status = document.querySelector<HTMLElement>('#search-status')!;
const params = new URLSearchParams(location.search || sessionStorage.getItem("wdl:last-search:"+import.meta.env.BASE_URL) || "");
query.value = params.get('q') ?? ''; category.value = params.get('categoria') ?? '';
let index: SearchEntry[] = [];
const scope=import.meta.env.BASE_URL;
const base=scope.replace(/\/?$/,'/');
function drafts():SearchEntry[]{
  const entries:SearchEntry[]=[];
  for(const key of Object.keys(localStorage)){
    const prefix='wdl:cisco-nb2:draft:v1:'+scope+':',linuxPrefix='wdl:linux:day:v1:'+scope+':';
    const linux=key.startsWith(linuxPrefix);
    const mod=key.startsWith(prefix)?courseModules.find(m=>m.id===key.slice(prefix.length)):undefined;
    if(!linux && !mod && key!=='wdl:draft:v1:'+scope)continue;
    try{
      const d=JSON.parse(localStorage.getItem(key) || 'null');
      if(typeof d?.body!=='string' || !d.body.trim())continue;
      const day=key.slice(linuxPrefix.length);
      const parent=linux?'Día '+day+(d.title?' · '+d.title:''):mod?'Módulo '+mod.number+' · '+mod.title:d.title || 'Apunte libre';
      const url=new URL(base+(linux?'linux/':'nuevo/'),location.origin);
      if(linux)url.searchParams.set('dia',day);
      if(mod)url.searchParams.set('modulo',mod.id);
      let heading='',lines:string[]=[],position=0,offset=0,fence='';
      function add(){
        const body=lines.join('\n').trim();
        if(!heading && !body)return;
        url.searchParams.set('pos',String(position));
        entries.push({title:heading || parent,description:heading?parent:body.slice(0,140),body,category:linux?'Linux':'Redes',tags:[parent,d.title || ''],type:'Apunte',url:url.href});
      }
      for(const line of d.body.split('\n')){
        const marker=line.trimStart().match(/^(`{3,}|~{3,})/);
        if(marker){if(!fence)fence=marker[1];else if(marker[1].startsWith(fence))fence='';}
        const match=!fence && (line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*$/) || line.match(/^([^:#\n]{1,56}):(?:\s+(.*)|\s*)$/));
        if(match){add();heading=match[1].trim();lines=match[2]?[match[2]]:[];position=offset;}else lines.push(line);
        offset+=line.length+1;
      }
      add();
    }catch{/* Other notes remain searchable. */}
  }
  return entries;
}
let ready = true;
function render() {
  if (!ready) return;
  const found = searchEntries([...drafts(),...index], query.value, category.value);
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
  sessionStorage.setItem('wdl:last-search:'+scope,url.search);
}
form.addEventListener('submit', event => { event.preventDefault(); render(); });
query.addEventListener('input', render); category.addEventListener('change', render);
render();document.addEventListener('study-draft-restored',render);window.addEventListener('pageshow',render);window.addEventListener('storage',render);
try {
  const response = await fetch(form.dataset.index!);
  if (!response.ok) throw new Error('index');
  index = await response.json(); ready = true; render();
} catch { render(); }
