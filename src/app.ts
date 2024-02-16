import cors from 'cors';
import morgan from 'morgan';
import express, { json, urlencoded } from 'express';

import { bindRoutes } from './routes';
import { logStream } from './logger/stream';
import { config } from './config';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(morgan('tiny', { stream: logStream }));
if (config.appEnv !== 'production' && config.appEnv !== 'staging') {
}

bindRoutes(app);

// other middleware go here

export { app };
