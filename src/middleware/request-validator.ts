import { ZodSchema } from 'zod';
import { RequestValidationError } from '../errors/error';
import { RequestHandler } from 'express';

export const validateRequest =
  (path: 'body' | 'query', schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new RequestValidationError(result.error.issues, path));
    }
    const validatedBody = result.data;
    req.body = validatedBody;
    next();
  };
