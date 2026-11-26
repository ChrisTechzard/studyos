import { AiPreviewCard, DashboardHero } from "@/components/dashboard/dashboard-hero";
import { ComingUp } from "@/components/dashboard/coming-up";
import { GroupsPreview } from "@/components/dashboard/groups-preview";
import { ProgressPanel } from "@/components/dashboard/progress-panel";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import { getStudyService } from "@/modules/study/server/instance";

export const dynamic = "force-dynamic";

export default async function HomePage(): Promise<React.ReactNode> {
  const ownerId = await getAuthenticatedOwnerId();
  const dashboard = await getStudyService().getDashboard(ownerId);
  const pendingCount = Math.max(
    0,
    dashboard.stats.tasksDueToday - dashboard.stats.tasksCompletedToday,
  );

  return (
    <div className="space-y-6">
      <DashboardHero stats={dashboard.stats} pendingCount={pendingCount} />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <TodaysPlan tasks={dashboard.todayTasks} />
        <AiPreviewCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <GroupsPreview />
        <ProgressPanel stats={dashboard.stats} />
        <ComingUp tasks={dashboard.todayTasks} />
      </div>
    </div>
  );
}
