import { Schema } from 'mongoose';
import { TaskPriorityMapping } from '../repositories/task/create';

interface NotificationSubscriptionSchema {
  reminder: boolean;
  taskStarted: boolean;
  taskCompleted: boolean;
}

type PriorityLevelKeyType = keyof typeof TaskPriorityMapping;
type PriorityLevelValueType = (typeof TaskPriorityMapping)[PriorityLevelKeyType];

export interface TaskModel {
  id: string;
  title: string;
  description?: string;
  startTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  completionTime?: Date;
  priorityLevel?: PriorityLevelValueType;
  notificationSubscription?: NotificationSubscriptionSchema;
  __v: number;
}

const notificationSubscriptionSchema = new Schema<NotificationSubscriptionSchema>(
  {
    reminder: {
      type: Boolean
    },
    taskStarted: {
      type: Boolean
    },
    taskCompleted: {
      type: Boolean
    }
  },
  { _id: false }
);

const taskSchema = new Schema<TaskModel>(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    startTime: {
      type: Date
    },
    completionTime: {
      type: Date
    },
    priorityLevel: {
      type: Number,
      enum: Object.values(TaskPriorityMapping)
    },
    notificationSubscription: {
      type: notificationSubscriptionSchema
    }
  },
  { timestamps: true }
);

export { taskSchema };
