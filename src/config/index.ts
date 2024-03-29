import { z } from 'zod';
import dotenv from 'dotenv';
import { getCommitHash } from '../utils/utils';

dotenv.config();
export const DBConfigValidationSchema = z.object({
  url: z.string().url()
});

const validatePort = (port: number) => {
  if (port < 1024 || port > 49152) {
    throw 'invalid port range';
  }

  return port;
};

export const ConfigValidationSchema = z.object({
  appEnv: z.string(),
  dbConfig: z.string().transform((val) => {
    const result = DBConfigValidationSchema.safeParse(JSON.parse(val));
    if (!result.success) {
      throw 'invalid DB configs';
    }

    return result.data;
  }),
  serverPort: z
    .string()
    .regex(/^\d+$/)
    .transform((port) => validatePort(Number(port))),
  lastCommitHash: z.string(),
  logLevel: z.string()
});

export enum AppEnv {
  test = 'test',
  staging = 'staging',
  production = 'production',
  development = 'development'
}

export enum LogLevel {
  debug = 'debug',
  error = 'error',
  combined = 'combined'
}

export type ConfigSchema = z.infer<typeof ConfigValidationSchema>;
export type DBConfigSchema = z.infer<typeof DBConfigValidationSchema>;

const configObject = {
  appEnv: process.env.APP_ENV,
  serverPort: process.env.PORT || process.env.SERVER_PORT,
  lastCommitHash: getCommitHash(),
  logLevel: process.env.LOG_LEVEL,
  dbConfig: process.env.DB_CONFIG
};

let cache: ConfigSchema | undefined;

function validateEnvs() {
  if (cache) return cache;
  const result = ConfigValidationSchema.safeParse(configObject);
  if (result.success) {
    cache = result.data;
    return cache;
  }
  const errMsg = result.error.errors.map((validationError) => {
    return `${validationError.path.join('.')}\t${validationError.message}`;
  });

  throw new Error(errMsg.join('\n'));
}

export const config = validateEnvs();
