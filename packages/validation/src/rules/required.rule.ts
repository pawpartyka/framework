import { Constraint } from '../interfaces/schema.interface';

export function required(value: any): boolean {
  return value !== undefined;
}

export function Required(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return required(value) || options?.message || `The ${ index || 'value' } is required`;
  };

  constraint.implicit = true;

  return constraint;
}
