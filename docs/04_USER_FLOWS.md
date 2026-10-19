# SkinSense — User Flows

## 1. Purpose

This document defines how a user moves through SkinSense from entry to completion of the product's primary tasks.

It describes:

* entry points,
* user actions,
* system responses,
* navigation,
* decision points,
* success states,
* incomplete states,
* error states,
* and recovery paths.

This document defines **behavior and journey**, not detailed visual design.

Detailed screen layouts, typography, components, spacing, and visual behavior belong in:

`05_UI_UX.md`

---

# 2. Flow Design Principles

All SkinSense flows should follow these principles:

## 2.1 Minimize Friction

The user should provide only information needed for the current task.

Do not create unnecessarily long forms.

## 2.2 Preserve Context

Information the user has already provided should be reused when relevant.

The user should not repeatedly enter the same skincare information.

## 2.3 Explain Important Decisions

When the AI produces a recommendation or analysis, the user should be able to understand why.

## 2.4 Keep the User in Control

The user should be able to:

* review information,
* correct information,
* edit profile data,
* review generated routines,
* and make the final decision.

The system should support decisions rather than silently make irreversible decisions for the user.

## 2.5 Handle Uncertainty Clearly

When the available information is insufficient, the system should request or acknowledge missing context rather than inventing an answer.

## 2.6 Safety Is Part of Every Flow

Safety behavior must be integrated into the relevant user journey.

Detailed safety rules belong in:

`12_SAFETY.md`

---

# 3. High-Level Navigation Model

The application should conceptually contain the following primary areas:

```text
                    SkinSense
                        │
          ┌─────────────┴─────────────┐
          │                           │
      First-Time                   Returning
        User                         User
          │                           │
          ▼                           ▼
   Understand My Skin             Dashboard
          │                    ┌──────┼──────┐
          ▼                    │      │      │
    Create Profile          Routine Product Journal
          │                 │       Check
          └─────────────────┴────────┴──────┘
```

Voice interaction can be initiated from supported areas without requiring the user to follow a separate voice-only workflow.

---

# 4. First-Time User Flow

## Goal

Create enough personal context for SkinSense to provide meaningful personalized guidance.

## Flow

```text
Landing
   ↓
Understand My Skin
   ↓
Guided Questions
   ↓
Review Answers
   ↓
Create Skin Profile
   ↓
Profile Summary
   ↓
Build My Routine
   ↓
Personalized Routine
   ↓
Dashboard
```

---

# 5. Landing Flow

## User Action

The user opens SkinSense.

## User Should Understand

Within the initial experience, the user should understand:

* what SkinSense does,
* that it is personalized,
* that it can help with routines and product understanding,
* and that it is not positioned as a medical diagnosis system.

## Primary Action

The main action should lead toward:

> **Understand My Skin**

## Secondary Actions

Depending on the final product structure, returning users may also be able to access:

* Check a Product
* Ask SkinSense

A first-time user should not be forced into product analysis before establishing basic personal context unless the product intentionally supports a standalone product-check flow.

---

# 6. Understand My Skin Flow

## Goal

Collect the minimum useful information required to establish a personal skincare context.

## Flow

```text
Start
  ↓
Question 1
  ↓
Question 2
  ↓
Question 3
  ↓
...
  ↓
Review
  ↓
Generate Profile
```

The exact question set belongs in `05_UI_UX.md` and may evolve based on user research.

---

# 7. Questionnaire Behavior

The questionnaire should support:

* single-select answers,
* multi-select answers,
* short text where necessary,
* optional information,
* and correction before submission.

The system should avoid asking the user for information that has no known product purpose.

## Required Behavior

Each question should make its purpose clear where additional explanation is needed.

The system should not imply that every answer can medically classify the user's skin.

---

# 8. Incomplete Questionnaire Flow

If a required answer is missing:

```text
Missing answer
   ↓
Explain what is needed
   ↓
User provides answer
   ↓
Continue
```

If optional information is missing:

```text
Optional information missing
   ↓
Allow user to continue
   ↓
Mark information as unavailable
```

The AI must account for missing information when generating results.

---

# 9. Review Before Profile Creation

Before creating the profile, the user should have an opportunity to review the information they entered.

Conceptually:

