import { Constraint } from '../../interfaces/schema.interface';

export function min(value: any, minimum: number): boolean {
  return typeof value === 'number' && value >= minimum;
}

export function Min(minimum: number, options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return min(value, minimum) || options?.message || `The ${ index || 'value' } should have at least ${ minimum }`;
  };
}
