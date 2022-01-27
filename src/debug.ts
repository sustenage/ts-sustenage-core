export function spy<A>(f: (a: A) => void, a: A): A {
  f(a);
  return a;
}
