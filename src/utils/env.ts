import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { parse } from '@dotenvx/dotenvx';

import { debug } from './debug.js';

const getEnv = async (files: string[]) => {
  const env = { ...process.env };

  for (const file of files) {
    if (existsSync(resolve(process.cwd(), file))) {
      debug(`Loading ${file}`);
      const content = await readFile(file, 'utf8');
      const parsed = parse(content);
      debug(`Parsed ${file}\n${JSON.stringify(parsed, null, 2)}`);
      Object.assign(env, parsed);
    }
  }

  return env;
};

export { getEnv };
