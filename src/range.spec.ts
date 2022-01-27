import { range } from '.';

test('range', () => {
  expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
});
