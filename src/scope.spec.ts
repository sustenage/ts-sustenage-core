import { scope } from '.';

test('scope', () => {
  const c = scope(() => {
    const a = 1;
    const b = 2;
    return a + b;
  });

  expect(c).toEqual(3);
});
