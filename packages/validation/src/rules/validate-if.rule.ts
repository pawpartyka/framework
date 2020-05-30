import { Injectable } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Constraint } from '../interfaces/schema.interface';

@Injectable()
export class ValidateIfRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return null;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return args[0](args, value, index, target);
  }
}

export const VALIDATE_IF: symbol = Symbol('validate-if');

export function ValidateIf(
  condition: (args: any[], value: any, index: string, target: any) => boolean | Promise<boolean>,
  options?: Pick<Constraint, 'message'>,
): Constraint {
  return {
    args: [condition],
    message: options?.message,
    name: VALIDATE_IF,
    rule: ValidateIfRule,
  };
}
