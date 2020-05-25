import { Injectable } from '@artisanjs/core';
import validator from 'validator';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class MaxLengthRule implements Rule {
  public message(args: number[], value: any, index: string, target: any): string {
    return `The "${ index }" should be shorter than or equal to ${ args[0] } characters`;
  }

  public passes(args: number[], value: any, index: string, target: any): boolean {
    return maxLength(value, args[0]);
  }
}

export function maxLength(value: any, max: number): boolean {
  return typeof value === 'string' && validator.isLength(value, { max: max });
}

export function MaxLength(max: number, options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [max],
    message: options?.message,
    name: 'maxLength',
    rule: MaxLengthRule,
  };
}
