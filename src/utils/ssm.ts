import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';

import { debug } from './debug.js';

const PREFIX = 'SSM:';

type ReplaceParamsOptions = {
  region?: string;
  profile?: string;
};

const replaceParams = async (
  env: Record<string, string | undefined>,
  { region, profile }: ReplaceParamsOptions = {},
) => {
  const ssm = new SSMClient({
    region,
    profile,
  });

  const names = Object.entries(env)
    .filter(([, value]) => value?.startsWith(PREFIX))
    .map(([, value]) => value?.slice(PREFIX.length))
    .filter((value) => value !== undefined);

  debug(`Replacing ${names.length} parameters`);
  debug(`Names: ${names.join(', ')}`);

  if (names.length === 0) {
    return env;
  }

  const command = new GetParametersCommand({
    Names: names,
    WithDecryption: true,
  });

  const response = await ssm.send(command);
  if (response.InvalidParameters?.length || 0 > 0) {
    console.error('Invalid SSM parameters', response.InvalidParameters);
    process.exit(1);
  }

  const params = response.Parameters ?? [];

  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => {
      if (value?.startsWith(PREFIX)) {
        const param = params.find((param) => `SSM:${param.Name}` === value);
        debug(`Replacing ${key} with ${param?.Value}`);
        return [key, param?.Value];
      }

      return [key, value];
    }),
  );
};

export { replaceParams };
