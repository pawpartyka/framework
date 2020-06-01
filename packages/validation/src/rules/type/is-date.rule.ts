import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isDate(value: any): boolean {
  return value instanceof Date;
}

export function IsDate(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isDate(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a date instance`;
  };
}
