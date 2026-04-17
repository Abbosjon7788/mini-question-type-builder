import type { Answer } from "@/lib/schema";

const BLANK_ID_RE = /data-blank-id=["']([^"']+)["']/g;

/** Extract all data-blank-id values in order of appearance. */
export function extractBlankIds(content: string): string[] {
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(BLANK_ID_RE.source, "g");
  while ((match = re.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

// -------------------------------------------------------------------------------------------------

/** Insert a new blank placeholder at the end of content and return updated content + new blank id. */
export function appendBlank(content: string): { content: string; id: string } {
  const existing = extractBlankIds(content);
  const numeric = existing.map((id) => Number(id)).filter((n) => Number.isFinite(n));
  const next = (numeric.length ? Math.max(...numeric) : -1) + 1;
  const id = String(next);
  const span = `<span class="blank" data-blank-id="${id}">[blank_${id}]</span>`;
  const glue = content.length && !/\s$/.test(content) ? " " : "";
  return { content: content + glue + span, id };
}

// -------------------------------------------------------------------------------------------------

/** Validate that every blank in content has at least one answer and vice-versa. */
export function validateBlanksAgainstContent(
  content: string,
  answerOrders: number[],
): { ok: true } | { ok: false; missingInContent: string[]; missingInBlanks: string[] } {
  const contentIds = new Set(extractBlankIds(content));
  const ordersSet = new Set(answerOrders.map(String));
  const missingInContent = [...ordersSet].filter((id) => !contentIds.has(id));
  const missingInBlanks = [...contentIds].filter((id) => !ordersSet.has(id));
  if (missingInContent.length === 0 && missingInBlanks.length === 0) return { ok: true };
  return { ok: false, missingInContent, missingInBlanks };
}

// -------------------------------------------------------------------------------------------------

/** Check a learner response against accepted answers (trimmed, case-insensitive). */
export function isCorrect(response: string, answers: Answer[]): boolean {
  const norm = response.trim().toLowerCase();
  if (!norm) return false;
  return answers.filter((a) => a.isCorrect).some((a) => a.value.trim().toLowerCase() === norm);
}

// -------------------------------------------------------------------------------------------------

/** Get the correct answers for a specific blank (by order / data-blank-id). */
export function getAnswersForBlank(answers: Answer[], blankId: string): Answer[] {
  const order = Number(blankId);
  return answers.filter((a) => a.order === order);
}
