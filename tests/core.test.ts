import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProgress } from '../src/lib/progress.ts';
import { searchEntries, type SearchEntry } from '../src/lib/search.ts';
import { roadmap } from '../src/data/roadmap.ts';

test('un respaldo antiguo conserva habilidades conocidas y elimina duplicados', () => {
  const parsed = parseProgress(JSON.stringify({ version: 1, completed: ['dns', 'dns', 'retired'], updatedAt: '2026-11-23' }), ['dns']);
  assert.deepEqual(parsed.completed, ['dns']);
});
test('un archivo incorrecto no puede reemplazar el progreso', () => {
  for (const raw of ['null', '{}', '{', '{"version":2,"completed":[]}', '{"version":1,"completed":[42]}']) {
    assert.throws(() => parseProgress(raw, ['dns']));
  }
});
test('los identificadores del roadmap son únicos para evitar pérdida de progreso', () => {
  const ids = roadmap.flatMap(stage => stage.tasks.map(task => task.id));
  assert.equal(new Set(ids).size, ids.length);
});
const entries: SearchEntry[] = [
  { title:'Red local', description:'Ejemplo', body:'Una investigación consulta DNS.', category:'Redes', tags:['cisco'], type:'Apunte', url:'/diario/red/' },
  { title:'DNS en Windows', description:'Consulta', body:'Comandos.', category:'Windows', tags:[], type:'Apunte', url:'/diario/windows/' },
];
test('la búsqueda encuentra el cuerpo sin depender de tildes o mayúsculas', () => {
  assert.equal(searchEntries(entries, 'INVESTIGACION dns', '')[0]?.title, 'Red local');
  assert.equal(searchEntries(entries, 'cisco', '').length, 1);
});
test('la búsqueda respeta temas y prioriza coincidencias de título', () => {
  assert.equal(searchEntries(entries, 'dns', '')[0]?.category, 'Windows');
  assert.equal(searchEntries(entries, 'dns', 'Redes').length, 1);
  assert.equal(searchEntries(entries, 'inexistente', '').length, 0);
});
