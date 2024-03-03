import { z } from 'zod';
import { DateTime } from 'luxon';

import { TaskPriority } from '../repositories/task/create';
import { DBConfigValidationSchema } from '../config';

const PORT_REGEX = /^(?:[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const validatePort = (port: string) => {
  if (!PORT_REGEX.test(port)) {
    throw new Error('Invalid PORT number');
  }

  return Number(port);
};

export const ConfigValidationSchema = z.object({
  appEnv: z.string(),
  dbConfig: z.string().transform((val) => DBConfigValidationSchema.safeParse(JSON.parse(val))),
  serverPort: z.string().transform((port) => validatePort(port)),
  lastCommitHash: z.string(),
  logLevel: z.string()
});

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

export const TaskValidationSchema = z.object({
  title: z.string().min(3).max(64),
  description: z.string().max(500),
  startTime: optionalDateValidationSchema,
  completionTime: optionalDateValidationSchema,
  priorityLevel: z.nativeEnum(TaskPriority).optional(),
  notificationSubscription: NotificationSubscriptionValidationSchema.optional()
});

export type NotificationSubscriptionSchema = z.infer<
  typeof NotificationSubscriptionValidationSchema
>;
