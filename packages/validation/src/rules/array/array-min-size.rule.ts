import { Constraint } from '../../interfaces/schema.interface';

export function arrayMinSize(value: any, minimum: number): boolean {
  return value?.length >= minimum;
}

export function ArrayMinSize(minimum: number, options?: any): Constraint {
  return (value: any, index: string, target: any): boolean | string => {
    return arrayMinSize(value, minimum) || options?.message || `The a should have at least ${ minimum }`;
  };
}
