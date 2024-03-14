import { DateTime } from 'luxon';
import { TaskCreatePayload } from '../controllers/v1/task/create.controller';
import { taskSchema } from '../models/task.model';
import { CreateTaskDto, TaskRepository } from '../repositories/task/create';
import { BadIssue, BadRequestError } from '../errors/error';

export class TaskService {
  async createTask(data: TaskCreatePayload) {
    const taskRepo = new TaskRepository(taskSchema);

    const { startTime, completionTime } = data;
    const issues = this.validateTimeline({ startTime, completionTime });
    if (issues.length) {
      throw new BadRequestError(issues);
    }

    const newTask = await taskRepo.createTask(this.mapTaskObject(data));

    if (newTask.kind === 'ok') {
      return newTask.data;
    }

    throw newTask.err;
  }

  private validateTimeline(timelime: { startTime?: DateTime; completionTime?: DateTime }) {
    const { startTime, completionTime } = timelime;

    const curTime = DateTime.utc();
    const issues: BadIssue[] = [];
    if (startTime && startTime < curTime) {
      issues.push({
        field: 'startTime',
        message: 'startTime must be in the future'
      });
    }
    if (completionTime && completionTime < curTime) {
      issues.push({
        field: 'completionTime',
        message: 'completionTime must be in the future'
      });
    }
    if (startTime && completionTime) {
      if (completionTime <= startTime) {
        issues.push({
          field: 'completionTime',
          message: 'completionTime must be in the future of startTime'
        });
      }
    }
    return issues;
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
