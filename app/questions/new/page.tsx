import type { Metadata } from "next";
import { NewQuestionForm } from "@/views/new-questions-view";
import Link from "next/link";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "New question",
  description: "Create a new Math Fill-in-the-Blank (Cloze Text) question.",
};

export default function NewQuestionPage() {
  return (
    <Fragment>
      <nav className="mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight mb-4">New math question</h1>

        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← All questions
        </Link>
      </nav>
      <NewQuestionForm />
    </Fragment>
  );
}
