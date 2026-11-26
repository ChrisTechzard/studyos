import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const previewGroups = [
  { name: "GCTU CEN L200", initials: "GC", gradient: "from-primary to-blue-400" },
  { name: "Algorithms Study Circle", initials: "AS", gradient: "from-accent to-pink-400" },
] as const;

export function GroupsPreview() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Groups</h2>
        <Link href="/groups" className="text-sm font-medium text-primary hover:underline">See all</Link>
      </div>
      <ul className="space-y-3">
        {previewGroups.map((group) => (
          <li key={group.name} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${group.gradient} text-xs font-bold text-white`}>
              {group.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{group.name}</p>
              <p className="text-xs text-muted-foreground">Preview · group module in 0.3</p>
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
  );
}
