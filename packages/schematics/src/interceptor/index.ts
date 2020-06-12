import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, mergeWith, move, url, MergeStrategy, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { join } from 'path';
import { ServiceSchema } from './schema';

export function interceptor(options: ServiceSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log(options);

    const movePath = normalize(join(options.path, strings.dasherize(options.name)));

    console.log(movePath);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(movePath),
    ]);

    return mergeWith(templateSource, MergeStrategy.Default);
  };
}
