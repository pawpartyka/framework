import { Constraint } from '../../interfaces/schema.interface';

export const IS_BOOLEAN: symbol = Symbol('is-boolean');

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean' || value instanceof Boolean;
}

export function IsBoolean(options?: any): Constraint {
  const constraint: Constraint = (value: any, index: string, target: any): boolean | string => {
    return isBoolean(value) || options?.message || `The ${ index || 'value' } must be a boolean`;
  };

  constraint['_id'] = IS_BOOLEAN;

  return constraint;
}
