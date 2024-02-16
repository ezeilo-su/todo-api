import dotenv from 'dotenv';
import * as path from 'path';

import { Config } from '../types/global';
import { getCommitHash } from '../utils/utils';
import { configSchema } from '../types/validation-schema';
import { logger } from '../logger/logger';
import { ZodError } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const getJSONEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.error(`undefined ${key} in ENV`);
    throw new Error(`${key} must be defined in the ENV`);
  }
  return JSON.parse(value);
};

const configObject = {
  appEnv: process.env.APP_ENV,
  serverPort: Number(process.env.PORT || process.env.SERVER_PORT),
  lastCommitHash: getCommitHash()
};

let cache: Config | undefined;
function validateEnvs() {
  try {
    if (!cache) {
      cache = configSchema.parse(configObject);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      error.errors.forEach((validationError) => {
        logger.error(validationError.message);
        logger.error(validationError.path.join('.'));
      });
    }
    throw 'ENV Error!';
  }

  return cache;
}

const config = cache || validateEnvs();

export { config };
