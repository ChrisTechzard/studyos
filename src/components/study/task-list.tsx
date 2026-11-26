"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { completeTaskAction } from "@/app/(app)/study/actions";
import { INITIAL_STUDY_ACTION_STATE } from "@/components/study/action-state";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatUtcTime } from "@/lib/format";
import type { Task } from "@/modules/study/domain";

type TaskListProps = {
  readonly tasks: readonly Task[];
  readonly streakDays: number;
};

export function TaskList({ tasks, streakDays }: TaskListProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today&apos;s tasks</h2>
          <p className="text-sm text-muted-foreground">Due today (UTC)</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {streakDays} day streak
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No tasks due today. Add one below to start your plan.
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => <TaskRow key={task.id} task={task} />)}
        </ul>
      )}
    </Card>
  );
}

function TaskRow({ task }: { readonly task: Task }) {
  const [state, action, isPending] = useActionState(completeTaskAction, INITIAL_STUDY_ACTION_STATE);
  const isDone = task.completedAt !== null;

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium", isDone && "text-muted-foreground line-through")}>{task.title}</p>
        <p className="text-sm text-muted-foreground">
          {task.courseLabel ?? "Personal"} · {formatUtcTime(task.dueAt)}
        </p>
      </div>
      {isDone ? (
        <span className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-success">
          <Check className="h-4 w-4" aria-hidden="true" />
          Done
        </span>
      ) : (
        <form action={action}>
          <input type="hidden" name="taskId" value={task.id} />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Mark done"}
          </button>
        </form>
      )}
      {state.status === "error" ? (
        <p className="text-sm text-danger" role="alert">{state.message}</p>
      ) : null}
    </li>
  );
}
