import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function IsString(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isString(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a string`;
  };
}
