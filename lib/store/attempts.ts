"use client";

import { create } from "zustand";

interface AttemptsState {
  // questionId -> blankId -> response
  responses: Record<string, Record<string, string>>;
  setResponse: (questionId: string, blankId: string, value: string) => void;
  clear: (questionId: string) => void;
  get: (questionId: string) => Record<string, string>;
}

export const useAttemptsStore = create<AttemptsState>((set, get) => ({
  responses: {},

  // methods
  setResponse: (questionId, blankId, value) =>
    set((s) => ({
      responses: {
        ...s.responses,
        [questionId]: { ...(s.responses[questionId] ?? {}), [blankId]: value },
      },
    })),
  clear: (questionId) =>
    set((s) => {
      const next = { ...s.responses };
      delete next[questionId];
      return { responses: next };
    }),
  get: (questionId) => get().responses[questionId] ?? {},
}));
