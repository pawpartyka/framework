import { compose } from '../helpers/compose.helper';
import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function ValidateIf(condition: (value: any, index: string, target: any) => boolean | Promise<boolean>, rules: Rule[]): Rule {
  return (value: any, index: string, target: any) => {
    return condition(value, index, target) ? compose(rules)(value, index, target) : null;
  };
}
