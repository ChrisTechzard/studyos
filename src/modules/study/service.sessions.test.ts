import { describe, expect, it } from "vitest";
import {
  SessionIdSchema,
  TaskIdSchema,
  getSessionDurationMinutes,
} from "@/modules/study/domain";
import {
  StudyConflictError,
  StudyNotFoundError,
  StudyValidationError,
} from "@/modules/study/errors";
import {
  createFixture,
  makeSession,
  makeTask,
  OWNER,
  TODAY,
} from "@/modules/study/test-factory";

describe("StudyService sessions", () => {
  it("rejects a second active session", async () => {
    const { service } = createFixture({ sessions: [makeSession({ endedAt: null })] });

    await expect(
      service.startSession({ ownerId: OWNER, title: "Another block" }),
    ).rejects.toBeInstanceOf(StudyConflictError);
  });

  it("rejects sessions linked to missing or completed tasks", async () => {
    const doneTask = makeTask({ completedAt: `${TODAY}T09:30:00.000Z` });
    const { service } = createFixture({ tasks: [doneTask] });

    await expect(
      service.startSession({ ownerId: OWNER, title: "Revision", taskId: doneTask.id }),
    ).rejects.toBeInstanceOf(StudyConflictError);

    await expect(
      service.startSession({
        ownerId: OWNER,
        title: "Revision",
        taskId: TaskIdSchema.parse("missing-task"),
      }),
    ).rejects.toBeInstanceOf(StudyNotFoundError);
  });

  it("rejects a future start time", async () => {
    const { service } = createFixture();

    await expect(
      service.startSession({
        ownerId: OWNER,
        title: "Future block",
        startedAt: "2026-11-27T08:00:00.000Z",
      }),
    ).rejects.toBeInstanceOf(StudyValidationError);
  });

  it("ends a session and remains idempotent", async () => {
    const active = makeSession({ endedAt: null, startedAt: `${TODAY}T09:00:00.000Z` });
    const { service, repository, setNow } = createFixture({ sessions: [active] });
    setNow(new Date(`${TODAY}T10:00:00.000Z`));

    const ended = await service.endSession({
      ownerId: OWNER,
      sessionId: active.id,
      endedAt: `${TODAY}T09:30:00.000Z`,
    });
    expect(getSessionDurationMinutes(ended)).toBe(30);

    const repeated = await service.endSession({ ownerId: OWNER, sessionId: active.id });
    expect(repeated.endedAt).toBe(ended.endedAt);
    expect(await repository.findActiveSession(OWNER)).toBeNull();
  });

  it("rejects invalid end times and unknown sessions", async () => {
    const active = makeSession({ endedAt: null, startedAt: `${TODAY}T09:00:00.000Z` });
    const { service } = createFixture({ sessions: [active] });

    await expect(
      service.endSession({
        ownerId: OWNER,
        sessionId: active.id,
        endedAt: `${TODAY}T09:00:00.000Z`,
      }),
    ).rejects.toBeInstanceOf(StudyValidationError);

    await expect(
      service.endSession({
        ownerId: OWNER,
        sessionId: active.id,
        endedAt: `${TODAY}T11:00:00.000Z`,
      }),
    ).rejects.toBeInstanceOf(StudyValidationError);

    await expect(
      service.endSession({
        ownerId: OWNER,
        sessionId: SessionIdSchema.parse("missing-session"),
      }),
    ).rejects.toBeInstanceOf(StudyNotFoundError);
  });
});
