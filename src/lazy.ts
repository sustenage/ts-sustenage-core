import { Option } from './option';

export class Lazy<A> {
  static of<A>(f: () => A): Lazy<A> {
    return new Lazy<A>(f);
  }

  private readonly unsafeFunc: () => A;
  private unsafeEvaluated: Option<A>;
  constructor(f: () => A) {
    this.unsafeFunc = f;
    this.unsafeEvaluated = Option.none<A>();
  }

  isEvaluated(): boolean {
    return this.unsafeEvaluated.isSome();
  }

  get(): A {
    return this.unsafeEvaluated.getOrElse(() => {
      const a = this.unsafeFunc();
      this.unsafeEvaluated = Option.of(a);
      return a;
    });
  }
}

export function lazy<A>(f: () => A): Lazy<A> {
  return Lazy.of(f);
}
