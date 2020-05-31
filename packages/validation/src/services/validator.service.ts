import { Injectable } from '@artisanjs/core';
import { Constraint, Schema } from '../interfaces/schema.interface';

@Injectable()
export class Validator {
  public async validate(data: any, schema: Schema, options: ValidateOptions = DEFAULT_VALIDATE_OPTIONS): Promise<ValidationResult> {
    return { errors: await this.executeSchemaTree(data, [], this.parseSchemaTree(schema)) };
  }

  private async executeSchemaTree(data: any, pathTree: string[], schemaTree: SchemaTree): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    for (const [expression, { children, constraints }] of Object.entries(schemaTree)) {
      if (expression === '*') {
        for (const [index, value] of Object.entries(Array.isArray(data) ? data : [])) {
          const messages: string[] = [];

          for (const constraint of constraints) {
            const result: boolean | string = await constraint(value, null, data);

            if (typeof result === 'string') {
              messages.push(result);
            }
          }

          if (messages.length) {
            errors.push({ messages, path: [...pathTree, index].join('.') });
          }
        }

        if (Object.keys(children).length) {
          for (const [index, value] of Object.entries(Array.isArray(data) ? data : [])) {
            errors.push(...await this.executeSchemaTree(value, [...pathTree, index], children));
          }
        }
      } else {
        const required: boolean = constraints.some(it => it.implicit);
        const value: any = expression === '' ? data : (data && data[expression]);
        const newPathTree: string[] = expression === '' ? [...pathTree] : [...pathTree, expression];

        if (value === undefined && required === false) {
          continue;
        }

        const messages: string[] = [];

        for (const constraint of constraints) {
          const result: boolean | string = await constraint(value, expression, data);

          if (typeof result === 'string') {
            messages.push(result);
          }
        }

        if (messages.length) {
          errors.push({ messages, path: newPathTree.join('.') });
        }

        if (Object.keys(children).length) {
          errors.push(...await this.executeSchemaTree(value, newPathTree, children));
        }
      }
    }

    return errors;
  }

  private parseSchemaTree(schema: { [expression: string]: Constraint[] }): SchemaTree {
    const schemaTree: SchemaTree = {
      '': {
        children: {},
        constraints: [],
      },
    };

    for (const [expression, constraints] of Object.entries(schema)) {
      let schemaTreeBranch: SchemaTreeBranch = schemaTree[''];

      const parts: string[] = expression.split('.');

      for (let index = 0; index < parts.length; index++) {
        if (index === 0 && parts[index] !== '') {
          schemaTreeBranch = schemaTreeBranch.children[parts[index]] = schemaTreeBranch.children[parts[index]] || { children: {}, constraints: [] };
        }

        if (index === parts.length - 1) {
          schemaTreeBranch.constraints = constraints;
        } else {
          schemaTreeBranch = schemaTreeBranch.children[parts[index + 1]] = schemaTreeBranch.children[parts[index + 1]] || { children: {}, constraints: [] };
        }
      }
    }

    return schemaTree;
  }
}

export const DEFAULT_VALIDATE_OPTIONS: ValidateOptions = {
  allowUnknown: true,
};

export interface SchemaTree {
  [expression: string]: SchemaTreeBranch;
}

export interface SchemaTreeBranch {
  children: SchemaTree;
  constraints: Constraint[];
}

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
