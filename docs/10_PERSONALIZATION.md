# SkinSense — Personalization System

## 1. Purpose

This document defines how SkinSense personalizes its skincare experience for an individual user.

The purpose of personalization is to ensure that SkinSense does not provide the same generic skincare response to every person.

The system should connect:

```text id="3m1z9e"
User Context
+
Current Skin Experience
+
Current Routine
+
Current Products
+
Preferences
+
Relevant History
+
Environmental Context
```

to produce a response that is relevant to that specific user.

This document defines **personalization concepts, context, rules, priorities, and lifecycle**.

It does not define:

- model architecture,
- exact prompts,
- complete skincare knowledge,
- product extraction,
- voice implementation,
- database implementation,
- UI design.

Those responsibilities belong to their dedicated documents.

---

# 2. Personalization Goal

The core personalization goal is:

> **Help SkinSense understand what is relevant to this user rather than simply returning generally popular skincare advice.**

Personalization should answer questions such as:

- What does this user report about their skin?
- What are their current concerns?
- What are they already using?
- What does their existing routine already contain?
- What does the user prefer?
- What changes are they reporting?
- What information is still unknown?
- How does the current question relate to their history?

---

# 3. Personalization Principle

SkinSense should personalize **from evidence about the user**, not from assumptions about the user.

Correct:

> "You mentioned that your skin feels oily around your forehead."

Incorrect:

> "You are definitely oily-skinned."

unless the available information genuinely supports that classification.

---

# 4. Personalization Layers

Personalization should be divided into logical layers.

```text id="hmj6w7"
1. User Identity / Preferences
2. Skin Context
3. Current Concerns
4. Current Routine
5. Current Products
6. Current User Experience
7. Product Under Evaluation
8. Historical Observations
9. Environmental Context
```

Not every request needs every layer.

---

# 5. User Context Model

The user's context should conceptually include:

```text id="lvn6gl"
User
├── Skin Context
├── Concerns
├── Sensitivity Information
├── Current Routine
├── Current Products
├── Preferences
├── Environmental Context
├── Product History
└── Progress Observations
```

Only supported information should be stored.

---

# 6. User-Provided Information

The strongest personalization signals are information directly provided by the user.

Examples:

> "My skin feels tight after washing."

> "My forehead gets oily by afternoon."

> "This product irritated me."

> "I prefer a simple routine."

These should carry more weight than generic assumptions.

---

# 7. User Interpretation

The system may interpret user responses into structured context.

Example:

```text id="kgt6xc"
User statement:
"My cheeks feel dry but my forehead gets oily."

Possible interpretation:
Combination-like skin behavior
```

However, this interpretation must remain distinguishable from:

> medically confirmed skin type.

The system should preserve the source of the information.

---

# 8. Confidence and Uncertainty

Personalization should track uncertainty where useful.

Possible internal states:

```text id="xz7eq3"
USER_STATED
SYSTEM_INTERPRETED
LIKELY
UNCERTAIN
UNKNOWN
```

This allows downstream AI systems to avoid treating weak assumptions as hard facts.

---

# 9. Stable vs Temporary Context

Not every user statement should become permanent profile information.

### Stable Context

Information that is intended to describe the user's general preferences or recurring experience.

Examples:

- prefers minimal routines,
- generally experiences oily skin,
- currently uses certain products.

### Temporary Context

Information specific to a particular moment.

Examples:

- skin feels unusually dry today,
- user used a new product once,
- temporary environmental exposure,
- one isolated observation.

These must not automatically become permanent profile attributes.

---

# 10. Context Lifecycle

Personalization context should evolve over time.

Conceptually:

```text id="kfy58d"
Initial Profile
      ↓
User Interactions
      ↓
New Explicit Information
      ↓
Updated Context
      ↓
Future Personalization
```

However, the system should not continuously rewrite user data based solely on AI inference.

Important profile changes should require appropriate validation or explicit user input.

---

# 11. Explicit vs Inferred Personalization

## Explicit

The user directly states:

> "I have been using this moisturizer for two months."

This can be stored as user-provided information.

## Inferred

The AI interprets:

> "The user's routine appears hydration-focused."

This should remain an interpretation.

It should not automatically become a permanent user preference.

---

# 12. Personalization Context Priority

For most personalized decisions, use context approximately in this order:

