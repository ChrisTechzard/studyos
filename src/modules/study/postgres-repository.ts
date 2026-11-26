import { z } from "zod";
import {
  IsoDateTimeSchema,
  SessionIdSchema,
  StudySessionSchema,
  TaskIdSchema,
  TaskSchema,
  UserIdSchema,
  type IsoDateTime,
  type SessionId,
  type StudySession,
  type Task,
  type TaskId,
  type UserId,
} from "@/modules/study/domain";
import { StudyPersistenceError } from "@/modules/study/errors";
import type { StudyRepository } from "@/modules/study/ports";

export interface QueryResultRow {
  readonly [column: string]: unknown;
}

export type QueryExecutor = (
  sql: string,
  params: readonly unknown[],
) => Promise<readonly QueryResultRow[]>;

const TASK_COLUMNS = "id, owner_id, title, notes, course_label, due_at, created_at, completed_at";
const SESSION_COLUMNS = "id, owner_id, task_id, title, started_at, ended_at";

/**
 * Durable adapter. Every statement is parameterized and owner-scoped; the
 * application filter is required even though RLS also protects the tables.
 */
export function createPostgresStudyRepository(execute: QueryExecutor): StudyRepository {
  return {
    async listTasks(ownerId: UserId): Promise<readonly Task[]> {
      const rows = await execute(
        `select ${TASK_COLUMNS} from public.tasks where owner_id = $1 order by due_at asc`,
        [ownerId],
      );
      return rows.map(mapTaskRow);
    },

    async findTask(ownerId: UserId, taskId: TaskId): Promise<Task | null> {
      const rows = await execute(
        `select ${TASK_COLUMNS} from public.tasks where owner_id = $1 and id = $2 limit 1`,
        [ownerId, taskId],
      );
      const [row] = rows;
      return row === undefined ? null : mapTaskRow(row);
    },

    async saveTask(task: Task): Promise<void> {
      await execute(
        `insert into public.tasks (${TASK_COLUMNS})
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (id) do update set
           title = excluded.title,
           notes = excluded.notes,
           course_label = excluded.course_label,
           due_at = excluded.due_at,
           completed_at = excluded.completed_at
         where public.tasks.owner_id = excluded.owner_id`,
        [
          task.id,
          task.ownerId,
          task.title,
          task.notes,
          task.courseLabel,
          task.dueAt,
          task.createdAt,
          task.completedAt,
        ],
      );
    },

    async listSessions(ownerId: UserId): Promise<readonly StudySession[]> {
      const rows = await execute(
        `select ${SESSION_COLUMNS} from public.study_sessions
         where owner_id = $1 order by started_at desc`,
        [ownerId],
      );
      return rows.map(mapSessionRow);
    },

    async findSession(ownerId: UserId, sessionId: SessionId): Promise<StudySession | null> {
      const rows = await execute(
        `select ${SESSION_COLUMNS} from public.study_sessions
         where owner_id = $1 and id = $2 limit 1`,
        [ownerId, sessionId],
      );
      const [row] = rows;
      return row === undefined ? null : mapSessionRow(row);
    },

    async findActiveSession(ownerId: UserId): Promise<StudySession | null> {
      const rows = await execute(
        `select ${SESSION_COLUMNS} from public.study_sessions
         where owner_id = $1 and ended_at is null order by started_at desc limit 1`,
        [ownerId],
      );
      const [row] = rows;
      return row === undefined ? null : mapSessionRow(row);
    },

    async saveSession(session: StudySession): Promise<void> {
      await execute(
        `insert into public.study_sessions (${SESSION_COLUMNS})
         values ($1, $2, $3, $4, $5, $6)
         on conflict (id) do update set
           task_id = excluded.task_id,
           title = excluded.title,
           started_at = excluded.started_at,
           ended_at = excluded.ended_at
         where public.study_sessions.owner_id = excluded.owner_id`,
        [
          session.id,
          session.ownerId,
          session.taskId,
          session.title,
          session.startedAt,
          session.endedAt,
        ],
      );
    },
  };
}

/** Wraps driver errors so they never leak SQL details to the UI. */
export function createPgQueryExecutor(
  query: <T extends QueryResultRow>(
    sql: string,
    params: readonly unknown[],
  ) => Promise<readonly T[]>,
): QueryExecutor {
  return async (sql: string, params: readonly unknown[]): Promise<readonly QueryResultRow[]> => {
    try {
      return await query(sql, params);
    } catch {
      throw new StudyPersistenceError("Could not access study data. Please try again.");
    }
  };
}

function mapTaskRow(row: QueryResultRow): Task {
  return parseEntity(TaskSchema, {
    id: TaskIdSchema.parse(row.id),
    ownerId: UserIdSchema.parse(row.owner_id),
    title: row.title,
    notes: row.notes ?? null,
    courseLabel: row.course_label ?? null,
    dueAt: toIso(row.due_at),
    createdAt: toIso(row.created_at),
    completedAt: row.completed_at === null || row.completed_at === undefined
      ? null
      : toIso(row.completed_at),
  });
}

function mapSessionRow(row: QueryResultRow): StudySession {
  return parseEntity(StudySessionSchema, {
    id: SessionIdSchema.parse(row.id),
    ownerId: UserIdSchema.parse(row.owner_id),
    taskId: row.task_id === null || row.task_id === undefined
      ? null
      : TaskIdSchema.parse(row.task_id),
    title: row.title,
    startedAt: toIso(row.started_at),
    endedAt: row.ended_at === null || row.ended_at === undefined
      ? null
      : toIso(row.ended_at),
  });
}

function toIso(value: unknown): IsoDateTime {
  if (value instanceof Date) {
    return IsoDateTimeSchema.parse(value.toISOString());
  }

  if (typeof value === "string") {
    return IsoDateTimeSchema.parse(value);
  }

  throw new StudyPersistenceError("Invalid timestamp returned by the database.");
}

function parseEntity<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const detail = result.error.issues[0]?.message ?? "invalid shape";
    throw new StudyPersistenceError(`Unexpected study record: ${detail}`);
  }

  return result.data;
}
