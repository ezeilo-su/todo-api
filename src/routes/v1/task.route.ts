import { Router } from 'express';
import { validateRequest } from '../../middleware/request-validator';
import {
  TaskCreateValidationSchema,
  createTaskHandler
} from '../../controllers/v1/task/create.controller';

const taskRoute = Router();

taskRoute.post('/', validateRequest('body', TaskCreateValidationSchema), createTaskHandler);

export { taskRoute };
