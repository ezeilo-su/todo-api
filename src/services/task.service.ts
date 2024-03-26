import { DateTime } from 'luxon';

import { taskSchema } from '../models/task.model';
import { TaskCreatePayload } from '../controllers/v1/task.controller';
import { CreateTaskDto, TaskRepository } from '../repositories/orm/task';
import { TaskStartFinishTimeError, TaskTimelineError } from '../errors/error';

export class TaskService {
  private readonly taskRepository: TaskRepository;
  constructor(taskRepo = TaskRepository, schema = taskSchema) {
    this.taskRepository = new taskRepo(schema);
  }
  async createTask(data: TaskCreatePayload) {
    const { startTime, completionTime } = data;
    this.validateTimeline({ startTime, completionTime });

    const newTask = await this.taskRepository.createTask(this.payloadToDto(data));

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

  private payloadToDto(d: TaskCreatePayload): CreateTaskDto {
    return {
      ...d,
      startTime: d.startTime ? d.startTime.toJSDate() : undefined,
      completionTime: d.completionTime ? d.completionTime.toJSDate() : undefined
    };
  }
}
