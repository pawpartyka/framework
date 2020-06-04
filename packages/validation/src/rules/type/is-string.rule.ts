import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsString(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' || control.value instanceof String) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must be a string`;
  };
}
