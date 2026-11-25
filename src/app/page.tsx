import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const todayPlan = [
  { title: "Review Data Structures notes", time: "08:30 - 09:30", type: "Personal study" },
  { title: "Computer Architecture group session", time: "14:00 - 15:30", type: "Group" },
  { title: "Prepare quiz for Linear Algebra", time: "19:00 - 19:45", type: "AI-assisted" },
] as const;

const groups = [
  { name: "GCTU CEN L200", detail: "12 members • Next session today", status: "Active" },
  { name: "Algorithms Study Circle", detail: "8 members • 2 unread discussions", status: "New activity" },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="StudyOS Dashboard"
        title="What do you want to study today?"
        description="A calm academic home for planning, focus, collaboration, and AI-assisted learning. This ground stage sets the foundation for the full StudyOS product."
        action={
          <Link
            href="/study"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start study session
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Today&apos;s plan</h2>
              <p className="text-sm text-muted-foreground">Your next meaningful study actions.</p>
            </div>
            <CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <ul className="space-y-3">
            {todayPlan.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">AI next action</h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Based on your upcoming Data Structures session, review linked lists and generate 5
            practice questions before your group meets.
          </p>
          <div className="rounded-xl bg-primary/10 p-4">
            <p className="text-sm font-medium">Suggested prompt</p>
            <p className="mt-1 text-sm text-muted-foreground">
              “Quiz me on linked lists with increasing difficulty and explain mistakes.”
            </p>
          </div>
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Open AI companion
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Active groups</h2>
          </div>
          <ul className="space-y-3">
            {groups.map((group) => (
              <li key={group.name} className="rounded-xl border border-border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{group.name}</p>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {group.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{group.detail}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Progress snapshot</h2>
          </div>
          <div className="space-y-3">
            <ProgressRow label="Weekly study goal" value="3 / 5 sessions" percent={60} />
            <ProgressRow label="Assignments on track" value="4 / 6 tasks" percent={67} />
            <ProgressRow label="Group participation" value="2 active groups" percent={50} />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Foundation status</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-success">●</span> Product blueprint captured in docs</li>
            <li className="flex gap-2"><span className="text-success">●</span> App shell and navigation scaffolded</li>
            <li className="flex gap-2"><span className="text-warning">●</span> Auth, data, and AI integrations planned</li>
            <li className="flex gap-2"><span className="text-warning">●</span> Module implementations pending</li>
          </ul>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <Brain className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
            Next up: auth, database schema, and the first real personal-study vertical slice.
          </div>
        </Card>
      </div>
    </div>
  );
}

type ProgressRowProps = {
  label: string;
  value: string;
  percent: number;
};

function ProgressRow({ label, value, percent }: ProgressRowProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
