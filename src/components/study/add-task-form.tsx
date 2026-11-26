"use client";

import { useActionState } from "react";
import { ListChecks } from "lucide-react";
import { createTaskAction } from "@/app/(app)/study/actions";
import { ActionFeedback } from "@/components/study/action-feedback";
import { INITIAL_STUDY_ACTION_STATE } from "@/components/study/action-state";
import { Card } from "@/components/ui/card";

export function AddTaskForm({ defaultDueAt }: { readonly defaultDueAt: string }) {
  const [state, action, isPending] = useActionState(createTaskAction, INITIAL_STUDY_ACTION_STATE);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Add a task</h2>
        <p className="text-sm text-muted-foreground">Tasks are validated by the study domain before they are saved.</p>
      </div>
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Title</span>
          <input
            name="title"
            required
            maxLength={120}
            placeholder="e.g. Revise chapter 4"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Due (UTC)</span>
          <input
            name="dueAt"
            type="datetime-local"
            required
            defaultValue={defaultDueAt}
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="space-y-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Notes (optional)</span>
          <input
            name="notes"
            maxLength={2000}
            placeholder="Scope, page numbers, or a reminder"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Adding..." : "Add task"}
          </button>
        </div>
        <div className="sm:col-span-2">
          <ActionFeedback state={state} />
        </div>
      </form>
    </Card>
  );
}
