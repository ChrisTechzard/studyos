import { describe, expect, it } from "vitest";
import { isTaskDone } from "@/modules/study/domain";
import { createFixture, OWNER, TODAY } from "@/modules/study/test-factory";

describe("personal study flow", () => {
  it("moves a task from planned to complete with an attached focus session", async () => {
    const { service, setNow } = createFixture();

    const task = await service.createTask({
      ownerId: OWNER,
      title: "Revise linked lists",
      dueAt: `${TODAY}T09:00:00.000Z`,
    });
    const session = await service.startSession({
      ownerId: OWNER,
      title: "Linked lists practice",
      taskId: task.id,
      startedAt: `${TODAY}T09:00:00.000Z`,
    });

    const completedTask = await service.completeTask({ ownerId: OWNER, taskId: task.id });
    setNow(new Date(`${TODAY}T09:40:00.000Z`));
    const endedSession = await service.endSession({ ownerId: OWNER, sessionId: session.id });
    const dashboard = await service.getDashboard(OWNER);

    expect(isTaskDone(completedTask)).toBe(true);
    expect(endedSession.endedAt).toBe(`${TODAY}T09:40:00.000Z`);
    expect(dashboard.todayTasks).toEqual([completedTask]);
    expect(dashboard.activeSession).toBeNull();
    expect(dashboard.stats).toEqual({
      tasksDueToday: 1,
      tasksCompletedToday: 1,
      focusMinutesToday: 40,
      streakDays: 1,
    });
  });
});
