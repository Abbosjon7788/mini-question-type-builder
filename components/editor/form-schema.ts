import { z } from "zod";

export const FormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  answers: z.array(
    z.object({
      id: z.number(),
      order: z.number(),
      value: z.string().min(1, "Required"),
      isCorrect: z.boolean(),
    }),
  ),
  caption: z.string(),
  explanation: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  language: z.string().min(1, "Language is required"),
  template: z.boolean(),
});

export type FormValues = z.infer<typeof FormSchema>;
