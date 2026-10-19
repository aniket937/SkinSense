# SkinSense — Product Requirements

## 1. Purpose

This document converts the validated user problems documented in `02_USER_PROBLEM.md` into concrete product requirements for SkinSense.

It defines:

* what SkinSense must do,
* which capabilities belong in the MVP,
* how users interact with those capabilities,
* expected system behavior,
* feature priorities,
* acceptance criteria,
* and explicit product boundaries.

This document is the primary source of truth for **product functionality and MVP scope**.

Detailed implementation decisions belong in the relevant technical documents.

---

# 2. Product Goal

SkinSense should help the initial real user make better-informed skincare decisions by connecting:

* their personal skincare context,
* their stated concerns,
* their current routine,
* skincare product information,
* ingredient information,
* and their own observations over time.

The system should reduce unnecessary uncertainty and trial-and-error without pretending to provide medical diagnosis or guaranteed outcomes.

---

# 3. MVP Definition

The MVP must deliver one complete value loop:

```text
Understand My Skin
        ↓
Build My Routine
        ↓
Check a Product
        ↓
Understand Ingredients
        ↓
Understand Product Fit
        ↓
Make an Informed Decision
```

The MVP should be small enough to be reliable and polished enough to demonstrate the core product concept.

---

# 4. MVP Features

## Priority P0 — Must Have

### P0.1 Personal Skin Profile

The application must allow the user to provide information required to create a personal skincare context.

The profile should capture only information required for the product's current functionality.

Potential inputs include:

* skin-type-related observations,
* current skincare concerns,
* current products,
* routine information,
* routine preferences,
* preferred level of complexity,
* relevant environmental/seasonal context.

The exact questionnaire should be defined in `04_USER_FLOWS.md` and `05_UI_UX.md`.

### Expected Output

The system creates a structured personal skincare profile that can be reused by other features.

The profile should distinguish:

* user-provided information,
* system interpretation,
* and unknown information.

The system must not represent the profile as a medical diagnosis.

---

# 5. P0.2 Build My Routine

The user must be able to request a personalized skincare routine.

The routine generator should consider available user context rather than producing a generic template.

### Required Inputs

At minimum, the routine engine should consider:

* personal skin context,
* stated concerns,
* existing routine/products where available,
* user preferences.

Relevant contextual information may also be considered where supported by the system.

### Required Output

The system should produce:

* a morning routine,
* an evening routine,
* ordered steps,
* product/category guidance,
* a short explanation for each step,
* relevant considerations or limitations.

### Core Requirement

Every meaningful recommendation must have a reason.

For example:

> "This step is included because..."

The explanation should be understandable to a non-expert.

### Routine Design Principles

The generated routine should:

* prioritize practicality,
* avoid unnecessary steps,
* avoid adding products merely to make the routine look advanced,
* use existing products where appropriate,
* clearly identify optional steps,
* avoid overclaiming outcomes.

---

# 6. P0.3 Check This Product

The user must be able to evaluate a skincare product before adding it to their routine.

The product may be supplied through supported product information such as:

* an uploaded product image,
* ingredient text,
* or product information entered manually.

### Required Processing

The system should attempt to:

1. identify the product information,
2. extract available ingredient information,
3. normalize the ingredient information,
4. explain notable ingredients,
5. compare the product with the user's profile,
6. compare it with the user's existing routine,
7. identify useful considerations,
8. present a clear result.

### Required User Outcome

The user should leave the feature understanding:

* what the product contains,
* what important ingredients are generally used for,
* how it relates to their current routine,
* what considerations exist before introducing it.

The system should not produce a simplistic guaranteed verdict.

---

# 7. P0.4 Ingredient Explainer

The user must be able to understand an ingredient without needing advanced skincare knowledge.

The system should explain:

* ingredient name,
* general purpose,
* common skincare role,
* relevant considerations,
* relationship to the current product or routine when available.

### Explanation Principle

Explain in simple language first.

Detailed scientific information may be available where appropriate, but the default response should remain accessible.

### Important Boundary

The system must distinguish:

> "commonly used for"

from:

> "will treat/cure."

---

# 8. P0.5 Product-to-Routine Compatibility

This is a central capability of SkinSense.

When the user checks a product, the system should compare:

```text
User profile
+
Current routine
+
New product
+
Known ingredient information
```

The resulting analysis should identify relevant considerations.

Examples of possible outputs:

