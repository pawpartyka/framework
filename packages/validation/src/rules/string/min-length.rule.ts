import { Injectable } from '@artisanjs/core';
import validator from 'validator';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class MinLengthRule implements Rule {
  public message(args: number[], value: any, index: string, target: any): string {
    return `The ${ index || 'value' } should have at least ${ args[0] } characters`;
  }

  public passes(args: number[], value: any, index: string, target: any): boolean {
    return minLength(value, args[0]);
  }
}

export const MIN_LENGTH: symbol = Symbol('min-length');

export function minLength(value: any, min: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { min: min });
}

export function MinLength(min: number, options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [min],
    message: options?.message,
    name: MIN_LENGTH,
    rule: MinLengthRule,
  };
}
