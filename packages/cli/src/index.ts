#!/usr/bin/env node
import { exec, spawn, ChildProcess } from 'child_process';
import * as commander from 'commander';
import * as ora from 'ora';
import { join, parse } from 'path';
import * as webpack from 'webpack';

const program = new commander.Command();

program
  .version('1.0.0');

program
  .command('build')
  .description('build a project')
  .action(async (options) => {
    //
  });

program
  .command('generate <schematic> <name>')
  .allowUnknownOption(true)
  .description('Generates and/or modifies files based on a schematic')
  .action(async (schematic, name, options) => {
    const child: ChildProcess = spawn(`schematics @artisanjs/cli:${ schematic } --name=${ name } --dry-run=false`, options.args.slice(2), {
      stdio: 'inherit',
      shell: true,
    });
  });

program
  .command('lint')
  .description('Runs linting tools in a given project folder.')
  .action(async (options) => {
    //
  });

program
  .command('new [name]')
  .description('create a new project')
  .action(async (name) => {
    const child: ChildProcess = spawn(`schematics @artisanjs/cli:application --name=${ name } --dry-run=false`, {
      stdio: 'inherit',
      shell: true,
    });

    // const spinner = ora().start('Installing packages...');
  });

program
  .command('start')
  .option('--prod', '', false)
  .description('start a project')
  .action(async (options) => {
    require('dotenv').config();

    const compiler = webpack(require(join(process.cwd(), 'webpack.config.js')));

    compiler.run((error, stats) => {
      if (stats.hasErrors()) {
        return console.error(stats.compilation.errors);
      }

      if (!stats.hasErrors()) {
        const child: ChildProcess = spawn('node', [join(stats.compilation.outputOptions.path, stats.compilation.outputOptions.filename)], {
          stdio: 'inherit',
          shell: true,
        });
      }
    });
  });

program
  .command('test')
  .option('--config [path]', 'Config')
  .option('--watch', 'Watch mode', false)
  .option('--coverage', 'Coverage', false)
  .description('test a project')
  .action(async (options) => {
    const args: string[] = [];

    if (options.config) {
      args.push(`--config=${ options.config }`);
    }

    const child: ChildProcess = spawn('jest', args, {
      stdio: 'inherit',
      shell: true,
    });
  });

program
  .parse(process.argv);
