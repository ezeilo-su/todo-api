import { z } from 'zod';

export const configSchema = z.object({
  appEnv: z.string(),
  serverPort: z.number(),
  lastCommitHash: z.string()
});
