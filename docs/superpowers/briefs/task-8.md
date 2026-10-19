### Task 8: My Skin `/skin` (create)
Sections, each a Card with display heading + value display + Edit toggle (inline edit form with Save/Cancel using local component state; Save → `save()` PUT → success `aria-live` "Saved."):
- **My Skin** — skin_behavior (ChoiceCards editing), **My Concerns** — multi chips, **Sensitivity**, **My Products** — chip list add/remove, **My Routine** — link card → `/routine`, **Language** (select: English / हिन्दी / मराठी — stored local prefs), **Voice** (toggle voice output + language for STT — local prefs), **Privacy** — link → `/settings#privacy`, **Data** — link → `/settings#data`.
Prefs save to `skinsense.prefs`; profile fields via API. Show "Not set" for unknowns.
