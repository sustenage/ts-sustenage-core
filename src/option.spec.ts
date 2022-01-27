import { None, Option, Some } from './option';
import { Result } from './result';

test('Option.of', () => {
  expect(Option.of(1) instanceof Option).toEqual(true);
  expect(Option.of(1) instanceof Some).toEqual(true);
  expect(Option.of(null) instanceof Some).toEqual(false);
  expect(Option.of(null) instanceof None).toEqual(true);
});

test('Option.none', () => {
  expect(Option.none() instanceof Option).toEqual(true);
  expect(Option.none() instanceof None).toEqual(true);
  expect(Option.none() instanceof Some).toEqual(false);
});

test('Option.try', () => {
  expect(
    Option.try(() => {
      throw Error(`error`);
    }),
  ).toBe(Option.none());

  expect(Option.try(() => 1)).toEqual(Option.of(1));
});

test('Option.join', () => {
  expect(Option.join(Option.of(1), Option.of('a'))).toEqual(
    Option.of([1, 'a']),
  );
});

test('Option.map', () => {
  expect(Option.of(1).map(a => a + 1)).toEqual(Option.of(2));
});

test('Option.flatMap', () => {
  expect(Option.of(1).flatMap(a => Option.of(a + 1))).toEqual(Option.of(2));
  expect(Option.of(1).flatMap(_ => Option.none())).toEqual(Option.none());
});

test('Option.every', () => {
  expect(Option.of(1).every(a => a === 1)).toEqual(true);
  expect(Option.none().every(a => a === 1)).toEqual(true);
});

test('Option.some', () => {
  expect(Option.of(1).some(a => a === 1)).toEqual(true);
  expect(Option.none().some(a => a === 1)).toEqual(false);
});

test('Option.orElse', () => {
  expect(Option.of(1).orElse(() => Option.of(2))).toEqual(Option.of(1));
  expect(Option.none().orElse(() => Option.of(2))).toEqual(Option.of(2));
});

test('Option.getOrElse', () => {
  expect(Option.of(1).getOrElse(() => 2)).toEqual(1);
  expect(Option.none().getOrElse(() => 2)).toEqual(2);
});

test('Option.transform', () => {
  expect(
    Option.of(1).transform(
      a => Option.of(a + 1),
      () => Option.of(0),
    ),
  ).toEqual(Option.of(2));
  expect(
    Option.none<number>().transform(
      a => Option.of(a + 1),
      () => Option.of(0),
    ),
  ).toEqual(Option.of(0));
});

test('Option.unwrap', () => {
  expect(
    Option.of(1).unwrap(
      a => a + 1,
      () => 0,
    ),
  ).toEqual(2);

  expect(
    Option.none<number>().unwrap(
      a => a + 1,
      () => 0,
    ),
  ).toEqual(0);
});

test('Option.isSome', () => {
  expect(Option.of(1).isSome()).toEqual(true);
  expect(Option.none<number>().isSome()).toEqual(false);
});

test('Option.isNone', () => {
  expect(Option.of(1).isNone()).toEqual(false);
  expect(Option.none<number>().isNone()).toEqual(true);
});

test('Option.toResult', () => {
  expect(Option.of(1).toResult(Error(`error`))).toEqual(Result.of(1));
});

test('Option.toPromise', async () => {
  const a = await Option.of(1).toPromise(Error(`error`));
  expect(a).toEqual(1);
});

test('Option.flatMapAsync', async () => {
  const x = await Option.of(1).flatMapAsync(async a => {
    const b = await Promise.resolve(1);
    return Option.of(a + b);
  });
  expect(x).toEqual(Option.of(2));
});

test('Option.mapAsync', async () => {
  const x = await Option.of(1).mapAsync(async a => {
    const b = await Promise.resolve(1);
    return a + b;
  });
  expect(x).toEqual(Option.of(2));
});
