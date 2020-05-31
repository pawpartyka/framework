import { Constraint } from '../interfaces/schema.interface';

export const VALIDATE_IF: symbol = Symbol('validate-if');

export function ValidateIf(condition: (value: any, index: string, target: any) => boolean | Promise<boolean>, options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return condition(value, index, target) || options?.message || `The ${ index || 'value' } is invalid`;
  };

  constraint['_id'] = VALIDATE_IF;

  return constraint;
}
