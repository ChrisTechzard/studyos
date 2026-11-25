import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  planned: string[];
};

export function ModulePlaceholder({ eyebrow, title, description, planned }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="relative space-y-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="inline-block h-px w-5 bg-primary/60" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Construction className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Planned for this module</h2>
            <p className="text-sm text-muted-foreground">Coming in future development phases</p>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {planned.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3.5 text-sm transition-colors hover:bg-muted/40"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-primary">Ground stage: </span>
          This route is scaffolded and ready for implementation in upcoming phases.
        </div>
      </Card>
    </div>
  );
}
