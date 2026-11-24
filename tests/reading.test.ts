import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editionDate, validReading } from '../src/lib/daily-reading.ts';
import { buildMessages, validateInput } from '../src/server/local-ai.ts';

test('la edición cambia a las 08:00 de Bogotá, incluso entre años', () => {
  assert.equal(editionDate(new Date('2027-01-01T12:59:59Z')), '2026-12-31');
  assert.equal(editionDate(new Date('2027-01-01T13:00:00Z')), '2027-01-01');
});
test('el diario exige una edición completa con fecha real y fuente HTTPS', () => {
  const item = {date:'2026-11-24',title:'RAM',topic:'DFIR',summary:'Qué muestra la memoria',practice:'Comparar dos procesos',source:'Documentación',url:'https://example.org/doc'};
  assert(validReading(item));
  for (const bad of [{...item,url:'javascript:alert(1)'},{...item,practice:''},{...item,date:'2026-02-30'},{}]) assert(!validReading(bad));
});
test('cada consulta de Linux recibe únicamente el material elegido y un objetivo apropiado', () => {
  for (const [action,text] of [['linux-command','ls -lh /var/log'],['linux-summary','Hoy probé ls.']]) {
    const messages = buildMessages(validateInput({action,text,title:'Día 2'}));
    assert.equal(messages[1].content,text);
    assert.match(messages[0].content,action === 'linux-command' ? /opciones/ : /Resume/);
    assert.throws(() => validateInput({action,text:' ',title:''}));
  }
  assert.throws(() => validateInput({action:'linux-command',text:'a'.repeat(4001),title:''}));
});

import {matchesProfile} from '../src/lib/daily-reading.ts';
import {studyNotes} from '../src/lib/study-notes.ts';
import {moduleTemplate} from '../src/lib/course-template.ts';
import {freeTemplate} from '../src/lib/free-template.ts';
import {courseModules} from '../src/data/course.ts';

test('solo el texto escrito aporta evidencia; se ignoran plantillas, otros cursos y lecturas guardadas',()=>{
  const draft=(body:string)=>JSON.stringify({body});
  const mod=courseModules[0], key='wdl:cisco-nb2:draft:v1:/:'+mod.id;
  const data:Record<string,string>={[key]:draft(moduleTemplate(mod)), 'wdl:draft:v1:/':draft(freeTemplate),'wdl:linux:day:v1:/:1':draft(''),'wdl:reading:v1:/:current':draft('Ubuntu'), 'wdl:draft:v1:/otro/':draft('Ubuntu')};
  Object.defineProperty(data,'getItem',{value:(k:string)=>data[k]});
  const read=()=>studyNotes(data as unknown as Storage,'/',[]);
  assert.deepEqual(read(),[]);
  data[key]=draft(moduleTemplate(mod).replace('### Mis apuntes','### Mis apuntes\nUn router conecta redes.'));
  assert.deepEqual(read(),[{label:'Cisco · módulo 1',text:'Un router conecta redes.'}]);
});
test('una edición nueva necesita evidencia del perfil vigente, incluso el mismo día',()=>{
 const base={date:'2026-11-24',title:'Mi lectura',summary:'Ejemplo',topic:'Redes',source:'Manual',url:'https://example.org',practice:'Dibuja dos redes.'};
 const profile={id:'h1',notes:[{label:'Cisco',text:'Un router conecta redes.'}]};
 const item={...base,profileId:'h1',note:'Cisco',evidence:'conecta redes',level:'Introducción'};
 assert(matchesProfile(item,profile));
 for(const value of [base,{...item,evidence:'uso Ubuntu'},{...item,note:'Linux'},{...item,profileId:'anterior'},{...item,level:'Experto'}])assert(!matchesProfile(value,profile));
 assert(!matchesProfile(item,{...profile,notes:[]}));
});
