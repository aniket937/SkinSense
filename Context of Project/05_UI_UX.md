# SkinSense — UI/UX Specification

## 1. Purpose

This document defines the user experience and interface requirements for SkinSense.

It covers:

- information architecture,
- screen hierarchy,
- interaction behavior,
- visual direction,
- component behavior,
- responsive behavior,
- loading/error/empty states,
- accessibility,
- content presentation,
- and UX consistency.

This document is the primary source of truth for the **frontend user experience**.

It does not define:

- backend implementation,
- AI model implementation,
- database structure,
- prompt engineering,
- skincare scientific knowledge,
- security architecture,
- deployment architecture.

Those responsibilities belong to their respective project documents.

---

# 2. UX Goal

SkinSense should feel like a calm, intelligent and approachable skincare companion.

The interface should help the user answer:

> "What makes sense for my skin?"

without making the experience feel like:

- a medical diagnostic system,
- an ecommerce website,
- a complicated skincare dashboard,
- or a generic chatbot.

The interface should reduce cognitive load rather than add more information.

---

# 3. Core UX Principles

## 3.1 Clarity First

Every screen should have one clear primary purpose.

Users should immediately understand:

- where they are,
- what they can do,
- what the system needs from them,
- and what the next action is.

---

## 3.2 Personal, Not Generic

When the application knows something about the user, the UI should reflect that context.

Instead of:

> "Recommended Routine"

prefer:

> "Your Routine"

Instead of:

> "Product Analysis"

prefer:

> "How this product fits your routine"

The interface should communicate that the system is working with the user's personal context.

---

## 3.3 Explainable

Important AI results must be understandable.

The UI should not only show:

> "Recommended"

It should provide access to:

> "Why?"

The user should be able to understand the relevant reasoning summary without being exposed to internal chain-of-thought or hidden model reasoning.

---

## 3.4 Calm Over Clinical

The product should feel trustworthy without looking like a hospital interface.

Avoid:

- excessive warning colors,
- dense medical dashboards,
- technical-looking data grids,
- unnecessary graphs,
- overly clinical terminology.

Use clear hierarchy, whitespace and conversational explanations.

---

## 3.5 User Remains in Control

AI suggestions are suggestions.

The UI should make it clear that the user:

- reviews recommendations,
- decides whether to use them,
- can edit their profile,
- can reconsider a product,
- and can change the routine.

The system should not visually imply that the AI has made a mandatory decision for the user.

---

## 3.6 Progressive Disclosure

Do not show every piece of information immediately.

Primary result first.

Additional details should be accessible through:

- expandable sections,
- "Why?",
- "View ingredients",
- "See considerations",
- "Learn more".

This keeps the interface readable while preserving depth.

---

# 4. Information Architecture

The application should conceptually contain:

```text id="x3fj1a"
SkinSense
│
├── Home / Dashboard
│
├── My Skin
│
├── My Routine
│
├── Check Product
│
├── Ingredient Explorer
│
├── Ask SkinSense
│
├── Progress
│
└── Profile / Settings
```

The exact navigation pattern can change based on responsive design.

The core capabilities must remain easy to discover.

---

# 5. Primary Navigation

The primary navigation should provide access to the most important product capabilities.

Recommended conceptual destinations:

### Home
Overview and quick actions.

### My Routine
Current routine and routine explanations.

### Check Product
Product evaluation workflow.

### Ask
Text/voice questions.

### Progress
Optional tracking and observations.

### Profile
Personal information and preferences.

The interface should avoid cluttering the main navigation with secondary utilities.

---

# 6. First-Time Experience

The first-time user should not immediately encounter a complex dashboard.

The first experience should establish the product's purpose and move directly toward understanding the user.

Conceptual flow:

```text id="s71og2"
Welcome
   ↓
What SkinSense Does
   ↓
Understand My Skin
   ↓
Questions
   ↓
Review
   ↓
Profile Created
   ↓
Build My Routine
```

---

# 7. Landing / Welcome Screen

## Goal

Quickly communicate the value of SkinSense.

The screen should establish:

### Primary message

> **Understand your skin. Make smarter skincare decisions.**

### Supporting message

> SkinSense helps you understand your routine, ingredients and products in the context of your own skincare needs.

### Primary CTA

> **Understand My Skin**

### Secondary CTA

