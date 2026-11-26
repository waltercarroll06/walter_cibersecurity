export type Review = { question: string; hint: string; answer: string; done: boolean; after: number };
const key = 'walter-study-review-v1';
export function reviews(): Review[] {
  return JSON.parse(localStorage.getItem(key) ?? '[]');
}
export function saveReviews(items: Review[]) {
  localStorage.setItem(key, JSON.stringify(items));
}
