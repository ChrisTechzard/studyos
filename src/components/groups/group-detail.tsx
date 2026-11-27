import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { GroupDetail } from "@/modules/groups/domain";

export function GroupDetailView({ detail }: { readonly detail: GroupDetail }) {
  const { group, members } = detail;

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {group.level}
          </span>
          {group.courseLabel ? (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {group.courseLabel}
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">@{group.handle}</span>
        </div>
        {group.description ? (
          <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description yet.</p>
        )}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Members</h2>
          <span className="text-xs text-muted-foreground">{members.length} total</span>
        </div>
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              <span className="truncate text-sm font-medium">{member.userId}</span>
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Link href="/groups" className="inline-block text-sm font-medium text-primary hover:underline">
        Back to all groups
      </Link>
    </div>
  );
}