* fits the current routine reasonably well,
* duplicates an existing function,
* contains ingredients requiring caution,
* introduces a new active that should be considered carefully,
* insufficient information to make a meaningful assessment.

The result must explain **why**.

The system must not claim absolute compatibility or guarantee safety.

---

# 9. P0.6 Open-Source AI Core

Open-source/open-weight AI is a core product requirement.

The primary AI system must meaningfully power product intelligence rather than being used only for cosmetic text generation.

The AI should be responsible for appropriate parts of:

* user-context understanding,
* routine reasoning,
* ingredient explanation,
* product interpretation,
* product/routine comparison,
* personalized explanations,
* natural-language interaction.

The open model must not be an optional replacement for a closed model.

If the open AI layer is removed, the primary intelligence of the product should materially degrade.

Detailed AI requirements belong in:

`07_AI_ARCHITECTURE.md`

---

# 10. P0.7 Voice Interaction

The user should be able to ask skincare questions using natural speech.

Examples:

> "Meri skin aaj bohot dry lag rahi hai."

> "Ye serum mere routine ke saath theek rahega?"

> "Niacinamide kya karta hai?"

The system should:

```text
Voice
→ Speech recognition
→ User intent/context
→ Open-source AI reasoning
→ Response
→ Optional voice synthesis
```

ElevenLabs is an output/voice-experience component.

It must not become the source of core product reasoning.

Detailed voice behavior belongs in:

`11_VOICE_SYSTEM.md`

---

# 11. P1 — Progress Journal

The MVP may include a lightweight personal progress journal.

The user may record:

* product introduction date,
* products currently used,
* how their skin feels,
* changes they notice,
* simple observations.

The system may summarize patterns in these user-provided observations.

### Example

> "You reported dryness more often after introducing this product."

The system must not automatically turn this into:

> "This product caused the dryness."

Pattern detection is not proof of causation.

---

# 12. P1 — Seasonal Adaptation

SkinSense may adapt guidance when the user's context changes due to season or environment.

The system should not make simplistic assumptions solely from the season.

Instead, seasonal context should be combined with the user's actual reported experience.

Example:

```text
Seasonal context
+
User-reported skin changes
+
Current routine
```

may influence routine guidance.

The feature should remain conservative and explain why a change is being suggested.

---

# 13. Feature Priority

| Priority | Feature                          | MVP      |
| -------- | -------------------------------- | -------- |
| P0       | Personal Skin Profile            | Yes      |
| P0       | Build My Routine                 | Yes      |
| P0       | Check This Product               | Yes      |
| P0       | Ingredient Explainer             | Yes      |
| P0       | Product-to-Routine Compatibility | Yes      |
| P0       | Open-Source AI Core              | Yes      |
| P0       | Voice Interaction                | Yes      |
| P1       | Progress Journal                 | Optional |
| P1       | Seasonal Adaptation              | Optional |
| P2       | Future convenience features      | No       |

P1 features must not delay the P0 product.

---

# 14. User Stories

## 14.1 Understand My Skin

**As a user**, I want to answer guided questions about my skin and skincare habits so that SkinSense can build a useful personal skincare context.

### Acceptance Criteria

* User can complete the questionnaire.
* Inputs are stored in structured form.
* Missing optional information does not break the experience.
* The system does not present the result as a medical diagnosis.

---

## 14.2 Build My Routine

**As a user**, I want a skincare routine based on my own situation so that I do not have to rely entirely on trial and error.

### Acceptance Criteria

* Routine uses the user's available context.
* Morning and evening routines are distinguishable.
* Steps are ordered.
* Each meaningful recommendation has a reason.
* Routine does not intentionally include unnecessary steps.
* Uncertainty is communicated where relevant.
* Unsafe or medical claims are not generated.

---

## 14.3 Check a Product

**As a user**, I want to check a skincare product before using it so that I can understand what it contains and whether it appears to fit my current routine.

### Acceptance Criteria

* User can provide supported product input.
* System extracts or receives ingredient information.
* Ingredients are explained in understandable language.
* Product is compared with known user context.
* Relevant overlaps or concerns are surfaced.
* The result includes reasoning.
* System does not guarantee that the product will work.

---

## 14.4 Understand an Ingredient

**As a user**, I want to ask what an ingredient does so that product labels are easier to understand.

### Acceptance Criteria

* User can ask about an ingredient.
* System identifies the ingredient.
* System provides a simple explanation.
* Explanation is relevant to skincare context.
* Medical claims are avoided.

---

## 14.5 Use Voice