```text id="4s6y8m"
1. Current explicit user information
2. Current product/routine information
3. Relevant recent observations
4. Stable user preferences
5. Relevant historical information
6. Environmental context
7. General domain knowledge
```

The exact ordering may vary by task.

---

# 13. Current Context Over Old Context

Recent relevant information should generally be more important than old information.

Example:

If the user previously reported:

> "My skin usually feels oily."

but recently states:

> "My skin has been unusually dry for the past week."

the current observation should be considered in the current interaction.

The system should not permanently overwrite the user's broader profile based on one temporary change.

---

# 14. Personalization Must Be Task-Specific

Different tasks require different context.

### Routine Generation

Needs:

- skin context,
- concerns,
- current routine,
- products,
- preferences,
- relevant environment.

### Product Compatibility

Needs:

- current product,
- ingredient data,
- user context,
- current routine,
- relevant sensitivities/observations.

### Ingredient Explanation

May only need:

- ingredient,
- product context,
- user context if the user asks for personalized interpretation.

### Generic Definition

May not need the personal profile at all.

This supports context minimization.

---

# 15. Personalization for Skin Profile

The personal skin profile should represent user-reported skincare behavior.

Possible fields:

```text id="w9e8qk"
Skin behavior
Skin sensitivity
Main concerns
Routine preference
Current products
Known observations
Unknown information
```

The profile should not contain unsupported medical diagnoses.

---

# 16. Personalization for Routine Generation

Routine generation should answer:

> "What routine best fits the information currently available about this user?"

The system should consider:

```text id="p8qg0h"
What they already use
+
What they say they need
+
What they prefer
+
What they report experiencing
```

The routine should avoid unnecessary additions.

---

# 17. Existing Product Preservation

When the user already owns or uses a product that can reasonably fill a routine role, SkinSense should consider that information before introducing another product.

Example:

```text id="sp1t8v"
Existing moisturizer
        ↓
Routine needs moisturizer
        ↓
Evaluate existing product first
```

This supports the user's goal of reducing unnecessary trial and error.

The system should not automatically recommend replacing an existing product simply because a different product is available.

---

# 18. Routine Complexity Preference

The user may have a preference such as:

```text id="n5lsdo"
Minimal
Balanced
Detailed
```

This preference may affect presentation and routine complexity.

However, preference must not override safety or other important constraints.

Example:

A user wanting a "detailed" routine should not receive unnecessary active ingredients simply because they requested more steps.

---

# 19. Budget Personalization

If the user provides a budget preference, it can influence product comparisons.

Example:

> "I want something under ₹1,000."

The system may prioritize options within the user's stated budget when appropriate.

Budget must not be treated as:

```text id="o0lo8b"
cheap = bad
expensive = good
```

Price is a preference constraint, not proof of quality.

---

# 20. Texture Preferences

Where relevant, users may have preferences such as:

- lightweight,
- gel,
- cream,
- non-sticky,
- fragrance preference.

These can influence product interpretation.

The system should not treat a preferred texture as a safety or effectiveness property.

---

# 21. Brand Preferences

Users may provide preferred or avoided brands.

Brand preference is a user preference, not evidence that one brand is objectively better.

SkinSense should distinguish:

```text id="8xfcb4"
USER PREFERENCE
```

from:

```text id="5xk4d6"
PRODUCT QUALITY EVIDENCE
```

---

# 22. Ingredient Preferences and Avoidances

A user may state:

> "I prefer fragrance-free products."

or:

> "I don't want products with a particular ingredient."

These should be treated as personal preferences unless the reason involves a safety concern.

The system should not convert preferences into universal domain rules.

---

# 23. Sensitivity Personalization

If the user consistently reports sensitivity, the system may use this as relevant context.

Example:

```text id="gcgk7j"
User reports:
Frequent irritation

Potential personalization:
Prefer simpler product changes
+
Consider relevant ingredient/formulation information
+
Avoid unnecessary experimentation
```

The system must not automatically infer the cause of the sensitivity.

---

# 24. Concern Personalization

The user's stated concerns should influence relevant explanations and routine decisions.

For example:

```text id="kymg1a"
User concern:
Oiliness

Product:
Moisturizer

AI:
Explain texture and hydration considerations
in relation to the user's concern.
```

Concern-specific personalization must not become diagnosis.

---

# 25. Multiple Concerns

Users may have multiple concerns.

Example:

```text id="2r6j7n"
Oiliness
+
Dryness
+
Breakouts
```

