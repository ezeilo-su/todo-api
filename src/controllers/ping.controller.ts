import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import { config } from '../config';

const pingController: RequestHandler = (_req, res) => {
  try {
    const commitHash = config.lastCommitHash;
    console.debug(`Latest commit hash: ${commitHash}`);

    res.status(httpStatus.OK).send({
      status: true,
      message: 'Welcome to Todo API',
      data: {
        version: commitHash
      }
    });
  } catch (error) {
    console.error('Error curred in pingController\n', { error });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'The server is apparently down!',
      data: null
    });
  }
};

export { pingController };
