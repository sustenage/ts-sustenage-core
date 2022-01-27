import { Option } from './option';
import { Failure, Result, Success } from './result';

test('Result.of', () => {
  expect(Result.of(1) instanceof Result).toEqual(true);
  expect(Result.of(1) instanceof Success).toEqual(true);
  expect(Result.of(null) instanceof Success).toEqual(false);
  expect(Result.of(null) instanceof Failure).toEqual(true);
});

test('Result.failure', () => {
  expect(Result.failure<number>(Error(`error`)) instanceof Result).toEqual(
    true,
  );
  expect(Result.failure<number>(Error(`error`)) instanceof Failure).toEqual(
    true,
  );
  expect(Result.failure<number>(Error(`error`)) instanceof Success).toEqual(
    false,
  );
});

test('Result.try', () => {
  expect(
    Result.try(() => {
      throw Error(`error`);
    })
      .getFailure()
      .unsafeGetOrNull()?.message,
  ).toEqual(`error`);

  expect(Result.try(() => 1)).toEqual(Success.of(1));
});

test('Result.join', () => {
  expect(Result.join(Result.of(1), Result.of('a'))).toEqual(
    Result.of([1, 'a']),
  );
});

test('Result.map', () => {
  expect(Result.of(1).map(a => a + 1)).toEqual(Result.of(2));
});

test('Result.flatMap', () => {
  expect(Result.of(1).flatMap(a => Result.of(a + 1))).toEqual(Result.of(2));
  expect(Result.of(1).flatMap(_ => Result.failure(Error(`error`)))).toEqual(
    Result.failure(Error(`error`)),
  );
});

test('Result.every', () => {
  expect(Result.of(1).every(a => a === 1)).toEqual(true);
  expect(Result.failure(Error(`error`)).every(a => a === 1)).toEqual(true);
});

test('Result.some', () => {
  expect(Result.of(1).some(a => a === 1)).toEqual(true);
  expect(Result.failure(Error(`error`)).some(a => a === 1)).toEqual(false);
});

test('Result.orElse', () => {
  expect(Result.of(1).orElse(() => Result.of(2))).toEqual(Result.of(1));
  expect(Result.failure(Error(`error`)).orElse(() => Result.of(2))).toEqual(
    Result.of(2),
  );
});

test('Result.getOrElse', () => {
  expect(Result.of(1).getOrElse(() => 2)).toEqual(1);
  expect(Result.failure(Error(`error`)).getOrElse(() => 2)).toEqual(2);
});

test('Result.transform', () => {
  expect(
    Result.of(1).transform(
      a => Result.of(a + 1),
      () => Result.of(0),
    ),
  ).toEqual(Result.of(2));
  expect(
    Result.failure<number>(Error(`error`)).transform(
      a => Result.of(a + 1),
      () => Result.of(0),
    ),
  ).toEqual(Option.of(0));
});

test('Result.unwrap', () => {
  expect(
    Result.of(1).unwrap(
      a => a + 1,
      () => 0,
    ),
  ).toEqual(2);

  expect(
    Result.failure<number>(Error(`error`)).unwrap(
      a => a + 1,
      () => 0,
    ),
  ).toEqual(0);
});

test('Result.isSuccess', () => {
  expect(Result.of(1).isSuccess()).toEqual(true);
  expect(Result.failure<number>(Error(`error`)).isSuccess()).toEqual(false);
});

test('Result.isFailure', () => {
  expect(Result.of(1).isFailure()).toEqual(false);
  expect(Result.failure<number>(Error(`error`)).isFailure()).toEqual(true);
});

test('Result.toOption', () => {
  expect(Result.of(1).toOption()).toEqual(Option.of(1));
});

test('Result.toPromise', async () => {
  const a = await Result.of(1).toPromise();
  expect(a).toEqual(1);
});

test('Result.flatMapAsync', async () => {
  const x = await Result.of(1).flatMapAsync(async a => {
    const b = await Promise.resolve(1);
    return Result.of(a + b);
  });
  expect(x).toEqual(Result.of(2));
});

test('Result.mapAsync', async () => {
  const x = await Result.of(1).mapAsync(async a => {
    const b = await Promise.resolve(1);
    return a + b;
  });
  expect(x).toEqual(Result.of(2));
});
