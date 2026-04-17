import { z } from "zod";

export const FormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  blanks: z.array(
    z.object({
      id: z.string().min(1),
      answers: z.array(z.object({ value: z.string().min(1, "Required") })).min(1),
    }),
  ),
  caption: z.string(),
  explanation: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type FormValues = z.infer<typeof FormSchema>;
