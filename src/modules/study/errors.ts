export type StudyErrorCode = "VALIDATION" | "NOT_FOUND" | "CONFLICT" | "PERSISTENCE";

export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

export class StudyError extends Error {
  public readonly code: StudyErrorCode;

  constructor(code: StudyErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class StudyValidationError extends StudyError {
  public readonly issues: readonly ValidationIssue[];

  constructor(message: string, issues: readonly ValidationIssue[] = []) {
    super("VALIDATION", message);
    this.issues = issues;
  }
}

export class StudyNotFoundError extends StudyError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class StudyConflictError extends StudyError {
  constructor(message: string) {
    super("CONFLICT", message);
  }
}

export class StudyPersistenceError extends StudyError {
  constructor(message: string) {
    super("PERSISTENCE", message);
  }
}

export function toSafeErrorMessage(error: unknown): string {
  if (error instanceof StudyError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
