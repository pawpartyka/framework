import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, mergeWith, move, url, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'path';
import { ApplicationSchema } from './schema';

export function application(options: ApplicationSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const name: string = parse(options.name).name;
    const path: string = normalize(strings.dasherize(options.name));

    return mergeWith(apply(url('./files'), [
      applyTemplates({ ...strings, name: name }),
      move(path),
    ]));
  };
}
