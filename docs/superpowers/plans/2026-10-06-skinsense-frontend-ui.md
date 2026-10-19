# SkinSense Frontend — Complete UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete SkinSense consumer frontend — landing, onboarding, profile, dashboard, routine, product checker, ingredient explorer, Ask SkinSense + voice, progress, settings/privacy — as one cohesive product with a mature Neo-Brutalist design system.

**Architecture:** Next.js App Router (client components) on the existing stack. Design-system-first: tokens in `globals.css` (Tailwind v4 `@theme`), shared primitives in `src/components/ui`, app shell in `src/components/shell`, domain cards in `src/components/domain`, data layer in `src/services` (existing raw-fetch pattern) + `src/lib` for context/local state. All skincare facts come from the existing backend; local-only features (chat, voice, progress, OCR) are clearly isolated and labeled, never faked as backend responses.

**Tech Stack:** Next 16.3.8, React 19.2.8, TypeScript 5 (strict), Tailwind CSS v4 (`@tailwindcss/postcss`), FastAPI backend at `http://localhost:8000/api/v1` (already running contracts). No new dependencies.

## Global Constraints

- **No new npm dependencies. No stack upgrades.** Only existing deps: next, react, react-dom, tailwindcss v4, typescript.
- **No code comments** (project rule: no comments unless asked).
- **No hardcoded skincare logic in UI** (no `if oily → use X`). Render validated backend results only.
- **No fake confidence numbers.** Never show "% compatible", "87% safe", scores 0–100 as numbers. Use the four contextual states: `Reasonably compatible`, `Consider carefully`, `Insufficient information`, `Safety escalation`.
- **No medical claims, no ecommerce pressure** (no Best/Product rankings, Buy Now, Must Have).
- **No raw technical errors in UI** (no 500s, TypeError, stack traces). Use friendly error states with Retry.
- **Mock isolation:** features without backend endpoints (Ask conversation, voice reasoning, progress journal, OCR) live in dedicated modules (`src/services/ask.ts`, `src/lib/voice.ts`, `src/services/progress.ts`, `src/services/ocr.ts`) and every non-backend answer carries a visible `DEMO` / source badge. Never label mock text as a backend AI response.
- **Backend API contract (do not invent fields):**
  - `GET /health/` → `{status, service, version}`
  - `GET /session/` → `{session_id}`
  - `GET /user-profile/` → `{id, skin_behavior, sensitivity, concerns[], current_products[], created_at, updated_at}`
  - `PUT /user-profile/` body `{skin_behavior?, sensitivity?, concerns?, current_products?}` → same shape
  - `POST /routine/generate` body `{skin_behavior, concerns}` → `{morning:[{step,category,purpose,why}], evening:[...], reasons[], safety_notes[]}`
  - `POST /ingredient/explain` body `{ingredient_name}` → `{ingredient_name, what_it_is, common_roles[], relevant_considerations[], sources[]}`
  - `POST /product/check` body `{product_name, ingredients[], skin_behavior, concerns}` → `{product_name, compatibility_score, warnings[], recommendations[], ingredient_analysis:[{ingredient, roles[], suitable, contraindications[]}]}`
  - `suitable` may be `true | false | null` (null = unknown ingredient → "Insufficient information" signal)
- **Voice:** browser Web Speech API for STT (`src/lib/voice.ts`); TTS only via `speechSynthesis` if used, labeled as local voice output. Voice feeds the same `askSkinSense` pipeline as text. ElevenLabs not connected → do not claim it.
- **OCR:** backend has no OCR endpoint → `src/services/ocr.ts` exposes `isAvailable()` (returns false) and the upload flow shows the honest OCR-unavailable/error state with a paste-ingredients fallback. Never fabricate extracted ingredients.
- **Persistence without backend:** routine history, progress journal, prefs (language/voice), onboarding notes → `localStorage` via `src/lib/storage.ts`. Be honest in Privacy copy.
- **Accessibility:** semantic HTML, keyboard reachable, visible focus (`:focus-visible`), `aria-live` for async status, non-color-only state indicators (icon/text), ≥4.5:1 contrast, `prefers-reduced-motion` respected (disable translate/hover motion).
- **Responsive:** mobile-first; bottom nav on mobile, top nav on desktop; single-column on small screens; touch targets ≥44px.
- **Route hygiene:** old routes `/product` and `/ingredient` become redirects to `/check-product` and `/ingredients`.

