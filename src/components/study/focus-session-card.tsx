"use client";

import { useActionState } from "react";
import { Play, Square, Timer } from "lucide-react";
import {
  endSessionAction,
  startSessionAction,
} from "@/app/(app)/study/actions";
import {
  ActionFeedback,
} from "@/components/study/action-feedback";
import { INITIAL_STUDY_ACTION_STATE } from "@/components/study/action-state";
import { Card } from "@/components/ui/card";
import { formatUtcTime } from "@/lib/format";
import type { StudySession } from "@/modules/study/domain";

type FocusSessionCardProps = {
  readonly activeSession: StudySession | null;
};

export function FocusSessionCard({ activeSession }: FocusSessionCardProps) {
  const [startState, startAction, isStarting] = useActionState(
    startSessionAction,
    INITIAL_STUDY_ACTION_STATE,
  );
  const [endState, endAction, isEnding] = useActionState(
    endSessionAction,
    INITIAL_STUDY_ACTION_STATE,
  );

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Timer className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Focus session</h2>
          <p className="text-sm text-muted-foreground">One session at a time, so the block stays intentional.</p>
        </div>
      </div>

      {activeSession === null ? (
        <StartForm state={startState} action={startAction} isPending={isStarting} />
      ) : (
        <ActiveSession
          session={activeSession}
          state={endState}
          action={endAction}
          isPending={isEnding}
        />
      )}
    </Card>
  );
}

type FormProps = {
  readonly state: typeof INITIAL_STUDY_ACTION_STATE;
  readonly action: (formData: FormData) => void;
  readonly isPending: boolean;
};

function StartForm({ state, action, isPending }: FormProps) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 space-y-1.5 text-sm">
        <span className="font-medium">What are you working on?</span>
        <input
          name="title"
          required
          maxLength={120}
          placeholder="e.g. Linked lists practice"
          className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Starting..." : "Start focus"}
      </button>
      <ActionFeedback state={state} />
    </form>
  );
}

type ActiveSessionProps = FormProps & {
  readonly session: StudySession;
};

function ActiveSession({ session, state, action, isPending }: ActiveSessionProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">Session in progress</p>
        <p className="mt-1 font-medium">{session.title}</p>
        <p className="text-sm text-muted-foreground">Started {formatUtcTime(session.startedAt)}</p>
      </div>
      <form action={action}>
        <input type="hidden" name="sessionId" value={session.id} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Square className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Saving..." : "Finish session"}
        </button>
      </form>
      <ActionFeedback state={state} />
    </div>
  );
}