```text
Your Information
-------------------------
Skin observations
Concerns
Current products
Routine
Preferences
-------------------------
Edit
Confirm
```

## User Actions

### Edit

Return to the relevant question.

### Confirm

Create or update the structured user profile.

---

# 10. Skin Profile Creation

After confirmation:

```text
User Inputs
    ↓
Profile Processing
    ↓
Structured Skin Context
```

The output should distinguish between:

* information directly provided by the user,
* system-generated interpretation,
* and information that remains unknown.

The profile must not be presented as a medical diagnosis.

---

# 11. Profile Review Flow

After profile generation, the user should see a concise summary.

Example conceptual output:

```text
Your Skin Context

Skin profile:
[summary]

Main concerns:
[concerns]

Current routine:
[products/steps]

Preferences:
[routine preference]

Information still unknown:
[if any]

Edit Profile
Build My Routine
```

The user can edit the profile before generating a routine.

---

# 12. Build My Routine Flow

## Goal

Generate a personalized skincare routine using the available user context.

## Primary Flow

```text
Profile
   ↓
Build My Routine
   ↓
Check Available Context
   ↓
Generate Routine
   ↓
Validate Result
   ↓
Routine Result
   ↓
Explore Reasons
```

---

# 13. Routine Generation Preconditions

Before generating the routine, the system should determine whether enough information is available.

### Enough information

Continue directly.

### Insufficient information

Ask for only the missing information that materially affects the routine.

Example:

```text
Need more information
        ↓
Ask one relevant question
        ↓
Update context
        ↓
Generate routine
```

The system should not ask unnecessary questions merely to increase profile size.

---

# 14. Routine Result Flow

The user receives:

```text
MY ROUTINE

Morning
1. ...
2. ...
3. ...

Evening
1. ...
2. ...
3. ...
```

Each meaningful recommendation should support:

> **Why this?**

The user can open the explanation for the step.

---

# 15. Routine Explanation Flow

```text
Routine Step
   ↓
Why This?
   ↓
Simple Explanation
   ↓
Relevant Considerations
```

The explanation should connect to the user's context where appropriate.

Example conceptual structure:

```text
Why this step?

You mentioned:
- [relevant user context]

This step is included because:
- [reason]

Things to consider:
- [consideration]
```

The UI should avoid presenting internal model reasoning or hidden chain-of-thought.

The application should provide concise, user-facing explanations rather than private reasoning traces.

---

# 16. Routine Review and Editing

The user should be able to review the generated routine.

Supported actions may include:

* view details,
* mark an existing product as currently used,
* remove or skip an optional step,
* regenerate after changing relevant profile information.

The user should remain responsible for deciding what they use.

---

# 17. Routine Regeneration Flow

If the user changes relevant information:

```text
Edit Profile
   ↓
Change information
   ↓
Save
   ↓
Routine affected?
   ├── No → Keep current routine
   └── Yes → Offer routine refresh
                    ↓
              Generate updated routine
```

The system should not silently replace the user's routine without a clear user action.

---

# 18. Dashboard Flow

After the initial setup, the dashboard becomes the main returning-user entry point.

Conceptually:

```text
Dashboard
│
├── My Routine
├── Check a Product
├── Ask SkinSense
├── My Ingredients / Product Insights
└── Progress
```

The exact navigation structure belongs in `05_UI_UX.md`.

---

# 19. Returning User Flow

```text
Open SkinSense
      ↓
Dashboard
      │
      ├──────────────┬──────────────┬─────────────┐
      ▼              ▼              ▼             ▼
My Routine     Check Product    Ask Voice      Progress
```

The user should be able to enter the task they want without repeating onboarding.

---

# 20. Check This Product — Core Flow

## Goal

Help the user understand a product and decide whether it appears relevant to their current skincare context.

## Flow

```text
Dashboard
   ↓
Check This Product
   ↓
Choose Input
   ├── Product Image
   ├── Ingredient List
   └── Manual Product Information
```

Then:

```text
Input
  ↓
Extract / Read Information
  ↓
Ingredient Information
  ↓
Product Analysis
  ↓
Compare With User Context
  ↓
Safety / Confidence Validation
  ↓
Result
```

---

# 21. Product Image Flow

## User Action

User uploads or captures an image of a product.

## System Flow

