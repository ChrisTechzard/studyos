import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GroupDetailView } from "@/components/groups/group-detail";
import { RegenerateInviteCodeForm } from "@/components/groups/regenerate-invite-code-form";
import { PageHeader } from "@/components/ui/page-header";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import type { GroupDetail } from "@/modules/groups/domain";
import { GroupNotFoundError } from "@/modules/groups/errors";
import { getGroupService } from "@/modules/groups/server/instance";

export const metadata: Metadata = { title: "Group" };
export const dynamic = "force-dynamic";

interface GroupDetailPageProps {
  readonly params: Promise<{ readonly handle: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps): Promise<React.ReactNode> {
  const { handle } = await params;
  const actorId = await getAuthenticatedOwnerId();

  let detail: GroupDetail;
  try {
    detail = await getGroupService().getGroupDetail({
      actorId,
      handle: handle.toLowerCase(),
    });
  } catch (error: unknown) {
    if (error instanceof GroupNotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study Group"
        title={detail.group.name}
        description="Membership, level, and course context for this study community."
      />
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <GroupDetailView detail={detail} />
        <RegenerateInviteCodeForm groupId={detail.group.id} />
      </div>
    </div>
  );
}