---

## File Structure

```
frontend/src/
  app/
    globals.css                 ← design tokens + component classes (EXISTS, rewrite)
    layout.tsx                  ← root: metadata, fonts, ProfileProvider, AppShell (EXISTS, rewrite)
    page.tsx                    ← landing (EXISTS, rewrite)
    onboarding/page.tsx         ← welcome → questionnaire → review (CREATE)
    dashboard/page.tsx          ← personal home (EXISTS, rewrite)
    skin/page.tsx               ← My Skin / profile editing (CREATE)
    routine/page.tsx            ← My Routine (CREATE)
    check-product/page.tsx      ← product checker + processing + OCR review + analysis (CREATE)
    ingredients/page.tsx        ← explorer (CREATE)
    ingredients/[name]/page.tsx ← detail (CREATE)
    ask/page.tsx                ← Ask SkinSense + voice (CREATE)
    progress/page.tsx           ← journal timeline (CREATE)
    settings/page.tsx           ← settings incl. privacy/data/about (CREATE)
    product/page.tsx            ← redirect → /check-product (EXISTS, rewrite)
    ingredient/page.tsx         ← redirect → /ingredients (EXISTS, rewrite)
  components/
    ui/
      Button.tsx  Card.tsx  ChoiceCard.tsx  Field.tsx  Badge.tsx
      StatusBanner.tsx  Loading.tsx  EmptyState.tsx  ErrorState.tsx
      SectionHeading.tsx  Modal.tsx  ProgressSteps.tsx
    shell/
      AppShell.tsx  TopNav.tsx  BottomNav.tsx
    domain/
      RoutineCard.tsx  IngredientCard.tsx  CompatibilityBlock.tsx
      AnswerCard.tsx  VoicePanel.tsx  ProfileSummary.tsx
  lib/
    profile-context.tsx         ← provider: loads profile once, exposes {profile, loading, refresh, save}
    storage.ts                  ← typed localStorage helpers (routine history, journal, prefs)
    voice.ts                    ← useVoiceInput hook: states ready/listening/processing/error/cancelled
    format.ts                   ← greeting(), slug helpers, date labels
  services/
    api.ts session.ts user-profile.ts ingredient.ts product.ts  (EXISTING, keep)
    routine.ts                  ← generateRoutine() typed (CREATE)
    ask.ts                      ← askSkinSense() with backend-first routing + demo fallback (CREATE)
    ocr.ts                      ← isAvailable() false + OCRUnavailable type (CREATE)
    progress.ts                 ← journal CRUD on localStorage (CREATE)
  types/
    user-profile.ts ingredient.ts (EXISTING, keep)
    routine.ts product.ts ask.ts progress.ts (CREATE)
```

---

## Design System Specification (Task 1 — build first)

### Tokens — `src/app/globals.css`

Tailwind v4. Exact palette (warm neutrals + terracotta + sage):

```css
@import "tailwindcss";

@theme {
  --color-paper: #f5efe6;
  --color-surface: #fffdf9;
  --color-ink: #1c1917;
  --color-ink-soft: #57534e;
  --color-ink-faint: #a8a29e;
  --color-line: #1c1917;
  --color-clay: #d2603a;
  --color-clay-deep: #b14a28;
  --color-sage: #4f6b54;
  --color-amber: #a16207;
  --color-rust: #9a3412;
  --color-blush: #f0d9cd;
  --color-moss: #e2ebe1;
  --color-honey: #f6e7c8;
  --color-sky: #dce7ef;
  --font-display: Georgia, "Times New Roman", Times, serif;
  --font-body: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}
```

Component classes (plain CSS, no `@apply`), in the same file:

