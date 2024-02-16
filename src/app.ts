import cors from 'cors';
import morgan from 'morgan';
import express, { json, urlencoded } from 'express';

import { bindRoutes } from './routes';
import { logger } from './logger/logger';
import { logStream } from './logger/stream';
import { config } from './config';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

if (config.appEnv !== 'production' && config.appEnv !== 'staging') {
  app.use(morgan('tiny', { stream: logStream }));
}

bindRoutes(app);

// other middleware go here

export { app };
