import { Control } from '../interfaces/control.interface';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function Required(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value !== undefined) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } is required`;
  };
}
