import { DateTime } from 'luxon';

import { taskSchema } from '../models/task.model';
import { TaskCreatePayload } from '../controllers/v1/task.controller';
import { CreateTaskDto, TaskRepository } from '../repositories/task';
import { TaskStartFinishTimeError, TaskTimelineError } from '../errors/error';

export class TaskService {
  private taskRepository: TaskRepository;
  constructor(taskRepo = TaskRepository, schema = taskSchema) {
    this.taskRepository = new taskRepo(schema);
  }
  async createTask(data: TaskCreatePayload) {
    const { startTime, completionTime } = data;
    this.validateTimeline({ startTime, completionTime });

    const newTask = await this.taskRepository.createTask(this.mapTaskObject(data));

    if (newTask.kind === 'ok') {
      return newTask.data;
    }

    throw newTask.err;
  }

  private validateTimeline(timelime: { startTime?: DateTime; completionTime?: DateTime }) {
    const { startTime, completionTime } = timelime;

    const curTime = DateTime.utc();
    if (startTime && startTime < curTime) {
      throw new TaskStartFinishTimeError('startTime');
    }
    if (completionTime && completionTime < curTime) {
      throw new TaskStartFinishTimeError('completionTime');
    }
    if (startTime && completionTime) {
      if (completionTime <= startTime) {
        throw new TaskTimelineError('');
      }
    }
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
