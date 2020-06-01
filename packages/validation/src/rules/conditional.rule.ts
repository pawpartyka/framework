import { compose } from '../helpers/compose.helper';
import { Rule } from '../interfaces/rule.interface';

export function Conditional(conditional: (value: any, index: string, target: any) => boolean | Promise<boolean>, trueRules: Rule[], falseRules: Rule[]): Rule {
  return (value: any, index: string, target: any) => {
    return conditional(value, index, target) ? compose(trueRules)(value, index, target) : compose(falseRules)(value, index, target);
  };
}
