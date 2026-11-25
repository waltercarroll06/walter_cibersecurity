export const bookPrefix = (base: string) => 'wdl:book:v1:' + base + ':';
export const bookId = (value: string | null) => value && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(value) ? value : null;
