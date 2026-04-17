"use client";

import { parseDocument } from "htmlparser2";
import { Element, Text, type Node } from "domhandler";
import type { ReactNode } from "react";
import type { Question } from "@/lib/schema";
import { BlankInput } from "./BlankInput";
import { MathInline } from "./MathInline";
import { splitMath } from "@/helpers";

interface Props {
  question: Question;
  showFeedback?: boolean;
}

function renderText(text: string, key: string): ReactNode {
  const parts = splitMath(text);

  return (
    <span key={key}>
      {parts.map((p, i) =>
        p.type === "math" ? (
          <MathInline key={`${key}-${i}`} tex={p.value} />
        ) : (
          <span key={`${key}-${i}`}>{p.value}</span>
        ),
      )}
    </span>
  );
}

function renderNodes(
  nodes: Node[],
  question: Question,
  showFeedback: boolean | undefined,
  blanksById: Map<string, Question["blanks"][number]>,
  keyPrefix: string,
): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;

    if (node instanceof Text) {
      return renderText(node.data, key);
    }

    if (node instanceof Element) {
      const cls = node.attribs?.class ?? "";
      if (cls.split(/\s+/).includes("blank")) {
        const blankId = node.attribs["data-blank-id"] ?? "";
        return (
          <BlankInput
            key={key}
            questionId={question.id}
            blank={blanksById.get(blankId)}
            blankId={blankId}
            showFeedback={showFeedback}
          />
        );
      }
      const Tag = node.name as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key}>
          {renderNodes(node.children as Node[], question, showFeedback, blanksById, key)}
        </Tag>
      );
    }
    return null;
  });
}

export function ClozeRenderer({ question, showFeedback }: Props) {
  const blanksById = new Map(question.blanks.map((b) => [b.id, b]));
  const doc = parseDocument(question.content);

  const nodes = renderNodes(doc.children as Node[], question, showFeedback, blanksById, "root");
  return <div className="leading-9 text-lg text-zinc-900 dark:text-zinc-100">{nodes}</div>;
}
