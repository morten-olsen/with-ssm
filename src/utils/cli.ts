const splitArgs = (args: string[]) => {
  const separatorIndex = args.indexOf('--');
  const actionArgs = args.slice(0, separatorIndex);
  const command = args[separatorIndex + 1];
  const commandArgs = args.slice(separatorIndex + 2);

  return {
    actionArgs,
    command,
    commandArgs,
  };
};

export { splitArgs };
