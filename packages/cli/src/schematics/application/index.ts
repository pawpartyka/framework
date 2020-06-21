import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, mergeWith, move, url, MergeStrategy, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { join, parse } from 'path';
import { ApplicationSchema } from './schema';

export function application(options: ApplicationSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const name: string = parse(options.name).name;
    const path: string = normalize(strings.dasherize(options.name));

    context.addTask(new NodePackageInstallTask());

    return mergeWith(apply(url('./files'), [
      applyTemplates({ ...strings, name: name }),
      move(path),
    ]));
  };
}
