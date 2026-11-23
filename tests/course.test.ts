import { test } from 'node:test';
import assert from 'node:assert/strict';
import { courseModules } from '../src/data/course.ts';
import { moduleTemplate } from '../src/lib/course-template.ts';

test('el curso contiene los 17 módulos únicos y 44 temas de las capturas', () => {
  assert.deepEqual(courseModules.map(module => module.number), Array.from({length:17}, (_, i) => i + 1));
  const topics = courseModules.flatMap(module => module.topics);
  assert.equal(topics.length, 44);
  assert.equal(new Set(topics.map(topic => topic.id)).size, 44);
  assert(!/examen|encuesta/i.test(JSON.stringify(courseModules)));
});
test('cada plantilla conserva los objetivos y un apartado de apuntes por tema', () => {
  for (const module of courseModules) {
    const template = moduleTemplate(module);
    assert(template.includes(module.objective));
    for (const topic of module.topics) {
      assert(template.includes(`## ${topic.number} ${topic.title}`));
      assert(template.includes(topic.objective));
    }
    assert.equal((template.match(/### Mis apuntes/g) ?? []).length, module.topics.length);
  }
});
