import { Option } from './option';

export abstract class Either<L, R> {
  public static left<L, R>(l: L): Either<L, R> {
    return new Left(l);
  }

  public static right<L, R>(r: R): Either<L, R> {
    return new Right(r);
  }

  public transform<L2, R2>(
    s: (l: L) => Either<L2, R2>,
    n: (r: R) => Either<L2, R2>,
  ): Either<L2, R2> {
    return this.unwrap(s, n);
  }

  public abstract unwrap<A>(s: (l: L) => A, n: (r: R) => A): A;

  public getLeft(): Option<L> {
    return this.unwrap(
      l => Option.of(l),
      _ => Option.none(),
    );
  }

  public getRight(): Option<R> {
    return this.unwrap(
      _ => Option.none(),
      r => Option.of(r),
    );
  }

  public isLeft(): boolean {
    return this.unwrap(
      _ => true,
      () => false,
    );
  }

  public isRight(): boolean {
    return this.unwrap(
      _ => false,
      () => true,
    );
  }
}

export class Left<L, R> extends Either<L, R> {
  private readonly value: L;
  public constructor(l: L) {
    super();
    this.value = l;
  }

  public unwrap<A>(s: (l: L) => A, _n: (r: R) => A): A {
    return s(this.value);
  }
}

export class Right<L, R> extends Either<L, R> {
  private readonly value: R;
  public constructor(r: R) {
    super();
    this.value = r;
  }

  public unwrap<A>(_s: (l: L) => A, n: (r: R) => A): A {
    return n(this.value);
  }
}
