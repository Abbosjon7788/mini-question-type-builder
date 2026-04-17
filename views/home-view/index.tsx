"use client";

import { useQuestionsStore } from "@/lib/store/questions";

import { QuestionCard } from "./QuestionCard";

export function QuestionsList() {
  const questions = useQuestionsStore((s) => s.questions);

  return (
    <ul className="space-y-3">
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </ul>
  );
}

// ----------------------------------------------------------------------------
