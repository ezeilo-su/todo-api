import { Express } from 'express';
import httpStatus from 'http-status';

import { pingRoute } from './ping.route';

const API_PREFIX = '/api';

const bindRoutes = (app: Express) => {
  app.use(`${API_PREFIX}/ping`, pingRoute);

  app.get('*', (_reqq, res) => {
    res.status(httpStatus.NOT_FOUND).send('Not found');
  });
};

export { bindRoutes };
