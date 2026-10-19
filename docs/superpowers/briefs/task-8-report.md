# Task 8 Report — My Skin `/skin` profile page

**Status:** DONE

## What was found / done

`src/app/skin/page.tsx`, `src/app/skin/sections.tsx`, and `src/app/skin/local-store.ts` already existed when this task started (complete implementation). I reviewed them line-by-line against `task-8.md` + `00-shared-context.md`, made two small accessibility fixes, and verified.

### Files created/changed

- `frontend/src/app/skin/page.tsx` — changed (added `aria-describedby` hint wiring to both `<select>` elements so `FieldLabel` hints are programmatically associated)
- `frontend/src/app/skin/sections.tsx` — reviewed, unchanged
- `frontend/src/app/skin/local-store.ts` — reviewed, unchanged

### Brief compliance (verified section by section)

| Brief item | Status |
|---|---|
| Each section = Card + display heading + value display + Edit toggle, inline edit form with Save/Cancel, local component state | ✓ `SectionCard` |
| Save → `save()` PUT → success `aria-live` "Saved." | ✓ per-section `aria-live="polite"` region renders "Saved." only after success; page-level `StatusBanner tone="normal"` "Changes saved" (role=status) |
| My Skin — `skin_behavior` ChoiceCards editing | ✓ `skinFeelOptions` (oily/dry/combination/normal) |
| My Concerns — multi chips | ✓ chips + input, Enter/comma commit, quick picks, removable (44px remove buttons), `aria-live` add/remove announcements |
| Sensitivity — ChoiceCards | ✓ `sensitivityOptions` (low/medium/high) |
| My Products — chip list add/remove | ✓ |
| My Routine — link card → `/routine` | ✓ |
| Language — select English / हिन्दी / मराठी, local prefs | ✓ saved to `skinsense.prefs` (merged, not overwritten) |
| Voice — toggle voice output + STT language, local prefs | ✓ `skinsense.prefs`, footnote "Saved on this device only." |
| Privacy → `/settings#privacy`, Data → `/settings#data` | ✓ |
| Prefs → `skinsense.prefs`; profile → API; "Not set" for unknowns | ✓ |
| Empty profile → EmptyState CTA "Understand your skin first" → `/onboarding` | ✓ (exact wording); link/pref sections still render below it |
| Onboarding notes read-only card "Notes from your onboarding", never sent to backend | ✓ |

### Full-state PUT (backend non-partial hazard)

`buildFullState()` always sends all four fields on every profile save: `concerns` and `current_products` unconditionally (from draft or current profile), `skin_behavior`/`sensitivity` whenever they are non-empty (current value otherwise). Omitted fields are only ones already null, so no existing data can be wiped by a section-scoped save. Prefs sections never call `save()` — local only.

### Honest save/error behavior

- No persistence implied before save: edits live in draft state; value display only updates after `save()` resolves (context updates profile).
- Success: "Saved." (per-section live region) + "Changes saved" banner; banner cleared when a new edit starts.
- Failure: stays in edit mode, drafts intact, inline `ErrorState` "Couldn't save your changes." with Try again; never claims saved; no raw errors.

### Accessibility / contrast / responsive review

- Labels: every select/input/checkbox labelled (`FieldLabel`, wrapping `<label>`); hints now wired via `aria-describedby` (fix applied this task).
- `aria-live`: "Saved." per section, chip add/remove status, banner `role="status"`.
- Focus: section heading receives focus on edit open/close (`tabIndex={-1}`); visible `:focus-visible` outline comes from globals.
- Touch targets ≥44px: `.btn` (min-height 44), `.choice`, chip remove buttons (`h-11 w-11`), quick-pick chips (`min-h-11`), `.field` selects (min-height 44).
- Non-color-only state: ChoiceCard ✓ box, chip ✓/+ glyphs, "Not set" wording.
- Contrast (v2 rule): no `text-clay`/`bg-clay` anywhere in `src/app/skin` (grep-verified). Selected chips use `bg-clay-deep text-surface` (5.3:1); "Saved." uses `text-sage` (~5.8:1); body/secondary text uses `text-ink-soft`.
- 360px: single column, `max-w-3xl px-5`, wrapping value/badge rows, flex-wrap chip lists; no fixed widths found.
- Reduced motion: page adds no animations; globals disables `.btn`/`.choice` transitions/hover transforms. No custom transforms added.
- No code comments, no new dependencies, no edits to shared components.

## Verification

- `npx tsc --noEmit` → exit 0 (no errors, pre-existing or new).
- `./node_modules/.bin/eslint src/app/skin` → exit 0, no warnings (took 2m09s).
  - Note: `npx eslint src/app/skin` and `npm run lint -- src/app/skin` timed out (>2–3 min) — npx/npm overhead on the WSL-mounted `/mnt/d` filesystem; the equivalent direct binary invocation passes.
- `next build` not run (per controller instruction).

## Concerns (minor, non-blocking)

1. ESLint/npx invocation is pathologically slow in this environment; lint did pass via local binary.
2. Shared `Button.tsx` uses `animate-spin` for its loading spinner, which is not disabled by the globals `prefers-reduced-motion` block (transitions only). Shared component — reported, not fixed.
3. Brief allows either single "Save changes" button or per-section Save/Cancel; per-section was chosen because the brief text explicitly specifies "inline edit form with Save/Cancel" per section.
