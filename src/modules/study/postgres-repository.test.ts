import { describe, expect, it } from "vitest";
import { SessionIdSchema, TaskIdSchema } from "@/modules/study/domain";
import { StudyPersistenceError } from "@/modules/study/errors";
import {
  createPgQueryExecutor,
  createPostgresStudyRepository,
  type QueryExecutor,
  type QueryResultRow,
} from "@/modules/study/postgres-repository";
import {
  makeSession,
  makeTask,
  OWNER,
  TODAY,
} from "@/modules/study/test-factory";

interface QueryCall {
  readonly sql: string;
  readonly params: readonly unknown[];
}

function createFake(responses: readonly (readonly QueryResultRow[])[] = []) {
  const calls: QueryCall[] = [];
  let index = 0;

  const execute: QueryExecutor = async (sql: string, params: readonly unknown[]) => {
    calls.push({ sql, params });
    const response = responses[index] ?? [];
    index += 1;
    return response;
  };

  return { repository: createPostgresStudyRepository(execute), calls };
}

function taskRow(overrides: QueryResultRow = {}): QueryResultRow {
  return {
    id: "task-1",
    owner_id: OWNER,
    title: "Review notes",
    notes: null,
    course_label: null,
    due_at: new Date(`${TODAY}T08:30:00.000Z`),
    created_at: new Date(`${TODAY}T07:00:00.000Z`),
    completed_at: null,
    ...overrides,
  };
}

describe("PostgresStudyRepository", () => {
  it("maps task rows and scopes list queries to the owner", async () => {
    const { repository, calls } = createFake([[taskRow()]]);

    const tasks = await repository.listTasks(OWNER);

    expect(calls[0]?.params).toEqual([OWNER]);
    expect(calls[0]?.sql).toContain("where owner_id = $1");
    expect(tasks[0]).toMatchObject({
      id: "task-1",
      title: "Review notes",
      dueAt: `${TODAY}T08:30:00.000Z`,
      completedAt: null,
    });
  });

  it("scopes single-record reads by owner and id", async () => {
    const { repository, calls } = createFake([[], []]);

    expect(await repository.findTask(OWNER, TaskIdSchema.parse("task-1"))).toBeNull();
    expect(await repository.findSession(OWNER, SessionIdSchema.parse("session-1"))).toBeNull();

    expect(calls[0]?.sql).toContain("owner_id = $1 and id = $2");
    expect(calls[0]?.params).toEqual([OWNER, "task-1"]);
    expect(calls[1]?.sql).toContain("owner_id = $1 and id = $2");
    expect(calls[1]?.params).toEqual([OWNER, "session-1"]);
  });

  it("finds at most one active session for the owner", async () => {
    const { repository, calls } = createFake([[]]);

    expect(await repository.findActiveSession(OWNER)).toBeNull();
    expect(calls[0]?.sql).toContain("ended_at is null");
    expect(calls[0]?.params).toEqual([OWNER]);
  });

  it("upserts tasks and sessions with an ownership guard", async () => {
    const { repository, calls } = createFake([[], []]);
    const task = makeTask();
    const session = makeSession();

    await repository.saveTask(task);
    await repository.saveSession(session);

    expect(calls[0]?.sql).toContain("public.tasks.owner_id = excluded.owner_id");
    expect(calls[0]?.params).toHaveLength(8);
    expect(calls[0]?.params).toContain(task.title);
    expect(calls[1]?.sql).toContain("public.study_sessions.owner_id = excluded.owner_id");
    expect(calls[1]?.params).toHaveLength(6);
  });

  it("rejects malformed rows with a typed persistence error", async () => {
    const { repository } = createFake([[taskRow({ title: 42 })]]);

    await expect(repository.listTasks(OWNER)).rejects.toBeInstanceOf(StudyPersistenceError);
  });

  it("hides driver errors behind a safe persistence message", async () => {
    const executor = createPgQueryExecutor(async () => {
      throw new Error("password authentication failed for user secret");
    });

    await expect(executor("select secret from hidden", [])).rejects.toMatchObject({
      code: "PERSISTENCE",
      message: "Could not access study data. Please try again.",
    });
  });
});
