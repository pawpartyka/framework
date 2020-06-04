import validator from 'validator';
import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MaxLength(max: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' && validator.isLength(control.value, { max: max })) {
      return null;
    }

    return options?.message || `The value should be shorter than or equal to ${ max } characters`;
  };
}