The system should avoid optimizing for only one concern.

Instead, it should consider trade-offs and prioritize based on:

- explicit user priorities,
- severity as self-reported,
- routine simplicity,
- available evidence,
- safety.

If priorities are unclear, the system may ask which concern matters most.

---

# 26. Product Personalization

When evaluating a product, personalization should consider:

```text id="f3k0l1"
Product
   +
User profile
   +
Current routine
   +
Concerns
   +
Preferences
```

The goal is to explain:

> "What does this product mean for this person?"

rather than:

> "Is this product generally good?"

---

# 27. Product Fit vs Product Quality

These must remain separate.

### Product Quality / Information

What is known about the product itself.

### Personal Fit

How that information relates to this specific user.

Example:

A well-formulated product can still be a poor fit for a user's preferences or current routine.

A less-famous product can still be relevant to a user's needs.

---

# 28. Personalization Without Brand Bias

The system must not personalize by selecting brands simply because:

- they are popular,
- they are expensive,
- they are trending,
- they have affiliate relationships,
- or they are frequently mentioned online.

Personalization should come from:

```text id="6y2v0o"
User context
+
Product evidence
```

not from commercial incentives.

---

# 29. Seasonal Personalization

Seasonal context should be a secondary personalization factor.

Example:

```text id="up7njl"
Season/environment
+
User-reported skin behavior
+
Current routine
```

should be considered together.

The system should not assume:

> Winter = dry skin

or:

> Summer = oily skin

for every user.

---

# 30. Environmental Personalization

If environmental data is available, relevant variables may include:

- temperature,
- humidity,
- sun exposure,
- outdoor activity,
- sweating.

The application should not use environmental information as deterministic medical input.

---

# 31. Weather Context Freshness

Environmental data is time-sensitive.

If weather is used for personalization, it should represent the relevant time period.

The system should not reuse stale environmental context indefinitely.

The exact weather-data implementation belongs outside this document.

---

# 32. Geographic Context

Location should only be used when genuinely necessary for the product.

Potential reasons could include:

- relevant climate context,
- regional product availability,
- regional product formulation.

The application should avoid collecting precise location merely for personalization.

---

# 33. Language Personalization

The user may prefer:

- English,
- Hindi,
- Hinglish,
- Marathi,
- or another supported language.

Language preference should influence:

- explanations,
- conversation,
- voice responses,
- terminology presentation.

Ingredient names and scientific terms should remain accurate.

---

# 34. Communication Style

The assistant may adapt to the user's preferred communication style.

Possible preferences:

```text id="8naowv"
Concise
Balanced
Detailed
```

The personalization layer should alter how information is presented without changing the underlying factual content.

---

# 35. Voice Personalization

If supported, voice personalization may include:

- preferred response language,
- response length,
- voice preference,
- voice enabled/disabled.

The voice layer should not change the semantic content of the validated AI answer.

---

# 36. Conversation Personalization

Within a session, relevant context should carry forward.

Example:

```text id="zxid1m"
User:
Check this serum.

AI:
Analysis...

User:
Would it be better at night?
```

The system should preserve enough context to understand the reference.

If several products are active and "it" is ambiguous, ask for clarification.

---

# 37. Conversation Context Limits

Conversation memory should not grow indefinitely.

Older or irrelevant messages should not automatically be included in every request.

Context should be summarized or selectively retrieved where appropriate.

---

# 38. Long-Term Memory

Long-term personal context should be stored explicitly and structurally.

Examples:

```text id="dqa5iu"
Current routine
Current products
Preferences
Stable user observations
Journal entries
```

Do not use a raw conversation transcript as the sole source of long-term personalization.

---

# 39. Memory Update Rules

Permanent profile updates should ideally come from:

- explicit user input,
- explicit confirmation,
- or a well-defined application action.

AI inference alone should not silently rewrite important long-term profile data.

---

# 40. Temporary Observation Handling

A statement such as:

> "My skin feels very dry today."

should normally be treated as a temporary observation unless the user indicates it reflects a recurring pattern.

This prevents accidental profile drift.

---

# 41. User Correction

Users must be able to correct the personalization context.

Example:

```text id="v70yhe"
System:
Skin profile: combination-like behavior

User:
No, that's not right.
```

The application should allow the user to modify the profile rather than forcing the AI interpretation.

---

# 42. Correction Priority

Explicit user correction should override a previous system interpretation.

