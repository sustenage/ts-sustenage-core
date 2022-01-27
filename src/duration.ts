export class Duration {
  private readonly ms: number;

  static ms(value: number): Duration {
    return new Duration(value);
  }

  static seconds(value: number): Duration {
    return Duration.ms(value * oneSecond);
  }

  static minutes(value: number): Duration {
    return Duration.ms(value * oneMinute);
  }

  static hours(value: number): Duration {
    return Duration.ms(value * oneHour);
  }

  static days(value: number): Duration {
    return Duration.ms(value * oneDay);
  }

  static years(value: number): Duration {
    return Duration.ms(value * oneYear);
  }

  private constructor(ms: number) {
    this.ms = ms;
  }

  toMilliSeconds(): number {
    return this.ms;
  }

  toSeconds(): number {
    return this.ms / oneSecond;
  }

  toMinutes(): number {
    return this.ms / oneMinute;
  }

  toHours(): number {
    return this.ms / oneHour;
  }

  toDays(): number {
    return this.ms / oneDay;
  }

  toYears(): number {
    return this.ms / oneYear;
  }

  add(duration: Duration): Duration {
    return Duration.ms(this.toMilliSeconds() + duration.toMilliSeconds());
  }

  sub(duration: Duration): Duration {
    return Duration.ms(this.toMilliSeconds() - duration.toMilliSeconds());
  }

  flatMap(f: (ms: number) => Duration): Duration {
    return f(this.ms);
  }

  map(f: (ms: number) => number): Duration {
    return Duration.ms(f(this.ms));
  }
}

const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
const oneYear = oneDay * 365;
