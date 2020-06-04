import validator from 'validator';
import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MinLength(min: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' && validator.isLength(control.value, { min: min })) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } should have at least ${ min } characters`;
  };
}
