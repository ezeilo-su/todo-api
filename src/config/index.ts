import dotenv from 'dotenv';
import * as path from 'path';

import { Config } from '../types/global';
import { getCommitHash } from '../utils/utils';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.error(`undefined ${key} in ENV`);
    throw new Error(`${key} must be defined in the ENV`);
  }
  return value;
};

export const getJSONEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.error(`undefined ${key} in ENV`);
    throw new Error(`${key} must be defined in the ENV`);
  }
  return JSON.parse(value);
};

const config: Config = {
  appEnv: getEnv('APP_ENV'),
  lastCommitHash: getCommitHash()
};

export { config };
