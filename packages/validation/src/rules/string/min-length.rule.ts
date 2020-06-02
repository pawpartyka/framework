import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MinLength(min: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'string' && validator.isLength(value, { min: min })) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should have at least ${ min } characters`;
  };
}
