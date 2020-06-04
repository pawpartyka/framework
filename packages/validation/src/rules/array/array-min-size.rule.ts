import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMinSize(min: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || Array.isArray(control.value) && control.value.length >= min) {
      return null;
    }

    return options?.message || `The value must contain at least ${ min } elements`;
  };
}
