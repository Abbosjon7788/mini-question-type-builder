import { z } from "zod";

export const StatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export type Status = z.infer<typeof StatusSchema>;

export const BlankSchema = z.object({
  id: z.string().min(1),
  answers: z.array(z.string().min(1)).min(1, "At least one answer required"),
});
export type Blank = z.infer<typeof BlankSchema>;

export const QuestionSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1, "Content is required"),
  blanks: z.array(BlankSchema),
  caption: z.string().optional().default(""),
  explanation: z.string().optional().default(""),
  status: StatusSchema,
  updatedAt: z.string(),
});

export type Question = z.infer<typeof QuestionSchema>;
