import { Constraint } from '../../interfaces/schema.interface';

export const IS_NUMBER: symbol = Symbol('is-number');

export function isNumber(value: any): boolean {
  return typeof value === 'number' || value instanceof Number;
}

export function IsNumber(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return isNumber(value) || options?.message || `The ${ index || 'value' } must be a number`;
  };

  constraint['_id'] = IS_NUMBER;

  return constraint;
}
