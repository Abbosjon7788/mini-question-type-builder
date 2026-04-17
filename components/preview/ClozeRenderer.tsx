"use client";

import { parseDocument } from "htmlparser2";
import { Element, Text, type Node } from "domhandler";
import type { ReactNode } from "react";
import type { Problem, Style } from "@/lib/schema";
import { BlankInput } from "./BlankInput";
import { Math } from "./Math";
import { getAnswersForBlank } from "@/helpers";

interface Props {
  problem: Problem;
  styles?: Style[];
  showFeedback?: boolean;
}

function getStyleValue(styles: Style[] | undefined, key: string): string | undefined {
  return styles?.find((s) => s.key === key)?.value;
}

/**
 * source: https://developer.mozilla.org/en-US/docs/Web/MathML/Reference/Element
 */
const MATHML_TAGS = new Set([
  "math",
  "mi",
  "mn",
  "mo",
  "ms",
  "mtext",
  "mspace",
  "mrow",
  "mfrac",
  "msqrt",
  "mroot",
  "mstyle",
  "merror",
  "mpadded",
  "mphantom",
  "mfenced",
  "menclose",
  "msub",
  "msup",
  "msubsup",
  "munder",
  "mover",
  "munderover",
  "mmultiscripts",
  "mtable",
  "mtr",
  "mtd",
  "maction",
  "annotation",
  "annotation-xml",
  "semantics",
]);

function serializeMathML(node: Node): string {
  if (node instanceof Text) return node.data;
  if (!(node instanceof Element)) return "";
  const attrs = Object.entries(node.attribs ?? {})
    .map(([k, v]) => ` ${k}="${String(v).replace(/"/g, "&quot;")}"`)
    .join("");
  const inner = (node.children as Node[]).map(serializeMathML).join("");
  return `<${node.name}${attrs}>${inner}</${node.name}>`;
}

function renderNodes(
  nodes: Node[],
  problem: Problem,
  styles: Style[] | undefined,
  showFeedback: boolean | undefined,
  keyPrefix: string,
): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;

    if (node instanceof Text) {
      return <span key={key}>{node.data}</span>;
    }

    if (node instanceof Element) {
      // MathML subtree — serialize back to string so MathJax can typeset it natively.
      if (MATHML_TAGS.has(node.name)) {
        const xml = serializeMathML(node);
        return <span key={key} dangerouslySetInnerHTML={{ __html: xml }} />;
      }

      const cls = node.attribs?.class ?? "";
      if (cls.split(/\s+/).includes("blank")) {
        const blankId = node.attribs["data-blank-id"] ?? "";
        const blankAnswers = getAnswersForBlank(problem.answers, blankId);
        const inputWidth = getStyleValue(styles, "mathInputWidth");
        const inputHeight = getStyleValue(styles, "mathInputHeight");

        return (
          <BlankInput
            key={key}
            problemId={problem.id}
            answers={blankAnswers}
            blankId={blankId}
            showFeedback={showFeedback}
            width={inputWidth}
            height={inputHeight}
          />
        );
      }

      const Tag = node.name as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key}>
          {renderNodes(node.children as Node[], problem, styles, showFeedback, key)}
        </Tag>
      );
    }
    return null;
  });
}

export function ClozeRenderer({ problem, styles, showFeedback }: Props) {
  const doc = parseDocument(problem.content, { xmlMode: false, lowerCaseTags: true });
  const nodes = renderNodes(doc.children as Node[], problem, styles, showFeedback, "root");
  return <Math className="leading-9 text-lg text-zinc-900 dark:text-zinc-100">{nodes}</Math>;
}
