import {
  SessionIdSchema,
  StudySessionSchema,
  TaskIdSchema,
  TaskSchema,
  UserIdSchema,
  type StudySession,
  type Task,
} from "@/modules/study/domain";
import {
  createInMemoryStudyRepository,
  type InMemorySeed,
} from "@/modules/study/in-memory-repository";
import type { StudyRepository, StudyServiceDependencies } from "@/modules/study/ports";
import { StudyService } from "@/modules/study/service";

export interface StudyFixture {
  readonly service: StudyService;
  readonly repository: StudyRepository;
  readonly setNow: (value: Date) => void;
}

export const OWNER = UserIdSchema.parse("student-1");
export const OTHER_OWNER = UserIdSchema.parse("student-2");
export const START_OF_DAY = new Date("2026-11-26T10:00:00.000Z");
export const DAY_1 = "2026-11-25";
export const TODAY = "2026-11-26";

export function createFixture(seed: InMemorySeed = {}): StudyFixture {
  const repository = createInMemoryStudyRepository(seed);
  let currentNow = START_OF_DAY;
  let idCount = 0;

  const dependencies: StudyServiceDependencies = {
    repository,
    clock: { now: () => currentNow },
    idGenerator: { next: () => `generated-${++idCount}` },
  };

  return {
    service: new StudyService(dependencies),
    repository,
    setNow: (value: Date): void => {
      currentNow = value;
    },
  };
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return TaskSchema.parse({
    id: TaskIdSchema.parse("task-1"),
    ownerId: OWNER,
    title: "Review notes",
    notes: null,
    courseLabel: null,
    dueAt: `${TODAY}T08:30:00.000Z`,
    createdAt: `${DAY_1}T10:00:00.000Z`,
    completedAt: null,
    ...overrides,
  });
}

export function makeSession(overrides: Partial<StudySession> = {}): StudySession {
  return StudySessionSchema.parse({
    id: SessionIdSchema.parse("session-1"),
    ownerId: OWNER,
    taskId: null,
    title: "Focus block",
    startedAt: `${TODAY}T08:00:00.000Z`,
    endedAt: `${TODAY}T08:45:00.000Z`,
    ...overrides,
  });
}