Depending on the final onboarding strategy:

> **Check a Product**

The secondary action should not distract from the primary first-time journey.

---

# 8. Onboarding Screen

The onboarding should feel like a conversation rather than a long survey.

Recommended structure:

```text id="b3j4ey"
Progress indicator
       ↓
Question
       ↓
Answer options
       ↓
Continue
```

Questions should generally be presented one or a small number at a time rather than putting the entire questionnaire into one giant form.

---

# 9. Questionnaire UX

## Question Presentation

Each question should contain:

- concise heading,
- optional short explanation,
- answer controls,
- progress indication,
- next/continue action.

Example:

> **How does your skin usually feel after washing?**

Possible options may be presented as cards or selectable options.

The exact question set is governed by the validated product requirements and should not be invented by the frontend.

---

# 10. Questionnaire Interaction

When the user selects an answer:

- selection should be visually obvious,
- the choice should remain editable,
- the system should avoid unnecessary confirmation dialogs,
- progressing should feel immediate.

For multi-select questions:

- selected items should remain visually persistent,
- the user should know whether multiple answers are allowed.

---

# 11. Questionnaire Progress

The interface should communicate progress without creating pressure.

Recommended:

> **Step 3 of 8**

or a subtle progress indicator.

Avoid:

> **You are only 37% done!**

The tone should remain calm.

---

# 12. Questionnaire Back Navigation

The user must be able to move backward.

When returning to an earlier question:

- previous answers should remain available,
- previously entered information should not be lost,
- changing an answer should update the stored session context.

---

# 13. Questionnaire Completion

After the final question:

```text id="7iwr4m"
Review Your Answers
       ↓
Edit
       ↓
Confirm
```

The review screen should provide a concise summary rather than displaying raw internal data.

---

# 14. Skin Profile Screen

After processing the questionnaire, the user receives a personal context summary.

Conceptual structure:

```text id="5jvy0x"
Your Skin Profile

Skin context
[summary]

Main concerns
[items]

Current routine
[items]

Preferences
[items]

What is still unknown
[items if applicable]

Edit Profile
Build My Routine
```

---

# 15. Profile Confidence and Uncertainty

The UI should distinguish between:

### User-provided information

Information directly supplied by the user.

### System interpretation

A system-generated summary based on those inputs.

### Unknown

Information the system does not have enough information to determine.

Avoid presenting inferred information with stronger visual certainty than user-provided information.

---

# 16. Dashboard

The dashboard should be the main home for returning users.

It should prioritize the user's most relevant actions.

Recommended hierarchy:

```text id="0z9gm0"
Greeting / context
       ↓
Current routine snapshot
       ↓
Quick actions
       ↓
Recent product insights
       ↓
Progress snapshot
```

---

# 17. Dashboard Primary Actions

The most prominent actions should be:

### Build / Review My Routine

Open the current routine.

### Check a Product

Start product analysis.

### Ask SkinSense

Ask a text or voice question.

The user should not need to search through menus to reach these capabilities.

---

# 18. Routine Screen

The routine screen should prioritize practical use.

Recommended structure:

```text id="x4jji0"
Your Routine

[Morning] [Evening]

Step 1
Product/category
Purpose

Step 2
Product/category
Purpose

Step 3
Product/category
Purpose

Why this routine?
Considerations
Edit / Regenerate
```

---

# 19. Morning / Evening Switching

Morning and evening routines should be visually distinguishable without relying solely on color.

The active state should be communicated through:

- text,
- spacing,
- shape,
- iconography,
- and state styling.

A user should understand the selection even in grayscale.

---

# 20. Routine Step Card

Every meaningful routine step should communicate:

### Step number

Example:

> 01

### Product/category

Example:

> Cleanser

### Purpose

Short explanation.

### Why

Expandable explanation.

### Optional state

If the step is optional, that should be explicit.

---

# 21. Routine Explanation

When the user selects "Why?":

The UI should reveal a concise explanation.

Example structure:

```text id="y5zheh"
Why this?

Based on your skin context and concerns,
this step was included because...

Things to consider:
...
```

The content should be understandable without skincare expertise.

---

# 22. Routine Editing

Users should be able to modify the routine where supported.

Actions may include:

- remove a step,
- replace an existing product,
- mark a product as currently owned,
- regenerate after profile changes.

