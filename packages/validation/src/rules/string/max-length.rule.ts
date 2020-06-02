import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MaxLength(max: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'string' && validator.isLength(value, { max: max })) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should be shorter than or equal to ${ max } characters`;
  };
}
