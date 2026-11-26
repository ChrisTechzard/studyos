import { getUtcDayKey, type StudySession } from "@/modules/study/domain";

/** Consecutive UTC days with at least one completed focus session. */
export function computeStreakDays(
  sessions: readonly StudySession[],
  todayKey: string,
): number {
  const daysWithSessions = new Set(
    sessions.flatMap((session) =>
      session.endedAt === null ? [] : [getUtcDayKey(session.endedAt)],
    ),
  );

  if (daysWithSessions.size === 0) {
    return 0;
  }

  const cursor = new Date(`${todayKey}T00:00:00.000Z`);

  if (!daysWithSessions.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;

  while (daysWithSessions.has(getUtcDayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}
