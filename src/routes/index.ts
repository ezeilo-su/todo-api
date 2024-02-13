import { Express } from 'express';

import { pingRoute } from './ping.route';

const API_PREFIX = '/api';

const bindRoutes = (app: Express) => {
  app.use(`${API_PREFIX}/ping`, pingRoute);
};

export { bindRoutes };
