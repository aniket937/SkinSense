### Task 10: Product Checker `/check-product` (create)
Single page, client-side steps: `input → processing → review? → result`.
- Header: "Check This Product" + "Understand what's in it and how it fits with what you already use."
- Input tabs (3, default first): **Upload Photo** / **Paste Ingredient List** / **Enter Product Details** — implemented as tablist; "Enter Product Details" = product name + brand (brand not sent to API, kept local, displayed "Brand: Not sent for analysis") + ingredients. Paste = product name optional + big textarea (one ingredient per line or comma-separated).
- Upload zone: `.brutal` dropzone, dashed inner, "Drop product photo — or choose an image", accepts `image/png,image/jpeg,image/webp`, ≤8MB client check (error banner if exceeded). After file selected: preview thumbnail card + **Replace** / **Remove**. Constraints line under zone.
- On Analyze from upload: processing card showing real local stages ("Preparing image" → "Reading label") then since `ocr.isAvailable()===false` → OCR error state: title "We couldn't read enough from this image." body "Try: a clearer photo, better lighting, a closer crop — or enter the ingredient list manually." + buttons [Enter ingredients manually] (switch tab) [Try another photo]. **No fabricated extraction. No fake progress.**
- Paste/Details analyze: validate (≥1 ingredient else field error) → LoadingStages with **real** stages: "Reading what you entered" (local validation, immediate) → "Comparing with your routine" (during actual POST) → result. On API failure → `ErrorState` "SkinSense couldn't complete this analysis right now. Your information hasn't been lost." + Try Again (retains inputs).
- **Result view** (the polished screen):
  1. Product Overview card: product_name (or "Unnamed product"), Brand: "Not available" (never invent), state badge.
  2. **CompatibilityBlock** (domain): derive from backend only:
     - `insufficient` if every ingredient_analysis entry has `suitable === null`
     - else if any recommendation contains "Consult a dermatologist" → `escalation` (banner escalation text + "What to check")
     - else if any recommendation contains "compatible" (the "appears compatible" text) AND `warnings.length === 0` → `compatible`
     - else → `consider`
     Title "How it fits your routine", label the state, then "Why:" bullet list from `warnings` (or "No conflicts were reported in this check" for compatible), "What to check:" static neutral list (ingredient list, current routine, how your skin responds). **Never render the numeric score.**
  3. **What We Found** — `warnings` list + `recommendations` list as plain bullets (label recommendations "Recommendations from this check").
  4. **Key Ingredients** — grid of `IngredientCard` from `ingredient_analysis`: name, roles joined (backend strings), suitable tag (`Compatible with your context` / `Check this one` / `Unknown — not in SkinSense's reference`) + contraindications as small list; "Learn more" → `/ingredients/${slug(name)}`.
  5. **Things to Consider** — safety_notes-style: warnings + standard neutral reminders? Only backend text. Plus if escalation → full-width escalation banner **and suppress nothing** — keep analysis visible but banner on top (spec: don't continue rendering normal recommendation as if nothing happened → escalation banner must appear above compatibility block).
  6. **What SkinSense Knows / What is uncertain** two-column: Knows ✓ "Ingredient list provided", "X ingredients recognized from the reference list"; Uncertain ? "Exact concentration is unavailable", "Brand is not available", per unknown ingredient "Ingredient wasn't in the reference list", "Label text may be incomplete" when free-form paste.
  7. CTAs: "Ask SkinSense about this" → `/ask?product=<name>`, "Explore an ingredient" → `/ingredients`.
