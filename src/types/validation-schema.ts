import { z } from 'zod';
import { LogLevel } from './enums';

const portRegex = /^(?:[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const validatePort = (port: string) => {
  if (!portRegex.test(port)) {
    throw new Error('Invalid PORT number');
  }

  return Number(port);
};

export const configSchema = z.object({
  appEnv: z.string(),
  serverPort: z.string().transform((port) => validatePort(port)),
  lastCommitHash: z.string(),
  logLevel: z.nativeEnum(LogLevel)
});
