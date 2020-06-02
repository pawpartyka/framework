import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsNumber(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'number' || value instanceof Number) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a number`;
  };
}
