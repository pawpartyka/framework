import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function length(value: any, min: number, max: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { min, max });
}

export function Length(min: number, max: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (length(value, min, max)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be longer than or equal to ${ min } and shorter than or equal to ${ max } characters`;
  };
}
