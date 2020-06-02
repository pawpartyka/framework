import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MaxDate(max: Date, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (value instanceof Date && value.getTime() <= max.getTime()) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain date less than or equal to ${ max }`;
  };
}
