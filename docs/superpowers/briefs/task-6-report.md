# Task 6 Report: Onboarding `/onboarding`

**Status:** DONE_WITH_CONCERNS (all concerns are informational; none block)

## What was implemented

Single client flow with local step state (no router push per step): `welcome → why → q1..q6 → review → done`.

- **Welcome** — centered card with the exact copy "Let's understand your skin before we change your routine." + primary CTA "Begin".
- **Why** — 3 short numbered cards (understand your context / a routine that explains itself / check products before buying), quiet Back + primary Continue.
- **Questions (q1–q6)** — each with `ProgressSteps current={i} total={6}` ("01 / 06"), one primary "Continue" + quiet "Back", all selection via `ChoiceCard` (large, accessible, `aria-pressed` + ✓ indicator):
  1. skin feel → `oily|dry|combination|normal` with short neutral descriptions (e.g. "Tends to look shiny by midday").
  2. concerns multi-select → `[acne, dryness, oiliness, sensitivity, uneven texture]`.
  3. sensitivity → `low|medium|high`, sub-copy "How easily does your skin react to new products?".
  4. current products → chip entry (Enter or comma commits, dedupe, per-chip remove button with `aria-label`), quiet "Skip for now" advances without committing the draft.
  5. routine preferences multi-select → `[quick routine, minimal steps, gentle actives, budget-friendly]`, hint "Saved on this device only." — goes ONLY to `STORAGE_KEYS.onboardingPrefs`, never sent to the backend.
  6. optional notes textarea → ONLY `STORAGE_KEYS.onboardingNotes`, hint "Saved on this device only."
- **Back navigation preserves answers** — all answer state lives in the page component; steps are fully controlled.
- **Review** — two visually separated blocks: **"You told SkinSense…"** (6 `.brutal` surface fact rows, each with an Edit button that jumps to its step and returns to review on Continue) vs **"SkinSense suggests…"** (honey card, `Badge tone="amber"` "Suggested from your answers", plain label-mapping inferences only, plus a "not a diagnosis" line). Skipped fields show explicit **"Not provided"**. Primary "Confirm & Continue" → `save(...)` (real PUT) → done; save failure shows `ErrorState` with retry, stays on review.
- **Done** — "Your profile is ready." + primary "Build my first routine" → `generateRoutine({skin_behavior, concerns})` with `LoadingStages` using the three exact stages ("Reading your profile" → "Building your plan" → "Reviewing the result") → `makeStoredRoutine(result)` called **once**, reused for `pushRoutineToHistory(...)` + `setCurrentRoutine(...)` → `router.push("/dashboard")`. Secondary "Go to dashboard". On failure: `ErrorState` with retry, user stays on the step, no success is ever claimed.
- **Shell** — page is self-contained on `/onboarding` (minimal AppShell): own header with boxed wordmark (`display border-2 border-line bg-surface px-3 py-1.5 brutal-shadow-sm`), own footer with "Not a medical device. Educational decision support only."
- **Focus/a11y** — step container receives focus on each step change (`tabIndex={-1}`), questions are `h1` with `role="group"` labelled by them, `aria-live` via ProgressSteps/LoadingStages, `role="alert"` via ErrorState, all icon-only buttons labelled, touch targets ≥36–44px.

## Files created

- `frontend/src/app/onboarding/page.tsx` — flow orchestration, state machine, welcome/why/done steps, save + generate handlers, header/footer
- `frontend/src/app/onboarding/config.ts` — `Answers`/`QuestionIndex` types, option lists, build stage names
- `frontend/src/app/onboarding/questions.tsx` — `QuestionShell` + the six question steps
- `frontend/src/app/onboarding/review.tsx` — review screen (facts vs suggestions blocks)

No shared components edited, no new npm dependencies, no code comments.

## Verification

```
$ npx tsc --noEmit        (from frontend/)
(exit 0, no output — zero errors project-wide)

$ npx eslint src/app/onboarding
(exit 0, no findings)
```

`next build` intentionally not run (controller runs it).

## Self-review findings

- **Brief completeness:** all exact copy strings, the 6-step mapping, ProgressSteps, one-primary-plus-quiet-Back rule, "Skip for now", review block names, badge label, "Not provided" rows, edit-jump, "Confirm & Continue", done copy, three loading stages, makeStoredRoutine-once, and both done-step buttons verified present.
- **Safety:** no medical claims, no confidence numbers, no rankings/buy pressure, no raw errors surfaced (all failures route to friendly `ErrorState` with retry), localStorage persistence disclosed in hints on steps 5/6.
- **Responsive 360px:** single-column stacks throughout; nav rows use `flex-wrap`; review blocks stack below `lg`; chips wrap.
- **Reduced motion:** relies on existing `globals.css` media query (disables `.btn`/`.choice` transitions and hover transforms); no bespoke animation added.
- **Backend contract:** only `skin_behavior`, `sensitivity`, `concerns`, `current_products` are PUT; prefs/notes excluded.