Example:

```text id="w7y6ud"
Previous interpretation:
Oily

User correction:
"My skin isn't generally oily."
```

The stored context should update according to the application's profile rules.

---

# 43. Personalization Conflict

Conflicts may occur.

Example:

```text id="9p3n2j"
Old profile:
Prefers detailed routines

Current input:
"I want only three steps now."
```

For the current task, the current explicit preference should generally take precedence.

The system should not create unnecessary conflict for the user.

---

# 44. Personalization Recency

A useful conceptual rule:

```text id="qzqgl7"
Current explicit input
>
Recent relevant information
>
Stable profile
>
Old history
>
Generic assumption
```

This should be applied carefully based on the task.

---

# 45. Personalization by Product Context

When the user asks about a specific product, irrelevant profile data should not be sent to the model.

Example:

If the user asks:

> "What does glycerin do?"

the complete journal history may not be necessary.

Context should be selected according to task relevance.

---

# 46. Personalization by Routine Context

When the user asks:

> "Can I add this serum?"

the most important context may include:

```text id="y4i2vk"
Current routine
Current products
Relevant concerns
Sensitivity information
New product ingredients
```

Unrelated preferences should not unnecessarily dominate the reasoning.

---

# 47. Personalization by Progress Context

When summarizing progress:

```text id="xsyn5f"
Product history
+
Usage history
+
User observations
```

should be prioritized.

Current routine may be included when relevant.

Old unrelated conversations should not influence the summary.

---

# 48. Personalization and User Goals

The same skin context can lead to different user priorities.

Example:

One user may prioritize:

> simplicity

Another may prioritize:

> understanding ingredients.

The system should personalize around the user's stated goal rather than applying the same optimization target to everyone.

---

# 49. Personalization and User Control

Personalization must never become invisible automation.

The user should be able to understand and modify meaningful aspects of their profile.

Where a recommendation is significantly influenced by a profile attribute, the system should make the relationship understandable.

Example:

> "You said you prefer a simple routine, so this plan uses fewer steps."

---

# 50. Personalization Transparency

The product may expose a concise explanation such as:

> "Based on the skin behavior and concerns you shared..."

or:

> "Because you already use a similar serum..."

This helps users understand why an answer is personalized.

---

# 51. Avoid False Personalization

A response is not truly personalized merely because the user's name was inserted.

Example:

```text id="u5s6dg"
"Aniket, here is your routine..."
```

without using relevant user context is not meaningful personalization.

Personalization must affect the actual decision-support content.

---

# 52. Avoid Over-Personalization

Do not introduce irrelevant personal information merely to make the system appear intelligent.

Bad:

> Using unrelated journal information to explain an ingredient.

Good:

> Using current routine information when evaluating product compatibility.

---

# 53. Personalization Safety

Personalization must never override safety boundaries.

For example:

```text id="7f4jj3"
User preference:
"I want strong products."

Safety:
Potential medical concern.

Result:
Safety rules take precedence.
```

User preferences can influence normal product choices but cannot authorize unsafe or prohibited behavior.

---

# 54. Personalization and Evidence

Personalization does not increase the certainty of weak evidence.

Example:

If a product ingredient has limited evidence, knowing more about the user does not turn that evidence into strong evidence.

The system should still communicate the underlying uncertainty.

---

# 55. Personalization and Product Claims

A manufacturer's claim should not become more trustworthy simply because it appears relevant to the user's goals.

The AI should distinguish:

```text id="o4p2uj"
Product claim
+
Evidence
+
User context
```

rather than:

```text id="9sq7cl"
User concern
+
Marketing claim
=
Recommendation
```

---

# 56. Personalization and Routine Duplication

Personalization should detect when a user already has a product serving a similar role.

This can help answer:

> "Do I really need this?"

The system should not automatically recommend replacing existing products.

---

# 57. Personalization and Product Discovery

If future product discovery is added, personalized ranking should be based on:

- user needs,
- preferences,
- available evidence,
- product compatibility,
- and practical constraints.

Not:

- affiliate revenue,
- sponsorship,
- popularity alone.

---

# 58. Personalization and Trial-and-Error

The product should reduce unnecessary experimentation by improving decisions **before** a new product is introduced.

The system may also support learning from user experience after introduction.

Conceptually:

```text id="q2x6pn"
Before use:
Understand context
+
Understand product
+
Compare routine

After use:
Record experience
+
Observe patterns
```

