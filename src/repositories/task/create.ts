import { Model, Schema, model } from 'mongoose';
import { TaskModel } from '../../models/task.model';
import { NotificationSubscriptionSchema } from '../../controllers/v1/task.controller';

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime?: Date;
  dateCreated: Date;
  dateUpdated: Date;
  completionTime?: Date;
  priorityLevel?: TaskPriority;
  notificationSubscription?: NotificationSubscriptionSchema;
}

export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

export const TaskPriorityMapping: Record<TaskPriority, number> = {
  [TaskPriority.low]: 1,
  [TaskPriority.medium]: 2,
  [TaskPriority.high]: 3
};

const TaskPriorityReverseMapping: Record<number, TaskPriority> = {
  [TaskPriorityMapping.low]: TaskPriority.low,
  [TaskPriorityMapping.medium]: TaskPriority.medium,
  [TaskPriorityMapping.high]: TaskPriority.high
};

export interface CreateTaskDto {
  title: string;
  description?: string;
  startTime?: Date;
  completionTime?: Date;
  priorityLevel?: TaskPriority;
  notificationSubscription?: NotificationSubscriptionSchema;
}

interface Err {
  kind: 'error';
  err: Error;
}

interface Ok {
  kind: 'ok';
  data: Task;
}

type Result = Err | Ok;

export class TaskRepository {
  private readonly taskModel: Model<TaskModel>;

  constructor(taskSchema: Schema<TaskModel>) {
    this.taskModel = model<TaskModel>('Task', taskSchema);
  }

  private mapToModel(data: CreateTaskDto) {
    return Object.entries(data).reduce(
      (acc, [key, val]) => {
        if (key === 'priorityLevel') {
          val = TaskPriorityMapping[val as TaskPriority];
        }

        acc[key] = val;
        return acc;
      },
      {} as { [key: string]: any }
    );
  }

  private mapToResult(newTask: TaskModel) {
    const { __v, createdAt, updatedAt, priorityLevel, ...data } = newTask;

    return {
      ...data,
      dateCreated: createdAt,
      dateUpdated: updatedAt,
      ...(priorityLevel && { priorityLevel: TaskPriorityReverseMapping[priorityLevel] })
    };
  }

  async createTask(data: CreateTaskDto): Promise<Result> {
    try {
      const { _id, ...newTask } = (
        await this.taskModel.create({
          ...this.mapToModel(data)
        })
      ).toObject();

      return {
        kind: 'ok',
        data: this.mapToResult(newTask)
      };
    } catch (error) {
      // handle known DB errors here before throw
      throw error;
    }
  }
}
