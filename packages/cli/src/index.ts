#!/usr/bin/env node
import inquirer from 'inquirer';
import yargs from 'yargs';
import { GenerateCommand } from './commands/generate.command';
import { NewCommand } from './commands/new.command';

// tslint:disable-next-line:no-var-requires
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

yargs
  .version('1.0.0')
  .scriptName('artisan')
  .command(GenerateCommand)
  .command(NewCommand)
  .parse();
