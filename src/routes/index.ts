import { Express } from 'express';

import { pingRoute } from './ping.route';

const API_PREFIX = '/api/v1';

const bindRoutes = (app: Express) => {
  app.use(`${API_PREFIX}/ping`, pingRoute);
};

export { bindRoutes };
