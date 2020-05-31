import validator from 'validator';
import { Constraint } from '../../interfaces/schema.interface';

export function maxLength(value: any, max: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { max: max });
}

export function MaxLength(max: number, options?: { message: string }): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return maxLength(value, max) || options?.message || `The ${ index || 'value' } should be shorter than or equal to ${ max } characters`;
  };
}