---

# 59. Personalization Feedback Loop

The product can improve relevance over time:

```text id="z7hn7j"
User Context
   ↓
Personalized Guidance
   ↓
User Experience
   ↓
User Feedback
   ↓
Updated Context
   ↓
Improved Future Guidance
```

The feedback loop must preserve the difference between:

- explicit facts,
- temporary observations,
- system interpretation.

---

# 60. Feedback Types

Possible feedback:

### Explicit

> "I don't like this moisturizer."

### Observational

> "My skin felt dry after using this."

### Behavioral

> User removed a routine step.

Behavioral signals should not automatically be interpreted as preference without appropriate design.

---

# 61. Personalization Learning

SkinSense should not silently train itself on individual behavior in unpredictable ways.

Changes to long-term personalization should follow explicit application logic.

The user should remain in control of important profile information.

---

# 62. Personalization State

A conceptual personal context object may contain:

```json id="j6gj88"
{
  "skin_context": {},
  "concerns": [],
  "sensitivity": {},
  "current_routine": [],
  "current_products": [],
  "preferences": {},
  "environment": {},
  "recent_observations": [],
  "unknowns": []
}
```

The exact database representation belongs in:

`13_DATA_MODEL.md`

---

# 63. Personalization Context Assembly

Before an AI request:

```text id="c2o3zz"
Task
 ↓
Determine relevant personalization
 ↓
Retrieve relevant user context
 ↓
Remove irrelevant context
 ↓
Assemble request
 ↓
Open AI
```

This should be a repeatable application process.

---

# 64. Personalization Priority Examples

## Example A — Routine

Relevant:

- skin context,
- concerns,
- current products,
- routine preference.

Less relevant:

- unrelated old journal entry.

## Example B — Product check

Relevant:

- current routine,
- product ingredients,
- sensitivity,
- concerns.

Less relevant:

- unrelated voice conversation.

## Example C — Ingredient explanation

Relevant:

- ingredient,
- product context,
- user concern if personalization is requested.

Less relevant:

- complete user history.

---

# 65. Personalization Failure

If the system cannot retrieve or build the required user context:

It should not pretend the response is personalized.

Example:

> "I can explain the product generally, but I don't currently have enough information about your routine to assess how it fits."

This is preferable to fabricated personalization.

---

# 66. Personalization Data Quality

Bad profile data can produce bad personalization.

The system should handle:

- contradictory answers,
- stale products,
- missing information,
- duplicate products,
- obsolete routines,
- unclear product identity.

Where necessary, ask the user to correct or update the information.

---

# 67. Stale Context

A product marked as "current" months ago may no longer be current.

The application may use:

- explicit update,
- last-used information,
- journal activity,
- or user confirmation

to determine whether context is still current.

The exact lifecycle logic belongs in `13_DATA_MODEL.md`.

---

# 68. Current Routine as a First-Class Context

The current routine should not be treated as simply a list of products.

It may contain:

```text id="7xv73s"
Time of use
Step/order
Product
Frequency
Optional status
User notes
```

This allows more meaningful personalization.

---

# 69. Current Product Status

Products may have statuses such as:

```text id="2c6f6s"
CURRENT
PAUSED
PAST
CONSIDERING
UNKNOWN
```

The exact status model may change during implementation.

A product being discussed does not automatically mean it is currently used.

---

# 70. Product Consideration State

When a user is evaluating a new product:

```text id="zr7uqs"
CONSIDERING
```

should remain distinct from:

```text id="30n6kl"
CURRENT
```

This prevents the system from accidentally incorporating an unpurchased product into the existing routine.

---

# 71. Personalization and Seasonal Routine Changes

If the user reports:

> "My skin is much drier this winter."

the system may use that observation in current guidance.

It should not silently rewrite the permanent skin profile from one seasonal observation.

---

# 72. Personalization and Progress Journal

Progress observations may be linked to:

- product,
- date,
- routine,
- concern.

This creates better context for future conversations.

Example:

> "You previously mentioned dryness after using this product."

The system should clearly attribute this to the user's own record.

---

# 73. Personalization and Voice

Voice transcripts should become ordinary user inputs after transcription.

The personalization system should not create a separate profile just because information came through voice.

```text id="jz2s0y"
Voice
↓
Text
↓
Same personalization pipeline
```

---

# 74. Personalization and ElevenLabs

