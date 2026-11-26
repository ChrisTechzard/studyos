import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyActionState } from "@/components/study/action-state";

export function ActionFeedback({ state }: { readonly state: StudyActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={cn("text-sm", state.status === "error" ? "text-danger" : "text-success")}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
