import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <ModulePlaceholder
      eyebrow="Calendar & Planner"
      title="Turn time into study progress"
      description="The academic calendar connects classes, study blocks, group sessions, deadlines, and exam plans into one actionable schedule."
      planned={[
        "Timetable and personal study blocks",
        "Group sessions and deadline tracking",
        "Exam planner with adaptive revision plans",
        "Reminders and calendar integrations later",
      ]}
    />
  );
}
