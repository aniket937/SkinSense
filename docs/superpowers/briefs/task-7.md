### Task 7: Dashboard `/dashboard` (rewrite)
Client page using `useProfile()`.
- Greeting (time-of-day via `format.ts`): "Good morning." / "Good afternoon." / "Good evening." + sub "Let's make today's skincare decisions a little simpler."
- **Your Skin Context** card: skin_behavior, sensitivity, concerns chips, product count — if empty → EmptyState "No profile yet" + CTA "Understand My Skin" → `/onboarding`. Link "Edit" → `/skin`.
- **Today's Routine** card: from `skinsense.routine.current` — shows morning/evening step counts + first two steps; empty → "No routine yet" + primary "Build My Routine" → routine page.
- Action grid (3 cards): **Check a Product** (clay tone, big) → `/check-product`; **Explore Ingredients** → `/ingredients`; **Ask SkinSense** → `/ask`.
- **Voice card** (moss tone): "Prefer speaking?" + "Ask by voice" → `/ask?voice=1`.
- **Progress** small card: entry count from journal + "Open journal" → `/progress`.
- Backend status chip (status/session from existing services, small meta line in footer of page or top-right) — keep, but subtle.
- Loading: skeleton cards. Error: `ErrorState` with retry.
