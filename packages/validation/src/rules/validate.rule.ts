import { Constraint } from '../interfaces/schema.interface';

export function Validate(passes: (value: any, index: string, target: any) => boolean | Promise<boolean>, options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return passes(value, index, target) || options?.message || `The ${ index || 'value' } is invalid`;
  };
}
