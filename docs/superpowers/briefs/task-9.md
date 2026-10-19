### Task 9: Routine `/routine` (create)
- Title "My Routine" + sub "A simple routine based on what you've told SkinSense."
- Tabs MORNING / EVENING (client tab state, `role="tablist"`).
- Steps: `RoutineCard` per item: big step number `01` (display, boxed), category as name (capitalize), purpose as description, "WHY THIS IS HERE" eyebrow + `why` text. From backend only.
- Safety notes card: `StatusBanner tone="caution"` listing `safety_notes` under "Safety notes".
- Toolbar: **Regenerate** (calls API, 3-stage loading, pushes previous routine into `skinsense.routine.history` first — never destroys), **Edit Routine** (toggles per-step hide locally + note "Changes are saved on this device."), **Pause** (toggles `paused` flag with clear banner "Routine paused — SkinSense will keep it ready."), **View History** (Modal listing past routines w/ timestamps, restore), **Ask SkinSense** → `/ask?topic=routine`.
- Empty state: "You don't have a routine yet." + "Build My Routine" (uses profile; if no profile → CTA to onboarding).
- No profile fields → insufficient banner `uncertain`.
