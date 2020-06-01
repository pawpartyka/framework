import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function maxLength(value: any, max: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { max: max });
}

export function MaxLength(max: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (maxLength(value, max)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should be shorter than or equal to ${ max } characters`;
  };
}
