"use client";

import { CreateGroupForm } from "@/components/groups/create-group-form";
import { GroupList } from "@/components/groups/group-list";
import { JoinGroupForm } from "@/components/groups/join-group-form";
import type { GroupSummary } from "@/modules/groups/domain";

export function GroupWorkspace({ groups }: { readonly groups: readonly GroupSummary[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <CreateGroupForm />
        <JoinGroupForm />
      </div>
      <GroupList groups={groups} />
    </div>
  );
}
