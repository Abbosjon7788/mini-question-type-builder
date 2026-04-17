import { type Status } from "@/lib/schema";
import { useMemo } from "react";

export function StatusBadge({ status }: { status: Status }) {
  const cls = useMemo(() => {
    return status === "PUBLISHED"
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
  }, [status]);

  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cls}`}>{status}</span>;
}
