import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class MinRule implements Rule {
  public message(args: number[], value: any, index: string, target: any): string {
    return `The "${ index || 'value' }" should have at least ${ args[0] }`;
  }

  public passes(args: number[], value: any, index: string, target: any): boolean {
    return min(value, args[0]);
  }
}

export const MIN: symbol = Symbol('min');

export function min(value: any, minimum: number): boolean {
  return typeof value === 'number' && value >= minimum;
}

export function Min(minimum: number, options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [minimum],
    message: options?.message,
    name: MIN,
    rule: MinRule,
  };
}
