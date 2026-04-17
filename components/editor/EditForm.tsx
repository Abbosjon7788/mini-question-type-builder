"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Question } from "@/lib/schema";
import { useQuestionsStore } from "@/lib/store/questions";
import { appendBlank, extractBlankIds, validateBlanksAgainstContent } from "@/helpers";
import { ClozeRenderer } from "@/components/preview/ClozeRenderer";
import { Button } from "@/components/Button";
import { BlankRow } from "./BlankRow";
import { type FormValues, FormSchema } from "./form-schema";

function toForm(q: Question): FormValues {
  return {
    content: q.content,
    blanks: q.blanks.map((b) => ({ id: b.id, answers: b.answers.map((v) => ({ value: v })) })),
    caption: q.caption ?? "",
    explanation: q.explanation ?? "",
    status: q.status,
  };
}

export function EditForm({ question }: { question: Question }) {
  const update = useQuestionsStore((s) => s.update);

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
    defaultValues: toForm(question),
    mode: "onBlur",
  });

  const {
    fields: blankFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "blanks",
  });

  useEffect(() => {
    reset(toForm(question));
  }, [question.id, reset, question]);

  const content = useWatch({ control, name: "content" });
  const blanks = useWatch({ control, name: "blanks" });
  const caption = useWatch({ control, name: "caption" });
  const explanation = useWatch({ control, name: "explanation" });
  const status = useWatch({ control, name: "status" });

  const contentBlankIds = useMemo(() => extractBlankIds(content ?? ""), [content]);
  const mismatch = useMemo(
    () =>
      validateBlanksAgainstContent(
        content ?? "",
        (blanks ?? []).map((b: { id: string }) => b.id),
      ),
    [content, blanks],
  );

  const onSubmit = handleSubmit((data) => {
    update(question.id, {
      content: data.content,
      blanks: data.blanks.map((b) => ({ id: b.id, answers: b.answers.map((a) => a.value) })),
      caption: data.caption,
      explanation: data.explanation,
      status: data.status,
    });
    reset(data, { keepValues: true });
  });

  const onInsertBlank = () => {
    const { content, id } = appendBlank(getValues("content") ?? "");
    setValue("content", content, { shouldDirty: true, shouldValidate: true });
    append({ id, answers: [{ value: "" }] });
  };

  const livePreview: Question = {
    ...question,
    content: content ?? "",
    blanks: (blanks ?? []).map((b) => ({ id: b.id, answers: b.answers.map((a) => a.value) })),
    caption: caption ?? "",
    explanation: explanation ?? "",
    status,
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-sm font-medium mb-1">
            <p>Statement (HTML + inline $math$)</p>
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
                `Placeholders without answer entries: ${mismatch.missingInBlanks.join(", ")}. `}
              {mismatch.missingInContent.length > 0 &&
                `Answer entries without placeholders: ${mismatch.missingInContent.join(", ")}.`}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Blanks ({blankFields.length} in form / {contentBlankIds.length} in content)
          </h3>
          <div className="space-y-3">
            {blankFields.map((field, idx) => (
              <BlankRow
                key={field.id}
                control={control}
                registerAction={register}
                idx={idx}
                onRemove={() => remove(idx)}
                errors={
                  errors.blanks?.[idx] as
                    | { answers?: Array<{ value?: { message?: string } }> }
                    | undefined
                }
              />
            ))}
            {blankFields.length === 0 && (
              <p className="text-sm text-zinc-500">
                No blanks yet — click &ldquo;Insert blank&rdquo;.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Caption</span>
            <input
              {...register("caption")}
              className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2"
            />
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
          <ClozeRenderer question={livePreview} />
          {livePreview.caption && (
            <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500">
              {livePreview.caption}
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
