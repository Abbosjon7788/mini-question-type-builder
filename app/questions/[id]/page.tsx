import { use, Fragment } from "react";
import type { Metadata } from "next";
import { QuestionDetailsView } from "@/views/question-details-view";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ mode?: string }>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { id } = await params;
  const { mode } = await searchParams;
  const label = mode === "preview" ? "Preview" : "Edit";
  return {
    title: `${label} | ${id}`,
    description: `${label} question ${id}`,
  };
}

export default function QuestionPage({ params }: { params: Params }) {
  const { id } = use(params);

  return (
    <Fragment>
      <h1 className="text-lg font-semibold sm:text-2xl font-mono text-white mb-4">
        Question: {id}
      </h1>
      <QuestionDetailsView id={id} />
    </Fragment>
  );
}
