import validator from 'validator';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Contains(seed: string, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'string' && validator.contains(value, seed)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain a ${ seed } string`;
  };
}
