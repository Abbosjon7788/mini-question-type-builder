"use client";

import { useQuestionsStore } from "@/lib/store/questions";
import { QuestionCard } from "./QuestionCard";

export function QuestionsList() {
  const problems = useQuestionsStore((s) => s.question.problems);

  return (
    <ul className="space-y-3">
      {problems.map((p) => (
        <QuestionCard key={p.id} problem={p} />
      ))}
    </ul>
  );
}
