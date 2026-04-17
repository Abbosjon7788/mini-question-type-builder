"use client";

import { useState, memo } from "react";
import htmlParser from "html-react-parser";

interface Props {
  caption: string;
  defaultOpen?: boolean;
}

export const Hint = memo<Props>((props) => {
  const { defaultOpen = false, caption } = props;

  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
      >
        <span aria-hidden>💡</span>
        <span>{open ? "Hide hint" : "Show hint"}</span>
      </button>
      {open && (
        <div
          role="note"
          className="mt-2 rounded-md border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-sm text-amber-900 dark:text-amber-100"
        >
          {htmlParser(caption)}
        </div>
      )}
    </div>
  );
});

if (process.env.NODE_ENV === "development") {
  Hint.displayName = "Hint";
}
