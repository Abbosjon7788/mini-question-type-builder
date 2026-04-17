"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { type FormValues } from "./form-schema";

export function BlankRow({
  control,
  registerAction,
  idx,
  onRemove,
  errors,
}: {
  control: ReturnType<typeof useForm<FormValues>>["control"];
  registerAction: ReturnType<typeof useForm<FormValues>>["register"];
  idx: number;
  onRemove: VoidFunction;
  errors: { answers?: Array<{ value?: { message?: string } }> } | undefined;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `blanks.${idx}.answers` as const,
  });

  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm">
          <span className="text-zinc-500">Blank id</span>{" "}
          <input
            {...registerAction(`blanks.${idx}.id` as const)}
            className="ml-1 w-20 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-sm"
          />
        </label>
        <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
          Remove blank
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((a, aIdx) => (
          <div key={a.id} className="flex items-center gap-2">
            <input
              {...registerAction(`blanks.${idx}.answers.${aIdx}.value` as const)}
              placeholder="Accepted answer"
              className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => remove(aIdx)}
              disabled={fields.length === 1}
              className="text-xs text-zinc-500 hover:text-red-600 disabled:opacity-30"
            >
              ×
            </button>
            {errors?.answers?.[aIdx]?.value?.message && (
              <span className="text-xs text-red-600">{errors.answers[aIdx]!.value!.message}</span>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="text-xs text-blue-600 hover:underline"
        >
          + Add answer
        </button>
      </div>
    </div>
  );
}
