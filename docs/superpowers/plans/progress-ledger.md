# SkinSense Frontend UI — Progress Ledger

Adapted: no git repo (file-based briefs/reports, verification via `npx tsc --noEmit` + controller-run `npx next build`).

## Completed by controller (foundation)

- Task 1-4: design tokens (globals.css), UI primitives (Button, Card, ChoiceCard, Field, Badge, StatusBanner, Loading, EmptyState, ErrorState, SectionHeading, Modal, ProgressSteps), shell (AppShell/TopNav/BottomNav/icons), profile-context, storage/format/voice libs, services (routine, ask, ocr, progress), layout, redirects, stray file removed — build green (routes: /, /dashboard, /ingredient, /product)
- Task 5: landing page — built by controller
- Task 7: dashboard — built by controller
- tailwind.config.ts (stale, broken) removed — Tailwind v4 config lives in globals.css

## Task ledger

- Task 6: DONE — files: onboarding/page.tsx, config.ts, questions.tsx, review.tsx. Reviewed (Needs fixes → fixed): required single-select enforced (q1/q3), 44px chip remove, aria-live chip add, response-driven loading stages. Contrast fix applied by controller (btn-primary/badge/selected = clay-deep; wordmarks text-clay-deep). tsc exit 0, eslint exit 0.
- Task 8: DONE — files: skin/page.tsx, sections.tsx, local-store.ts. Per-section Save/Cancel; full-state save (backend PUT is not partial); EmptyState → /onboarding when no profile; chips editor w/ aria-live; Language/Voice prefs sections (local). Reviewer dispatch cancelled; implementation accepted by controller.
- Task 9: DONE — routine/page.tsx + components/domain/RoutineCard.tsx. MORNING/EVENING role="tablist"; safety notes caution banner; Regenerate (3-stage loading, previous pushed to history); Edit Routine (local); Pause banner; View History modal w/ Restore; Ask SkinSense → /ask?topic=routine; empty state; uncertain banner when no profile fields.
- Task 10: DONE — check-product/page.tsx + components/domain/CompatibilityBlock.tsx. 3 input tabs (photo/paste/details); OCR unavailable → honest "couldn't read" state; staged loading w/ real API; deriveCompatibility (insufficient/escalation/compatible/consider); known/uncertain columns; lastAnalysis persisted. Fixed: found + removed stale ChipsInput junk, unused imports; product/types ProductAnalysisMeta.recognized/unknown → number.
- Task 11: DONE — ingredients/page.tsx + ingredients/[name]/page.tsx + components/domain/IngredientCard.tsx. Catalog w/ search + category chips; detail calls /ingredient/explain with what_it_is + sections + in-your-context + sources; uncertain banner on empty; watch topic chip via ?product=; useCallback([name]) refresh (no comment hacks).
- Task 12: DONE — ask/page.tsx + components/domain/VoicePanel.tsx. Discussing chip; 4 suggested questions; backend answer for topic/known ingredient else demo layer w/ demo StatusBanner; voice (auto-start guard, listening/processing/speaking/error states, ?voice=1 deep link, transcript submit closes panel); TTS gated on prefs.voiceOutput; unsupported → honest banner; fixed export of UseVoiceInputResult (voice.ts); Suspense boundary for useSearchParams.
- Task 13: DONE — progress/page.tsx. Add note (date/title/note); Timeline w/ date rail; EmptyState; "What SkinSense notices" card only when ≥2 entries (plain observation, no causality); delete via Modal confirm.
- Task 14: DONE — settings/page.tsx. Anchored #profile/#preferences/#privacy/#data/#about; profile summary → /skin; routine-pref chips (local); language select (en/hi/mr); voice toggles + Test voice (speechSynthesis); privacy in plain language; delete-data Modal w/ checkbox → clearAllSkinSenseData() + success banner; About w/ version from /health. Card extended to accept id/aria-labelledby.

## Verification

- `npx tsc --noEmit` exit 0 (all pages/domain components).
- `npx next build` green — routes prerendered: /, /_not-found, /ask, /check-product, /dashboard, /ingredient, /ingredients, /onboarding, /product, /progress, /routine, /settings, /skin; ƒ /ingredients/[name].
- Runtime smoke: all 11 pages 200; /product & /ingredient → 307; backend /health/ 200.
- Backend API verified end-to-end: user-profile GET (seed) + PUT round-trip; routine/generate, ingredient/explain, product/check all return fallback JSON (models verified to match frontend services: RoutineGenerate, IngredientInfo, ProductCheck).
- Backend pytest: 2 tests pass (health + no-secret) — only backend tests present so far.
- Contrast rule v2 applied across shared + page components. Reduced-motion also stops animate-spin/pulse.
