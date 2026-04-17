"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuestionsStore } from "@/lib/store/questions";
import { EditForm } from "@/components/editor/EditForm";
import { Preview } from "@/components/preview/Preview";
import { Button, buttonClasses } from "@/components/Button";
import { Fragment } from "react";

export function QuestionDetailsView({ id }: { id: number }) {
  const problem = useQuestionsStore((s) => s.getProblemById(id));
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") === "preview" ? "preview" : "edit";

  if (!problem) {
    return (
      <Fragment>
        <p>Problem not found.</p>
        <Link href="/" className={buttonClasses({ variant: "primary" })}>
          &larr; Back
        </Link>
      </Fragment>
    );
  }

  const setMode = (m: "edit" | "preview") => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("mode", m);
    router.replace(`/questions/${id}?${sp.toString()}`);
  };

  return (
    <Fragment>
      <nav className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          &larr; All questions
        </Link>
        <div
          role="tablist"
          className="inline-flex rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden"
        >
          <Button
            role="tab"
            aria-selected={mode === "edit"}
            variant={mode === "edit" ? "solid" : "ghost"}
            onClick={() => setMode("edit")}
          >
            Edit
          </Button>
          <Button
            role="tab"
            aria-selected={mode === "preview"}
            variant={mode === "preview" ? "solid" : "ghost"}
            onClick={() => setMode("preview")}
          >
            Preview
          </Button>
        </div>
      </nav>

      {mode === "edit" ? <EditForm problem={problem} /> : <Preview problemId={id} />}
    </Fragment>
  );
}
