"use client";

import { useMemo } from "react";
import katex from "katex";

interface Props {
  tex: string;
  displayMode?: boolean;
}

export function MathInline({ tex, displayMode = false }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        strict: "ignore",
      });
    } catch {
      return tex;
    }
  }, [tex, displayMode]);

  return (
    <span
      className="katex-host"
      aria-label={`math: ${tex}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
