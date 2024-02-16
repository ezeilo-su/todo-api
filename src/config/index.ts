import dotenv from 'dotenv';
import * as path from 'path';

import { Config } from '../types/global';
import { getCommitHash } from '../utils/utils';
import { configSchema } from '../types/validation-schema';
import { logger } from '../logger/logger';

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
  serverPort: process.env.PORT || process.env.SERVER_PORT,
  lastCommitHash: getCommitHash(),
  logLevel: process.env.LOG_LEVEL
};

let cache: Config | undefined;
function validateEnvs() {
  if (cache) return cache;
  const result = configSchema.safeParse(configObject);
  if (result.success) {
    cache = result.data;
    return cache;
  }
  result.error.errors.forEach((validationError) => {
    logger.error(validationError.message);
    logger.error(validationError.path.join('.'));
  });
  throw 'Error in the ENV';
}

export const config = validateEnvs();
