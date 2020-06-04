import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsDate(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || control.value instanceof Date) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must be a date instance`;
  };
}
