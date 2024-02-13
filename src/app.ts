import cors from 'cors';
import express, { json, urlencoded } from 'express';

import { bindRoutes } from './routes';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

bindRoutes(app);

// other middleware

export { app };
