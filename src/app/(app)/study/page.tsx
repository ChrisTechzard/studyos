import type { Metadata } from "next";
import { StudyWorkspace } from "@/components/study/study-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import { getStudyService } from "@/modules/study/server/instance";

export const metadata: Metadata = { title: "Study" };
export const dynamic = "force-dynamic";

export default async function StudyPage(): Promise<React.ReactNode> {
  const ownerId = await getAuthenticatedOwnerId();
  const dashboard = await getStudyService().getDashboard(ownerId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personal Study"
        title="Focus, plan, and make progress"
        description="Plan today's tasks and record focused work. Your data is saved to your authenticated account."
      />
      <StudyWorkspace dashboard={dashboard} />
    </div>
  );
}
