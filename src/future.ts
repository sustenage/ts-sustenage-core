import { Option, Result, Unit } from './index';

type Resolve<A> = (a?: A | PromiseLike<A>) => Unit;
type Reject = (e?: Error) => Unit;

export class Future<A> {
  static of<A>(): Future<A> {
    return new Future<A>();
  }

  private unsafeResolve: Option<Resolve<A>>;
  private unsafeReject: Option<Reject>;
  private readonly _promise: Promise<A>;

  constructor() {
    this.unsafeResolve = Option.none<Resolve<A>>();
    this.unsafeReject = Option.none<Reject>();
    this._promise = new Promise<A>((resolve, reject) => {
      this.unsafeResolve = Option.of(resolve as Resolve<A>);
      this.unsafeReject = Option.of(reject as Reject);
    });
  }

  promise(): Promise<A> {
    return this._promise;
  }

  complete(a: Result<A>): Unit {
    return a.unwrap(
      s => this.unsafeResolve.forEach(f => f(s)),
      e => this.unsafeReject.forEach(f => f(e)),
    );
  }
}
