import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function maxDate(value: any, maximum: Date): boolean {
  return value instanceof Date && value.getTime() <= maximum.getTime();
}

export function MaxDate(maximum: Date, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (maxDate(value, maximum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain date less than or equal to ${ maximum }`;
  };
}
