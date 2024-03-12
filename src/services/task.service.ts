import { DateTime } from 'luxon';
import { TaskCreatePayload } from '../controllers/v1/task/create.controller';
import { taskSchema } from '../models/task.model';
import { CreateTaskDto, TaskRepository } from '../repositories/task/create';

export class TaskService {
  async createTask(data: TaskCreatePayload) {
    const taskRepo = new TaskRepository(taskSchema);
    const newTask = await taskRepo.createTask(this.mapTaskObject(data));

    if (newTask.kind === 'ok') {
      return newTask.data;
    }

    throw newTask.err;
  }

  private mapTaskObject(d: TaskCreatePayload) {
    const mapped = Object.entries(d).reduce(
      (acc, [key, val]) => {
        if (val instanceof DateTime) {
          acc[key] = val.toJSDate();
        } else {
          acc[key] = val;
        }

        return acc;
      },
      {} as { [key: string]: any }
    );

    return mapped as CreateTaskDto;
  }
}
