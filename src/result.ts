import { NullOrUndefinedError, UnknownError } from './error';
import { Option, Unit } from './index';

export abstract class Result<A> {
  public static of<A>(a: A | null | undefined): Result<A> {
    return a != null
      ? new Success(a)
      : new Failure<A>(new NullOrUndefinedError(`null or undefined`));
  }

  public static try<A>(f: () => A | null | undefined): Result<A> {
    try {
      return Result.of(f());
    } catch (err) {
      if (err instanceof Error) {
        return new Failure<A>(err);
      } else {
        return new Failure<A>(new UnknownError(err));
      }
    }
  }

  public static failure<A>(error: Error): Result<A> {
    return new Failure(error);
  }

  public static join<A1, A2>(a: Result<A1>, b: Result<A2>): Result<[A1, A2]>;
  public static join<A1, A2, A3>(
    a: Result<A1>,
    b: Result<A2>,
    c: Result<A3>,
  ): Result<[A1, A2, A3]>;
  public static join<A1, A2, A3, A4>(
    a: Result<A1>,
    b: Result<A2>,
    c: Result<A3>,
    d: Result<A4>,
  ): Result<[A1, A2, A3, A4]>;
  public static join<A1, A2, A3, A4, A5>(
    a: Result<A1>,
    b: Result<A2>,
    c: Result<A3>,
    d: Result<A4>,
    e: Result<A5>,
  ): Result<[A1, A2, A3, A4, A5]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static join(...args: any): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
    return unsafeJoinNHelper(Array.from(args));
  }

  public map<B>(f: (a: A) => B): Result<B> {
    return this.flatMap(a => new Success(f(a)));
  }

  public flatMap<B>(f: (a: A) => Result<B>): Result<B> {
    return this.unwrap(
      a => f(a),
      e => new Failure(e),
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

  public orElse(f: (e: Error) => Result<A>): Result<A> {
    return this.unwrap(
      _ => this,
      e => f(e),
    );
  }

  public getOrElse(f: () => A): A {
    return this.unwrap(a => a, f);
  }

  public transform<B>(
    s: (a: A) => Result<B>,
    n: (e: Error) => Result<B>,
  ): Result<B> {
    return this.unwrap(s, n);
  }

  public abstract unwrap<B>(s: (a: A) => B, n: (e: Error) => B): B;

  public getSuccess(): Option<A> {
    return this.unwrap(
      a => Option.of(a),
      _ => Option.none(),
    );
  }

  public getFailure(): Option<Error> {
    return this.unwrap(
      _ => Option.none(),
      e => Option.of(e),
    );
  }

  public isSuccess(): boolean {
    return this.unwrap(
      _ => true,
      () => false,
    );
  }

  public isFailure(): boolean {
    return this.unwrap(
      _ => false,
      () => true,
    );
  }

  public toOption(): Option<A> {
    return this.unwrap(
      a => Option.of<A>(a),
      _ => Option.none<A>(),
    );
  }

  public toPromise(): Promise<A> {
    return this.unwrap(
      a => Promise.resolve(a),
      e => Promise.reject(e),
    );
  }

  public flatMapAsync<B>(f: (a: A) => Promise<Result<B>>): Promise<Result<B>> {
    return this.unwrap(f, e => Promise.resolve(new Failure(e)));
  }

  public mapAsync<B>(f: (a: A) => Promise<B>): Promise<Result<B>> {
    return this.unwrap(
      a => f(a).then(_ => Promise.resolve(new Success(_))),
      e => Promise.resolve(new Failure(e)),
    );
  }
}

export class Success<A> extends Result<A> {
  private readonly value: A;
  public constructor(a: A) {
    super();
    this.value = a;
  }

  public unwrap<B>(s: (a: A) => B, _n: (e: Error) => B): B {
    return s(this.value);
  }
}

export class Failure<A> extends Result<A> {
  private readonly error: Error;
  public constructor(error: Error) {
    super();
    this.error = error;
  }

  public unwrap<B>(_s: (a: A) => B, n: (e: Error) => B): B {
    return n(this.error);
  }
}

function unsafeJoinNHelper(args: Result<unknown>[]): Result<unknown[]> {
  if (args.length === 0) return Result.of<unknown[]>([]);
  else {
    const [fx, ...tail] = args;
    return fx.flatMap(x => unsafeJoinNHelper(tail).map(xs => [x].concat(xs)));
  }
}