```css
.brutal { border: 2px solid var(--color-line); background: var(--color-surface); }
.brutal-shadow { box-shadow: 4px 4px 0 var(--color-line); }
.brutal-shadow-sm { box-shadow: 2px 2px 0 var(--color-line); }
.brutal-shadow-lg { box-shadow: 6px 6px 0 var(--color-line); }
.brutal-hover { transition: transform .15s ease, box-shadow .15s ease; }
.brutal-hover:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--color-line); }
.brutal-hover:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--color-line); }
.btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
  border:2px solid var(--color-line); font-weight:600; cursor:pointer;
  min-height:44px; padding:.625rem 1.25rem; box-shadow:4px 4px 0 var(--color-line);
  transition:transform .15s ease, box-shadow .15s ease; }
.btn:hover { transform: translate(-2px,-2px); box-shadow:6px 6px 0 var(--color-line); }
.btn:active { transform: translate(2px,2px); box-shadow:1px 1px 0 var(--color-line); }
.btn:focus-visible, .choice:focus-visible, a:focus-visible, input:focus-visible,
textarea:focus-visible, button:focus-visible, [tabindex]:focus-visible {
  outline:3px solid var(--color-clay); outline-offset:2px; }
.btn-primary { background:var(--color-clay); color:#fffdf9; }
.btn-secondary { background:var(--color-surface); color:var(--color-ink); }
.btn-quiet { background:transparent; box-shadow:none; border-color:transparent; text-decoration:underline; }
.btn:disabled { opacity:.55; cursor:not-allowed; transform:none; box-shadow:4px 4px 0 var(--color-line); }
.choice { border:2px solid var(--color-line); background:var(--color-surface);
  padding:1rem 1.25rem; cursor:pointer; text-align:left; width:100%;
  box-shadow:3px 3px 0 var(--color-line); transition:transform .12s ease, box-shadow .12s ease; }
.choice:hover { transform: translate(-2px,-2px); box-shadow:5px 5px 0 var(--color-line); }
.choice[aria-pressed="true"], .choice[data-selected="true"] {
  background:var(--color-blush); box-shadow:3px 3px 0 var(--color-clay); border-color:var(--color-clay); }
.eyebrow { font-family:var(--font-body); font-size:.75rem; font-weight:700;
  letter-spacing:.14em; text-transform:uppercase; color:var(--color-ink-soft); }
.display { font-family:var(--font-display); font-weight:700; letter-spacing:-.01em; line-height:1.1; }
@media (prefers-reduced-motion: reduce) {
  .brutal-hover, .btn, .choice { transition:none !important; }
  .btn:hover, .choice:hover, .brutal-hover:hover { transform:none !important; }
}
```

Body defaults: `body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-body); }` — remove `@media (prefers-color-scheme: dark)` block (single light theme; dark-mode vars must not fight the Neo-Brutalist paper look).

Typography scale (use everywhere): display `text-4xl/5xl/6xl display`, page h1 `text-3xl sm:text-4xl display`, h2 `text-2xl display`, h3 `text-lg font-semibold`, body `text-base` (never smaller than `text-sm` for prose), meta `.eyebrow`.

### Primitives — exact props (Task 2)

`src/components/ui/Button.tsx`
```ts
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};
```
Renders `<button className={cx("btn", variantCls, sizeCls)}>`. `danger` = rust bg. `loading` shows inline spinner + `aria-busy`.

`src/components/ui/Card.tsx`
```ts
type CardProps = { children: React.ReactNode; className?: string; tone?: "default"|"blush"|"moss"|"honey"; as?: "div"|"section"|"article"; };
```
Base classes: `brutal brutal-shadow p-5 sm:p-6` + tone bg. Tones map to blush/moss/honey backgrounds.

`src/components/ui/ChoiceCard.tsx`
```ts
type ChoiceCardProps = { title: string; description?: string; selected: boolean; onSelect: () => void;
  multi?: boolean; icon?: React.ReactNode; name?: string; };
```
Renders `<button type="button" className="choice" data-selected={selected} aria-pressed={selected}>` with check indicator (✓ box) — selection never color-only.

