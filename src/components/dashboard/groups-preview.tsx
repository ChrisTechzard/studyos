import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GroupSummary } from "@/modules/groups/domain";

export function GroupsPreview({ groups }: { readonly groups: readonly GroupSummary[] }) {
  const visible = groups.slice(0, 3);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Groups</h2>
        <Link href="/groups" className="text-sm font-medium text-primary hover:underline">See all</Link>
      </div>
      <ul className="space-y-3">
        {visible.length === 0 ? (
          <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No groups yet. Create or join one to see it here.
          </li>
        ) : (
          visible.map((group) => (
            <li key={group.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                {getInitials(group.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.level} · {group.memberCount} members
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
      <Link
        href="/groups"
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Users className="h-4 w-4" aria-hidden="true" />
        Manage groups
      </Link>
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