Editing should not require rebuilding the entire profile.

---

# 23. Regeneration UX

When regeneration is requested:

```text id="8m9m2g"
Current Routine
       ↓
Regenerate
       ↓
Processing
       ↓
Updated Routine
```

The interface should avoid implying that regeneration guarantees improvement.

If meaningful changes occurred, the UI may explain:

> "Your routine changed because..."

---

# 24. Product Checker Entry Screen

Primary heading:

> **Check a product before you add it to your routine.**

Supporting message:

> Understand the ingredients and see how the product relates to what you already use.

Input choices:

```text id="zozxyy"
Upload Product
Paste Ingredients
Enter Product Information
```

The simplest supported input should be the most visually prominent.

---

# 25. Product Image Upload UX

The upload area should clearly communicate:

> **Take or upload a clear product photo**

Support:

- file selection,
- drag-and-drop on desktop where appropriate,
- camera capture on supported mobile devices.

A short helper text may explain that the ingredient label should be readable.

---

# 26. Product Image Quality State

Before processing, the interface may identify obvious quality problems.

Possible message:

> **The ingredient text looks difficult to read. Try a clearer photo.**

Actions:

> Try Again  
> Paste Ingredients Instead

Do not silently send an unreadable image and present fabricated results.

---

# 27. Product Processing State

AI processing should show meaningful status.

Conceptual states:

```text id="0wyw8m"
Reading product
      ↓
Finding ingredients
      ↓
Understanding ingredients
      ↓
Comparing with your routine
      ↓
Preparing your result
```

These should be presented as user-facing progress states, not internal technical logs.

---

# 28. Product Result Screen

The primary result should be easy to scan.

Recommended order:

```text id="ssm8ki"
Product
   ↓
Overall assessment
   ↓
Why?
   ↓
Key ingredients
   ↓
Routine fit
   ↓
Things to consider
   ↓
Ingredient details
```

---

# 29. Product Assessment UX

The UI should avoid exaggerated binary language.

Avoid:

> PERFECT FOR YOU ✅

Prefer:

> **Looks compatible with your current routine**

or:

> **Worth considering carefully**

or:

> **Not enough information to assess confidently**

The exact wording depends on the analysis result.

---

# 30. Product Assessment Visuals

Assessment states should never rely on color alone.

Use combinations of:

- label,
- icon,
- text,
- supporting explanation.

Possible semantic states:

```text
Compatible
Consider
Limited information
Professional guidance recommended
```

The UI should not imply medical certainty.

---

# 31. Product Explanation

The user should be able to answer:

> "Why did SkinSense give me this result?"

The explanation should connect:

```text id="r32i6i"
My context
+
Product information
+
Relevant ingredients
```

into a concise user-facing explanation.

---

# 32. Ingredient Section

Key ingredients should be displayed as clear, scannable items.

Example:

```text id="x9gqf1"
Niacinamide
Common role
Short explanation
[Learn more]

Glycerin
Common role
Short explanation
[Learn more]
```

The user should not be presented with a wall of ingredient descriptions.

---

# 33. Ingredient Detail Flow

Selecting an ingredient opens a detail view containing:

- ingredient name,
- simple explanation,
- common skincare role,
- relevant considerations,
- relationship to the current product where appropriate.

The detail view should support returning to the product analysis without losing context.

---

# 34. Ask SkinSense Screen

The question experience should feel conversational but remain product-focused.

Conceptual structure:

```text id="igxz5u"
Ask SkinSense

[Conversation area]

Type your question...

        🎙 Voice
        Send
```

The interface should make it easy to switch between typing and voice.

---

# 35. Conversational Context

The conversation should preserve relevant context during the session.

For example, after checking a product:

> "What about using it at night?"

the user should not need to repeat which product they are discussing if the context is still active.

The system should avoid pretending to remember information it no longer has access to.

---

# 36. Voice Interaction UX

Voice should feel like an extension of the existing interface.

Recommended states:

```text id="0i1eal"
Tap microphone
    ↓
Listening
    ↓
Processing
    ↓
Answer
    ↓
Optional voice playback
```

---

# 37. Voice Input UI

While recording:

- microphone control should visibly indicate active recording,
- there should be a clear stop action,
- the user should know when recording has ended,
- accidental recordings should be easy to cancel.