## Concerns

1. **Backend PUT is not partial** (`backend/main.py:117-120`): omitted fields are set to `None`. For onboarding this behaves correctly (skipped → null → "Not provided" is honest), but any future "edit one field" caller will wipe the others. Pre-existing backend behavior, not changed per scope.
2. **Skipped step 1:** `generateRoutine` is sent `skin_behavior: ""`, which the backend accepts and answers with its generic routine (real backend output, nothing fabricated). If backend validation tightens later, the existing ErrorState/retry path handles it gracefully.
3. **LoadingStages progress** advances on timers (0.9s / 1.8s) while the single generate request is in flight — stage names are the three real stages from the brief; on failure timers are cleared and no success is shown.
4. **Pre-existing contrast note (not mine to fix):** `.btn-primary` (clay `#d2603a` on `#fffdf9`) is ≈3.8:1 — below WCAG 4.5:1 for normal text; it is the Task 2 design-system default used across all pages.
5. Edit-jump remembers its origin (Continue on an edited step returns straight to review); Back still walks the linear flow. Tiny extra state, but it's what "Edit buttons jump back to the step" implies.

---

## Review-fix pass (task-owned files only)

### 1. Required single-select enforcement (q1/q3) — Important

- `frontend/src/app/onboarding/questions.tsx:37-96` — `QuestionShell` gained an optional `error?: boolean` prop; renders an inline `role="alert"` message "Choose one to continue." directly under the heading (`questions.tsx:74-78`, styled `text-sm font-semibold text-rust` matching `Field.tsx` error convention). The `h1` now takes `ref` + `tabIndex={-1}` and receives focus when the error appears (`questions.tsx:59-61, 66-71`), so focus stays on the question.
- `questions.tsx:98-129` (`SkinFeelStep`) and `questions.tsx:152-184` (`SensitivityStep`) — each owns an `error` state; Continue with `value === null` sets the error and does **not** call `onNext`. `ChoiceCard.onSelect` now always calls `onChange(option.value)` (no `null` branch), so tapping the selected option keeps it selected — an answer is always present once chosen (`questions.tsx:121-124`, `176-179`). Selecting any option clears the error.
- `questions.tsx:131-150` (`ConcernsStep`, q2) — remains multi-select with no validation attached: optional, empty allowed (review already shows "Not provided"). Made explicit in copy: sub is now "Choose all that apply, or none to skip." (`questions.tsx:136`).

### 2. Touch target — Minor

- `questions.tsx:281` — product-chip remove button `h-9 w-9` → `h-11 w-11` (44px); `flex items-center justify-center border-2 border-line bg-paper` kept for centering/borders.

### 3. Chip-added feedback — Minor

- `questions.tsx:199` — `lastAdded` state; `addProducts` records newly added (non-duplicate) parts and sets `Added: <product>` only when a chip is actually committed (`questions.tsx:208-218`). Covers Enter and comma commit paths.
- `questions.tsx:266-268` — persistent `<p aria-live="polite" className="sr-only">` status element rendering `Added: ${lastAdded}` (sr-only → no layout shift; chips remain the visual cue).

### 4. Loading stages honesty — Minor

- `frontend/src/app/onboarding/page.tsx:142-176` — `handleBuild` reworked: stage 0 set immediately with `buildPhase "loading"`; stage 1 (`Building your plan`) flips on only after the call is started (300ms timer registered at start, cancelled by `clearTimers()` on response/failure, so stage 0 always paints first and stage 1 never appears without an in-flight request); stage 2 (`Reviewing the result`) set only after the response arrives, shown ~600ms before storing/navigating. Stage 2 can never appear before the response. Absolute 12s guard (`page.tsx:155`) → `fail()` clears timers and sets the error state; a late response after guard fires is ignored (`page.tsx:163`). Rejection → same error state as before. Stage names in `config.ts` untouched.

## Verification (review-fix pass)

```
$ npx tsc --noEmit        (from frontend/)
(exit 0, no output — zero errors project-wide)

$ npx eslint src/app/onboarding
(exit 0, no findings)
```

`config.ts` and `review.tsx` unchanged (no edits needed); no shared components, `globals.css`, or other files touched; no comments added.
