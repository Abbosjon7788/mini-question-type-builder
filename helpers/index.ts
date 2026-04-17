// Utilities for working with the `content` HTML string and its blank placeholders.

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

  console.log({
    content,
    existing,
    numeric,
    next,
  });

  const id = String(next);
  const span = `<span class="blank" data-blank-id="${id}">[blank_${id}]</span>`;
  const glue = content.length && !/\s$/.test(content) ? " " : "";
  return { content: content + glue + span, id };
}

// -------------------------------------------------------------------------------------------------

/** Validate that blanks array matches placeholders in content (both directions). */
export function validateBlanksAgainstContent(
  content: string,
  blankIds: string[],
): { ok: true } | { ok: false; missingInContent: string[]; missingInBlanks: string[] } {
  const contentIds = new Set(extractBlankIds(content));
  const blanksSet = new Set(blankIds);
  const missingInContent = [...blanksSet].filter((id) => !contentIds.has(id));
  const missingInBlanks = [...contentIds].filter((id) => !blanksSet.has(id));
  if (missingInContent.length === 0 && missingInBlanks.length === 0) return { ok: true };
  return { ok: false, missingInContent, missingInBlanks };
}

// -------------------------------------------------------------------------------------------------

/** Check a learner response against accepted answers (trimmed, case-insensitive). */
export function isCorrect(response: string, answers: string[]): boolean {
  const norm = response.trim().toLowerCase();
  if (!norm) return false;
  return answers.some((a) => a.trim().toLowerCase() === norm);
}

// -------------------------------------------------------------------------------------------------

/** Splits text into plain segments and $...$ inline math, returns ReactNode-ready parts. */
export function splitMath(text: string): Array<{ type: "text" | "math"; value: string }> {
  const parts: Array<{ type: "text" | "math"; value: string }> = [];
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "math", value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}
