import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GroupSummary } from "@/modules/groups/domain";

export function GroupList({ groups }: { readonly groups: readonly GroupSummary[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your groups</h2>
        <span className="text-xs text-muted-foreground">{groups.length} total</span>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <Users className="mx-auto mb-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium">No groups yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Create one or join with an invite code.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                href={{ pathname: `/groups/${group.handle}` }}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {getInitials(group.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{group.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.level}
                    {group.courseLabel ? ` · ${group.courseLabel}` : ""} · {group.memberCount} members
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.joinedAs}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}
