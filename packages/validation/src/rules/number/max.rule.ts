import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class MaxRule implements Rule {
  public message(args: number[], value: any, index: string, target: any): string {
    return `The "${ index || 'value' }" should ${ args[0] }`;
  }

  public passes(args: number[], value: any, index: string, target: any): boolean {
    return max(value, args[0]);
  }
}

export const MAX: symbol = Symbol('max');

export function max(value: any, maximum: number): boolean {
  return typeof value === 'number' && value >= maximum;
}

export function Max(maximum: number, options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [maximum],
    message: options?.message,
    name: MAX,
    rule: MaxRule,
  };
}