ElevenLabs produces spoken output from validated content.

It should not independently personalize the meaning of the response.

The semantic personalization happens before voice synthesis.

---

# 75. Personalization and Language

The same personalized meaning should be preserved across languages.

For example:

```text id="j7xg9f"
English answer
=
Hindi answer
=
Hinglish answer
```

The language may change, but the underlying factual content and safety boundaries should remain consistent.

---

# 76. Personalization and Explainability

When personalization materially affects an output, the user should be able to understand the main factor.

Example:

> "Because you said you prefer a minimal routine, I kept this to three core steps."

This builds trust without exposing hidden model reasoning.

---

# 77. Personalization and User Consent

The product should not infer that the user wants all possible personalization features merely because they use the application.

Where appropriate, optional personalization capabilities should be opt-in.

The exact consent model belongs in:

`15_SECURITY_PRIVACY.md`

---

# 78. Data Minimization

Only retrieve the user information needed for the current task.

This improves:

- privacy,
- reasoning quality,
- performance,
- maintainability.

More context is not automatically better.

---

# 79. Personalization Anti-Patterns

Do not:

- invent user preferences,
- infer permanent facts from one temporary observation,
- treat AI interpretations as user statements,
- use irrelevant personal data,
- use name insertion as fake personalization,
- let popularity replace user context,
- recommend products only because they are personalized,
- override safety with user preferences,
- use private information unnecessarily,
- silently rewrite the user's profile.

---

# 80. Personalization Decision Framework

Before using a user attribute, ask:

1. Was it explicitly provided or reliably derived?
2. Is it relevant to the current task?
3. Is it current enough to use?
4. Is the certainty sufficient?
5. Would using it change the recommendation?
6. Should the user be able to see or correct it?

If not, do not use the attribute.

---

# 81. Personalization Example — Routine

Input:

```text
User reports:
- combination-like skin behavior
- occasional breakouts
- prefers simple routines
- current products: cleanser + moisturizer + sunscreen
```

The personalization engine should communicate to the AI:

```text
Relevant context:
- combination-like behavior
- breakouts
- minimal routine preference
- existing products
```

The AI can then construct a routine that respects the user's existing products and simplicity preference.

This does not imply a medical diagnosis.

---

# 82. Personalization Example — Product Check

Input:

```text
Current routine:
Cleanser
Moisturizer
Sunscreen

New product:
Serum X

Relevant user context:
Combination-like skin behavior
Breakout concern
Minimal-routine preference
```

The system compares the new product against that context.

The result should explain:

```text
What the product contains
+
What those ingredients generally do
+
Whether it appears to add something useful
+
What overlaps or considerations exist
```

---

# 83. Personalization Example — Ingredient Question

User asks:

> "What does niacinamide do for me?"

The system should:

```text id="jag5m0"
Identify ingredient
+
Retrieve domain knowledge
+
Retrieve relevant user concerns
+
Explain general role
+
Connect to user context
```

The personalized portion must remain appropriately cautious.

---

# 84. Personalization Example — Progress

User records:

> "My skin felt less oily this week."

The system may summarize:

> "You reported less oiliness this week."

If similar observations accumulate:

> "Your recent journal entries contain repeated reports of reduced oiliness."

The system should not automatically conclude:

> "Your product caused the improvement."

---

# 85. Personalization Quality Metrics

Personalization quality can be evaluated by asking:

- Did the system use relevant user information?
- Did it ignore irrelevant information?
- Did it preserve user-provided facts accurately?
- Did it distinguish temporary observations from stable context?
- Did it avoid invented attributes?
- Did the result differ meaningfully when relevant user context changed?
- Did it remain safe?

---

# 86. Personalization Regression Testing

The system should test whether changing an important user attribute changes the result appropriately.

Example:

```text id="0nkck8"
Same product
+
User A → prefers minimal routine

Same product
+
User B → different relevant context
```

The resulting explanations should differ where the contextual difference actually matters.

---

# 87. Personalization Robustness

The product should remain useful even when the profile is incomplete.

Example:

```text id="6fq8h4"
Profile:
Partial

Expected:
Useful general explanation
+
Clear limitations
```

The system should degrade gracefully rather than produce fake personalization.

---

# 88. Personalization Security

User context is sensitive data.

AI requests should expose only the fields required for the current task.

Logs should avoid unnecessary copies of personal context.

Detailed controls belong in:

`15_SECURITY_PRIVACY.md`

