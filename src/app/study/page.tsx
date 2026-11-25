import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Study" };

export default function StudyPage() {
  return (
    <ModulePlaceholder
      eyebrow="Personal Study"
      title="Focus, plan, and make progress"
      description="Personal study mode gives students a distraction-light space to start sessions, track goals, capture notes, and build momentum."
      planned={[
        "Focus timer and Pomodoro sessions",
        "Personal study workspace and notes",
        "Goals, streaks, and progress tracking",
        "AI-assisted study prompts and summaries",
      ]}
    />
  );
}