Avoid forcing users to wait silently without feedback.

---

# 38. Voice Output UI

When voice output is available:

- provide play/pause control,
- indicate that the response is being spoken,
- allow the user to continue reading the text response,
- do not hide important information exclusively inside audio.

Text should remain available as the authoritative user-facing response.

---

# 39. Progress Screen

If progress tracking is enabled, the screen should remain lightweight.

Recommended:

```text id="nxk3tg"
Progress

Products you're tracking
Recent observations
Timeline
Simple pattern summary
```

Avoid turning the progress screen into an overly complex analytics dashboard.

---

# 40. Progress Entry

A user may add:

- date,
- product,
- personal observation.

Example:

> "Skin felt less oily this week."

The UI should encourage factual personal observations rather than asking users to produce medical conclusions.

---

# 41. Progress Summary

AI-generated summaries should visually distinguish:

### Your observations

What the user actually recorded.

### Pattern noticed

A system-generated summary of those observations.

### Limitation

A short reminder that the pattern does not establish medical causation.

---

# 42. Profile Screen

The profile area should allow users to review and edit their personal context.

Suggested sections:

```text id="y3s3aa"
Skin Profile
Current Routine
Preferences
Voice Preferences
Data / Privacy
```

Only supported settings should be displayed.

---

# 43. Edit Profile UX

Editing should preserve previously entered information.

The user should be able to change:

- skin-related observations,
- concerns,
- routine,
- preferences,
- other supported profile information.

After saving, the UI should clearly indicate whether the change may affect the routine or product analysis.

---

# 44. Empty States

Empty states should teach the user what they can do next.

### No profile

> **Let's understand your skin first.**

CTA:

> Understand My Skin

### No routine

> **Your personalized routine hasn't been created yet.**

CTA:

> Build My Routine

### No product history

> **Check your first product to start building your skincare context.**

CTA:

> Check a Product

### No progress entries

> **Nothing tracked yet. Add an observation when you want to.**

---

# 45. Loading States

All AI-powered operations should use explicit loading states.

Loading UI should communicate:

- what is happening,
- that processing is active,
- and that the user should not repeatedly submit the same request.

Avoid meaningless spinners without context for longer AI operations.

---

# 46. Error States

Error messages should answer three questions:

1. What happened?
2. What can the user do?
3. Was their information preserved?

Example:

> **We couldn't read the ingredient list clearly.**
>
> Try a clearer photo or paste the ingredients manually.

Actions:

> Try Again  
> Paste Ingredients

---

# 47. AI Uncertainty State

When the AI cannot confidently determine an answer:

The UI should not present the result as a normal confident recommendation.

Use language such as:

> **We don't have enough information to assess this confidently.**

Then provide the most relevant next action.

---

# 48. Safety State

When a user asks something outside SkinSense's safe scope, the response should remain calm and informative.

The UI should avoid creating a dramatic alarm state unless genuinely necessary.

Example:

> **This may need professional evaluation.**

Then explain the boundary and provide an appropriate next step.

Detailed safety content belongs in `12_SAFETY.md`.

---

# 49. Toasts and Notifications

Use transient notifications only for lightweight confirmations.

Good examples:

> Profile updated.

> Routine saved.

> Product added.

Avoid putting important AI explanations or safety information inside temporary toasts.

Important information must remain visible in the main interface.

---

# 50. Modal Usage

Modals should be used sparingly.

Appropriate uses:

- destructive confirmation,
- focused detail views,
- quick edits,
- permission requests where necessary.

Do not put the primary skincare analysis inside a small modal.

Important information deserves a full contextual view.

---

# 51. Visual Direction

SkinSense should have a **calm, modern wellness aesthetic**.

The design should feel:

- clean,
- warm,
- premium but approachable,
- minimal,
- intelligent,
- trustworthy.

It should avoid looking like:

- a hospital portal,
- an ecommerce store,
- a social media app,
- or a generic AI dashboard.

The exact color palette should be selected during implementation based on this visual direction and must remain accessible.

Do not treat any previously used project color palette as a mandatory SkinSense requirement unless explicitly adopted into the final design system.

---

# 52. Typography

Typography should prioritize readability.

General hierarchy:

```text
Display / Hero
↓
Page title
↓
Section title
↓
Card title
↓
Body
↓
Supporting text
```

