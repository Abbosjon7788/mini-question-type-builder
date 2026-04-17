"use client";

import { MathJaxContext } from "better-react-mathjax";
import type { ReactNode } from "react";

const config = {
  loader: { load: ["input/tex", "input/mml", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  mml: {},
  chtml: {
    scale: 1,
    displayAlign: "left" as const,
  },
  startup: {
    typeset: false,
  },
  options: {
    enableMenu: false,
  },
};

export function MathProvider({ children }: { children: ReactNode }) {
  return (
    <MathJaxContext
      version={3}
      config={config}
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    >
      {children}
    </MathJaxContext>
  );
}
