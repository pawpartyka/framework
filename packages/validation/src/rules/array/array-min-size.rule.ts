import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function arrayMinSize(value: any, minimum: number): boolean {
  return Array.isArray(value) && value.length >= minimum;
}

export function ArrayMinSize(minimum: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (arrayMinSize(value, minimum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain at least ${ minimum } elements`;
  };
}
