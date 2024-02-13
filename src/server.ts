import { Express } from 'express';
import { bindRoutes } from './routes';

const SERVER_PORT = process.env.PORT || 3000;

const startServer = (app: Express) => {
  bindRoutes(app);

  return app.listen(SERVER_PORT, () => {
    console.info(`App listening on PORT: ${SERVER_PORT}`);
  });
};

export { startServer };
