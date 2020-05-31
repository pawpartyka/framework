import { Constraint } from '../../interfaces/schema.interface';

export function isObject(value: any): boolean {
  return typeof value === 'object' || value instanceof Object;
}

export function IsObject(options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return isObject(value) || options?.message || `The ${ index || 'value' } must be a object`;
  };
}