`src/components/ui/Field.tsx` — `Input`, `Textarea`, `FieldLabel` (label+hint+error, wired via htmlFor/aria-describedby).

`src/components/ui/Badge.tsx`
```ts
type BadgeProps = { tone?: "ink"|"clay"|"sage"|"amber"|"muted"; children: React.ReactNode; };
```
2px border pill, uppercase meta type.

`src/components/ui/StatusBanner.tsx` — the safety language system:
```ts
type BannerTone = "normal" | "caution" | "uncertain" | "escalation" | "error" | "demo";
type StatusBannerProps = { tone: BannerTone; title: string; body?: string; children?: React.ReactNode; };
```
Fixed copy map (use verbatim):
- normal: title "Based on the information provided…", bg `surface`
- caution: title "Consider carefully", body "Some information is uncertain.", bg `honey`
- uncertain: title "Not enough information", body "SkinSense doesn't have enough reliable information to assess this confidently.", bg `sky`
- escalation: title "This may require professional attention.", body "SkinSense can't safely assess this situation.", bg `blush`, icon ⚠
- error: friendly error card (pair with ErrorState)
- demo: title "DEMO RESPONSE", body "This answer came from SkinSense's local demo layer — the reasoning endpoint isn't connected yet.", bg `honey`

`src/components/ui/Loading.tsx` — `Spinner` (aria-label), `LoadingStages({stages: string[], activeIndex: number})` — real stages only; `Skeleton` block.

`src/components/ui/EmptyState.tsx` / `ErrorState.tsx`
```ts
EmptyState: { icon?, title, body?, action?: {label, onClick|href} }
ErrorState: { title?, body?, onRetry? }  // default title "Something didn't go as planned."
```
ErrorState default body: "SkinSense couldn't complete that request right now." Never show raw errors.

`src/components/ui/SectionHeading.tsx` — `{ eyebrow?: string; title: string; sub?: string; }` editorial heading block.

`src/components/ui/Modal.tsx` — accessible dialog (focus trap-lite: focus first button, Esc closes, backdrop click closes, `role="dialog" aria-modal`). Used for delete-data confirm + history.

`src/components/ui/ProgressSteps.tsx` — `{ current: number; total: number; }` renders `01 / 06` eyebrow + segmented bar.

### App Shell (Task 3)

`AppShell.tsx` (client): reads `usePathname()`; on `/` and `/onboarding` renders children only (no nav, minimal header with wordmark). Else wraps in TopNav + `<main class="flex-1 pb-24 lg:pb-0">` + BottomNav.

`TopNav` (desktop `lg:flex`): wordmark "SKINSENSE" (display font, boxed with border) | links: Home, My Skin, Routine, Check Product, Ingredients, Ask | right: voice quick button (mic icon → `/ask?voice=1`) + Profile → `/settings`. Active link: underline offset / boxed bg. Mobile: compact top bar (wordmark + avatar/settings link).

`BottomNav` (mobile, `lg:hidden`, fixed): Home `/dashboard`, Routine `/routine`, Product `/check-product`, Ingredients `/ingredients`, Ask `/ask` — icon + label, active = clay color + top border, `aria-current="page"`.

`ProfileProvider` (`src/lib/profile-context.tsx`, client): loads `getProfile()` once, exposes `{profile, loading, error, refresh, save}` where `save(data)` calls `updateProfile` then refreshes. Wrapped in root layout.

### Services (Task 4)

