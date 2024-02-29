import { Model, Schema, model } from 'mongoose';
import { TaskModel } from '../../models/task.model';
import { NotificationSubscriptionSchema } from '../../validation-schema';

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

export class TaskRepository {
  private readonly taskModel: Model<TaskModel>;

  constructor(taskSchema: Schema<TaskModel>) {
    this.taskModel = model<TaskModel>('Task', taskSchema);
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const { _id, __v, createdAt, updatedAt, priorityLevel, ...newTask } = (
      await this.taskModel.create({
        ...data,
        ...(data.priorityLevel && { priorityLevel: TaskPriorityMapping[data.priorityLevel] })
      })
    ).toObject();

    return {
      ...newTask,
      dateCreated: createdAt,
      dateUpdated: updatedAt,
      ...(priorityLevel && { priorityLevel: TaskPriorityReverseMapping[priorityLevel] })
    };
  }
}
