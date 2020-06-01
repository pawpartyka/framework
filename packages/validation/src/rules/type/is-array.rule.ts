import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function IsArray(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isArray(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be an array`;
  };
}
