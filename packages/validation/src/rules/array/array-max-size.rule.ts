import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMaxSize(max: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || Array.isArray(control.value) && control.value.length <= max) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must contain not more than ${ max } elements`;
  };
}
