export type PluralizeWords = [string, string, string];

export const PLURALIZE_DAYS: PluralizeWords = ['день', 'дня', 'дней'];

export function pluralize(count: number, words: PluralizeWords): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const mod = count % 100;

  if (mod >= 5 && mod <= 20) {
    return words[2];
  }

  const index = cases[(mod % 10 < 5) ? mod % 10 : 5];

  return words[index];
}
