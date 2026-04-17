"use client";

import { MathJax } from "better-react-mathjax";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  inline?: boolean;
  className?: string;
}

export function Math({ children, inline, className }: Props) {
  return (
    <MathJax dynamic inline={inline} className={className} hideUntilTypeset="first">
      {children}
    </MathJax>
  );
}
