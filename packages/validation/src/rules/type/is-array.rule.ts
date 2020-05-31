import { Constraint } from '../../interfaces/schema.interface';

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function IsArray(options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return isArray(value) || options?.message || `The ${ index || 'value' } must be an array`;
  };
}
