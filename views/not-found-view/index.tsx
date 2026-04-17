import Link from "next/link";
import { buttonClasses } from "@/components/Button";

export function NotFoundView() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-20 flex-1 flex items-center">
      <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-mono text-5xl sm:text-6xl font-semibold tracking-tight">404</span>
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            NOT FOUND
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
          We couldn&apos;t find that question.
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          The page you&apos;re looking for may have been removed, renamed, or never existed. Drafts
          live in your browser — check the list to pick up where you left off.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className={buttonClasses({ variant: "primary" })}>
            ← All questions
          </Link>
        </div>
      </div>
    </div>
  );
}