```text
Product Image
    ↓
Image Quality Check
    ├── Good → Continue
    └── Poor → Ask for better image
    ↓
Text / Ingredient Extraction
    ↓
Normalization
    ↓
Analysis
```

The system should not claim that information was successfully extracted if the image could not be reliably interpreted.

---

# 22. Product Input Error Flow

If the uploaded image is unreadable:

```text
Image
 ↓
Quality Check
 ↓
Unreadable
 ↓
Explain problem
 ↓
Offer:
  - Upload another image
  - Paste ingredient list
  - Enter product information manually
```

The user should not be trapped in a failed upload state.

---

# 23. Ingredient List Flow

If the user already has the ingredient list:

```text
Paste Ingredient List
       ↓
Parse Ingredients
       ↓
Normalize Names
       ↓
Ingredient Explanation
       ↓
Routine Comparison
       ↓
Result
```

If the list is incomplete:

```text
Incomplete list
    ↓
Inform user
    ↓
Continue with available information
    OR
Request complete list
```

The system must clearly communicate when the analysis is limited by incomplete data.

---

# 24. Product Analysis Result Flow

The result should conceptually contain:

```text
Product Overview
       ↓
Important Ingredients
       ↓
What They Generally Do
       ↓
How Product Relates to User Context
       ↓
Routine Compatibility
       ↓
Things to Consider
       ↓
Next Step
```

The exact visual presentation belongs in `05_UI_UX.md`.

---

# 25. Product Compatibility Flow

The system compares:

```text
User Profile
+
Existing Routine
+
Product Information
+
Ingredient Information
```

Then produces a user-facing compatibility assessment.

Possible outcomes include:

### Reasonably Compatible

The available information does not reveal an obvious reason that conflicts with the user's stated routine/context.

### Consider Carefully

There is a relevant overlap, uncertainty, or introduction consideration.

### Insufficient Information

The available information is not sufficient to make a meaningful assessment.

### Professional Evaluation Recommended

The user's description or situation exceeds the product's intended educational/decision-support scope.

Exact safety behavior belongs in `12_SAFETY.md`.

---

# 26. Product Compatibility Explanation

Every meaningful assessment should answer:

> **Why?**

Conceptually:

```text
Assessment
   ↓
Relevant user context
   ↓
Relevant product information
   ↓
Reasoning summary
   ↓
Considerations
```

The system should not expose hidden internal reasoning.

It should expose an understandable explanation suitable for the user.

---

# 27. Ingredient Explainer Flow

The user can ask about an ingredient independently.

Entry points may include:

* product analysis,
* routine step,
* search/input,
* voice interaction.

## Flow

```text
Ingredient Name
      ↓
Ingredient Identification
      ↓
Knowledge Lookup
      ↓
AI Explanation
      ↓
User-Friendly Result
```

---

# 28. Ingredient Follow-Up Flow

After reading the explanation, the user may ask:

> "Why is this in my product?"

or:

> "Do I already have this ingredient in another product?"

The system should reuse the current context when available rather than asking the user to repeat information.

---

# 29. Ask SkinSense — Text Flow

The user can ask a natural-language question.

Example:

> "Can I add this serum to my current routine?"

## Flow

```text
User Question
     ↓
Understand Intent
     ↓
Load Relevant User Context
     ↓
Retrieve Relevant Information
     ↓
Open AI Reasoning
     ↓
Safety / Output Validation
     ↓
Answer
```

The answer should be contextual rather than generic whenever sufficient user information exists.

---

# 30. Voice Interaction Flow

Voice should follow the same product logic as text.

```text
Press Microphone
      ↓
Speak
      ↓
Speech Recognition
      ↓
Recognized Text
      ↓
Intent / Context
      ↓
Open AI Processing
      ↓
Validated Response
      ↓
Text Response
      ↓
Optional Voice Response
```

The voice path must not create a separate intelligence system.

Text and voice should ultimately use the same core application/AI reasoning flow wherever possible.

---

# 31. Voice Recording States

The system should support clear states:

```text
Idle
 ↓
Listening
 ↓
Processing
 ↓
Response Ready
 ↓
Speaking
 ↓
Complete
```

If the user stops recording early:

```text
Stop
 ↓
Process available audio
```

If no meaningful speech is detected:

