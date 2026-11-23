export interface SearchEntry { title: string; description: string; body: string; category: string; tags: string[]; type: string; url: string }
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function searchEntries(entries: SearchEntry[], query: string, category: string) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    const text = normalize([entry.title, entry.description, entry.body, ...entry.tags].join(' '));
    return (!category || category === entry.category) && words.every(word => text.includes(word));
  }).sort((a, b) => {
    const score = (entry: SearchEntry) => words.filter(word => normalize(entry.title).includes(word)).length;
    return score(b) - score(a);
  });
}
