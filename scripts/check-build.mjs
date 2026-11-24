import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
async function filesAt(directory) {
  const names = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(names.map(item => item.isDirectory() ? filesAt(join(directory, item.name)) : join(directory, item.name)))).flat();
}
const files = await filesAt(root);
const index = JSON.parse(await readFile(join(root, 'search-index.json'), 'utf8'));
assert(Array.isArray(index), 'El índice debe ser una lista incluso si aún no hay apuntes publicados.');
assert(index.every(entry => entry.category === 'Redes' && entry.type === 'Apunte'), 'Solo se publica el diario de redes.');
for (const file of files.filter(file => /\.(html|json)$/.test(file))) {
  const text = await readFile(file, 'utf8');
  assert(!text.includes('MARCADOR_BORRADOR_NO_PUBLICAR'), `Un borrador se filtró en ${file}`);
  if (!file.endsWith('.html')) continue;
  for (const [, raw] of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const path = decodeURIComponent(raw.split(/[?#]/)[0]);
    assert(!base || path === base || path.startsWith(`${base}/`), `Enlace sin prefijo: ${path}`);
    const local = resolve(root, `.${path.slice(base.length)}`);
    assert(local.startsWith(root), 'Ruta fuera del sitio');
    let result;
    try { result = await stat(local); } catch { assert.fail(`Archivo o enlace inexistente: ${raw} en ${file}`); }
    if (result.isDirectory()) await stat(join(local, 'index.html'));
  }
}
console.log(`Verificado: ${files.filter(file => file.endsWith('.html')).length} páginas, índice de búsqueda, imágenes, enlaces internos y exclusión de borradores.`);
