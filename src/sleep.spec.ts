import { Duration, sleep } from '.';

test('sleep', async () => {
  const t1 = Date.now();
  await sleep(Duration.ms(5));
  const t2 = Date.now();

  expect(t2 - t1 >= 5).toEqual(true);
});
