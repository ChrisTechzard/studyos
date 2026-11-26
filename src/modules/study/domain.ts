import { z } from "zod";

export const UserIdSchema = z.string().min(1).brand<"UserId">();
export const TaskIdSchema = z.string().min(1).brand<"TaskId">();
export const SessionIdSchema = z.string().min(1).brand<"SessionId">();
export const IsoDateTimeSchema = z.iso.datetime();

export type UserId = z.infer<typeof UserIdSchema>;
export type TaskId = z.infer<typeof TaskIdSchema>;
export type SessionId = z.infer<typeof SessionIdSchema>;
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>;

export const TaskSchema = z.object({
  id: TaskIdSchema,
  ownerId: UserIdSchema,
  title: z.string().trim().min(1).max(120),
  notes: z.string().max(2000).nullable(),
  courseLabel: z.string().max(60).nullable(),
  dueAt: IsoDateTimeSchema,
  createdAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema.nullable(),
});

export type Task = z.infer<typeof TaskSchema>;

export const StudySessionSchema = z.object({
  id: SessionIdSchema,
  ownerId: UserIdSchema,
  taskId: TaskIdSchema.nullable(),
  title: z.string().trim().min(1).max(120),
  startedAt: IsoDateTimeSchema,
  endedAt: IsoDateTimeSchema.nullable(),
});

export type StudySession = z.infer<typeof StudySessionSchema>;

export const CreateTaskInputSchema = z.object({
  ownerId: UserIdSchema,
  title: z.string().trim().min(1, "Enter a task title.").max(120, "Keep the title under 120 characters."),
  notes: z.string().trim().max(2000).optional(),
  courseLabel: z.string().trim().max(60).optional(),
  dueAt: IsoDateTimeSchema,
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const CompleteTaskInputSchema = z.object({
  ownerId: UserIdSchema,
  taskId: TaskIdSchema,
});

export type CompleteTaskInput = z.infer<typeof CompleteTaskInputSchema>;

export const StartSessionInputSchema = z.object({
  ownerId: UserIdSchema,
  title: z.string().trim().min(1, "Name this focus session.").max(120),
  taskId: TaskIdSchema.optional(),
  startedAt: IsoDateTimeSchema.optional(),
});

export type StartSessionInput = z.infer<typeof StartSessionInputSchema>;

export const EndSessionInputSchema = z.object({
  ownerId: UserIdSchema,
  sessionId: SessionIdSchema,
  endedAt: IsoDateTimeSchema.optional(),
});

export type EndSessionInput = z.infer<typeof EndSessionInputSchema>;

export const StudyStatsSchema = z.object({
  tasksDueToday: z.number().int().nonnegative(),
  tasksCompletedToday: z.number().int().nonnegative(),
  focusMinutesToday: z.number().int().nonnegative(),
  streakDays: z.number().int().nonnegative(),
});

export type StudyStats = z.infer<typeof StudyStatsSchema>;

export const StudyDashboardSchema = z.object({
  ownerId: UserIdSchema,
  generatedAt: IsoDateTimeSchema,
  todayTasks: z.array(TaskSchema),
  activeSession: StudySessionSchema.nullable(),
  stats: StudyStatsSchema,
});

export type StudyDashboard = z.infer<typeof StudyDashboardSchema>;

export function isTaskDone(task: Task): boolean {
  return task.completedAt !== null;
}

/** Full minutes between session start and end. Invalid intervals yield 0. */
export function getSessionDurationMinutes(session: StudySession): number {
  if (session.endedAt === null) {
    return 0;
  }

  const elapsed = Date.parse(session.endedAt) - Date.parse(session.startedAt);
  return Number.isFinite(elapsed) && elapsed > 0 ? Math.round(elapsed / 60_000) : 0;
}

/** UTC day key keeps "today" deterministic across server time zones. */
export function getUtcDayKey(date: Date | IsoDateTime): string {
  const iso = typeof date === "string" ? date : date.toISOString();
  return iso.slice(0, 10);
}
