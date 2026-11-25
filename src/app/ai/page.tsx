import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "AI" };

export default function AIPage() {
  return (
    <ModulePlaceholder
      eyebrow="AI Companion"
      title="An academic assistant with guardrails"
      description="The AI layer helps students understand, practice, plan, and retrieve trusted knowledge — with citations and academic-integrity boundaries."
      planned={[
        "Tutor chat with guided explanations",
        "Quiz, flashcard, and summary generation",
        "RAG over permitted documents with citations",
        "Usage limits, safety checks, and evals",
      ]}
    />
  );
}
