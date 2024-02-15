import cors from 'cors';
import morgan from 'morgan';
import express, { json, urlencoded } from 'express';

import { bindRoutes } from './routes';
import { log } from './logger/logger';
import { logStream } from './logger/stream';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  app.use(morgan('tiny', { stream: logStream }));
  log.info('Logging enabled');
}

bindRoutes(app);

// other middleware go here

export { app };