**As a user**, I want to speak my skincare question instead of typing it so that asking questions feels natural and convenient.

### Acceptance Criteria

* User can start voice input.
* Speech is converted to usable text.
* The text is processed by the core AI workflow.
* User receives the same type of meaningful answer as text interaction.
* Voice-output failure does not break the text experience.

---

## 14.6 Track Progress

**As a user**, I want to record what I use and how my skin feels over time so that I can better understand my own experience.

### Acceptance Criteria

* User can create journal entries.
* Entries are associated with date/time.
* Product usage can be recorded.
* System can summarize user-reported patterns.
* The system does not present correlation as medical causation.

---

# 15. Core Product Flow

The primary experience should follow this conceptual flow:

```text
START
  ↓
Understand My Skin
  ↓
Create Personal Profile
  ↓
Dashboard
  ├───────────────┐
  ↓               ↓
Build Routine   Check Product
  ↓               ↓
Routine         Product Analysis
  ↓               ↓
Why?            Ingredients
  ↓               ↓
Use Routine     Routine Compatibility
  │               │
  └───────┬───────┘
          ↓
     Informed Decision
          ↓
     Optional Journal
```

Voice interaction should be available across appropriate parts of this journey.

---

# 16. Product Response Principles

Whenever the AI provides a meaningful recommendation or analysis, the response should aim to include:

### What

What the system is recommending or observing.

### Why

Why the recommendation or observation is relevant to the user's context.

### Considerations

What the user should keep in mind.

### Uncertainty

What the system cannot confidently determine from the available information.

### Next Step

A practical action the user may consider.

This structure may vary by feature, but the reasoning should remain transparent.

---

# 17. Product Decision Language

SkinSense should prefer language that reflects appropriate confidence.

### Preferred

* "Based on the information you provided..."
* "This ingredient is commonly used for..."
* "This may fit your routine because..."
* "One thing to consider is..."
* "There isn't enough information to determine..."
* "Individual response can vary."

### Avoid

* "This will definitely work."
* "This is the perfect product for you."
* "You have [medical condition]."
* "This product will cure [condition]."
* "This ingredient is guaranteed to solve [problem]."

Detailed safety rules belong in `12_SAFETY.md`.

---

# 18. Product Inputs

SkinSense may use the following input categories:

## User Inputs

* skin observations,
* concerns,
* current products,
* routine,
* preferences,
* questions,
* voice,
* journal observations.

## Product Inputs

* product image,
* product name,
* ingredient list,
* available product metadata.

## Context Inputs

* relevant seasonal/environmental information,
* user-provided context.

Every input must have a clearly defined purpose.

The application should not collect information merely because it is technically possible to collect it.

---

# 19. Product Outputs

The product may generate:

### Personal profile

A structured representation of the user's skincare context.

### Personalized routine

Morning and evening guidance.

### Ingredient explanation

Simple information about notable ingredients.

### Product analysis

Interpretation of the supplied product.

### Compatibility analysis

Comparison between the product and the user's context.

### Progress observations

Summaries of user-provided history.

### Voice response

Spoken version of supported responses.

---

# 20. Error and Missing-Information Requirements

The product must handle incomplete information gracefully.

Examples:

### Missing skin information

The system should ask for relevant missing information or clearly state the limitation.

### Unreadable product image

The system should tell the user that the image could not be reliably interpreted and request a clearer image or ingredient list.

### Unknown ingredient

The system should not invent information.

### Incomplete ingredient list

The system should explicitly state that the analysis is based only on the available information.

### AI uncertainty

The system should communicate uncertainty rather than inventing confidence.

---

# 21. AI Failure Requirement

The user experience must not depend on every AI request succeeding.

When AI processing fails:

* the application should show a meaningful error,
* the user's input should not be silently lost,
* the UI should provide a recovery action,
* sensitive internal error information should not be exposed.

The system must never fabricate an AI result merely because the model failed.

---

# 22. Privacy Requirements

The product should minimize unnecessary collection of personal information.

The system should:

* collect only information needed for the product,
* avoid exposing private user information in logs,
* protect credentials and API keys,
* provide appropriate deletion behavior,
* treat uploaded images and voice data as potentially sensitive.

Detailed privacy/security requirements belong in:

`15_SECURITY_PRIVACY.md`

---

# 23. Safety Requirements

Safety is a product requirement, not just a prompt requirement.

The system must:

