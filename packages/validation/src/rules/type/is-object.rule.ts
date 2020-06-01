import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function IsObject(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isObject(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a object`;
  };
}
