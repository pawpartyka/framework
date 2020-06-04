import { compose } from '../helpers/compose.helper';
import { Control } from '../interfaces/control.interface';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function ValidateIf(condition: (control: Control) => boolean | Promise<boolean>, rules: Rule[]): Rule {
  return async (control: Control) => {
    if (await condition(control) === true) {
      return await compose(rules)(control);
    }

    return null;
  };
}
