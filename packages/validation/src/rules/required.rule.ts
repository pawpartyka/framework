import { Control } from '../interfaces/control.interface';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function Required(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value !== undefined) {
      return null;
    }

    return options?.message || `The value is required`;
  };
}
