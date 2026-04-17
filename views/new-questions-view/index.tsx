"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuestionsStore } from "@/lib/store/questions";
import { appendBlank, extractBlankIds } from "@/helpers";
import { Button } from "@/components/Button";

const FormSchema = z.object({
  content: z.string().min(1, "Content is required."),
  caption: z.string(),
  explanation: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  language: z.string().min(1, "Language is required"),
  template: z.boolean(),
});
type FormValues = z.infer<typeof FormSchema>;

const DEFAULTS: FormValues = {
  content:
    '<p>Solve: <math><mi>x</mi><mo>+</mo><mn>3</mn><mo>=</mo><mn>7</mn></math>. Therefore <span class="blank" data-blank-id="0">[blank_0]</span>.</p>',
  caption: "",
  explanation: "",
  status: "DRAFT",
  language: "EN",
  template: false,
};

export function NewQuestionForm() {
  const router = useRouter();
  const createProblem = useQuestionsStore((s) => s.createProblem);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
  });

  const content = useWatch({ control, name: "content" });

  const onInsertBlank = () => {
    const next = appendBlank(getValues("content") ?? "");
    setValue("content", next.content, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = handleSubmit((data) => {
    const blankIds = extractBlankIds(data.content);
    const answers = blankIds.map((id, idx) => ({
      id: idx + 1,
      order: Number(id),
      value: "",
      isCorrect: true,
    }));
    const created = createProblem({
      content: data.content,
      answers,
      caption: data.caption,
      explanation: data.explanation,
      status: data.status,
      language: data.language,
      template: data.template,
    });
    router.push(`/questions/${created.id}?mode=edit`);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Language</span>
          <input
            {...register("language")}
            className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 text-sm"
            placeholder="EN"
          />
          {errors.language && (
            <p className="text-sm text-red-600 mt-1">{errors.language.message}</p>
          )}
        </label>
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" {...register("template")} className="rounded" />
          <span className="text-sm font-medium">Template</span>
        </label>
      </div>

      <div>
        <label className="flex items-center justify-between text-sm font-medium mb-1">
          <span>Statement (HTML + MathML)</span>
          <Button size="sm" onClick={onInsertBlank}>
            + Insert blank
          </Button>
        </label>
        <textarea
          {...register("content")}
          rows={6}
          aria-describedby="content-err"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 font-mono text-sm"
        />
        {errors.content && (
          <p id="content-err" className="text-sm text-red-600 mt-1">
            {errors.content.message}
          </p>
        )}
        <p className="text-xs text-zinc-500 mt-1">
          Detected blanks: {extractBlankIds(content ?? "").length || 0}. You can add answers after
          creation.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Hint</span>
        <input
          {...register("caption")}
          placeholder="Shown to the learner on demand"
          className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          Stored as <code>caption</code>. HTML tags are stripped for display.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Explanation</span>
        <textarea
          {...register("explanation")}
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Status</span>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <select
              {...field}
              className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          )}
        />
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="solid" size="lg" disabled={isSubmitting}>
          Create question
        </Button>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
