"use client";

import { Button } from "@/components/Button";
import { useQuestionsStore } from "@/lib/store/questions";

export function ResetButton() {
  const resetToMock = useQuestionsStore((s) => s.resetToMock);

  return (
    <Button
      variant="outline"
      size="md"
      onClick={() => {
        if (confirm("Reset all questions to mock data?")) resetToMock();
      }}
    >
      Reset to mock
    </Button>
  );
}
