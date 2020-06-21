import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { CommandModule } from 'yargs';

export const NewCommand: CommandModule = {
  aliases: [
    'n',
  ],
  builder: yargs => {
    return yargs;
  },
  command: [
    'new',
  ],
  describe: 'Create a new project',
  handler: async yargs => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        validate: value => typeof value === 'string' || 'Pass a valid project name',
      },
    ]);

    const args: string[] = [
      '--name',
      answers.name,
    ];

    spawn(`schematics @artisanjs/cli:application`, args, {
      stdio: 'inherit',
      shell: true,
    });
  },
};
