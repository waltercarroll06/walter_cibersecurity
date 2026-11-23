export interface Progress { version: 1; completed: string[]; updatedAt: string }
export function parseProgress(raw: string, knownIds: string[]): Progress {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('El archivo no contiene un respaldo del roadmap.');
  const data = value as Record<string, unknown>;
  if (data.version !== 1 || !Array.isArray(data.completed) || !data.completed.every(id => typeof id === 'string')) {
    throw new Error('El respaldo no tiene un formato compatible.');
  }
  return {
    version: 1,
    completed: [...new Set(data.completed as string[])].filter(id => knownIds.includes(id)),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
  };
}
