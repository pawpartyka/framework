import validator from 'validator';
import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Contains(seed: string, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' && validator.contains(control.value, seed)) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must contain a ${ seed } string`;
  };
}
