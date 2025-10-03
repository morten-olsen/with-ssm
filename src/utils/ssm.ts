import { GetParametersCommand, SSMClient, type Parameter } from '@aws-sdk/client-ssm';

import { debug } from './debug.js';
import { ensureAWS } from './aws.js';

const PREFIX = 'SSM:';

type ReplaceParamsOptions = {
  region?: string;
  profile?: string;
};

const replaceParams = async (
  env: Record<string, string | undefined>,
  { region, profile }: ReplaceParamsOptions = {},
) => {
  const names = Object.entries(env)
    .filter(([, value]) => value?.startsWith(PREFIX))
    .map(([, value]) => value?.slice(PREFIX.length))
    .filter((value) => value !== undefined);

  debug(`Replacing ${names.length} parameters`);
  debug(`Names: ${names.join(', ')}`);

  if (names.length === 0) {
    return env;
  }

  await ensureAWS(region, profile);
  const ssm = new SSMClient({
    region,
    profile,
  });
  // Chunk names into groups of 10 (AWS SSM GetParametersCommand limit)
  const chunks: string[][] = [];
  debug(`Chunking ${names.length} names into groups of 10`);
  for (let i = 0; i < names.length; i += 10) {
    chunks.push(names.slice(i, i + 10));
  }

  debug(`Processing ${chunks.length} chunks`);

  // Fetch parameters in chunks and combine results
  const allParams: Parameter[] = [];
  const allInvalidParams: string[] = [];

  for (const chunk of chunks) {
    const command = new GetParametersCommand({
      Names: chunk,
      WithDecryption: true,
    });

    const response = await ssm.send(command);

    if (response.Parameters) {
      allParams.push(...response.Parameters);
    }

    if (response.InvalidParameters) {
      allInvalidParams.push(...response.InvalidParameters);
    }
  }

  if (allInvalidParams.length > 0) {
    console.error('Invalid SSM parameters', allInvalidParams);
    process.exit(1);
  }

  const params = allParams;

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