Avoid excessive font-weight variation.

Body text should remain comfortable to read on both desktop and mobile.

---

# 53. Color Semantics

Color should communicate meaning consistently.

Potential semantic categories include:

- neutral,
- information,
- positive,
- caution,
- safety.

However, color must never be the only method of communicating state.

Every semantic state should also have:

- text,
- iconography,
- or structural distinction.

---

# 54. Cards

Cards should be used for grouped information, not every individual piece of content.

Useful card types include:

- routine step,
- ingredient,
- product insight,
- profile summary,
- progress observation.

Avoid nesting cards unnecessarily.

---

# 55. Buttons

Each screen should have one clear primary action where practical.

Button hierarchy:

### Primary
Main task completion.

### Secondary
Alternative or supporting action.

### Tertiary
Low-priority action.

Avoid multiple buttons competing visually for attention.

---

# 56. Forms

Forms should:

- use clear labels,
- provide useful defaults where appropriate,
- explain uncommon inputs,
- show validation close to the relevant field,
- avoid unnecessary required fields.

Validation messages should be human-readable.

---

# 57. Responsive Design

SkinSense must work across:

- desktop,
- tablet,
- mobile.

The mobile experience is important because skincare-related interactions such as product scanning and voice input are naturally suited to mobile use.

---

# 58. Mobile Layout Rules

On mobile:

- primary actions should remain reachable,
- content should not become horizontally cramped,
- cards should stack vertically where necessary,
- text must remain readable,
- product images should receive enough space,
- voice controls should remain easy to access,
- sticky elements should not cover content.

---

# 59. Desktop Layout Rules

On desktop:

- use available horizontal space without creating excessive reading width,
- maintain strong content hierarchy,
- keep the main analysis centered,
- avoid large empty decorative regions that push useful content below the fold.

Product analysis may use a two-column structure where useful:

```text id="j39zfk"
Product / Ingredients     Personal Context / Analysis
```

The layout must remain understandable.

---

# 60. Accessibility

The product should aim for WCAG-aligned accessibility practices.

Core requirements:

- keyboard accessibility,
- visible focus states,
- sufficient text contrast,
- semantic HTML,
- descriptive labels,
- accessible form controls,
- screen-reader-friendly state changes,
- alternative text for meaningful images,
- no information conveyed by color alone.

---

# 61. Reduced Motion

Animations should communicate state or provide useful feedback.

Do not use animation merely for decoration.

Users who request reduced motion should not receive unnecessary motion-heavy transitions.

---

# 62. Voice Accessibility

Voice is an optional interaction method, not the only method.

Every major voice-based interaction should have a text equivalent.

If voice recognition is unavailable:

> Allow typing.

If voice output is unavailable:

> Keep the text answer.

The product must remain fully usable without ElevenLabs.

---

# 63. Content Tone

The product should sound:

- friendly,
- clear,
- calm,
- respectful,
- knowledgeable,
- non-judgmental.

Avoid:

- fear-based language,
- sales language,
- exaggerated promises,
- overly clinical wording,
- unnecessary jargon.

---

# 64. AI Response Presentation

AI responses should be broken into digestible sections.

Avoid a giant paragraph.

For example:

```text id="j3c4q7"
What we found

Why it may fit

Things to consider

What you can do next
```

The UI should render structured AI output into stable components where possible rather than presenting all model text as an unformatted chat bubble.

---

# 65. Trust UX

Because users may rely on the application for personal skincare decisions, trust must come from:

- clear explanations,
- transparent limitations,
- consistent UI,
- understandable language,
- visible user control,
- and appropriate safety messaging.

Do not attempt to manufacture trust through badges such as:

> "100% Accurate AI"

or:

> "Dermatologist-Level AI"

unless such claims are independently and appropriately substantiated.

---

# 66. Product Comparison UX

If multiple products are eventually compared, comparison should focus on meaningful differences.

Possible comparison dimensions:

- relevant ingredients,
- ingredient overlap,
- product purpose,
- relationship to the user's current routine,
- considerations.

Do not rank products solely by popularity or arbitrary AI scoring.

---

# 67. Search / Discovery UX

If ingredient search is supported, it should remain simple.

Conceptual flow:

```text id="ud1m32"
Search ingredient
       ↓
Select result
       ↓
Ingredient explanation
```