- `routine.ts`: `generateRoutine(input: {skin_behavior: string; concerns: string[]}): Promise<RoutineResult>` — POST existing endpoint; types in `types/routine.ts` matching backend (`RoutineStep {step:number; category:string; purpose:string; why:string}`).
- `progress.ts`: `type JournalEntry = {id: string; date: string; title: string; note: string}`; `listEntries()`, `addEntry()`, `removeEntry()`, `clearAll()` — localStorage key `skinsense.journal`.
- `storage.ts`: `loadJSON<T>(key, fallback)`, `saveJSON(key, value)`, `removeKey(key)`; keys: `skinsense.routine.history`, `skinsense.routine.current`, `skinsense.prefs`, `skinsense.onboarding.notes`.
- `ask.ts`:
  ```ts
  type AskMessage = { id: string; role: "user"|"skinsense"; text: string; source: "backend"|"demo"; topic?: string };
  type AskResult = { text: string; source: "backend"|"demo"; topic?: string };
  askSkinSense(question: string, ctx: {topic?: string; productName?: string}): Promise<AskResult>
  ```
  Routing: if question/topic matches a known ingredient name (try `explainIngredient`) → build a plain-language answer from backend fields, `source:"backend"`. Else → demo answer from a small local template that references the user's stored routine/profile **without new skincare claims**, `source:"demo"`. Demo answers must include the `StatusBanner tone="demo"` label in UI.
- `ocr.ts`: `isAvailable(): boolean` → `false`; `type OcrUnavailable = { reason: "service_not_connected" }`.
- `voice.ts`: `useVoiceInput()` → `{state: "ready"|"listening"|"processing"|"error"|"cancelled", transcript, start(), stop(), reset(), supported}` using `window.SpeechRecognition || window.webkitSpeechRecognition`, `lang` from prefs (default `en-IN` to support Hinglish examples). If unsupported → `supported:false` → UI shows "Voice isn't available right now. You can ask SkinSense using text instead."

---

## Page Tasks

### Task 5: Landing `/` (rewrite `src/app/page.tsx`)
Client page. Sections in order, all using primitives:
1. **Hero** — eyebrow "YOUR SKINCARE COMPANION", h1 display: "Skincare decisions, made easier to understand." supporting copy about understanding skin context, routine, ingredients and products before deciding. CTAs: primary "Understand My Skin" → `/onboarding`; secondary "See How It Works" → `#how`. Hero visual: composed CSS/SVG collage of 4 labeled mini-cards ("Your skin profile", "Your routine", "Your product", "Ingredient"), **no generic AI imagery** — build from `.brutal` cards + simple SVG glyphs.
2. **Real Problem** (`#problem`) — SectionHeading "The real problem" — 5 editorial cards (quote-style, display font italic) with the exact questions from the spec ("How do I know my skin type?" … "How do I know whether my skincare is really working?").
3. **How SkinSense Helps** (`#how`) — 4 capability cards: Understand Your Skin → `/onboarding`, Build Your Routine → `/routine`, Check Your Products → `/check-product`, Understand Ingredients → `/ingredients`.
4. **Open AI** section — horizontal 6-step flow: Your context → Relevant knowledge → Open-weight AI → Validation → Safety → Response. Simple connected boxes with numbers, plain-language one-liners each (e.g. Validation: "Answers are checked in a fixed format before you see them."). Not an engineering dashboard.
5. **Voice section** — big quote card: "Ye serum mere routine ke saath theek rahega?" + "Ask naturally — by text or voice." + CTA → `/ask?voice=1`.
6. **Responsible AI** — 5 principle badges/cards: No diagnosis · No fake certainty · No blind product pushing · Clear uncertainty · Safety-first guidance.
7. **Final CTA** — full-width blush band: "Start Understanding Your Skin" primary → `/onboarding`.
Footer: wordmark + "Not a medical device. Educational decision support only."

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

### Task 8: My Skin `/skin` (create)
Sections, each a Card with display heading + value display + Edit toggle (inline edit form with Save/Cancel using local component state; Save → `save()` PUT → success `aria-live` "Saved."):
- **My Skin** — skin_behavior (ChoiceCards editing), **My Concerns** — multi chips, **Sensitivity**, **My Products** — chip list add/remove, **My Routine** — link card → `/routine`, **Language** (select: English / हिन्दी / मराठी — stored local prefs), **Voice** (toggle voice output + language for STT — local prefs), **Privacy** — link → `/settings#privacy`, **Data** — link → `/settings#data`.
Prefs save to `skinsense.prefs`; profile fields via API. Show "Not set" for unknowns.