```text
No useful input
 ↓
Ask user to try again
```

---

# 32. Voice Failure Flow

If speech recognition fails:

```text
Voice failure
    ↓
Explain
    ↓
Offer:
  - Try again
  - Use text input
```

If ElevenLabs output fails:

```text
Voice output failure
    ↓
Keep text answer
    ↓
Allow retry
```

The core response must never disappear simply because voice synthesis failed.

---

# 33. Progress Journal Flow

The journal is an optional supporting feature.

## Entry Flow

```text
Progress
   ↓
Add Entry
   ↓
Record:
  - Date
  - Product/use information
  - User observations
   ↓
Save
```

The user should be able to edit or delete their own entries.

---

# 34. Progress Review Flow

```text
Progress
   ↓
Select Product / Period
   ↓
View History
   ↓
User-Reported Observations
   ↓
AI Pattern Summary
```

The summary should clearly differentiate:

* recorded observations,
* detected patterns,
* and conclusions that cannot be established.

---

# 35. Seasonal Context Flow

Where seasonal/environmental context is supported:

```text
Current Context
      ↓
User Skin Experience
      ↓
Routine Review
      ↓
Possible Adjustment
      ↓
Explain Why
      ↓
User Decides
```

Season alone should not automatically trigger major routine changes.

The system should use the user's reported experience as an important context signal.

---

# 36. Profile Editing Flow

The user should be able to update their profile.

```text
Profile
   ↓
Edit
   ↓
Change Information
   ↓
Save
   ↓
Check Affected Features
   ├── Routine affected
   ├── Product analysis affected
   └── No major impact
```

The user should be informed when a profile change may affect an existing routine or analysis.

---

# 37. Delete Data Flow

The product should provide appropriate deletion controls for stored personal data.

Conceptually:

```text
Settings / Profile
       ↓
Delete selected data
       OR
Delete account/profile
       ↓
Confirmation
       ↓
Delete
       ↓
Success
```

Exact data retention and deletion rules belong in:

`15_SECURITY_PRIVACY.md`

---

# 38. Safety Escalation Flow

If the user's input enters a situation outside the intended scope:

```text
User Input
   ↓
Safety Check
   ├── Normal skincare education → Continue
   │
   ├── Uncertain → Explain limitation
   │
   └── Potential medical concern
           ↓
      Do not diagnose
           ↓
      Give safe boundary response
           ↓
      Encourage professional evaluation
```

The system should not continue a normal recommendation flow when doing so would create false medical confidence.

Detailed safety behavior belongs in `12_SAFETY.md`.

---

# 39. AI Uncertainty Flow

When the AI lacks enough information:

```text
Question
  ↓
Context Check
  ↓
Insufficient information
  ↓
Can one missing input resolve it?
  ├── Yes → Ask targeted question
  └── No → Explain limitation
```

The system must never fill missing information with an invented assumption without making that assumption explicit.

---

# 40. AI Failure Flow

If the AI service fails:

```text
User Request
   ↓
AI Request
   ↓
Failure
   ↓
User-Friendly Error
   ↓
Retry
```

The user should not see internal traces, secrets, or raw backend errors.

No fabricated fallback answer should be generated simply to avoid showing an error.

---

# 41. Authentication Flow

Authentication behavior depends on the final architecture.

The product flow should conceptually support:

```text
Open App
   ↓
Authenticated?
   ├── Yes → Dashboard
   └── No → Sign In / Create Profile
```

Authentication should not create unnecessary friction for a small personal MVP.

Exact authentication mechanisms belong in:

`15_SECURITY_PRIVACY.md`

and

`14_SYSTEM_ARCHITECTURE.md`

---

# 42. First Session Complete Flow

A successful first session should look approximately like:

```text
Landing
  ↓
Understand My Skin
  ↓
Answer Questions
  ↓
Review
  ↓
Create Profile
  ↓
Build My Routine
  ↓
Review Routine
  ↓
Check a Product
  ↓
Understand Ingredients
  ↓
Compare With Routine
  ↓
Ask Follow-Up Question
  ↓
Optional Voice Interaction
  ↓
Dashboard
```

The user should feel that SkinSense has helped answer a real skincare decision rather than simply showing a collection of AI screens.

---

# 43. Returning Session Example

