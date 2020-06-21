import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { CommandModule } from 'yargs';

export const GenerateCommand: CommandModule = {
  aliases: [
    'g',
  ],
  builder: yargs => {
    return yargs;
  },
  command: [
    'generate',
  ],
  describe: 'Generate a component',
  handler: async yargs => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'schematic',
        message: 'Schematic:',
        choices: [
          { name: 'Controller', value: 'controller' },
          { name: 'Interceptor', value: 'interceptor' },
          { name: 'Service', value: 'service' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Name:',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Path:',
        default: 'src',
      },
      {
        name: 'flat',
        message: 'Flat?',
        type: 'confirm',
        default: false,
      },
      {
        name: 'skipTests',
        message: 'Skip tests?',
        type: 'confirm',
        default: false,
      },
    ]);

    const args: any[] = [
      '--name',
      answers.name,
      '--path',
      answers.path,
      '--dry-run',
      false,
    ];

    if (answers.flat) {
      args.push('--flat');
    }

    if (answers.skipTests) {
      args.push('--skipTests');
    }

    spawn(`schematics @artisanjs/cli:${ answers.schematic }`, args, {
      stdio: 'inherit',
      shell: true,
    });
  },
};
