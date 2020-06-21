import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, filter, mergeWith, move, noop, url, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { join, parse } from 'path';
import { ServiceSchema } from './schema';

export function service(options: ServiceSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const name: string = parse(options.name).name;
    const path = normalize(join(options.path, options.flat ? '' : strings.dasherize(options.name)));

    return mergeWith(apply(url('./files'), [
      options.skipTests ? filter(it => !it.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({ ...strings, name: name }),
      move(path),
    ]));
  };
}
