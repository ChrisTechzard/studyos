"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { regenerateInviteCodeAction } from "@/app/(app)/groups/actions";
import { INITIAL_GROUPS_ACTION_STATE } from "@/components/groups/action-state";
import { ActionFeedback } from "@/components/study/action-feedback";
import { Card } from "@/components/ui/card";
import type { GroupId } from "@/modules/groups/domain";

export function RegenerateInviteCodeForm({ groupId }: { readonly groupId: GroupId }) {
  const [state, action, isPending] = useActionState(
    regenerateInviteCodeAction,
    INITIAL_GROUPS_ACTION_STATE,
  );

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Invite people</h2>
        <p className="text-sm text-muted-foreground">
          Rotating invalidates the previous code. Only the owner can rotate it.
        </p>
      </div>
      <form action={action} className="space-y-3">
        <input type="hidden" name="groupId" value={groupId} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Generating..." : "Generate new invite code"}
        </button>
        <ActionFeedback state={state} />
      </form>
    </Card>
  );
}
