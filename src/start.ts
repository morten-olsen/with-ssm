import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { exec } from './utils/exec.js';
import { getEnv } from './utils/env.js';
import { replaceParams } from './utils/ssm.js';

const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 [options] -- <command>')
    .option('region', {
      type: 'string',
      description: 'The AWS region to use for SSM.',
    })
    .option('profile', {
      type: 'string',
      description: 'The AWS profile to use from your credentials file.',
    })
    .option('file', {
      alias: 'f',
      type: 'string',
      description: 'The file to use for environment variables. (multiple files can be specified)',
      default: ['.env', '.env.with-ssm'],
    })
    .demandCommand(1, 'Error: You must provide a command to execute after --')
    .alias('h', 'help')
    .epilogue('For more information, check the documentation.')
    .parse();

  const command = argv._[0] as string;
  const commandArgs = argv._.slice(1).map(String);

  if (!command) {
    console.error('No command provided');
    process.exit(1);
  }

  const files = argv.file && Array.isArray(argv.file) ? argv.file : [argv.file];
  const hostEnv = await getEnv(files);
  const env = await replaceParams(hostEnv);

  exec({
    command,
    env,
    args: commandArgs,
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
