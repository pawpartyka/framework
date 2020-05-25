import { Injectable, Injector } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Schema } from '../interfaces/schema.interface';

@Injectable()
export class Validator {
  constructor(private readonly injector: Injector) {
  }

  public async validate(value: any, schema: Schema, options?: ValidateOptions): Promise<ValidationResult> {
    return this.validateValue(value, schema, { ...DEFAULT_VALIDATE_OPTIONS, ...options });
  }

  private async validateValue(value: any, schema: Schema, options: ValidateOptions): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    if (Array.isArray(schema)) {
      for (const constraint of schema) {
        const rule: Rule = await this.injector.find(constraint.rule);

        if (await rule.passes(constraint.args, value, null, null) === false) {
          errors.push({ messages: { [constraint.name]: await rule.message(constraint.args, value, null, null) }, path: '' });
        }
      }
    } else {
      //
    }

    if (typeof value === 'object' && value !== null) {
      //
    }

    if (typeof value === 'object' && value !== null && value.length) {
      //
    }

    if (value === null || value === undefined || ['symbol', 'string', 'number', 'boolean'].includes(typeof value)) {
      //
    }

    // for (const [path, constraints] of Object.entries(schema)) {
    //   const keys: string[] = path.split('.');
    //
    //   for (let index = 0; index <= keys.length; index++) {
    //     if (index === keys.length - 1) {
    //
    //     }
    //   }
    // }

    return {
      errors: errors,
    };
  }

  private async execute(value: any, schema: Schema): Promise<ValidationError> {
    return null;
  }
}

export const DEFAULT_VALIDATE_OPTIONS: ValidateOptions = {
  allowUnknown: true,
  // stripUnknown: false,
  // todo@ convert: true,
};

export interface ValidateOptions {
  allowUnknown?: boolean;
  // stripUnknown?: boolean;
  // todo@ convert?: boolean,
}

export interface ValidationError {
  messages: { [key: string]: string; };
  path: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  // value: unknown;
}
