import { Duration } from './duration';
import { Unit } from './index';

export function sleep(ms: Duration): Promise<Unit> {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(Unit);
    }, ms.toMilliSeconds());
  });
}
