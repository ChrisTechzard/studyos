import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  planned: string[];
};

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  planned,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Planned in this module
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {planned.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">
          This route is part of the StudyOS ground stage scaffold. Functionality will be
          implemented in phased releases.
        </p>
      </Card>
    </div>
  );
}
