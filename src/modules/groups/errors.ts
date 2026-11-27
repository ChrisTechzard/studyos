export type GroupErrorCode = "VALIDATION" | "NOT_FOUND" | "CONFLICT" | "AUTHORIZATION" | "PERSISTENCE";

export interface GroupValidationIssue {
  readonly path: string;
  readonly message: string;
}

export class GroupError extends Error {
  public readonly code: GroupErrorCode;

  constructor(code: GroupErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class GroupValidationError extends GroupError {
  public readonly issues: readonly GroupValidationIssue[];

  constructor(message: string, issues: readonly GroupValidationIssue[] = []) {
    super("VALIDATION", message);
    this.issues = issues;
  }
}

export class GroupNotFoundError extends GroupError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class GroupConflictError extends GroupError {
  constructor(message: string) {
    super("CONFLICT", message);
  }
}

export class GroupAuthorizationError extends GroupError {
  constructor(message: string) {
    super("AUTHORIZATION", message);
  }
}

export class GroupPersistenceError extends GroupError {
  constructor(message: string) {
    super("PERSISTENCE", message);
  }
}

export function toSafeGroupErrorMessage(error: unknown): string {
  if (error instanceof GroupError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
