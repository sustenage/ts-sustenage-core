export function scope<A>(func: () => A): A {
  return func();
}
