import { Constraint } from '../../interfaces/schema.interface';

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function IsString(options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return isString(value) || options?.message || `The ${ index || 'value' } must be a string`;
  };
}
