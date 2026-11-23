import { getCollection, type CollectionEntry } from 'astro:content';
export type Entry = CollectionEntry<'notes'> | CollectionEntry<'labs'>;
export const withBase = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const entryUrl = (entry: Entry) => withBase(`${entry.collection === 'notes' ? 'diario' : 'laboratorios'}/${entry.id}/`);
export const formatDate = (date: Date) => new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
export const readTime = (body = '') => Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
export async function published(collection: 'notes' | 'labs') {
  return (await getCollection(collection, ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
