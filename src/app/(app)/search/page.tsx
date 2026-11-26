import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <ModulePlaceholder
      eyebrow="Knowledge Search"
      title="Search people, knowledge, and activity"
      description="StudyOS search connects students to groups, documents, discussions, sessions, and trusted answers across their academic context."
      planned={[
        "Unified search across people, groups, and courses",
        "Document and discussion retrieval",
        "Session/event discovery",
        "Permission-aware AI answers with citations",
      ]}
    />
  );
}
