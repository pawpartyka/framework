import { Constraint } from '../../interfaces/schema.interface';

export const IS_ARRAY: symbol = Symbol('is-array');

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function IsArray(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return isArray(value) || options?.message || `The ${ index || 'value' } must be an array`;
  };

  constraint['_id'] = IS_ARRAY;

  return constraint;
}
