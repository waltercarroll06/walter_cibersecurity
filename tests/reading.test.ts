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
