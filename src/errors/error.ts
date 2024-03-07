import { ZodIssue } from 'zod';

export interface BadIssues {
  field: string;
  message: string;
}
[];

export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }

  toJSON() {}

  toString() {}
}

interface ValidationIssue {
  path: string;
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  validationIssues: ValidationIssue[];

  constructor(
    private issues: ZodIssue[],
    private path: string
  ) {
    super(`Invalid request ${path} param(s)`);
    this.validationIssues = this.serializeIssues();
  }

  private serializeIssues(): ValidationIssue[] {
    return Object.values(this.issues).reduce((acc, cur) => {
      acc.push({
        path: this.path,
        field: cur.path.join('.'),
        message: cur.message
      });
      return acc;
    }, [] as ValidationIssue[]);
  }
}
