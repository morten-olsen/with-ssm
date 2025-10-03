import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

const ensureAWS = async (region?: string, profile?: string) => {
  const sts = new STSClient({
    region,
    profile,
  });

  const command = new GetCallerIdentityCommand({});

  try {
    await sts.send(command);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to get caller identity', errorMessage);
    process.exit(1);
  }
};

export { ensureAWS };
