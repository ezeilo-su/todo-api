import { z } from 'zod';
import { DateTime } from 'luxon';
import { RequestHandler } from 'express';

import { Task, TaskPriority } from '../../repositories/task/create';
import { TaskService } from '../../services/task.service';
import httpStatus from 'http-status';
import { logger } from '../../logger/logger';
import { RequestValidationError } from '../../errors/error';

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
  notificationSubscription: NotifSubValidationSchema.optional()
});

export type NotificationSubscriptionSchema = z.infer<typeof NotifSubValidationSchema>;

interface ResponseBody<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TaskCreatePayload = z.infer<typeof TaskCreateValidationSchema>;

export class TaskController {
  private taskService: TaskService;
  constructor(taskService = TaskService) {
    this.taskService = new taskService();
  }

  create: RequestHandler<unknown, ResponseBody<Task>> = async (req, res, next) => {
    try {
      const validatedPayload = this.validateCreate(req.body);
      const newTask = await this.taskService.createTask(validatedPayload);
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

  private validateCreate(body: any) {
    const result = TaskCreateValidationSchema.safeParse(body);
    if (!result.success) {
      throw new RequestValidationError('body', result.error.issues);
    }

    return result.data;
  }
}