---

# 89. Personalization Architecture Boundary

This layer sits conceptually between application data and AI reasoning:

```text id="l5de10"
Stored User Data
       ↓
Personalization Context Builder
       ↓
Relevant User Context
       ↓
AI Task
```

The personalization layer is responsible for deciding:

> **What user context is relevant to this task?**

The AI layer is responsible for:

> **Reasoning over that context.**

---

# 90. Personalization Does Not Replace AI

Personalization provides context.

AI provides interpretation/reasoning.

```text id="y74x5p"
Personalization
      ↓
Context
      ↓
Open AI
      ↓
Decision Support
```

These responsibilities should remain separate.

---

# 91. Personalization Does Not Replace Domain Knowledge

Knowing the user has oily skin does not tell the system everything about skincare.

The AI still requires relevant domain knowledge from the approved knowledge layer.

```text id="0y3b8b"
User Context
+
Domain Knowledge
+
Product Information
↓
Personalized Reasoning
```

---

# 92. Personalization and Open AI

Open-source/open-weight AI is valuable because the project can control how personalized context is interpreted.

The model should be replaceable without redesigning the user profile itself.

Personalization should therefore use stable structured context rather than model-specific formats.

---

# 93. Personalization and Model Swapping

A different open model should receive equivalent semantic context.

Example:

```text id="p7dl7t"
Structured User Context
         ↓
Model A
         ↓
Result

Same Structured User Context
         ↓
Model B
         ↓
Result
```

This supports model experimentation without changing the product's conceptual personalization system.

---

# 94. Personalization Output Contract

The personalization layer should provide structured context to downstream AI services.

Conceptually:

```json id="exmsq1"
{
  "user_context": {},
  "current_context": {},
  "relevant_products": [],
  "relevant_routine": [],
  "relevant_observations": [],
  "preferences": {},
  "unknowns": []
}
```

The exact schema belongs in the data and architecture documents.

---

# 95. Personalization Change Management

A change to personalization rules may change many AI outputs.

Therefore, changes should be evaluated using representative user scenarios before being considered complete.

Examples:

- changing preference priority,
- changing recency rules,
- changing which profile fields are included,
- changing current-product logic.

---

# 96. Personalization Source-of-Truth Rules

Use this document for:

- user context,
- personalization logic,
- profile interpretation,
- context relevance,
- stable vs temporary information,
- recency,
- preferences,
- personalization feedback,
- personalization boundaries.

Use:

- `02_USER_PROBLEM.md` → original user's validated needs
- `03_PRODUCT_REQUIREMENTS.md` → what personalization features the product must support
- `06_SKINCARE_DOMAIN.md` → domain knowledge
- `07_AI_ARCHITECTURE.md` → AI processing
- `08_AI_PROMPTS.md` → prompt behavior
- `09_PRODUCT_ANALYSIS.md` → product analysis
- `11_VOICE_SYSTEM.md` → voice
- `12_SAFETY.md` → safety
- `13_DATA_MODEL.md` → persistence
- `14_SYSTEM_ARCHITECTURE.md` → implementation
- `15_SECURITY_PRIVACY.md` → privacy
- `16_TESTING.md` → personalization testing

---

# 97. Definition of Done

The personalization system is considered complete for the MVP when:

- the user has a structured personal skincare context,
- explicit information is distinguished from inference,
- temporary observations are distinguished from stable attributes,
- relevant context can be selected by task,
- current products and routines can influence personalization,
- user preferences can influence presentation and recommendations appropriately,
- recent relevant information can override stale context where appropriate,
- the user can correct important profile information,
- personalization does not create medical diagnosis,
- missing context produces transparent limitations,
- irrelevant personal data is not unnecessarily sent to the AI,
- and the same personalization context can be used across routine, product, ingredient, conversation, voice, and progress workflows.

---

# 98. Final Personalization Principle

SkinSense should not aim to know everything about the user.

It should aim to know:

> **the right things about the user for the question being asked.**

The ideal personalization flow is:

```text id="9j9d8a"
What did the user tell us?
          ↓
What is still relevant now?
          ↓
What does this particular task need?
          ↓
What information should NOT be included?
          ↓
What can the open AI model responsibly infer?
          ↓
What should remain uncertain?
```

Personalization is successful when the user feels:

> **"This answer actually understands my situation."**

without the system pretending to know more about the user than the user has actually shared.