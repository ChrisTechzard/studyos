import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Groups" };

export default function GroupsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Study Groups"
      title="Find your people. Study together."
      description="Groups are persistent academic communities with identity, roles, discussions, shared resources, and study sessions."
      planned={[
        "Create/join groups with academic identity",
        "Roles, rules, and moderation controls",
        "Structured discussions and group chat",
        "Shared files, sessions, and group calendar",
      ]}
    />
  );
}
