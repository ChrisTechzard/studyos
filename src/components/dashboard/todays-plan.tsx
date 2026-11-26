import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatUtcTime } from "@/lib/format";
import type { Task } from "@/modules/study/domain";

export function TodaysPlan({ tasks }: { readonly tasks: readonly Task[] }) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today&apos;s Plan</h2>
          <p className="text-sm text-muted-foreground">Your next meaningful actions</p>
        </div>
        <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">View all</Link>
      </div>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing due today. Add a task in the study workspace.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => <TaskItem key={task.id} task={task} />)}
        </ul>
      )}
      <Link
        href="/study"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add study block
      </Link>
    </Card>
  );
}

function TaskItem({ task }: { readonly task: Task }) {
  const isDone = task.completedAt !== null;

  return (
    <li className="group flex items-center gap-4 rounded-xl border border-border bg-muted/20 px-4 py-3.5 transition-colors hover:bg-muted/40">
      <div className={`h-10 w-1 rounded-full ${isDone ? "bg-success" : "bg-primary"} shrink-0`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`font-medium truncate ${isDone ? "text-muted-foreground line-through" : ""}`}>{task.title}</p>
        <p className="text-sm text-muted-foreground">{task.courseLabel ?? "Personal"}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-muted-foreground">{formatUtcTime(task.dueAt)}</p>
        {isDone ? <p className="text-xs text-success">Done</p> : null}
      </div>
    </li>
  );
}
