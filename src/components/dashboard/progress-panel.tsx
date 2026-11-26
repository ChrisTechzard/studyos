import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/format";
import type { StudyStats } from "@/modules/study/domain";

type Progress = {
  readonly label: string;
  readonly value: string;
  readonly percent: number;
};

export function ProgressPanel({ stats }: { readonly stats: StudyStats }) {
  const completionRate = stats.tasksDueToday === 0
    ? 0
    : Math.round((stats.tasksCompletedToday / stats.tasksDueToday) * 100);

  const rows: readonly Progress[] = [
    { label: "Tasks completed", value: `${stats.tasksCompletedToday}/${stats.tasksDueToday}`, percent: completionRate },
    { label: "Focus target", value: `${formatDuration(stats.focusMinutesToday)} / 60m`, percent: Math.round((stats.focusMinutesToday / 60) * 100) },
    { label: "Study streak", value: `${stats.streakDays} days`, percent: Math.round((stats.streakDays / 7) * 100) },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Today&apos;s Progress</h2>
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">Live</span>
      </div>
      <div className="space-y-4">
        {rows.map((row) => <ProgressRow key={row.label} {...row} />)}
      </div>
    </Card>
  );
}

function ProgressRow({ label, value, percent }: Progress) {
  const boundedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/60">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${boundedPercent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
