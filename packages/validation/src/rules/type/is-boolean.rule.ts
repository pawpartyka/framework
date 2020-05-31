import { Constraint } from '../../interfaces/schema.interface';

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean' || value instanceof Boolean;
}

export function IsBoolean(options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return isBoolean(value) || options?.message || `The ${ index || 'value' } must be a boolean`;
  };
}
