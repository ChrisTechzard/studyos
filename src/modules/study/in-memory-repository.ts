import type {
  SessionId,
  StudySession,
  Task,
  TaskId,
  UserId,
} from "@/modules/study/domain";
import type { StudyRepository } from "@/modules/study/ports";

export interface InMemorySeed {
  readonly tasks?: readonly Task[];
  readonly sessions?: readonly StudySession[];
}

/**
 * Development-only adapter. State is process-local and intentionally lost on
 * restart; swap for a Postgres adapter before any multi-instance deployment.
 */
export function createInMemoryStudyRepository(seed: InMemorySeed = {}): StudyRepository {
  const tasks = new Map<string, Task>();
  const sessions = new Map<string, StudySession>();

  for (const task of seed.tasks ?? []) {
    tasks.set(buildKey(task.ownerId, task.id), structuredClone(task));
  }

  for (const session of seed.sessions ?? []) {
    sessions.set(buildKey(session.ownerId, session.id), structuredClone(session));
  }

  return {
    async listTasks(ownerId: UserId): Promise<readonly Task[]> {
      return cloneValues(tasks, ownerId).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    },

    async findTask(ownerId: UserId, taskId: TaskId): Promise<Task | null> {
      return cloneOrNull(tasks.get(buildKey(ownerId, taskId)));
    },

    async saveTask(task: Task): Promise<void> {
      tasks.set(buildKey(task.ownerId, task.id), structuredClone(task));
    },

    async listSessions(ownerId: UserId): Promise<readonly StudySession[]> {
      return cloneValues(sessions, ownerId).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    },

    async findSession(ownerId: UserId, sessionId: SessionId): Promise<StudySession | null> {
      return cloneOrNull(sessions.get(buildKey(ownerId, sessionId)));
    },

    async findActiveSession(ownerId: UserId): Promise<StudySession | null> {
      const active = cloneValues(sessions, ownerId).find((session) => session.endedAt === null);
      return active ?? null;
    },

    async saveSession(session: StudySession): Promise<void> {
      sessions.set(buildKey(session.ownerId, session.id), structuredClone(session));
    },
  };
}

function buildKey(ownerId: string, entityId: string): string {
  return `${ownerId}:${entityId}`;
}

function cloneValues<T extends { readonly ownerId: string }>(store: Map<string, T>, ownerId: string): T[] {
  return [...store.values()]
    .filter((value) => value.ownerId === ownerId)
    .map((value) => structuredClone(value));
}

function cloneOrNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : structuredClone(value);
}
