import { Option, identity } from '.';

test('identity', () => {
  expect(Option.of(1).map(identity)).toEqual(Option.of(1));
});
