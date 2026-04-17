"use client";

import { ClozeRenderer } from "@/components/preview/ClozeRenderer";
import { useAttemptsStore } from "@/lib/store/attempts";
import { useState } from "react";
import { useQuestionsStore } from "@/lib/store/questions";
import { Button } from "@/components/Button";

export function Preview({ id }: { id: string }) {
  const question = useQuestionsStore((s) => s.getById(id))!;
  const clear = useAttemptsStore((s) => s.clear);
  const responses = useAttemptsStore((s) => s.responses[id]);
  const [showFeedback, setShowFeedback] = useState(false);

  const hasAnyAnswer = !!responses && Object.values(responses).some((v) => v.trim().length > 0);

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950">
        <ClozeRenderer question={question} showFeedback={showFeedback} />
        {question.caption && (
          <p className="mt-6 text-xs uppercase tracking-wide text-zinc-500">{question.caption}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" disabled={!hasAnyAnswer} onClick={() => setShowFeedback(true)}>
          Check answers
        </Button>
        <Button
          variant="outline"
          size="lg"
          disabled={!hasAnyAnswer}
          onClick={() => {
            clear(id);
            setShowFeedback(false);
          }}
        >
          Reset
        </Button>
      </div>

      {showFeedback && question.explanation && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/40">
          <h3 className="text-sm font-semibold mb-1">Explanation</h3>
          <ClozeRenderer question={{ ...question, content: question.explanation, blanks: [] }} />
        </div>
      )}
    </section>
  );
}
