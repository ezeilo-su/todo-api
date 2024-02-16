import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import { config } from '../config';

const pingController: RequestHandler = (_req, res) => {
  const commitHash = config.lastCommitHash;
  console.debug(`Latest commit hash: ${commitHash}`);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'Welcome to Todo API',
    data: {
      meta: {
        version: commitHash
      }
    }
  });
};

export { pingController };
