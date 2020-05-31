import { Constraint } from '../../interfaces/schema.interface';

export const MAX: symbol = Symbol('max');

export function max(value: any, maximum: number): boolean {
  return typeof value === 'number' && value >= maximum;
}

export function Max(maximum: number, options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return max(value, maximum) || options?.message || `The "${ index || 'value' }" should ${ maximum }`;
  };

  constraint['_id'] = MAX;

  return constraint;
}
