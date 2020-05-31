import validator from 'validator';
import { Constraint } from '../../interfaces/schema.interface';

export function minLength(value: any, min: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { min: min });
}

export function MinLength(min: number, options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return minLength(value, min) || options?.message || `The ${ index || 'value' } should have at least ${ min } characters`;
  };
}
