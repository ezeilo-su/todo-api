import { ZodIssue } from 'zod';
import { MongooseError } from 'mongoose';

export interface BadIssue {
  path?: string;
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

export class TaskTimelineError extends AppError implements Stringifiable<string[]> {
  constructor(path: string) {
    super(`${path} error`);
  }

  toJSON() {
    return ['completionTime must be in the future of startTime'];
  }

  toString(): string {
    return this.message;
  }
}

export class TaskStartFinishTimeError extends AppError implements Stringifiable<string[]> {
  private path: string;
  constructor(path: string) {
    super(`${path} error`);
    this.path = path;
  }

  toJSON() {
    return [`${this.path} must be in the future`];
  }

  toString(): string {
    return this.message;
  }
}

export class DatabaseError extends MongooseError {
  constructor(message: string) {
    super(message);
  }
}
