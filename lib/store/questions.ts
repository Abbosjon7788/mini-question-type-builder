"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Question, Problem, Status, Style } from "@/lib/schema";
import mockData from "@/data/mock-data.json";

interface QuestionsState {
  question: Question;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  // CRUD actions for math problems
  getProblemById: (id: number) => Problem | undefined;
  getProblems: () => Problem[];
  getStyles: () => Style[];
  updateProblem: (id: number, patch: Partial<Problem>) => void;
  setProblemStatus: (id: number, status: Status) => void;
  createProblem: (p: Omit<Problem, "id">) => Problem;
  removeProblem: (id: number) => void;
  resetToMock: () => void;
}

const seed = (): Question => ({
  id: mockData.question.id,
  type: mockData.question.type,
  styles: mockData.question.styles.map((s) => ({ ...s })),
  problems: mockData.question.problems.map((p) => ({
    ...p,
    status: p.status as Status,
    answers: p.answers.map((a) => ({ ...a })),
  })),
});

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      question: seed(),
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      getProblemById: (id) => get().question.problems.find((p) => p.id === id),

      getProblems: () => get().question.problems,

      getStyles: () => get().question.styles,

      updateProblem: (id, patch) =>
        set((s) => ({
          question: {
            ...s.question,
            problems: s.question.problems.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),

      setProblemStatus: (id, status) =>
        set((s) => ({
          question: {
            ...s.question,
            problems: s.question.problems.map((p) => (p.id === id ? { ...p, status } : p)),
          },
        })),

      createProblem: (p) => {
        const existing = get().question.problems;
        const maxId = existing.length ? Math.max(...existing.map((x) => x.id)) : 0;
        const newProblem: Problem = { ...p, id: maxId + 1 };
        set((s) => ({
          question: {
            ...s.question,
            problems: [...s.question.problems, newProblem],
          },
        }));
        return newProblem;
      },

      removeProblem: (id) =>
        set((s) => ({
          question: {
            ...s.question,
            problems: s.question.problems.filter((p) => p.id !== id),
          },
        })),

      resetToMock: () => set({ question: seed() }),
    }),
    {
      name: "qtb:questions:v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      migrate: () => {
        return { question: seed(), hydrated: false } as QuestionsState;
      },
    },
  ),
);