The interface should distinguish between an exact ingredient match and an uncertain/ambiguous match.

---

# 68. Permissions

Permissions should be requested only when needed.

Possible permissions include:

- microphone,
- camera,
- image/file access.

Before requesting permission, explain briefly why it is needed.

If permission is denied:

- do not break the application,
- provide an alternative input method where practical.

---

# 69. Authentication UX

Authentication should not dominate the initial experience.

If authentication is required, the UI should clearly explain its purpose.

Avoid unnecessary onboarding duplication between:

```text
Create Account
+
Create Skin Profile
```

These should feel like parts of one coherent experience where possible.

---

# 70. Data Deletion UX

If personal profile data can be deleted, the interface should make the option discoverable without making it dangerous to trigger accidentally.

Destructive actions require:

- clear wording,
- clear scope,
- confirmation,
- and success feedback.

---

# 71. Error Recovery Principle

Every major error should have a next action.

Examples:

```text id="s4fs0s"
Unreadable image
→ Try another photo

AI unavailable
→ Retry / continue with text

Voice unavailable
→ Type instead

Missing information
→ Answer question

Unknown ingredient
→ Provide more information
```

Do not display a dead-end error screen unless no recovery is genuinely possible.

---

# 72. Data Preservation Principle

When a non-destructive action fails, preserve user input where practical.

Examples:

- failed product processing should not automatically delete the uploaded image,
- failed AI response should not erase the user's question,
- failed profile update should not silently discard previous information.

---

# 73. Interaction Feedback

Every important user action should provide feedback.

Examples:

- button state changes,
- selection state,
- upload progress,
- save confirmation,
- processing state.

Avoid excessive animation and noise.

---

# 74. Empty / Loading / Error / Success State Consistency

Every major feature should define at least:

```text id="grjzql"
Initial state
Loading state
Success state
Empty state
Error state
Recovery state
```

This requirement applies especially to:

- routine generation,
- product analysis,
- voice,
- progress,
- profile updates.

---

# 75. UX Safety Boundaries

The interface must not visually overstate the certainty of AI output.

Avoid UI patterns such as:

- medical-style diagnosis cards,
- disease severity scores,
- pseudo-clinical certainty meters,
- "guaranteed result" indicators,
- "perfect match" labels.

The visual design should reinforce the product's role as a decision-support companion.

---

# 76. Demo-Friendly UX

Because the project is being built for the Hacktoberfest challenge, the main experience should be easy to demonstrate.

A strong demo should be able to show:

```text id="x0vuka"
Friend Profile
      ↓
AI Routine
      ↓
New Product
      ↓
Product Check
      ↓
Ingredient Explanation
      ↓
Routine Compatibility
      ↓
Voice Question
      ↓
Useful Response
```

The demo should communicate the product value within a short interaction.

---

# 77. Demo Data UX

Development/demo data should be clearly separated from real user data.

Demo mode should not accidentally mix with production/personal data.

The UI should not expose secret test information.

---

# 78. Performance UX

AI operations may take longer than ordinary interactions.

The UI should:

- show meaningful progress,
- prevent accidental duplicate submissions where appropriate,
- remain responsive,
- preserve input,
- provide retry behavior.

Do not block the entire application while one AI operation is running unless technically necessary.

---

# 79. Design Consistency Rules

All screens should follow the same principles for:

- spacing,
- typography,
- button hierarchy,
- card behavior,
- state semantics,
- border/radius language,
- icons,
- feedback patterns,
- and responsive behavior.

New components should reuse existing design patterns rather than creating one-off visual styles.

---

# 80. Component-Level Source of Truth

The final implementation should maintain reusable UI components for repeated patterns such as:

- buttons,
- inputs,
- selectable options,
- cards,
- routine steps,
- ingredient cards,
- product analysis sections,
- alerts,
- loading states,
- voice controls,
- dialogs.

Do not duplicate visually similar components with slightly different behavior unless there is a clear product reason.

---

# 81. UX Don'ts

Do not:

- create a chatbot as the entire product,
- overwhelm the user with text,
- create a ten-step routine simply to look advanced,
- use fear-based warnings,
- hide uncertainty,
- force voice interaction,
- force account creation unnecessarily,
- use excessive animations,
- build an ecommerce-style product catalogue,
- make the interface look like a medical diagnosis tool,
- claim AI certainty that the underlying information does not support.

