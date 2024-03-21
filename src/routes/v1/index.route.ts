import { Router } from 'express';
import { taskRoute } from './task.route';

const versionOneRoutes = Router();

versionOneRoutes.use('/task', taskRoute);

export { versionOneRoutes };
