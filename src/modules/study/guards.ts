import {
  isTaskDone,
  type SessionId,
  type StudySession,
  type Task,
  type TaskId,
  type UserId,
} from "@/modules/study/domain";
import {
  StudyConflictError,
  StudyNotFoundError,
  StudyValidationError,
} from "@/modules/study/errors";
import type { StudyRepository } from "@/modules/study/ports";

export async function requireTask(
  repository: StudyRepository,
  ownerId: UserId,
  taskId: TaskId,
): Promise<Task> {
  const task = await repository.findTask(ownerId, taskId);

  if (task === null) {
    throw new StudyNotFoundError("Task not found.");
  }

  return task;
}

export async function requireActiveTask(
  repository: StudyRepository,
  ownerId: UserId,
  taskId: TaskId,
): Promise<Task> {
  const task = await requireTask(repository, ownerId, taskId);

  if (isTaskDone(task)) {
    throw new StudyConflictError("Cannot start a session for a completed task.");
  }

  return task;
}

export async function requireSession(
  repository: StudyRepository,
  ownerId: UserId,
  sessionId: SessionId,
): Promise<StudySession> {
  const session = await repository.findSession(ownerId, sessionId);

  if (session === null) {
    throw new StudyNotFoundError("Focus session not found.");
  }

  return session;
}

export async function requireNoActiveSession(
  repository: StudyRepository,
  ownerId: UserId,
): Promise<void> {
  const active = await repository.findActiveSession(ownerId);

  if (active !== null) {
    throw new StudyConflictError("Finish your active focus session before starting another.");
  }
}

export function assertNotFutureStart(startedAt: string, now: Date): void {
  if (Date.parse(startedAt) > now.getTime()) {
    throw new StudyValidationError("A session cannot start in the future.");
  }
}

export function assertValidEnd(startedAt: string, endedAt: string, now: Date): void {
  const endTime = Date.parse(endedAt);

  if (!Number.isFinite(endTime) || endTime <= Date.parse(startedAt)) {
    throw new StudyValidationError("End time must be after the session start.");
  }

  if (endTime > now.getTime()) {
    throw new StudyValidationError("A session cannot end in the future.");
  }
}
