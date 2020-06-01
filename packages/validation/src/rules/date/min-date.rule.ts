import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function minDate(value: any, minimum: Date): boolean {
  return value instanceof Date && value.getTime() >= minimum.getTime();
}

export function MinDate(minimum: Date, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (minDate(value, minimum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain date greater than or equal to ${ minimum }`;
  };
}
