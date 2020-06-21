#!/usr/bin/env node
import yargs from 'yargs';
import { GenerateCommand } from './commands/generate.command';
import { NewCommand } from './commands/new.command';

yargs
  .version('1.0.0')
  .scriptName('artisan')
  .command(GenerateCommand)
  .command(NewCommand)
  .parse();
