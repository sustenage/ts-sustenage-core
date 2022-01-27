import { AsyncArray, Duration, sleep } from '.';

test('AsyncArray.mapAsync', async () => {
  expect(
    await AsyncArray.mapAsync([1, 2, 3, 4], async x => {
      await sleep(Duration.ms(3));
      return x * 2;
    }),
  ).toEqual([2, 4, 6, 8]);
});

test('AsyncArray.flatMapAsync', async () => {
  expect(
    await AsyncArray.flatMapAsync([1, 2, 3, 4], async x => {
      await sleep(Duration.ms(3));
      return x % 2 === 0 ? [x * 2] : [];
    }),
  ).toEqual([4, 8]);
});
