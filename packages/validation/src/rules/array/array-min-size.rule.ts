import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMinSize(min: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || Array.isArray(control.value) && control.value.length >= min) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must contain at least ${ min } elements`;
  };
}
