import { Duration } from '.';

test('Duration.ms', () => {
  expect(Duration.ms(3).toMilliSeconds()).toEqual(3);
  expect(Duration.ms(3).toSeconds()).toEqual(3 / 1000);
  expect(Duration.ms(3).toMinutes()).toEqual(3 / (60 * 1000));
  expect(Duration.ms(3).toHours()).toEqual(3 / (60 * 60 * 1000));
  expect(Duration.ms(3).toDays()).toEqual(3 / (24 * 60 * 60 * 1000));
  expect(Duration.ms(3).toYears()).toEqual(3 / (365 * 24 * 60 * 60 * 1000));
});

test('Duration.seconds', () => {
  expect(Duration.seconds(3).toMilliSeconds()).toEqual(3 * 1000);
});

test('Duration.minutes', () => {
  expect(Duration.minutes(3).toMilliSeconds()).toEqual(3 * 60 * 1000);
});

test('Duration.hours', () => {
  expect(Duration.hours(3).toMilliSeconds()).toEqual(3 * 60 * 60 * 1000);
});

test('Duration.days', () => {
  expect(Duration.days(3).toMilliSeconds()).toEqual(3 * 24 * 60 * 60 * 1000);
});

test('Duration.years', () => {
  expect(Duration.years(3).toMilliSeconds()).toEqual(
    3 * 365 * 24 * 60 * 60 * 1000,
  );
});

test('Duration.add', () => {
  expect(Duration.ms(3).add(Duration.ms(4)).toMilliSeconds()).toEqual(7);
});

test('Duration.sub', () => {
  expect(Duration.ms(4).sub(Duration.ms(2)).toMilliSeconds()).toEqual(2);
});

test('Duration.map', () => {
  expect(
    Duration.ms(4)
      .map(_ => _ * 2)
      .toMilliSeconds(),
  ).toEqual(8);
});

test('Duration.flatMap', () => {
  expect(
    Duration.ms(4)
      .flatMap(_ => Duration.ms(_ * 2))
      .toMilliSeconds(),
  ).toEqual(8);
});
