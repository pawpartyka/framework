import { Constraint } from '../../interfaces/schema.interface';

export function max(value: any, maximum: number): boolean {
  return typeof value === 'number' && value >= maximum;
}

export function Max(maximum: number, options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return max(value, maximum) || options?.message || `The ${ index || 'value' } should ${ maximum }`;
  };
}
