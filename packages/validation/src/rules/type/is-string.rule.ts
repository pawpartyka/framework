import { Constraint } from '../../interfaces/schema.interface';

export const IS_STRING: symbol = Symbol('is-string');

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function IsString(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return isString(value) || options?.message || `The ${ index || 'value' } must be a string`;
  };

  constraint['_id'] = IS_STRING;

  return constraint;
}
