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

export const NotifSubValidationSchema = z
  .object({
    reminder: z.boolean().optional(),
    taskStarted: z.boolean().optional(),
    taskCompleted: z.boolean().optional()
  })
  .refine((data) => Object.values(data).some((value) => value === true), {
    message: `At least one field in [${Object.keys(NotificationSubscription)}] must be set if notificationSubscription is supplied`
  });

export const TaskCreateValidationSchema = z
  .object({
    title: z.string().min(3).max(64),
    description: z.string().max(500).optional(),
    startTime: z
      .string()
      .transform((startTime) => DateTime.fromISO(startTime))
      .refine((startTime) => !startTime || startTime > DateTime.now(), {
        message: 'startTime must be in the future'
      })
      .optional(),
    completionTime: z
      .string()
      .transform((completionTime) => DateTime.fromISO(completionTime))
      .refine((completionTime) => !completionTime || completionTime > DateTime.now(), {
        message: 'completionTime must be in the future'
      })
      .optional(),
    priorityLevel: z.nativeEnum(TaskPriority).optional(),
    notificationSubscription: NotifSubValidationSchema.optional()
  })
  .refine(
    (schema) =>
      !schema.completionTime ||
      (schema.completionTime > DateTime.now() &&
        (!schema.startTime || schema.completionTime > schema.startTime)),
    {
      message: 'completionTime must be in the future and greater than startTime'
    }
  );

export type NotificationSubscriptionSchema = z.infer<typeof NotifSubValidationSchema>;

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
    logger.info('error creating task\n' + JSON.stringify(error));
    next(error);
  }
};
