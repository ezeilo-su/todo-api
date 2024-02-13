import cors from 'cors';
import express, { json, urlencoded } from 'express';

import { startServer } from './server';

const app = express();

const server = startServer(app);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

export default server;
