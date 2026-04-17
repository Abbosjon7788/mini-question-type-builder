import type { Metadata } from "next";
import { QuestionsList } from "@/views/home-view";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { ResetButton } from "@/views/home-view/ResetButton";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "All questions",
  description: "Browse and manage your Math Fill-in-the-Blank questions.",
};

export default function Home() {
  return (
    <Fragment>
      <header className="flex items-start sm:items-center flex-col gap-2 sm:flex-row sm:justify-between mb-4 sm:mb-6 sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Question Type Builder</h1>
          <p className="text-sm text-zinc-500">Math Fill-in-the-Blank</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/questions/new" className={buttonClasses({ variant: "primary" })}>
            + New question
          </Link>
          <ResetButton />
        </div>
      </header>
      <QuestionsList />
    </Fragment>
  );
}
