import validator from 'validator';
import { Constraint } from '../../interfaces/schema.interface';

export const MIN_LENGTH: symbol = Symbol('min-length');

export function minLength(value: any, min: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { min: min });
}

export function MinLength(min: number, options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    if (minLength(value, min)) {
      return true;
    }

    return options?.message || `The ${ index || 'value' } should have at least ${ min } characters`;
  };

  constraint['_id'] = MIN_LENGTH;

  return constraint;
}
