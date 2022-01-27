import { Either, Left, Right } from './either';
import { Option } from './option';

test('Either.left', () => {
  expect(Either.left(1) instanceof Either).toEqual(true);
  expect(Either.left(1) instanceof Left).toEqual(true);
  expect(Either.left(1) instanceof Right).toEqual(false);
});

test('Either.right', () => {
  expect(Either.right(1) instanceof Either).toEqual(true);
  expect(Either.right(1) instanceof Left).toEqual(false);
  expect(Either.right(1) instanceof Right).toEqual(true);
});

test('Either.transform', () => {
  expect(
    Either.left<number, number>(1).transform(
      l => Either.left(l + 1),
      r => Either.left(r + 2),
    ),
  ).toEqual(Either.left(2));

  expect(
    Either.left<number, number>(1).transform(
      l => Either.right(l + 1),
      r => Either.right(r + 2),
    ),
  ).toEqual(Either.right(2));

  expect(
    Either.right<number, number>(1).transform(
      l => Either.left(l + 1),
      r => Either.left(r + 2),
    ),
  ).toEqual(Either.left(3));

  expect(
    Either.right<number, number>(1).transform(
      l => Either.right(l + 1),
      r => Either.right(r + 2),
    ),
  ).toEqual(Either.right(3));
});

test('Either.unwrap', () => {
  expect(
    Either.left<number, number>(1).unwrap(
      l => l + 1,
      r => r + 2,
    ),
  ).toEqual(2);

  expect(
    Either.right<number, number>(1).unwrap(
      l => l + 1,
      r => r + 2,
    ),
  ).toEqual(3);
});

test('Either.getLeft', () => {
  expect(Either.left<number, number>(1).getLeft()).toEqual(Option.of(1));
  expect(Either.right<number, number>(1).getLeft()).toEqual(Option.none());
});

test('Either.getRight', () => {
  expect(Either.right<number, number>(1).getRight()).toEqual(Option.of(1));
  expect(Either.left<number, number>(1).getRight()).toEqual(Option.none());
});

test('Either.isLeft', () => {
  expect(Either.left<number, number>(1).isLeft()).toEqual(true);
  expect(Either.right<number, number>(1).isLeft()).toEqual(false);
});

test('Either.isRight', () => {
  expect(Either.right<number, number>(1).isRight()).toEqual(true);
  expect(Either.left<number, number>(1).isRight()).toEqual(false);
});
