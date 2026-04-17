"use client";

import { useAttemptsStore } from "@/lib/store/attempts";
import { isCorrect } from "@/helpers";
import type { Answer } from "@/lib/schema";
import { useMemo } from "react";

interface Props {
  problemId: number;
  answers: Answer[];
  blankId: string;
  showFeedback?: boolean;
  width?: string;
  height?: string;
}

const base =
  "inline-block mx-1 px-2 py-0.5 rounded-md border text-sm align-baseline outline-none focus:ring-2 focus:ring-offset-1 transition-colors";

export function BlankInput({ problemId, answers, blankId, showFeedback, width, height }: Props) {
  const value = useAttemptsStore((s) => s.responses[problemId]?.[blankId] ?? "");
  const setResponse = useAttemptsStore((s) => s.setResponse);

  const correct = answers.length > 0 && value ? isCorrect(value, answers) : null;
  const state = !showFeedback || !value ? "idle" : correct ? "correct" : "wrong";

  const palette = useMemo(() => {
    return state === "correct"
      ? "border-green-500 bg-green-50 text-green-900 focus:ring-green-500 dark:bg-green-950/40 dark:text-green-100"
      : state === "wrong"
        ? "border-red-500 bg-red-50 text-red-900 focus:ring-red-500 dark:bg-red-950/40 dark:text-red-100"
        : "border-zinc-300 bg-white text-zinc-900 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  }, [state]);

  const inlineStyles = useMemo(() => {
    const inlineStyle: React.CSSProperties = {};
    if (width) inlineStyle.width = `${width}px`;
    if (height) inlineStyle.height = `${height}px`;
    if (!width) inlineStyle.minWidth = "5rem";

    return inlineStyle;
  }, [width, height]);

  return (
    <input
      name="math-input"
      type="text"
      value={value}
      onChange={(e) => setResponse(problemId, blankId, e.target.value)}
      className={`${base} ${palette}`}
      style={inlineStyles}
      aria-label={`Answer for blank ${blankId}`}
      aria-invalid={state === "wrong"}
      autoComplete="off"
      spellCheck={false}
    />
  );
}
