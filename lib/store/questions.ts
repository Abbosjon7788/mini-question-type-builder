"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Question, Status } from "@/lib/schema";
import mockData from "@/data/mock-data.json";

interface QuestionsState {
  questions: Question[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  getById: (id: string) => Question | undefined;
  update: (id: string, patch: Partial<Question>) => void;
  setStatus: (id: string, status: Status) => void;
  create: (q: Omit<Question, "id" | "updatedAt">) => Question;
  remove: (id: string) => void;
  resetToMock: () => void;
}

const seed = (): Question[] => (mockData.questions as Question[]).map((q) => ({ ...q }));

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      questions: seed(),
      hydrated: false,

      // methods
      setHydrated: (value) => set({ hydrated: value }),
      getById: (id) => get().questions.find((q) => q.id === id),
      update: (id, patch) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...patch, updatedAt: new Date().toISOString() } : q,
          ),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q,
          ),
        })),
      create: (q) => {
        const newQ: Question = {
          ...q,
          id: `q-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ questions: [...s.questions, newQ] }));
        return newQ;
      },
      remove: (id) => set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
      resetToMock: () => set({ questions: seed() }),
    }),
    {
      name: "qtb:questions:v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
