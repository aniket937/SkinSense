### Task 6: Onboarding `/onboarding` (create)
Single client page, local step state (no router per step). Flow:
`welcome → why → q1..q6 → review → done(build routine)`.
- Welcome: calm centered card — "Let's understand your skin before we change your routine." + CTA "Begin".
- Why: 3 short cards (understand your context / build a routine that explains itself / check products before buying).
- Questions with `ProgressSteps current={i} total={6}` ("01 / 06"):
  1. "How does your skin usually feel?" single → skin_behavior values `oily|dry|combination|normal` (ChoiceCards: with short neutral descriptions e., "Tends to look shiny by midday").
  2. "What do you notice most?" multi → concerns pool `[acne, dryness, oiliness, sensitivity, uneven texture]` (backend compares `acne|dryness|oiliness|sensitivity` substrings; `uneven texture` passes through harmlessly).
  3. "How sensitive is your skin?" single → `low|medium|high` (copy: "How easily does your skin react to new products?").
  4. "What products do you currently use?" free text + chip entry (comma/Enter) → current_products; skippable ("Skip for now").
  5. "Any preferences for your routine?" multi → `[quick routine, minimal steps, gentle actives, budget-friendly]` stored in localStorage prefs `skinsense.onboarding.prefs` (NOT sent to backend — API has no preferences field).
  6. "Anything else SkinSense should know?" optional textarea → localStorage `skinsense.onboarding.notes`.
- Back navigation preserves answers. Each step has one primary "Continue" + quiet "Back".
- Review: two clearly separated blocks — **"You told SkinSense…"** (facts from questions, `.brutal` surface cards) vs **"SkinSense suggests…"** (plain inferences, e. skin_behavior label mapping presented as suggestion with badge "Suggested from your answers", plus "Not provided" rows for skipped fields). Edit buttons jump back to the step. Primary "Confirm & Continue" → `updateProfile()` (PUT) → next.
- Done: "Your profile is ready." + "Build my first routine" → generate routine via `generateRoutine` (loading stages: "Reading your profile" → "Building your plan" → "Reviewing the result") → store current+history → `/dashboard`. Secondary "Go to dashboard".
