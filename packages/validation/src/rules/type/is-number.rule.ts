import { Constraint } from '../../interfaces/schema.interface';

export function isNumber(value: any): boolean {
  return typeof value === 'number' || value instanceof Number;
}

export function IsNumber(options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return isNumber(value) || options?.message || `The ${ index || 'value' } must be a number`;
  };
}
