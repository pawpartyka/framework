import { Control } from '../interfaces/control.interface';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function RequiredIf(condition: (control: Control) => boolean | Promise<boolean>, options?: RuleOptions): Rule {
  return async (control: Control) => {
    if (!!await condition(control)) {
      if (control.value !== undefined) {
        return null;
      }

      return options?.message || `The value is required`;
    }

    return null;
  };
}
