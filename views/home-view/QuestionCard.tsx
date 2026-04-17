import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import type { Problem } from "@/lib/schema";
import htmlParser from "html-react-parser";

export function QuestionCard({ problem }: { problem: Problem }) {
  return (
    <li className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-zinc-500">#{problem.id}</span>
          <StatusBadge status={problem.status} />
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
            {problem.language}
          </span>
          {problem.template && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
              Template
            </span>
          )}
        </div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
          {htmlParser(problem.content)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/questions/${problem.id}?mode=edit`}
          className={buttonClasses({ variant: "solid" })}
        >
          Edit
        </Link>
        <Link
          href={`/questions/${problem.id}?mode=preview`}
          className={buttonClasses({ variant: "outline" })}
        >
          Preview
        </Link>
      </div>
    </li>
  );
}
