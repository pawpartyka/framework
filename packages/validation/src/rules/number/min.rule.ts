import { Constraint } from '../../interfaces/schema.interface';

export const MIN: symbol = Symbol('min');

export function min(value: any, minimum: number): boolean {
  return typeof value === 'number' && value >= minimum;
}

export function Min(minimum: number, options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return min(value, minimum) || options?.message || `The "${ index || 'value' }" should have at least ${ minimum }`;
  };

  constraint['_id'] = MIN;

  return constraint;
}
