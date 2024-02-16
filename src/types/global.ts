import { z } from 'zod';
import { configSchema } from './validation-schema';

export type Config = z.infer<typeof configSchema>;
