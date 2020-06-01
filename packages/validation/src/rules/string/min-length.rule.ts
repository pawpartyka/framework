import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function minLength(value: any, min: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { min: min });
}

export function MinLength(min: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (minLength(value, min)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should have at least ${ min } characters`;
  };
}
