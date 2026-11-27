"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { joinGroupAction } from "@/app/(app)/groups/actions";
import { INITIAL_GROUPS_ACTION_STATE } from "@/components/groups/action-state";
import { ActionFeedback } from "@/components/study/action-feedback";
import { Card } from "@/components/ui/card";

export function JoinGroupForm() {
  const [state, action, isPending] = useActionState(joinGroupAction, INITIAL_GROUPS_ACTION_STATE);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Join a group</h2>
        <p className="text-sm text-muted-foreground">Enter the 12-character invite code shared by a member.</p>
      </div>
      <form action={action} className="space-y-3">
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Invite code</span>
          <input
            name="inviteCode"
            required
            minLength={12}
            maxLength={24}
            placeholder="A1B2C3D4E5F6"
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm uppercase tracking-widest outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Joining..." : "Join group"}
        </button>
        <ActionFeedback state={state} />
      </form>
    </Card>
  );
}
