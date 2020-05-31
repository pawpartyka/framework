import { Constraint } from '../interfaces/schema.interface';

export const REQUIRED: symbol = Symbol('required');

export function required(value: any): boolean {
  return value !== undefined;
}

export function Required(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return required(value) || options?.message || `The ${ index || 'value' } is required`;
  };

  constraint['_id'] = REQUIRED;

  return constraint;
}
