import {
  CompleteTaskInputSchema,
  CreateTaskInputSchema,
  EndSessionInputSchema,
  SessionIdSchema,
  StartSessionInputSchema,
  StudyDashboardSchema,
  StudySessionSchema,
  TaskIdSchema,
  TaskSchema,
  UserIdSchema,
  getSessionDurationMinutes,
  getUtcDayKey,
  isTaskDone,
  type CompleteTaskInput,
  type CreateTaskInput,
  type EndSessionInput,
  type StudyDashboard,
  type StudySession,
  type StartSessionInput,
  type Task,
  type UserId,
} from "@/modules/study/domain";
import {
  assertNotFutureStart,
  assertValidEnd,
  requireActiveTask,
  requireNoActiveSession,
  requireSession,
  requireTask,
} from "@/modules/study/guards";
import type {
  Clock,
  IdGenerator,
  StudyRepository,
  StudyServiceDependencies,
} from "@/modules/study/ports";
import { computeStreakDays } from "@/modules/study/streak";
import { parseOrThrow } from "@/modules/study/validation";

/** Owns study business rules; the UI never mutates domain entities directly. */
export class StudyService {
  private readonly repository: StudyRepository;
  private readonly clock: Clock;
  private readonly idGenerator: IdGenerator;

  constructor(dependencies: StudyServiceDependencies) {
    this.repository = dependencies.repository;
    this.clock = dependencies.clock;
    this.idGenerator = dependencies.idGenerator;
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const data = parseOrThrow(CreateTaskInputSchema, input);
    const task = TaskSchema.parse({
      id: TaskIdSchema.parse(this.idGenerator.next()),
      ownerId: data.ownerId,
      title: data.title,
      notes: data.notes ?? null,
      courseLabel: data.courseLabel ?? null,
      dueAt: data.dueAt,
      createdAt: this.nowIso(),
      completedAt: null,
    });

    await this.repository.saveTask(task);
    return task;
  }

  async completeTask(input: CompleteTaskInput): Promise<Task> {
    const { ownerId, taskId } = parseOrThrow(CompleteTaskInputSchema, input);
    const task = await requireTask(this.repository, ownerId, taskId);

    if (isTaskDone(task)) {
      return task;
    }

    const completed: Task = TaskSchema.parse({ ...task, completedAt: this.nowIso() });
    await this.repository.saveTask(completed);
    return completed;
  }

  async startSession(input: StartSessionInput): Promise<StudySession> {
    const data = parseOrThrow(StartSessionInputSchema, input);

    if (data.taskId !== undefined) {
      await requireActiveTask(this.repository, data.ownerId, data.taskId);
    }

    await requireNoActiveSession(this.repository, data.ownerId);

    const startedAt = data.startedAt ?? this.nowIso();
    assertNotFutureStart(startedAt, this.clock.now());

    const session: StudySession = StudySessionSchema.parse({
      id: SessionIdSchema.parse(this.idGenerator.next()),
      ownerId: data.ownerId,
      taskId: data.taskId ?? null,
      title: data.title,
      startedAt,
      endedAt: null,
    });

    await this.repository.saveSession(session);
    return session;
  }

  async endSession(input: EndSessionInput): Promise<StudySession> {
    const data = parseOrThrow(EndSessionInputSchema, input);
    const session = await requireSession(this.repository, data.ownerId, data.sessionId);

    if (session.endedAt !== null) {
      return session;
    }

    const endedAt = data.endedAt ?? this.nowIso();
    assertValidEnd(session.startedAt, endedAt, this.clock.now());

    const ended: StudySession = StudySessionSchema.parse({ ...session, endedAt });
    await this.repository.saveSession(ended);
    return ended;
  }

  async getDashboard(ownerId: UserId): Promise<StudyDashboard> {
    const owner = parseOrThrow(UserIdSchema, ownerId);
    const [tasks, sessions] = await Promise.all([
      this.repository.listTasks(owner),
      this.repository.listSessions(owner),
    ]);

    const today = getUtcDayKey(this.clock.now());
    const todayTasks = tasks.filter((task) => getUtcDayKey(task.dueAt) === today);
    const tasksCompletedToday = tasks.filter(
      (task) => task.completedAt !== null && getUtcDayKey(task.completedAt) === today,
    ).length;
    const focusMinutesToday = sessions.reduce((total, session) => {
      const endedOnToday = session.endedAt !== null && getUtcDayKey(session.endedAt) === today;
      return total + (endedOnToday ? getSessionDurationMinutes(session) : 0);
    }, 0);

    return StudyDashboardSchema.parse({
      ownerId: owner,
      generatedAt: this.clock.now().toISOString(),
      todayTasks,
      activeSession: sessions.find((session) => session.endedAt === null) ?? null,
      stats: {
        tasksDueToday: todayTasks.length,
        tasksCompletedToday,
        focusMinutesToday,
        streakDays: computeStreakDays(sessions, today),
      },
    });
  }

  private nowIso(): string {
    return this.clock.now().toISOString();
  }
}
