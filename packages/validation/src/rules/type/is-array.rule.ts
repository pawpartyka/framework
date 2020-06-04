import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsArray(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || Array.isArray(control.value)) {
      return null;
    }

    return options?.message || `The value must be an array`;
  };
}
