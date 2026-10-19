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
  - **Contrast resolution (v2, controller-applied):** `--color-clay` (#d2603a) is decorative accent only. For TEXT on light surfaces and for primary/danger button fills and selected/active state fills, use `--color-clay-deep` (#b14a28, 5.3:1). `.btn-primary` and Badge/ChoiceCard/Loading selected states already use `clay-deep` (fixed). Rule for new code: any `text-clay`/`bg-clay` you write on papis surface must be replaced with `text-clay-deep`/`bg-clay-deep` unless the clay element is purely decorative (e.g. focus outline, 3px shadow accent, ProgressSteps bar fill which is non-text ≥3:1).
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
