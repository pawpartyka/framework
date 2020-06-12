import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, filter, mergeWith, move, noop, url, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parse } from 'path';
import { ServiceSchema } from './schema';

export function service(options: ServiceSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path: string = normalize(strings.dasherize(options.name));
    const name: string = parse(options.name).name;

    return mergeWith(apply(url('./files'), [
      options.skipTests ? filter(it => !it.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({ ...strings, name: options.name }),
      move(path),
    ]));
  };
}
