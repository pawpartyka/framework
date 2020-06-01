import { Injectable } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';

@Injectable()
export class Validator {
  public async validate(data: any, schema: Schema): Promise<ValidationResult> {
    return { errors: await this.executeSchemaTree(data, [], this.parseSchemaTree(schema)) };
  }

  private async executeSchemaTree(data: any, pathTree: string[], schemaTree: SchemaTree): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    for (const [expression, { children, rules }] of Object.entries(schemaTree)) {
      if (expression === '*') {
        for (const [index, value] of Object.entries(Array.isArray(data) ? data : [])) {
          const messages: string[] = [];

          for (const rule of rules) {
            const result: null | string | string[] = await rule(value, null, data);

            if (result !== null) {
              messages.push(...Array.isArray(result) ? result : [result]);
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
        const required: boolean = rules.some(it => it.implicit);
        const value: any = expression === '' ? data : (data && data[expression]);
        const newPathTree: string[] = expression === '' ? [...pathTree] : [...pathTree, expression];

        if (value === undefined && required === false) {
          continue;
        }

        const messages: string[] = [];

        for (const rule of rules) {
          const result: null | string | string[] | Rule = await rule(value, expression, data);

          if (result !== null) {
            messages.push(...Array.isArray(result) ? result : [result]);
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

  private parseSchemaTree(schema: { [expression: string]: Rule[] }): SchemaTree {
    const schemaTree: SchemaTree = {
      '': {
        children: {},
        rules: [],
      },
    };

    for (const [expression, rules] of Object.entries(schema)) {
      let schemaTreeBranch: SchemaTreeBranch = schemaTree[''];

      const parts: string[] = expression.split('.');

      for (let index = 0; index < parts.length; index++) {
        if (index === 0 && parts[index] !== '') {
          schemaTreeBranch = schemaTreeBranch.children[parts[index]] = schemaTreeBranch.children[parts[index]] || { children: {}, rules: [] };
        }

        if (index === parts.length - 1) {
          schemaTreeBranch.rules = rules;
        } else {
          schemaTreeBranch = schemaTreeBranch.children[parts[index + 1]] = schemaTreeBranch.children[parts[index + 1]] || { children: {}, rules: [] };
        }
      }
    }

    return schemaTree;
  }
}

export interface Schema {
  [expression: string]: Rule[];
}

export interface SchemaTree {
  [expression: string]: SchemaTreeBranch;
}

export interface SchemaTreeBranch {
  children: SchemaTree;
  rules: Rule[];
}

export interface ValidationError {
  messages: string[];
  path: string;
}

export interface ValidationResult {
  errors: ValidationError[];
}
