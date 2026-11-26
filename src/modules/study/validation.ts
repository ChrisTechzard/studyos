import { z } from "zod";
import { StudyValidationError, type ValidationIssue } from "@/modules/study/errors";

/** Converts Zod issues into domain errors so callers never see raw parser details. */
export function parseOrThrow<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const issues: ValidationIssue[] = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  throw new StudyValidationError(issues[0]?.message ?? "Invalid input.", issues);
}
