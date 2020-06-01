import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean' || value instanceof Boolean;
}

export function IsBoolean(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (isBoolean(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a boolean`;
  };
}
