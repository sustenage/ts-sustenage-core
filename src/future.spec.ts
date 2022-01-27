import { Duration, Future, Result, sleep } from '.';

test('Future.complete successfully', async () => {
  const f = Future.of<number>();

  sleep(Duration.ms(5))
    .then(() => f.complete(Result.of(1)))
    .catch(err => {
      throw err;
    });

  expect(await f.promise()).toEqual(1);
});

test('Future.complete unsuccessfully', async () => {
  const f = Future.of<number>();

  sleep(Duration.ms(5))
    .then(() => f.complete(Result.failure(Error(`error`))))
    .catch(err => {
      throw err;
    });

  try {
    await f.promise();
  } catch (err) {
    expect(err instanceof Error).toEqual(true);
  }
});
