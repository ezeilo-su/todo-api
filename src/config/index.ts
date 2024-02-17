import dotenv from 'dotenv';
import * as path from 'path';

import { Config } from '../types/global';
import { getCommitHash } from '../utils/utils';
import { configSchema } from '../types/validation-schema';
// import { logger } from '../logger/logger';

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
  const errMsg = result.error.errors.map((validationError) => {
    return `${validationError.path.join('.')}\t${validationError.message}`;
  });

  throw new Error(errMsg.join('\n'));
}

export const config = validateEnvs();