A returning user may start directly from a current need:

```text
Open SkinSense
   ↓
Dashboard
   ↓
"I found a new serum"
   ↓
Check Product
   ↓
Upload Product
   ↓
Ingredient Analysis
   ↓
Routine Compatibility
   ↓
Question
   ↓
Decision Support
```

The user should not have to repeat onboarding if the necessary profile already exists.

---

# 44. Cross-Feature Context

The following context should be reusable where relevant:

```text
User Profile
      ↓
 ┌────┼──────────────┐
 ▼    ▼              ▼
Routine Product     Voice
      │
      ▼
   Journal
```

For example:

A user profile created during onboarding should be available to:

* routine generation,
* product checking,
* ingredient discussion,
* voice questions,
* and progress tracking where relevant.

The user should not have to recreate the same context for each feature.

---

# 45. Navigation Recovery Rules

The user should be able to leave a flow and return without losing completed information wherever practical.

Examples:

### During questionnaire

Previously completed answers should persist during the session.

### During product analysis

The uploaded product should remain available while navigating between relevant analysis sections.

### During routine review

The current routine should remain available while viewing explanations.

### During voice interaction

The transcribed user input should remain visible where appropriate so the user can correct or retry it.

---

# 46. Global Error Principles

Across all flows:

1. Explain what went wrong in simple language.
2. Preserve user input where practical.
3. Provide a clear recovery action.
4. Never expose sensitive internal information.
5. Never invent a result because a subsystem failed.
6. Never hide important uncertainty.

---

# 47. Global Loading Principles

AI-powered tasks may take longer than normal UI actions.

During processing, the application should communicate that the system is working.

Conceptually:

```text
Processing your information...
```

The user should not mistake a slow AI request for an unresponsive application.

Detailed loading visuals belong in:

`05_UI_UX.md`

---

# 48. Global Navigation Rules

The user should be able to reach the primary product capabilities without unnecessary navigation depth.

Primary destinations should remain discoverable:

* My Routine
* Check Product
* Ask SkinSense
* Progress
* Profile

The exact navigation pattern may change during UI design, but the core capabilities should remain easy to access.

---

# 49. Flow Priority

## P0 — Critical

```text
First-time onboarding
        ↓
Skin profile
        ↓
Build routine
        ↓
Check product
        ↓
Ingredient explanation
        ↓
Compatibility assessment
        ↓
Text follow-up
```

## P1 — Supporting

```text
Voice interaction
Progress journal
Seasonal adaptation
```

P1 functionality should not block the completion of P0 functionality.

---

# 50. Primary End-to-End Success Flow

The most important end-to-end flow is:

```text
REAL USER PROBLEM
       ↓
User opens SkinSense
       ↓
Build personal skin context
       ↓
Receive personalized routine
       ↓
Understand why the routine was suggested
       ↓
Find a new skincare product
       ↓
Check product
       ↓
Understand ingredients
       ↓
Compare product with existing routine
       ↓
Understand considerations
       ↓
Ask follow-up question
       ↓
Make user's own informed decision
```

This flow represents the core value of SkinSense.

---

# 51. Flow Completion Definition

A user flow is considered complete when:

* the user's intended task can be started clearly,
* required information can be collected,
* the system can process the information,
* the user receives a meaningful result,
* the user understands the important result,
* errors have usable recovery paths,
* safety boundaries are respected,
* and the user can continue to the next relevant action.

Technical implementation details for these flows belong in the architecture and feature-specific documents.

---

# 52. Source-of-Truth Boundaries

Use this document for:

* user journeys,
* navigation behavior,
* state transitions,
* decision points,
* success/error/recovery flows,
* cross-feature context.

Do not use this document as the detailed source for:

* visual design,
* component specifications,
* skincare facts,
* AI implementation,
* prompts,
* database schema,
* API implementation,
* security controls,
* deployment.

Those responsibilities belong to their dedicated documents.

---

# 53. Change Rule

User flows should change when:

* user research reveals a better workflow,
* a product requirement changes,
* an important usability problem is discovered,
* or an implementation constraint meaningfully changes the interaction.

Do not change a flow merely to accommodate an implementation shortcut if it makes the user's experience worse.

Any major flow change should be reflected in the corresponding product and UX documents.
