import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <ModulePlaceholder
      eyebrow="Profile"
      title="Your academic identity"
      description="Profiles anchor the StudyOS experience with university, programme, courses, interests, and learning preferences."
      planned={[
        "Student profile and academic context",
        "Course/programme affiliations",
        "Notification and privacy preferences",
        "Progress history and account settings",
      ]}
    />
  );
}
