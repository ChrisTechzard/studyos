import type { Metadata } from "next";
import { GroupWorkspace } from "@/components/groups/group-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import { getGroupService } from "@/modules/groups/server/instance";

export const metadata: Metadata = { title: "Groups" };
export const dynamic = "force-dynamic";

export default async function GroupsPage(): Promise<React.ReactNode> {
  const actorId = await getAuthenticatedOwnerId();
  const groups = await getGroupService().listGroups(actorId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Groups"
        title="Find your people. Study together."
        description="Create a persistent study community or join one with an invite code. Membership is saved to your authenticated account."
      />
      <GroupWorkspace groups={groups} />
    </div>
  );
}
