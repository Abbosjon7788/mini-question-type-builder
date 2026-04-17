"use client";

import { create } from "zustand";

interface AttemptsState {
  // problemId -> blankId -> response
  responses: Record<number, Record<string, string>>;
  setResponse: (problemId: number, blankId: string, value: string) => void;
  clear: (problemId: number) => void;
  get: (problemId: number) => Record<string, string>;
}

export const useAttemptsStore = create<AttemptsState>((set, get) => ({
  responses: {},

  setResponse: (problemId, blankId, value) =>
    set((s) => ({
      responses: {
        ...s.responses,
        [problemId]: { ...(s.responses[problemId] ?? {}), [blankId]: value },
      },
    })),

  clear: (problemId) =>
    set((s) => {
      const next = { ...s.responses };
      delete next[problemId];
      return { responses: next };
    }),

  get: (problemId) => get().responses[problemId] ?? {},
}));
