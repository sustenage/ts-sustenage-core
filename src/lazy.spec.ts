import { lazy } from '.';

test('lazy', () => {
  const l = lazy(() => 1);

  expect(l.isEvaluated()).toEqual(false);

  expect(l.get()).toEqual(1);

  expect(l.isEvaluated()).toEqual(true);
});
