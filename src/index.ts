import { Unit as UnitClass } from './unit';

export * as AsyncArray from './async-array';
export * from './empty-object';
export * from './either';
export * from './option';
export * from './result';
export * from './error';
export * from './scope';
export * from './duration';
export * from './sleep';
export * from './identity';
export * from './future';
export * from './lazy';
export * from './range';
export * from './debug';

export type Unit = UnitClass;
export const Unit = new UnitClass();
