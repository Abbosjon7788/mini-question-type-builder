"use client";

import { useForm, Controller } from "react-hook-form";
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
  errors: { value?: { message?: string }; order?: { message?: string } } | undefined;
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <label className="text-sm">
            <span className="text-zinc-500">Blank #</span>{" "}
            <input
              {...registerAction(`answers.${idx}.order` as const, { valueAsNumber: true })}
              type="number"
              className="ml-1 w-16 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 text-sm"
            />
          </label>
          <label className="flex items-center gap-1 text-sm">
            <Controller
              control={control}
              name={`answers.${idx}.isCorrect` as const}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded"
                />
              )}
            />
            <span className="text-zinc-500">Correct</span>
          </label>
        </div>
        <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
          Remove
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          {...registerAction(`answers.${idx}.value` as const)}
          placeholder="Answer value"
          className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
        />
        {errors?.value?.message && (
          <span className="text-xs text-red-600">{errors.value.message}</span>
        )}
      </div>
    </div>
  );
}
