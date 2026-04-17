"use client";

import { useEffect, Fragment } from "react";
import { useQuestionsStore } from "@/lib/store/questions";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useQuestionsStore((s) => s.hydrated);

  useEffect(() => {
    useQuestionsStore.persist.rehydrate();
  }, []);

  if (!hydrated) {
    return <div className="p-8 text-sm text-zinc-500">Loading…</div>;
  }

  return <Fragment>{children}</Fragment>;
}
