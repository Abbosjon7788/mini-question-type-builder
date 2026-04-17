"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Problem } from "@/lib/schema";
import { useQuestionsStore } from "@/lib/store/questions";
import { appendBlank, extractBlankIds, validateBlanksAgainstContent } from "@/helpers";
import { ClozeRenderer } from "@/components/preview/ClozeRenderer";
import { Hint } from "@/components/preview/Hint";
import { Button } from "@/components/Button";
import { BlankRow } from "./BlankRow";
import { type FormValues, FormSchema } from "./form-schema";

function toForm(p: Problem): FormValues {
  return {
    content: p.content,
    answers: p.answers.map((a) => ({
      id: a.id,
      order: a.order,
      value: a.value,
      isCorrect: a.isCorrect,
    })),
    caption: p.caption ?? "",
    explanation: p.explanation ?? "",
    status: p.status,
    language: p.language,
    template: p.template,
  };
}

export function EditForm({ problem }: { problem: Problem }) {
  const updateProblem = useQuestionsStore((s) => s.updateProblem);
  const styles = useQuestionsStore((s) => s.getStyles());

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: toForm(problem),
    mode: "onBlur",
  });

  const {
    fields: answerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "answers",
  });

  useEffect(() => {
    reset(toForm(problem));
  }, [problem.id, reset, problem]);

  const content = useWatch({ control, name: "content" });
  const answers = useWatch({ control, name: "answers" });
  const caption = useWatch({ control, name: "caption" });
  const explanation = useWatch({ control, name: "explanation" });
  const status = useWatch({ control, name: "status" });
  const language = useWatch({ control, name: "language" });
  const template = useWatch({ control, name: "template" });

  const contentBlankIds = useMemo(() => extractBlankIds(content ?? ""), [content]);

  const answerOrders = useMemo(() => [...new Set((answers ?? []).map((a) => a.order))], [answers]);

  const mismatch = useMemo(
    () => validateBlanksAgainstContent(content ?? "", answerOrders),
    [content, answerOrders],
  );

  const onSubmit = handleSubmit((data) => {
    updateProblem(problem.id, {
      content: data.content,
      answers: data.answers,
      caption: data.caption,
      explanation: data.explanation,
      status: data.status,
      language: data.language,
      template: data.template,
    });
    reset(data, { keepValues: true });
  });

  const onInsertBlank = () => {
    const { content: newContent, id } = appendBlank(getValues("content") ?? "");
    setValue("content", newContent, { shouldDirty: true, shouldValidate: true });
    const maxAnswerId = (getValues("answers") ?? []).reduce((max, a) => Math.max(max, a.id), 0);
    append({ id: maxAnswerId + 1, order: Number(id), value: "", isCorrect: true });
  };

  const livePreview: Problem = {
    ...problem,
    content: content ?? "",
    answers: answers ?? [],
    caption: caption ?? "",
    explanation: explanation ?? "",
    status,
    language: language ?? "EN",
    template: template ?? false,
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="space-y-5">
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
          <div className="flex items-center justify-between text-sm font-medium mb-1">
            <p>Statement (HTML + MathML)</p>
            <Button size="sm" onClick={onInsertBlank}>
              + Insert blank
            </Button>
          </div>
          <textarea
            {...register("content")}
            rows={6}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 font-mono text-sm"
            aria-describedby="content-err"
          />
          {errors.content && (
            <p id="content-err" className="text-sm text-red-600 mt-1">
              {errors.content.message}
            </p>
          )}
          {!mismatch.ok && (
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {mismatch.missingInBlanks.length > 0 &&
                `Placeholders without answers: ${mismatch.missingInBlanks.join(", ")}. `}
              {mismatch.missingInContent.length > 0 &&
                `Answers without placeholders: ${mismatch.missingInContent.join(", ")}.`}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Answers ({answerFields.length} entries / {contentBlankIds.length} blanks in content)
          </h3>
          <div className="space-y-3">
            {answerFields.map((field, idx) => (
              <BlankRow
                key={field.id}
                control={control}
                registerAction={register}
                idx={idx}
                onRemove={() => remove(idx)}
                errors={errors.answers?.[idx]}
              />
            ))}
            {answerFields.length === 0 && (
              <p className="text-sm text-zinc-500">
                No answers yet — click &ldquo;Insert blank&rdquo;.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Hint</span>
            <input
              {...register("caption")}
              placeholder="Shown to the learner on demand (e.g. 'Use inverse operations.')"
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
                  <option value="PUBLISHED" disabled={!mismatch.ok}>
                    PUBLISHED{!mismatch.ok ? " (fix errors first)" : ""}
                  </option>
                </select>
              )}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="solid" size="lg" disabled={!isDirty}>
            Save
          </Button>
          {isDirty && (
            <span className="text-xs text-amber-700 dark:text-amber-400">Unsaved changes</span>
          )}
        </div>
      </div>

      <aside className="space-y-3">
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Live preview</div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-950">
          <ClozeRenderer problem={livePreview} styles={styles} />
          <Hint caption={livePreview.caption} defaultOpen />
        </div>
      </aside>
    </form>
  );
}
