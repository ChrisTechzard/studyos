import { z } from "zod";
import { GroupValidationError, type GroupValidationIssue } from "@/modules/groups/errors";

/** Converts Zod issues into domain errors so callers never see raw parser details. */
export function parseOrThrow<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const issues: GroupValidationIssue[] = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  throw new GroupValidationError(issues[0]?.message ?? "Invalid input.", issues);
}
