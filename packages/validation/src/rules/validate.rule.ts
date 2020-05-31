import { Constraint } from '../interfaces/schema.interface';

export const VALIDATE: symbol = Symbol('validate');

export function Validate(passes: (value: any, index: string, target: any) => boolean | Promise<boolean>, options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return passes(value, index, target) || options?.message || `The ${ index || 'value' } is invalid`;
  };

  constraint['_id'] = VALIDATE;

  return constraint;
}
