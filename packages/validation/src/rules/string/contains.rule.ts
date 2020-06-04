import validator from 'validator';
import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Contains(seed: string, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' && validator.contains(control.value, seed)) {
      return null;
    }

    return options?.message || `The value must contain a ${ seed } string`;
  };
}
