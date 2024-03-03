import { execSync } from 'child_process';
import { AppEnv } from '../config';

export const getCommitHash = (): string => {
  if (process.env.APP_ENV !== AppEnv.staging && process.env.APP_ENV !== AppEnv.production) {
    return execSync('git rev-parse --short HEAD').toString().trim();
  }

  return process.env.HEROKU_SLUG_COMMIT as string; //  Full commit hash
};

export const generateId = () => crypto.randomUUID();
