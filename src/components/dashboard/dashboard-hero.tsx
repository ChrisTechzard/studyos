import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/format";
import type { StudyStats } from "@/modules/study/domain";

type DashboardHeroProps = {
  readonly stats: StudyStats;
  readonly pendingCount: number;
};

type Stat = {
  readonly label: string;
  readonly value: string;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly bg: string;
};

export function DashboardHero({ stats, pendingCount }: DashboardHeroProps) {
  const completionRate = stats.tasksDueToday === 0
    ? 0
    : Math.round((stats.tasksCompletedToday / stats.tasksDueToday) * 100);

  const heroStats: readonly Stat[] = [
    { label: "Study Streak", value: `${stats.streakDays} days`, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Focus Today", value: formatDuration(stats.focusMinutesToday), icon: Clock, color: "text-primary", bg: "bg-primary/10" },
    { label: "Tasks Done", value: `${stats.tasksCompletedToday}/${stats.tasksDueToday}`, icon: Target, color: "text-success", bg: "bg-success/10" },
    { label: "Task Completion", value: `${completionRate}%`, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 right-20 h-48 w-48 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Your academic command center
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to learn,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              let&apos;s make today count.
            </span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            You have {pendingCount} {pendingCount === 1 ? "task" : "tasks"} left today, with {formatDuration(stats.focusMinutesToday)} of focus already logged.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/study"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Open study workspace
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Brain className="h-4 w-4" aria-hidden="true" />
              Ask AI
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:w-72">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
              <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AiPreviewCard() {
  return (
    <Card className="relative overflow-hidden space-y-4">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/15 blur-2xl" aria-hidden="true" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Next Action</h2>
            <p className="text-xs text-muted-foreground">Module preview — AI companion arrives in 0.5</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Based on your upcoming study blocks, the companion will suggest one useful next step — a short review, practice set, or plan adjustment.
        </p>
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Planned capability</p>
          <p className="mt-1.5 text-sm text-foreground/80">
            &ldquo;Quiz me on linked lists with increasing difficulty and explain my mistakes.&rdquo;
          </p>
        </div>
        <Link
          href="/ai"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Open AI Companion
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
