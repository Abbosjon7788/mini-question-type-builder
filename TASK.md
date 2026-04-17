# Frontend Take-Home Assessment

## Project

Build a mini **Question Type Builder** for **Math Fill-in-the-Blank (Cloze Text)** questions.

The feature should reflect a real-world authoring flow used in educational products:

- Authors create and edit a math question
- Authors preview it in a learner-facing view
- Authors can switch between **Edit** and **View** states
- Data is stored on the frontend (no backend required)

Estimated effort: **4-5 days**.

## What You Need to Build

### 1. Views

Implement at least these two views:

- **Edit View**
- **View (Preview) View**

A toggle, tabs, or route-based separation is acceptable.

### 2. Question Builder Capabilities

Use the provided mock data as initial state and support:

- Question statement editing (HTML-like content with math support)
- Fill-in-the-blank placeholders in statement
- Answer list editing for placeholders
- Caption editing
- Explanation editing
- Status field (at minimum: DRAFT, PUBLISHED)

### 3. Math Rendering and Interaction

Your solution must support rendering math content and blanks in both views.

Minimum expectation:

- Inline math expressions render correctly
- Blank placeholders can be interacted with in preview mode
- Candidate answers can be collected in local state

### 4. State and Persistence

No backend is needed.

Use frontend state storage (for example: React state + context, Zustand, Redux Toolkit, etc.) and persist drafts in
browser storage (localStorage or IndexedDB).

### 5. Validation and UX

Include basic validation and user feedback:

- Missing required fields
- Answer count mismatch with placeholders
- Empty explanation/caption should be handled gracefully

The interface should be responsive and usable on desktop and mobile.

## Technical Constraints

- Framework: React (Next.js is allowed but not required)
- Language: TypeScript preferred
- No backend/API required
- You may use open-source libraries for math rendering and rich text parsing

## Out of Scope

- Authorization/authentication for authors is **not required**.
- User roles, permissions, and access control are **not required**.

## Decision Freedom

Anything not explicitly specified in this brief is up to you.

Examples of acceptable candidate choices:

- Testing approach (no tests, unit tests, integration tests, or component tests)
- State management library/pattern
- Form library/validation strategy
- Routing structure and view switching pattern
- UI component library or custom UI
- Math rendering/parsing library choice

Please document your choices and trade-offs in `README.md`.

## Provided Starter Data

Use `mock-data.json` as your initial source.

Important: keeping the structure of `mock-data.json` is required.
Do not change the top-level shape, field names, or nested object structure.
You may update values during runtime in app state, but the provided data contract must remain compatible.

Important: in each problem, the `content` field contains blank placeholders that must be rendered as interactive input
fields in View/Preview.

Example placeholder in `content`:

`<span class="blank" data-blank-id="0">[blank_0]</span>`

Expected behavior:

- Render each blank placeholder as an answer input field.
- Keep a deterministic mapping between placeholder index and answer index/order.
- Capture learner input for each rendered blank in local state.

## Deliverables

1. Source code repository
2. `README.md` with:
   - Setup/run instructions
   - Architecture decisions
   - Trade-offs
   - What you would improve with more time

## Evaluation Criteria

You will be evaluated on:

- Product thinking and UX quality
- State modeling and data flow
- Math rendering correctness
- Code quality and component design
- Edge-case handling and validation
- Responsiveness and accessibility
- Overall maintainability

## Bonus (Optional)

- Undo/redo for edits
- Draft vs published workflow guardrails
- Unit/component tests
- Keyboard-first interactions
- i18n-ready text labels

## Submission

Please share:

- Repository link
- Notes on assumptions and known limitations
