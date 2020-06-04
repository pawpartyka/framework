import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMaxSize(max: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || Array.isArray(control.value) && control.value.length <= max) {
      return null;
    }

    return options?.message || `The value must contain not more than ${ max } elements`;
  };
}
