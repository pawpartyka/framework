import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsDate(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (value instanceof Date) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a date instance`;
  };
}
