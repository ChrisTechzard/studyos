"use server";

import { revalidatePath } from "next/cache";
import type { StudyActionState } from "@/components/study/action-state";
import { TaskIdSchema, SessionIdSchema } from "@/modules/study/domain";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import { toSafeErrorMessage } from "@/modules/study/errors";
import { getStudyService } from "@/modules/study/server/instance";

export async function createTaskAction(
  _previous: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const title = readFormString(formData, "title");
  const notes = readFormString(formData, "notes");
  const dueAt = toIsoString(readFormString(formData, "dueAt"));
  const ownerId = await getAuthenticatedOwnerId();

  try {
    await getStudyService().createTask({
      ownerId,
      title,
      notes: notes.length > 0 ? notes : undefined,
      dueAt,
    });
    revalidateStudyPages();
    return { status: "success", message: "Task added to today's plan." };
  } catch (error: unknown) {
    return { status: "error", message: toSafeErrorMessage(error) };
  }
}

export async function completeTaskAction(
  _previous: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const taskId = readFormString(formData, "taskId");
  const ownerId = await getAuthenticatedOwnerId();

  try {
    await getStudyService().completeTask({
      ownerId,
      taskId: TaskIdSchema.parse(taskId),
    });
    revalidateStudyPages();
    return { status: "success", message: "Task completed." };
  } catch (error: unknown) {
    return { status: "error", message: toSafeErrorMessage(error) };
  }
}

export async function startSessionAction(
  _previous: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const title = readFormString(formData, "title");
  const ownerId = await getAuthenticatedOwnerId();

  try {
    await getStudyService().startSession({ ownerId, title });
    revalidateStudyPages();
    return { status: "success", message: "Focus session started." };
  } catch (error: unknown) {
    return { status: "error", message: toSafeErrorMessage(error) };
  }
}

export async function endSessionAction(
  _previous: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const sessionId = readFormString(formData, "sessionId");
  const ownerId = await getAuthenticatedOwnerId();

  try {
    await getStudyService().endSession({
      ownerId,
      sessionId: SessionIdSchema.parse(sessionId),
    });
    revalidateStudyPages();
    return { status: "success", message: "Focus session recorded." };
  } catch (error: unknown) {
    return { status: "error", message: toSafeErrorMessage(error) };
  }
}

function revalidateStudyPages(): void {
  revalidatePath("/");
  revalidatePath("/study");
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toIsoString(localDateTime: string): string {
  if (localDateTime.length === 0) {
    return "";
  }

  const parsed = new Date(localDateTime);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}
