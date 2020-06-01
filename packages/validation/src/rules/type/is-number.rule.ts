import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isNumber(value: any): boolean {
  return typeof value === 'number' || value instanceof Number;
}

export function IsNumber(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isNumber(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a number`;
  };
}
