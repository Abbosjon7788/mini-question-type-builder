"use client";

import { useAttemptsStore } from "@/lib/store/attempts";
import { isCorrect } from "@/helpers";
import type { Blank } from "@/lib/schema";
import { useMemo } from "react";

interface Props {
  questionId: string;
  blank: Blank | undefined;
  blankId: string;
  showFeedback?: boolean;
}

// -------------------------------------------------------------------------------------------------

const base =
  "inline-block mx-1 px-2 py-0.5 rounded-md border text-sm align-baseline min-w-20 outline-none focus:ring-2 focus:ring-offset-1 transition-colors";

// -------------------------------------------------------------------------------------------------

export function BlankInput({ questionId, blank, blankId, showFeedback }: Props) {
  const value = useAttemptsStore((s) => s.responses[questionId]?.[blankId] ?? "");
  const setResponse = useAttemptsStore((s) => s.setResponse);

  const correct = blank && value ? isCorrect(value, blank.answers) : null;
  const state = !showFeedback || !value ? "idle" : correct ? "correct" : "wrong";

  const palette = useMemo(() => {
    return state === "correct"
      ? "border-green-500 bg-green-50 text-green-900 focus:ring-green-500 dark:bg-green-950/40 dark:text-green-100"
      : state === "wrong"
        ? "border-red-500 bg-red-50 text-red-900 focus:ring-red-500 dark:bg-red-950/40 dark:text-red-100"
        : "border-zinc-300 bg-white text-zinc-900 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  }, [state]);

  return (
    <input
      name={"math-input"}
      type="text"
      value={value}
      onChange={(e) => setResponse(questionId, blankId, e.target.value)}
      className={`${base} ${palette}`}
      aria-label={`Answer for blank ${blankId}`}
      aria-invalid={state === "wrong"}
      size={Math.max(6, value.length + 2)}
      autoComplete="off"
      spellCheck={false}
    />
  );
}
