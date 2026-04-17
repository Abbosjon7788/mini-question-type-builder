import { z } from "zod";

export const StatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export type Status = z.infer<typeof StatusSchema>;

export const AnswerSchema = z.object({
  id: z.number(),
  order: z.number(),
  value: z.string().min(1, "Answer value is required"),
  isCorrect: z.boolean(),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const ProblemSchema = z.object({
  id: z.number(),
  language: z.string().min(1),
  template: z.boolean(),
  status: StatusSchema,
  content: z.string().min(1, "Content is required"),
  caption: z.string(),
  explanation: z.string(),
  answers: z.array(AnswerSchema),
});
export type Problem = z.infer<typeof ProblemSchema>;

export const StyleSchema = z.object({
  key: z.string(),
  value: z.string(),
});
export type Style = z.infer<typeof StyleSchema>;

export const QuestionSchema = z.object({
  id: z.number(),
  type: z.string(),
  styles: z.array(StyleSchema),
  problems: z.array(ProblemSchema),
});
export type Question = z.infer<typeof QuestionSchema>;
