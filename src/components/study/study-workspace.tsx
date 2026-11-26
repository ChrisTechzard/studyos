"use client";

import { Check, Clock3, ListChecks } from "lucide-react";
import { AddTaskForm } from "@/components/study/add-task-form";
import { StatCard } from "@/components/study/action-feedback";
import { FocusSessionCard } from "@/components/study/focus-session-card";
import { TaskList } from "@/components/study/task-list";
import { formatDayKey, formatDuration } from "@/lib/format";
import type { StudyDashboard } from "@/modules/study/domain";

export function StudyWorkspace({ dashboard }: { readonly dashboard: StudyDashboard }) {
  const { stats } = dashboard;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={ListChecks} label="Tasks today" value={`${stats.tasksDueToday}`} />
        <StatCard icon={Check} label="Completed today" value={`${stats.tasksCompletedToday}`} />
        <StatCard icon={Clock3} label="Focus logged today" value={formatDuration(stats.focusMinutesToday)} />
      </div>

      <FocusSessionCard activeSession={dashboard.activeSession} />
      <TaskList tasks={dashboard.todayTasks} streakDays={stats.streakDays} />
      <AddTaskForm defaultDueAt={`${formatDayKey(dashboard.generatedAt)}T18:00`} />
    </div>
  );
}
