import { describe, expect, it } from "vitest";
import { SessionIdSchema, TaskIdSchema, getSessionDurationMinutes } from "@/modules/study/domain";
import {
  createInMemoryStudyRepository,
} from "@/modules/study/in-memory-repository";
import {
  createFixture,
  DAY_1,
  makeSession,
  makeTask,
  OWNER,
  START_OF_DAY,
  TODAY,
} from "@/modules/study/test-factory";

describe("StudyService dashboard", () => {
  it("returns zeroed stats and no active session for a new student", async () => {
    const { service } = createFixture();

    expect(await service.getDashboard(OWNER)).toEqual({
      ownerId: OWNER,
      generatedAt: START_OF_DAY.toISOString(),
      todayTasks: [],
      activeSession: null,
      stats: {
        tasksDueToday: 0,
        tasksCompletedToday: 0,
        focusMinutesToday: 0,
        streakDays: 0,
      },
    });
  });

  it("aggregates today's tasks, focus minutes, and consecutive-day streak", async () => {
    const { service } = createFixture({
      tasks: [
        makeTask({ id: TaskIdSchema.parse("task-a") }),
        makeTask({
          id: TaskIdSchema.parse("task-b"),
          title: "Yesterday task",
          dueAt: `${DAY_1}T08:30:00.000Z`,
          completedAt: `${TODAY}T09:45:00.000Z`,
        }),
        makeTask({
          id: TaskIdSchema.parse("task-c"),
          title: "Done today",
          completedAt: `${TODAY}T09:00:00.000Z`,
        }),
      ],
      sessions: [
        makeSession({ id: SessionIdSchema.parse("s-today") }),
        makeSession({
          id: SessionIdSchema.parse("s-yesterday"),
          startedAt: `${DAY_1}T08:00:00.000Z`,
          endedAt: `${DAY_1}T08:20:00.000Z`,
        }),
        makeSession({
          id: SessionIdSchema.parse("s-active"),
          startedAt: `${TODAY}T09:00:00.000Z`,
          endedAt: null,
        }),
      ],
    });

    const dashboard = await service.getDashboard(OWNER);

    expect(dashboard.todayTasks.map((task) => task.id)).toEqual(["task-a", "task-c"]);
    expect(dashboard.activeSession?.id).toBe("s-active");
    expect(dashboard.stats).toEqual({
      tasksDueToday: 2,
      tasksCompletedToday: 2,
      focusMinutesToday: 45,
      streakDays: 2,
    });
  });

  it("does not count a stale active session in focus minutes", async () => {
    const { service } = createFixture({
      sessions: [makeSession({ endedAt: null, startedAt: `${DAY_1}T08:00:00.000Z` })],
    });

    const dashboard = await service.getDashboard(OWNER);

    expect(dashboard.activeSession?.id).toBe("session-1");
    expect(dashboard.stats.focusMinutesToday).toBe(0);
  });
});

describe("domain helpers and repository isolation", () => {
  it("returns zero for sessions without a valid positive interval", () => {
    expect(getSessionDurationMinutes(makeSession({ endedAt: null }))).toBe(0);
    expect(
      getSessionDurationMinutes(makeSession({ endedAt: `${TODAY}T07:00:00.000Z` })),
    ).toBe(0);
  });

  it("clones stored entities so callers cannot mutate the repository", async () => {
    const repository = createInMemoryStudyRepository({ tasks: [makeTask()] });
    const loaded = await repository.findTask(OWNER, TaskIdSchema.parse("task-1"));

    if (loaded === null) {
      throw new Error("Expected seeded task to be present.");
    }

    loaded.title = "Mutated outside the domain";
    expect((await repository.findTask(OWNER, TaskIdSchema.parse("task-1")))?.title).toBe("Review notes");
  });
});
