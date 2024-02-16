import { execSync } from 'child_process';

import { AppEnv } from '../types/enums';

export const getCommitHash = (): string => {
  if (process.env.APP_ENV !== AppEnv.staging && process.env.APP_ENV !== AppEnv.production) {
    return execSync('git rev-parse --short HEAD').toString().trim();
  }

  return process.env.HEROKU_SLUG_COMMIT as string; //  Full commit hash
  // return (process.env.HEROKU_SLUG_DESCRIPTION as string).split(' ')[1]; //  shaort commit hash
  // return process.env.COMMIT_SHA as string; - Update accordingly for GitHub and GitLab
};
