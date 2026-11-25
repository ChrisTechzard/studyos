import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const todayPlan = [
  { title: "Review Data Structures notes", time: "08:30 – 09:30", type: "Personal", color: "bg-primary" },
  { title: "Computer Architecture group session", time: "14:00 – 15:30", type: "Group", color: "bg-accent" },
  { title: "Prepare quiz for Linear Algebra", time: "19:00 – 19:45", type: "AI-assisted", color: "bg-success" },
] as const;

const groups = [
  { name: "GCTU CEN L200", members: 12, detail: "Next session today", initials: "GC", gradient: "from-primary to-blue-400" },
  { name: "Algorithms Study Circle", members: 8, detail: "2 unread discussions", initials: "AS", gradient: "from-accent to-pink-400" },
] as const;

const stats = [
  { label: "Study Streak", value: "7 days", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Hours This Week", value: "12.5h", icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  { label: "Tasks Done", value: "18/24", icon: Target, color: "text-success", bg: "bg-success/10" },
  { label: "Focus Score", value: "92%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
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
                Chris?
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              You have 3 tasks today, a group session at 2 PM, and your Data Structures exam is in 5 days. Let&apos;s make it count.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/study"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Start studying
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
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
                <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} aria-hidden="true" />
                </div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* Today's plan */}
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Today&apos;s Plan</h2>
              <p className="text-sm text-muted-foreground">Your next meaningful actions</p>
            </div>
            <Link href="/calendar" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <ul className="space-y-3">
            {todayPlan.map((item) => (
              <li
                key={item.title}
                className="group flex items-center gap-4 rounded-xl border border-border bg-muted/20 px-4 py-3.5 transition-colors hover:bg-muted/40"
              >
                <div className={`h-10 w-1 rounded-full ${item.color} shrink-0`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-muted-foreground">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add study block
          </button>
        </Card>

        {/* AI suggestion */}
        <Card className="relative overflow-hidden space-y-4">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/15 blur-2xl" aria-hidden="true" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Next Action</h2>
                <p className="text-xs text-muted-foreground">Personalized for you</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Based on your upcoming Data Structures session, review linked lists and generate 5 practice questions before your group meets.
            </p>
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Suggested prompt</p>
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
      </div>

      {/* Bottom grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Groups */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Groups</h2>
            <Link href="/groups" className="text-sm font-medium text-primary hover:underline">See all</Link>
          </div>
          <ul className="space-y-3">
            {groups.map((g) => (
              <li key={g.name} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${g.gradient} text-xs font-bold text-white`}>
                  {g.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.members} members · {g.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/groups"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Discover groups
          </Link>
        </Card>

        {/* Progress */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekly Progress</h2>
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">On track</span>
          </div>
          <div className="space-y-4">
            <ProgressRow label="Study sessions" value="3 / 5" percent={60} />
            <ProgressRow label="Assignments" value="4 / 6" percent={67} />
            <ProgressRow label="Group participation" value="2 / 4" percent={50} />
            <ProgressRow label="AI practice quizzes" value="5 / 5" percent={100} />
          </div>
        </Card>

        {/* Upcoming / status */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Coming Up</h2>
            <CalendarClock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <ul className="space-y-3">
            <UpcomingItem day="Today" title="Computer Architecture" time="2:00 PM" tag="Group" />
            <UpcomingItem day="Tomorrow" title="Data Structures Exam Prep" time="10:00 AM" tag="Personal" />
            <UpcomingItem day="Fri" title="Linear Algebra Quiz" time="9:00 AM" tag="Exam" />
          </ul>
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              <span className="text-muted-foreground">Foundation scaffold complete</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted/60">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function UpcomingItem({ day, title, time, tag }: { day: string; title: string; time: string; tag: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-muted/40 text-center">
        <span className="text-[10px] font-semibold uppercase leading-none text-muted-foreground">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{tag}</span>
    </li>
  );
}
