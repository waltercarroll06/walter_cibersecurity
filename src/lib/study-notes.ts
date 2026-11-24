import { courseModules } from '../data/course.ts';
import { moduleTemplate } from './course-template.ts';
import { freeTemplate } from './free-template.ts';
export type StudyNote = { label: string; text: string };
const boilerplate = new Set([freeTemplate,...courseModules.map(moduleTemplate)].join('\n').split('\n').map(line => line.trim()));
export function personalText(body: string) {
  return body.split(/\r?\n/).map(line=>line.trim()).filter(line=>line && !boilerplate.has(line) && /[\p{L}\p{N}]/u.test(line)).join('\n').trim();
}
export function studyNotes(storage: Storage, base: string, published: StudyNote[]) {
  const collected = published.map(n=>({label:n.label,text:personalText(n.text)}));
  const modulePrefix = 'wdl:cisco-nb2:draft:v1:'+base+':';
  const linuxPrefix = 'wdl:linux:day:v1:'+base+':';
  for (const key of Object.keys(storage).sort()) {
    let label: string;
    if (key.startsWith(modulePrefix)) {
      const course = courseModules.find(m=>m.id===key.slice(modulePrefix.length));
      label = course ? 'Cisco · módulo '+course.number : 'Apunte de Cisco';
    } else if (key==='wdl:draft:v1:'+base) label='Apunte libre de redes';
    else if (key.startsWith(linuxPrefix)) label='Linux · día '+key.slice(linuxPrefix.length);
    else continue;
    try {
      const entry=JSON.parse(storage.getItem(key) ?? 'null');
      if (typeof entry?.body==='string') collected.push({label,text:personalText(entry.body)});
    } catch { /* Ignore an unreadable draft without losing other notes. */ }
  }
  return collected.filter(n=>n.text.length>0).map(n=>({label:n.label.slice(0,160),text:n.text.slice(0,18000)})).slice(-60);
}
