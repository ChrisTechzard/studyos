import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatUtcTime } from "@/lib/format";
import type { Task } from "@/modules/study/domain";

export function ComingUp({ tasks }: { readonly tasks: readonly Task[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Coming Up</h2>
        <CalendarClock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming tasks today.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
            <UpcomingItem
              key={task.id}
              title={task.title}
              time={formatUtcTime(task.dueAt)}
              tag={task.courseLabel ?? "Personal"}
            />
          ))}
        </ul>
      )}
      <div className="rounded-xl border border-border bg-muted/20 p-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
          <span className="text-muted-foreground">Study domain tracking is live</span>
        </div>
      </div>
    </Card>
  );
}

function UpcomingItem({ title, time, tag }: { readonly title: string; readonly time: string; readonly tag: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-muted/40 text-center">
        <span className="text-[10px] font-semibold uppercase leading-none text-muted-foreground">Today</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{tag}</span>
    </li>
  );
}
