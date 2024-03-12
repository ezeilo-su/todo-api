import { z } from 'zod';
import { DateTime } from 'luxon';
import { RequestHandler } from 'express';

import { Task, TaskPriority } from '../../../repositories/task/create';
import { TaskService } from '../../../services/task.service';
import httpStatus from 'http-status';
import { logger } from '../../../logger/logger';

export enum NotificationSubscription {
  reminder = 'reminder',
  taskStarted = 'taskStarted',
  taskCompleted = 'taskCompleted'
}
export const NotificationSubscriptionValidationSchema = z
  .object({
    reminder: z.boolean().optional(),
    taskStarted: z.boolean().optional(),
    taskCompleted: z.boolean().optional()
  })
  .refine(
    (data) => {
      // Ensure that at least one field is provided
      return Object.values(data).some((value) => value === true);
    },
    {
      message:
        'At least one field in [reminder, taskStarted, taskCompleted] must be true if notificationSubscription is present'
    }
  );
const optionalDateValidationSchema = z
  .string()
  .transform((val) => DateTime.fromISO(val))
  .optional();

export const TaskCreateValidationSchema = z.object({
  title: z.string().min(3).max(64),
  description: z.string().max(500).optional(),
  startTime: optionalDateValidationSchema,
  completionTime: optionalDateValidationSchema,
  priorityLevel: z.nativeEnum(TaskPriority).optional(),
  notificationSubscription: NotificationSubscriptionValidationSchema.optional()
});

export type NotificationSubscriptionSchema = z.infer<
  typeof NotificationSubscriptionValidationSchema
>;

interface ResponseBody<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TaskCreatePayload = z.infer<typeof TaskCreateValidationSchema>;

export const createTaskHandler: RequestHandler<
  unknown,
  ResponseBody<Task>,
  TaskCreatePayload
> = async (req, res, next) => {
  try {
    const taskService = new TaskService();

    const newTask = await taskService.createTask(req.body);
    logger.info(JSON.stringify(newTask));

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Task successfully created',
      data: newTask
    });
  } catch (error) {
    // check for error instance and handle properly
    console.log('error creating task\n', { error });
    next(error);
  }
};
