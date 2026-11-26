import { describe, expect, it } from "vitest";
import { TaskIdSchema } from "@/modules/study/domain";
import { StudyNotFoundError, StudyValidationError } from "@/modules/study/errors";
import {
  createFixture,
  makeTask,
  OTHER_OWNER,
  OWNER,
  START_OF_DAY,
  TODAY,
} from "@/modules/study/test-factory";

describe("StudyService tasks", () => {
  it("creates a validated task with server-owned timestamps and ids", async () => {
    const { service, repository } = createFixture();

    const task = await service.createTask({
      ownerId: OWNER,
      title: "  Review linked lists  ",
      notes: "  chapters 3-4  ",
      dueAt: `${TODAY}T09:00:00.000Z`,
    });

    expect(task).toMatchObject({
      id: "generated-1",
      title: "Review linked lists",
      notes: "chapters 3-4",
      courseLabel: null,
      createdAt: START_OF_DAY.toISOString(),
      completedAt: null,
    });
    expect(await repository.findTask(OWNER, task.id)).toEqual(task);
  });

  it("rejects invalid input before touching the repository", async () => {
    const { service, repository } = createFixture();

    await expect(
      service.createTask({ ownerId: OWNER, title: "   ", dueAt: `${TODAY}T09:00:00.000Z` }),
    ).rejects.toBeInstanceOf(StudyValidationError);

    await expect(
      service.createTask({ ownerId: OWNER, title: "Valid", dueAt: "not-a-date" }),
    ).rejects.toBeInstanceOf(StudyValidationError);

    expect(await repository.listTasks(OWNER)).toHaveLength(0);
  });

  it("completes a task once and stays idempotent", async () => {
    const task = makeTask();
    const { service, repository } = createFixture({ tasks: [task] });

    const completed = await service.completeTask({ ownerId: OWNER, taskId: task.id });
    expect(completed.completedAt).toBe(START_OF_DAY.toISOString());

    const repeated = await service.completeTask({ ownerId: OWNER, taskId: task.id });
    expect(repeated.completedAt).toBe(completed.completedAt);
    expect(await repository.listTasks(OWNER)).toHaveLength(1);
  });

  it("does not expose or mutate another owner's tasks", async () => {
    const { service } = createFixture({ tasks: [makeTask()] });

    await expect(
      service.completeTask({ ownerId: OTHER_OWNER, taskId: TaskIdSchema.parse("task-1") }),
    ).rejects.toBeInstanceOf(StudyNotFoundError);
    expect(await service.getDashboard(OTHER_OWNER)).toMatchObject({
      stats: { tasksDueToday: 0, tasksCompletedToday: 0 },
    });
  });
});