### Task 9: Routine `/routine` (create)
- Title "My Routine" + sub "A simple routine based on what you've told SkinSense."
- Tabs MORNING / EVENING (client tab state, `role="tablist"`).
- Steps: `RoutineCard` per item: big step number `01` (display, boxed), category as name (capitalize), purpose as description, "WHY THIS IS HERE" eyebrow + `why` text. From backend only.
- Safety notes card: `StatusBanner tone="caution"` listing `safety_notes` under "Safety notes".
- Toolbar: **Regenerate** (calls API, 3-stage loading, pushes previous routine into `skinsense.routine.history` first — never destroys), **Edit Routine** (toggles per-step hide locally + note "Changes are saved on this device."), **Pause** (toggles `paused` flag with clear banner "Routine paused — SkinSense will keep it ready."), **View History** (Modal listing past routines w/ timestamps, restore), **Ask SkinSense** → `/ask?topic=routine`.
- Empty state: "You don't have a routine yet." + "Build My Routine" (uses profile; if no profile → CTA to onboarding).
- No profile fields → insufficient banner `uncertain`.

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

### Task 11: Ingredients `/ingredients` + `/ingredients/[name]`
- Explorer: title "Ingredients", sub "Skincare terms, explained simply." Search box (client filter over catalog; Enter also opens detail if exact-ish match). Sections: **Popular ingredients** (niacinamide, salicylic acid, hyaluronic acid, retinol, vitamin c, ceramide), **Common actives** (AHA, azelaic acid, benzoyl peroxide, peptides), **Categories** (Exfoliants, Hydrators, Barrier, Brightening, Acne care) — category chips filter the catalog list. Catalog = names + category only (navigation data, no claims). Cards show name (display) + category eyebrow + arrow → detail. Empty search → EmptyState "No ingredient found" + "Ask SkinSense about it" → `/ask?topic=<q>`.
- Detail `/ingredients/[name]`: client page, `explainIngredient({ingredient_name: name})`.
  - Editorial layout: eyebrow "INGREDIENT", h1 display name, one-line `what_it_is` big.
  - Sections: **What it does** → `common_roles` chips/list; **Why it's used** → roles phrased from backend? backend has only common_roles + considerations + sources. Structure: WHAT IT DOES (common_roles), WHY IT'S USED (first consideration? no — must not invent). Use: WHAT IT DOES = common_roles; WHAT TO KNOW = relevant_considerations; IN YOUR CONTEXT = profile-based context row (show user's skin_behavior/concerns as "You told SkinSense: …" + neutral line "Keep your own context in mind — SkinSense doesn't assume this ingredient suits everyone." — no logic); SOURCES = sources list.
  - Unknown ingredient: backend returns empty what_it_is?/note → show `StatusBanner tone="uncertain"` with the backend's consideration text.
  - CTAs: "Check a product with this" → `/check-product`, "Ask about this" → `/ask?topic=<name>` (preserves product context if `?product=` present: show "Discussing: <product>" chip).
  - Loading skeleton; error ErrorState retry.

### Task 12: Ask SkinSense `/ask` + voice
- Header: "Ask SkinSense" + "Ask about your routine, a product, or an ingredient."
- Context chip area: if `?topic=` or `?product=` → chip "Discussing: X" + clear (×) button (updates state, removes param).
- Suggested question cards (from real user problems): "What does niacinamide do?", "Why is this step in my routine?", "Can I add this product?", "Why do these two products feel different?" — tap to send.
- Messages: user (right, ink block), SkinSense (left, surface card). Backend-sourced answers → badge "From SkinSense knowledge"; demo → `StatusBanner tone="demo"` inside message. Input bar: textarea + Send; Enter submits (Shift+Enter newline).
- Voice: mic button in input bar → `VoicePanel` modal/inline strong central interaction:
  - states: ready → listening (big centered mic, animated dots `● ● ●`, "Ask naturally…", [Stop]) → processing ("Thinking…" with transcript shown) → answer appended to chat (same pipeline) → speaking (if speechSynthesis on, shows "Speaking" + Stop) → error / cancelled.
  - On transcript: show "You said: “…”" in chat as user message before answer.
  - `?voice=1` opens VoicePanel automatically.
  - unsupported → inline `StatusBanner tone="uncertain"` "Voice isn't available right now. You can ask SkinSense using text instead."
- Uses `askSkinSense` for every message (text and voice identical path).

### Task 13: Progress `/progress`
- Title "Progress" + sub "Your notes over time — not a diagnosis."
- Add-entry form: date (default today), title (e., "Started new serum"), note ("My skin felt slightly dry.") → saves local.
- Timeline: date rail (OCT 06 display) + entry cards; empty → EmptyState "No notes yet" with add CTA.
- Optional "What SkinSense notices" card: if ≥2 entries → plain observations built ONLY from note presence/order (e., "Here's a pattern SkinSense noticed in your notes: You've logged 3 entries since Oct 06.") with label "Observation from your notes" — no causality claims; if <2 → not shown.
- Delete entry via Modal confirm.

### Task 14: Settings `/settings` (incl. privacy/data/about)
Anchored sections (`#profile #privacy #data`), each a Card:
- **Profile** — summary + link `/skin`.
- **Preferences** — routine preferences chips (local), default landing = dashboard.
- **Language** — select (English/हिन्दी/मराठी) saved to prefs (honest note: "Interface language preference is saved on this device. SkinSense's answers are currently in English.").
- **Voice** — enable voice output toggle + STT language select + "Test voice" button (speechSynthesis sample) — honest note that voice output uses your device's built-in voice.
- **Privacy** card (plain language): What SkinSense stores (profile fields you entered: list them; routine history + journal entries on this device; nothing else), Images (product photos are processed on this device — the label-reading service isn't connected, so photos aren't uploaded), Voice (voice input is transcribed by your browser's built-in speech service; SkinSense doesn't store audio), Conversations (Ask history lives in this tab only and clears when you close it), no unsupported claims.
- **Data** card: "Delete your SkinSense data" danger button → Modal: title "Delete your SkinSense data?" body lists exactly what's deleted (this device's routine history, journal, preferences, onboarding notes, chat) + "Your saved profile on the server (skin type, concerns, products) can't be deleted from this screen yet — it was created as a single default profile." checkbox "I understand this can't be undone" enables [Delete data] → clears keys, shows success banner "Local data deleted." No dark patterns (Cancel prominent, equal).
- **About SkinSense**: what it is / is not ("SkinSense is an educational decision-support companion. It is not a dermatologist, not a diagnosis tool, not a store.") + version from health endpoint.

