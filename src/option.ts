import { Result, Unit } from './index';

export abstract class Option<A> {
  public static of<A>(a: A | null | undefined): Option<A> {
    return a != null ? new Some(a) : Option.none<A>();
  }

  public static none<A>(): None<A> {
    return _none as None<A>;
  }

  public static try<A>(f: () => A | null | undefined): Option<A> {
    try {
      return Option.of<A>(f());
    } catch (_) {
      return Option.none<A>();
    }
  }

  public static join<A, B>(a: Option<A>, b: Option<B>): Option<[A, B]>;
  public static join<A, B, C>(
    a: Option<A>,
    b: Option<B>,
    c: Option<C>,
  ): Option<[A, B, C]>;
  public static join<A, B, C, D>(
    a: Option<A>,
    b: Option<B>,
    c: Option<C>,
    d: Option<D>,
  ): Option<[A, B, C, D]>;
  public static join<A, B, C, D, E>(
    a: Option<A>,
    b: Option<B>,
    c: Option<C>,
    d: Option<D>,
    e: Option<E>,
  ): Option<[A, B, C, D, E]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static join(...args: Option<any>[]): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
    return unsafeJoinNHelper(Array.from(args));
  }

  public map<B>(f: (a: A) => B): Option<B> {
    return this.flatMap(a => new Some(f(a)));
  }

  public flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return this.unwrap(
      a => f(a),
      () => Option.none<B>(),
    );
  }

  public forEach(f: (a: A) => Unit): Unit {
    return this.map(a => f(a));
  }

  public every(f: (a: A) => boolean): boolean {
    return this.unwrap(f, () => true);
  }

  public some(f: (a: A) => boolean): boolean {
    return this.unwrap(f, () => false);
  }

  public orElse(f: () => Option<A>): Option<A> {
    return this.unwrap(_ => this, f);
  }

  public getOrElse(f: () => A): A {
    return this.unwrap(a => a, f);
  }

  public unsafeGetOrNull(): A | null {
    return this.unwrap(
      a => a,
      () => null,
    );
  }

  public unsafeGetOrUndefined(): A | undefined {
    return this.unwrap(
      a => a,
      () => undefined,
    );
  }

  public transform<B>(s: (a: A) => Option<B>, n: () => Option<B>): Option<B> {
    return this.unwrap(s, n);
  }

  public abstract unwrap<B>(s: (a: A) => B, _n: () => B): B;

  public isSome(): boolean {
    return this.unwrap(
      _ => true,
      () => false,
    );
  }

  public isNone(): boolean {
    return this.unwrap(
      _ => false,
      () => true,
    );
  }

  public toResult<E extends Error>(err: E): Result<A> {
    return this.unwrap(
      a => Result.of(a),
      () => Result.failure(err),
    );
  }

  public toPromise<E extends Error>(err: E): Promise<A> {
    return this.unwrap(
      a => Promise.resolve(a),
      () => Promise.reject(err),
    );
  }

  public flatMapAsync<B>(f: (a: A) => Promise<Option<B>>): Promise<Option<B>> {
    return this.unwrap(f, () => Promise.resolve(Option.none<B>()));
  }

  public mapAsync<B>(f: (a: A) => Promise<B>): Promise<Option<B>> {
    return this.unwrap(
      a => f(a).then(_ => Promise.resolve(new Some(_))),
      () => Promise.resolve(Option.none<B>()),
    );
  }
}

export class Some<A> extends Option<A> {
  private readonly value: A;
  public constructor(a: A) {
    super();
    this.value = a;
  }

  public unwrap<B>(s: (a: A) => B, _n: () => B): B {
    return s(this.value);
  }
}

export class None<A> extends Option<A> {
  public constructor() {
    super();
  }

  public unwrap<B>(_s: (a: A) => B, n: () => B): B {
    return n();
  }
}

const _none = new None<unknown>();

function unsafeJoinNHelper(args: Option<unknown>[]): Option<unknown[]> {
  if (args.length === 0) return Option.of<unknown[]>([]);
  else {
    const [fx, ...tail] = args;
    return fx.flatMap(x => unsafeJoinNHelper(tail).map(xs => [x].concat(xs)));
  }
}
