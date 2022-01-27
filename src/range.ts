/**
 * range(0, 5) === [0, 1, 2, 3, 4, 5]
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}
