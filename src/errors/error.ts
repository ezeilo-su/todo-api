import { ZodIssue } from 'zod';

export interface BadIssues {
  field: string;
  message: string;
}
[];

interface ValidationIssue {
  path: string;
  field: string;
  message: string;
}

interface Stringifiable<T> {
  toJSON(): T;
  toString(): string;
}

export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends AppError implements Stringifiable<{}> {
  constructor(
    private issues: ZodIssue[],
    private path: string
  ) {
    super(`Invalid request ${path} param(s)`);
  }

  toJSON(): ValidationIssue[] {
    return Object.values(this.issues).reduce((acc, cur) => {
      acc.push({
        path: this.path,
        field: cur.path.length > 1 ? `${cur.path[0]}[${cur.path[1]}]` : String(cur.path[0]),
        message: cur.message
      });
      return acc;
    }, [] as ValidationIssue[]);
  }
}
