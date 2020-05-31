import validator from 'validator';
import { Constraint } from '../../interfaces/schema.interface';

export const MAX_LENGTH: symbol = Symbol('max-length');

export function maxLength(value: any, max: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { max: max });
}

export function MaxLength(max: number, options?: { message: string }): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return maxLength(value, max) || options?.message || `The ${ index || 'value' } should be shorter than or equal to ${ max } characters`;
  };

  constraint['_id'] = MAX_LENGTH;

  return constraint;
}
