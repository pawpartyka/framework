import { Injectable} from '@artisanjs/core';
import { Schema } from '../interfaces/schema.interface';
import { REQUIRED } from '../rules/required.rule';

@Injectable()
export class Validator {
  public async validate(data: any | any[], schema: Schema, options: ValidateOptions = DEFAULT_VALIDATE_OPTIONS): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    for (const [expression, constraints] of Object.entries(schema)) {
      const isParentRequired: boolean = (schema[expression.split('.').slice(0, -1).join('.')] || []).some(it => it['_id'] === REQUIRED);
      const isTargetRequired: boolean = constraints.some(it => it['_id'] === REQUIRED);

      for (const path of this.parse(expression, data)) {
        const parts: string[] = path.split('.');

        let parentValue: any = data;
        let targetValue: any = data && data[parts[0]];

        for (let index = 1; index < parts.length; index++) {
          parentValue = targetValue;
          targetValue = targetValue && targetValue[parts[index]];
        }

        if ((!parentValue && isParentRequired === false) || (!targetValue && isTargetRequired === false)) {
          continue;
        }

        const messages: string[] = [];

        for (const constraint of constraints) {
          const result: boolean | string = await constraint(targetValue, parts[parts.length - 1], data);

          if (typeof result === 'string') {
            messages.push(result);
          }
        }

        if (messages.length) {
          errors.push({ messages, path: path });
        }
      }
    }

    return { errors };
  }

  private parse(path: string, data: any): string[] {
    const paths: string[] = [];

    if (path.includes('*')) {
      let value: any = data;

      for (const part of path.split('.')) {
        if (part === '*') {
          for (const index of Object.keys(value || [])) {
            paths.push(...this.parse(path.replace('*', index), data));
          }

          break;
        }

        value = value && value[part];
      }
    } else {
      paths.push(path);
    }

    return paths;
  }
}

export const DEFAULT_VALIDATE_OPTIONS: ValidateOptions = {
  allowUnknown: true,
};

export interface ValidateOptions {
  allowUnknown?: boolean;
}

export interface ValidationError {
  messages: string[];
  path: string;
}

export interface ValidationResult {
  errors: ValidationError[];
}