### Task 15: Redirects
- `src/app/product/page.tsx` → `redirect("/check-product")` (server component using `next/navigation`).
- `src/app/ingredient/page.tsx` → `redirect("/ingredients")`.
- Remove stray `src/globals.css` (unused duplicate).

### Task 16: Root layout (rewrite `src/app/layout.tsx`)
- Keep `next/font/google` Geist (already working) + metadata: title "SkinSense — Skincare decisions, made easier to understand", description from landing copy.
- `<ProfileProvider><AppShell>{children}</AppShell></ProfileProvider>` inside body.
- Add skip-link "Skip to content".

---

## Verification (after every batch)

- `cd frontend && npx next build` must pass with all routes green.
- `cd backend && python3 -m pytest -q` (9 tests) must stay green — backend untouched.
- Manual journey: landing → onboarding → review → dashboard → routine → check product (paste path) → ingredient detail → ask → voice panel opens → progress → settings → delete-data modal opens/cancels.
- Check at 360px, 768px, 1280px; keyboard tab through landing + onboarding; `prefers-reduced-motion` disables hover translate.

## Known Limitations (document in final summary)

- OCR/photo analysis unavailable (no backend endpoint) — honest fallback to paste.
- Ask conversation, voice reasoning, progress journal are local demo layers, labeled.
- Server-side profile deletion not available (no DELETE endpoint).
- Routine "Edit" (step hiding) is device-local.
