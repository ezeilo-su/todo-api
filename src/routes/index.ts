import { Express } from 'express';
import httpStatus from 'http-status';

import { pingRoute } from './ping.route';
import { versionOneRoutes } from './v1/index.route';
import { errorHandler } from '../middleware/error-handler';

const API_PREFIX = '/api';

const bindRoutes = (app: Express) => {
  app.use(`${API_PREFIX}/ping`, pingRoute);
  app.use(`${API_PREFIX}/v1`, versionOneRoutes);

  app.use(errorHandler);

  app.get('*', (_reqq, res) => {
    res.status(httpStatus.NOT_FOUND).send('Not found');
  });
};

export { bindRoutes };
