import type { APIRoute } from 'astro';
import { entryUrl, published } from '../lib/content';
export const GET: APIRoute = async () => {
  const entries = [...await published('notes'), ...await published('labs')];
  return new Response(JSON.stringify(entries.map(entry => ({ title: entry.data.title, description: entry.data.description, category: entry.data.category, tags: entry.data.tags, body: entry.body ?? '', type: entry.collection === 'notes' ? 'Apunte' : 'Laboratorio', url: entryUrl(entry) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
