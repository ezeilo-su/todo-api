import { Router } from 'express';
import { pingController } from '../controllers/ping.controller';

const pingRoute = Router();

pingRoute.get('/', pingController);

export { pingRoute };
