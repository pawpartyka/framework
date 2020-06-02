import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MinDate(min: Date, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (value instanceof Date && value.getTime() >= min.getTime()) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain date greater than or equal to ${ min }`;
  };
}