---

# 82. UX Decision Framework

When deciding how a new feature should appear in the UI, ask:

1. What user problem does this interaction solve?
2. What is the user's intended next action?
3. Can the interface communicate this more simply?
4. Does the interaction preserve user control?
5. Does it expose uncertainty appropriately?
6. Does it remain consistent with existing SkinSense patterns?
7. Is it necessary for the MVP?

---

# 83. Flow-to-Screen Mapping

| User Flow | Primary Screens |
|---|---|
| First-time onboarding | Welcome → Questionnaire → Review → Profile |
| Build routine | Profile → Routine |
| Routine explanation | Routine → Step Detail |
| Check product | Product Input → Processing → Product Analysis |
| Ingredient understanding | Product Analysis → Ingredient Detail |
| Ask SkinSense | Ask → Conversation |
| Voice | Ask / Contextual Voice Interaction |
| Progress | Progress → Entry → Summary |
| Profile management | Profile → Edit |
| Error recovery | Context-specific recovery state |

---

# 84. MVP Screen Set

The initial implementation should prioritize these screens:

```text id="vyn15j"
1. Welcome
2. Understand My Skin
3. Questionnaire
4. Review Answers
5. Skin Profile
6. Dashboard
7. My Routine
8. Check Product
9. Product Processing
10. Product Analysis
11. Ingredient Detail
12. Ask SkinSense
13. Profile / Settings
```

Progress screens may be added if included in the MVP.

Additional screens should require product justification.

---

# 85. Final UX Goal

The ideal SkinSense interaction should feel like:

```text id="m7zhpb"
"I have a skincare question."
             ↓
"SkinSense understands my context."
             ↓
"It explains the relevant information."
             ↓
"It connects that information to my routine."
             ↓
"I understand my options."
             ↓
"I make my own decision."
```

The interface should make this process feel **simple, personal and trustworthy**.

---

# 86. Definition of Done

The UI/UX specification is considered satisfied when:

- all P0 user flows have corresponding screens,
- every important screen has defined states,
- primary actions are clear,
- responsive behavior is specified,
- accessibility requirements are considered,
- AI uncertainty can be represented,
- voice and text interaction remain equivalent in functionality,
- safety boundaries are reflected in the interface,
- repeated UI patterns are componentized,
- and the product can be demonstrated through a coherent end-to-end journey.

---

# 87. Source-of-Truth Boundaries

Use this document for:

- screen structure,
- navigation,
- user interaction,
- UX behavior,
- visual direction,
- responsive behavior,
- accessibility,
- UI states,
- UX copy principles.

Use other documents for:

- `01_PROJECT.md` → project vision and principles
- `02_USER_PROBLEM.md` → validated user problems
- `03_PRODUCT_REQUIREMENTS.md` → product capabilities and acceptance criteria
- `04_USER_FLOWS.md` → high-level user journeys
- `06_SKINCARE_DOMAIN.md` → skincare facts
- `07_AI_ARCHITECTURE.md` → AI architecture
- `08_AI_PROMPTS.md` → AI prompt logic
- `09_PRODUCT_ANALYSIS.md` → product analysis
- `10_PERSONALIZATION.md` → personalization behavior
- `11_VOICE_SYSTEM.md` → voice implementation
- `12_SAFETY.md` → safety rules
- `13_DATA_MODEL.md` → data
- `14_SYSTEM_ARCHITECTURE.md` → technical implementation
- `15_SECURITY_PRIVACY.md` → privacy/security
- `16_TESTING.md` → testing
- `17_DEVELOPMENT.md` → development workflow
- `18_DEPLOYMENT_DEMO.md` → deployment/demo
- `19_HACKTOBERFEST.md` → challenge-specific requirements

If UI implementation conflicts with a safety requirement, the safety requirement takes precedence.

---

# 88. Change Policy

This document should be updated when:

- user research changes a core interaction,
- product requirements change,
- usability testing reveals a significant problem,
- accessibility issues are discovered,
- or a new feature requires a new interaction pattern.

Do not change visual behavior merely to accommodate a coding shortcut when it harms the user experience.

Major UX changes should remain consistent with the validated problem in `02_USER_PROBLEM.md`.