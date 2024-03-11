import { MongooseError } from 'mongoose';
import { ZodIssue } from 'zod';

export interface BadIssue {
  path: string;
  field: string;
  message: string;
}

export type ValidationIssues = BadIssue[];

interface Stringifiable<T> {
  toJSON(): T;
  toString(): string;
}

export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RequestValidationError extends AppError implements Stringifiable<ValidationIssues> {
  constructor(
    private path: string,
    private issues: ZodIssue[]
  ) {
    super(`Invalid request ${path} param(s)`);
  }

  toString(): string {
    return this.message;
  }

  toJSON(): ValidationIssues {
    return Object.values(this.issues).reduce((acc, cur) => {
      acc.push({
        path: this.path,
        field: cur.path.length > 1 ? `${cur.path[0]}[${cur.path[1]}]` : String(cur.path[0]),
        message: cur.message
      });
      return acc;
    }, [] as ValidationIssues);
  }
}

export class DatabaseError extends MongooseError {
  constructor(message: string) {
    super(message);
  }
}
