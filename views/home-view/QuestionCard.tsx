import { StatusBadge } from "@/components/StatusBadge";

import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import type { Question } from "@/lib/schema";

export function QuestionCard({ question }: { question: Question }) {
  return (
    <li className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-zinc-500">{question.id}</span>
          <StatusBadge status={question.status} />
        </div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
          {question.caption || question.content.replace(/<[^>]+>/g, "").slice(0, 80)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/questions/${question.id}?mode=edit`}
          className={buttonClasses({ variant: "solid" })}
        >
          Edit
        </Link>
        <Link
          href={`/questions/${question.id}?mode=preview`}
          className={buttonClasses({ variant: "outline" })}
        >
          Preview
        </Link>
      </div>
    </li>
  );
}
