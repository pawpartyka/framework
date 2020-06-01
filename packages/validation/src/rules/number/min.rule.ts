import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function min(value: any, minimum: number): boolean {
  return typeof value === 'number' && value >= minimum;
}

export function Min(minimum: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (min(value, minimum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should have at least ${ minimum }`;
  };
}
