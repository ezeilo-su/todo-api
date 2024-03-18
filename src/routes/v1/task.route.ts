import { Router } from 'express';
import { TaskController } from '../../controllers/v1/task.controller';
import { TaskService } from '../../services/task.service';

const taskRoute = Router();
const taskController = new TaskController(new TaskService());

taskRoute.post('/', taskController.createTaskHandler);

export { taskRoute };
