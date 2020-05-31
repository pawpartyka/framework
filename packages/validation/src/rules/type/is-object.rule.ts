import { Constraint } from '../../interfaces/schema.interface';

export const IS_OBJECT: symbol = Symbol('is-object');

export function isObject(value: any): boolean {
  return typeof value === 'object' || value instanceof Object;
}

export function IsObject(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return isObject(value) || options?.message || `The ${ index || 'value' } must be a object`;
  };

  constraint['_id'] = IS_OBJECT;

  return constraint;
}
