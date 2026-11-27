"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createGroupAction } from "@/app/(app)/groups/actions";
import { INITIAL_GROUPS_ACTION_STATE } from "@/components/groups/action-state";
import { ActionFeedback } from "@/components/study/action-feedback";
import { Card } from "@/components/ui/card";

const LEVELS = ["L100", "L200", "L300", "L400", "POSTGRAD"] as const;

export function CreateGroupForm() {
  const [state, action, isPending] = useActionState(createGroupAction, INITIAL_GROUPS_ACTION_STATE);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create a group</h2>
        <p className="text-sm text-muted-foreground">You become the owner and receive a one-time invite code.</p>
      </div>
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Group name</span>
          <input
            name="name"
            required
            minLength={3}
            maxLength={80}
            placeholder="e.g. Algorithms Study Circle"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Handle</span>
          <input
            name="handle"
            required
            minLength={3}
            maxLength={32}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="algorithms-circle"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Level</span>
          <select
            name="level"
            defaultValue="L200"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Course (optional)</span>
          <input
            name="courseLabel"
            maxLength={60}
            placeholder="e.g. CS 201"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Description (optional)</span>
          <input
            name="description"
            maxLength={500}
            placeholder="What will this group work on?"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Creating..." : "Create group"}
          </button>
        </div>
        <div className="sm:col-span-2">
          <ActionFeedback state={state} />
        </div>
      </form>
    </Card>
  );
}
