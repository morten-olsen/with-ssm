import { spawn } from 'child_process';

type ExecOptions = {
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string | undefined>;
};

const exec = (options: ExecOptions) => {
  const { command, args, cwd, env } = options;
  const child = spawn(command, args, { cwd, env, stdio: 'inherit' });
  const killChild = () => child.kill();

  process.on('SIGINT', killChild);
  process.on('SIGTERM', killChild);
  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });

  child.on('error', (err) => {
    console.error(`[with-ssm] ❌ Failed to start command "${command}".`);
    console.error(err.message);
    process.exit(1);
  });

  return child;
};

export { exec };
