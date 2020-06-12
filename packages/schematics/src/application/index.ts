import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, mergeWith, move, url, MergeStrategy, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { ApplicationSchema } from './schema';

export function application(options: ApplicationSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const movePath = normalize('/' + strings.dasherize(options.name));

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(movePath),
    ]);

    context.addTask(new NodePackageInstallTask());

    return mergeWith(templateSource, MergeStrategy.Default);
  };
}