* avoid medical diagnosis,
* avoid guaranteed treatment claims,
* avoid false certainty,
* distinguish skincare education from medical advice,
* communicate when professional evaluation may be appropriate.

Detailed rules belong in:

`12_SAFETY.md`

---

# 24. Product Boundaries

The following are explicitly outside the MVP:

* medical diagnosis,
* skin disease classification,
* guaranteed treatment recommendations,
* automated prescription decisions,
* ecommerce,
* product purchasing,
* marketplace functionality,
* influencer/content feed,
* social network functionality,
* beauty advertising system,
* automatic claims that a product will definitely work.

These should not be added simply to make the project appear larger.

---

# 25. Requirement Traceability

Every P0 feature must map to a validated user problem from `02_USER_PROBLEM.md`.

### Mapping

| Requirement            | Validated Problem                                        |
| ---------------------- | -------------------------------------------------------- |
| Personal Skin Profile  | Difficulty understanding skin type                       |
| Build My Routine       | Uncertainty about skincare steps                         |
| Product Checker        | Difficulty choosing the right product/brand              |
| Ingredient Explainer   | Confusion about ingredients/acids                        |
| Compatibility Analysis | Uncertainty about whether a product fits                 |
| Progress Journal       | Uncertainty about whether skincare is working            |
| Voice                  | Convenience/accessibility of interacting with the system |

A feature without a clear problem connection should be reviewed before implementation.

---

# 26. MVP Success Criteria

The MVP should satisfy the following end-to-end scenario:

### Scenario

The original friend opens SkinSense because she is unsure about her skincare choices.

She:

1. provides her skincare context,
2. receives a personalized routine,
3. understands why the routine contains those steps,
4. finds a new skincare product,
5. uploads/checks that product,
6. understands its important ingredients,
7. sees how it relates to her current routine,
8. receives transparent considerations,
9. can ask follow-up questions by voice or text,
10. can optionally record her experience over time.

If this journey works reliably, the MVP demonstrates the central value proposition of SkinSense.

---

# 27. Quality Bar

A feature is not considered complete merely because it technically works.

A completed feature should be:

* functionally correct,
* understandable,
* visually coherent,
* resilient to common errors,
* appropriately validated,
* consistent with project safety rules,
* connected to the user's real problem,
* and integrated with the rest of the product.

---

# 28. Requirements Change Policy

Requirements may evolve as new user feedback is collected.

When new evidence contradicts an existing requirement:

1. validate the new evidence,
2. update `02_USER_PROBLEM.md`,
3. update this document,
4. document the reasoning behind the change,
5. update affected technical/UX documents.

Do not silently modify product scope.

---

# 29. Source-of-Truth Rules

Use this document for:

* product capabilities,
* MVP scope,
* feature priorities,
* user stories,
* acceptance criteria,
* product-level behavior.

Use other documents for:

* `02_USER_PROBLEM.md` → real user research
* `04_USER_FLOWS.md` → detailed journey design
* `05_UI_UX.md` → interface and interaction specification
* `06_SKINCARE_DOMAIN.md` → skincare knowledge
* `07_AI_ARCHITECTURE.md` → AI architecture
* `08_AI_PROMPTS.md` → prompts
* `09_PRODUCT_ANALYSIS.md` → product-analysis implementation
* `10_PERSONALIZATION.md` → personalization logic
* `11_VOICE_SYSTEM.md` → voice
* `12_SAFETY.md` → safety
* `13_DATA_MODEL.md` → data
* `14_SYSTEM_ARCHITECTURE.md` → technical architecture
* `15_SECURITY_PRIVACY.md` → security and privacy
* `16_TESTING.md` → tests
* `17_DEVELOPMENT.md` → development workflow
* `18_DEPLOYMENT_DEMO.md` → deployment and demo
* `19_HACKTOBERFEST.md` → challenge alignment

When two documents conflict, the higher-level project constraints and safety requirements take precedence, and the conflict should be resolved explicitly rather than guessed.

---

# 30. Final Product Requirement

SkinSense must remain a **decision-support product for a real friend**, not become a generic AI skincare platform.

The core product experience is:

```text
Understand my skin
        +
Understand skincare products
        +
Understand ingredients
        +
Understand how they relate to my routine
        ↓
Make a more informed skincare decision
```

The value of SkinSense comes from connecting these pieces through personalized, explainable, open-AI-powered reasoning.

The product should be judged by whether it makes the original user's skincare decisions **clearer and less dependent on blind trial and error**, not by the number of features it contains.
