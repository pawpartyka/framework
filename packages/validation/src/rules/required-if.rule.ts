import { Control } from '../interfaces/control.interface';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function RequiredIf(condition: (control: Control) => boolean | Promise<boolean>, options?: RuleOptions): Rule {
  return async (control: Control) => {
    if (!!await condition(control)) {
      if (control.value !== undefined) {
        return null;
      }

      if (options?.message) {
        return typeof options.message === 'string' ? options.message : options?.message(control);
      }

      return `The ${ control.property || 'value' } is required`;
    }

    return null;
  };
}
