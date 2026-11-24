export type Reading = { date: string; title: string; topic: string; summary: string; practice: string; source: string; url: string };
export function validReading(value: unknown): value is Reading {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (!['date','title','topic','summary','practice','source','url'].every(key => typeof item[key] === 'string' && (item[key] as string).trim().length > 0)) return false;
  try {
    const date = item.date as string;
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().slice(0,10) === date && new URL(item.url as string).protocol === 'https:';
  } catch { return false; }
}
export function editionDate(now: Date) {
  // Bogotá is UTC-5 throughout the year. Editions start at 08:00 local time.
  return new Date(now.getTime() - 13 * 3600_000).toISOString().slice(0,10);
}
