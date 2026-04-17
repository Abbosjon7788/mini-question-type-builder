# Question Type Builder

Frontend-only authoring tool for **Math Fill-in-the-Blank (Cloze Text)** questions. Authors create/edit questions with inline math and blank placeholders, and preview them as a learner would. Drafts persist in the browser.

## Setup

```bash
yarn install
yarn dev             # http://localhost:3000
yarn build           # production build
yarn format          # prettier formatter
```

Requires Node 18.18+ (Next.js 16).

## Third-Party Packages

### Dependencies

| Package                | Version | Purpose                                                                                                                      |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `zustand`              | ^5.0.12 | Lightweight state store with `persist` middleware for `localStorage` draft persistence                                       |
| `react-hook-form`      | ^7.72.1 | Performant form state management for the question editor                                                                     |
| `@hookform/resolvers`  | ^5.2.2  | Connects Zod schemas to React Hook Form for declarative validation                                                           |
| `zod`                  | ^4.3.6  | Schema validation — enforces blank-answer alignment and required fields                                                      |
| `better-react-mathjax` | ^3.0.0  | React wrapper around MathJax 3. Typesets MathML (`<math>…</math>`) and LaTeX (`$…$`) in place and re-runs on content updates |
| `html-react-parser`    | ^6.0.1  | Parses `content` HTML into React elements, enabling swap of `<span class="blank">` for interactive `<BlankInput>` components |

### Dev Dependencies

| Package                                             | Version         | Purpose                                           |
| --------------------------------------------------- | --------------- | ------------------------------------------------- |
| `tailwindcss`                                       | ^4              | Utility-first CSS framework (v4)                  |
| `@tailwindcss/postcss`                              | ^4              | PostCSS plugin for Tailwind                       |
| `typescript`                                        | ^5              | Static type checking                              |
| `eslint` / `eslint-config-next`                     | ^9 / 16.2.3     | Linting with Next.js-specific rules               |
| `eslint-config-prettier`                            | ^10.1.8         | Disables ESLint rules that conflict with Prettier |
| `prettier`                                          | ^3.8.3          | Code formatting                                   |
| `@types/katex`                                      | ^0.16.8         | TypeScript definitions for KaTeX                  |
| `@types/node` / `@types/react` / `@types/react-dom` | ^20 / ^19 / ^19 | TypeScript definitions for Node.js and React      |

## Metadata

Next.js Metadata API is used across the app for SEO and page titles.

| File                          | Type                         | Details                                                                                                                                                       |
| ----------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`              | Static                       | `title.default`: "Question Type Builder", `title.template`: "%s · Question Type Builder", `description`: "Math Fill-in-the-Blank (Cloze Text) authoring tool" |
| `app/page.tsx`                | Static                       | `title`: "All questions"                                                                                                                                      |
| `app/not-found.tsx`           | Static                       | `title`: "Page not found"                                                                                                                                     |
| `app/questions/new/page.tsx`  | Static                       | `title`: "New question"                                                                                                                                       |
| `app/questions/[id]/page.tsx` | Dynamic (`generateMetadata`) | Title is computed from the route params and search params — e.g. "Edit \| abc123" or "Preview \| abc123"                                                      |

The root layout sets a **template** (`%s · Question Type Builder`) so nested pages only need to provide their own title segment.

## How it works

- Question list at `/` → pick **Edit** or **Preview**.
- Question page at `/questions/[id]?mode=edit|preview` — tab toggle is a query param, so it's deep-linkable and survives refresh.
- Edit view has a live preview pane, validates that blank placeholders ↔ answer entries align, and gates `PUBLISHED` on a clean state.
- Preview view renders each `<span class="blank" data-blank-id="N">` as an `<input>`, captures learner responses in a session-scoped Zustand store, and reveals correct/incorrect feedback on **Check answers**.
- Questions (authoritative) persist to `localStorage` under `qtb:questions:v1`. Learner responses are session-only.

## Known limitations

- Answer checking is trimmed/case-insensitive string equality; no math-expression equivalence (`2x` ≠ `x*2`).
- No tests included in this pass.
