import { Injectable } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Constraint } from '../interfaces/schema.interface';

@Injectable()
export class RequiredRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The "${ index }" is required`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return required(value);
  }
}

export function required(value: any): boolean {
  return value !== undefined;
}

export function Required(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    name: 'required',
    rule: RequiredRule,
  };
}
