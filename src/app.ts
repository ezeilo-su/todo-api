import cors from 'cors';
import morgan from 'morgan';
import express, { json, urlencoded } from 'express';

import { bindRoutes } from './routes';
import { logStream } from './logger/stream';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(morgan('tiny', { stream: logStream }));
// other middleware go here

bindRoutes(app);

export { app };
