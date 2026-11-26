import type {
  SessionId,
  StudySession,
  Task,
  TaskId,
  UserId,
} from "@/modules/study/domain";

export interface StudyRepository {
  listTasks(ownerId: UserId): Promise<readonly Task[]>;
  findTask(ownerId: UserId, taskId: TaskId): Promise<Task | null>;
  saveTask(task: Task): Promise<void>;
  listSessions(ownerId: UserId): Promise<readonly StudySession[]>;
  findSession(ownerId: UserId, sessionId: SessionId): Promise<StudySession | null>;
  findActiveSession(ownerId: UserId): Promise<StudySession | null>;
  saveSession(session: StudySession): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  next(): string;
}

export interface StudyServiceDependencies {
  readonly repository: StudyRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}
