# SkinSense — Project Definition

## 1. Project Identity

**Project Name:** SkinSense

**Project Type:** Personalized AI-powered skincare decision companion

**Challenge:** Hacktoberfest 2026 — DEV Challenge: Build for a Friend

**Challenge Theme:** Build for a Friend

**Primary Goal:** Build a genuinely useful skincare companion for one real person who struggles with skincare decision-making.

---

# 2. Project Summary

SkinSense is a personalized skincare companion designed around a real friend's recurring difficulty with skincare decisions. The friend has identified several practical problems: understanding their own skin type, choosing an appropriate skincare brand or product, understanding what ingredients and active ingredients actually do, deciding whether a product is suitable for their existing routine, and determining whether a skincare routine is producing meaningful results.

SkinSense addresses these problems through two primary experiences:

1. **Build My Routine** — create a personalized skincare routine based on the user's own skin profile, concerns, current products, preferences, and context.
2. **Check This Product** — help the user understand a skincare product, its ingredients, and how it may fit into their existing routine.

The system also supports voice-based interaction so the user can describe their concerns naturally instead of relying entirely on forms or typed queries.

The intelligence behind the core decision-making must come from **open-source/open-weight AI**. The project should use the open AI layer for understanding the user's context, reasoning about skincare information, generating personalized guidance, explaining ingredients, and evaluating product/routine compatibility.

ElevenLabs may be used as a voice-output layer to make the experience more natural, but it must not replace the open AI core.

---

# 3. Why SkinSense Exists

The project is based on a real user's experience rather than a hypothetical market problem.

The validated problem observed so far is that skincare information is abundant but **personal decision-making remains confusing**.

The friend specifically struggles with questions such as:

* How do I know my skin type?
* Which skincare brand should I choose?
* Why do different brands contain the same ingredient?
* What do acids and other skincare ingredients actually do?
* What skincare steps should I follow?
* How do I know whether a product is actually working?
* How do I know which ingredients or products are suitable for me?
* Should I trust a lesser-known brand if its ingredients look good?
* Am I choosing based on evidence or simply trial and error?

The current workaround is primarily **trial and error and trying to understand the user's own skin type**.

Therefore, SkinSense is not primarily solving a lack-of-information problem.

It is solving a **lack-of-confidence and lack-of-personalized-decision-support problem**.

---

# 4. Core Problem Statement

People can easily find skincare products and skincare advice, but they often struggle to determine:

* what their skin actually needs,
* what a particular ingredient means,
* which product is appropriate for their situation,
* whether a new product fits with what they already use,
* and whether their routine is actually helping.

SkinSense aims to reduce this uncertainty by connecting **the user's own context** with **structured skincare knowledge** and **open-source AI reasoning**.

---

# 5. Target User

## Primary Target User

The initial target user is the real friend for whom the project is being built.

The product must be shaped around this person's validated needs rather than around an imagined mass-market audience.

The friend's currently identified pain points are:

* difficulty identifying skin type,
* uncertainty when selecting brands,
* difficulty understanding ingredient functions,
* uncertainty about skincare steps,
* reliance on trial and error,
* uncertainty about whether skincare is actually working.

## Broader Potential Users

The architecture may support other users with similar skincare decision-making problems later.

However, broader-market expansion is **not a primary MVP objective**.

The project must remain grounded in the original friend and the original validated problem.

---

# 6. Product Promise

The core promise of SkinSense is:

> **Help me understand what makes sense for my skin before I buy, add, or change a skincare product.**

The product should help the user move from:

> "I don't know what to choose."

to:

> "I understand why this may or may not fit my routine."

SkinSense should prioritize **clarity, personalization, explanation, and informed decisions** over the number of recommendations it produces.

---

# 7. Core Product Concept

SkinSense consists of a small number of connected capabilities.

## 7.1 Understand My Skin

The user provides information about their skin experience and skincare context through a guided process.

The purpose is to build a useful personal context for later recommendations.

This is not intended to represent a medical diagnosis.

The resulting profile should be treated as a **user-reported skincare profile** or a system-generated skincare context, not a confirmed medical classification.

---

## 7.2 Build My Routine

The user can ask SkinSense to create a skincare routine.

The routine should be based on the information available about the user, such as:

* skin profile,
* current concerns,
* current products,
* preferences,
* desired routine complexity,
* relevant environmental or seasonal context.

The generated routine should:

* be understandable,
* avoid unnecessary complexity,
* explain the reasoning behind each step,
* fit the user's existing context where possible,
* clearly communicate uncertainty where information is insufficient.

The system should not generate unnecessary steps simply to make the routine appear sophisticated.

---

## 7.3 Check This Product

The user can submit a skincare product through available supported inputs, such as a product image or ingredient information.

SkinSense should then help the user understand:

* what the product is,
* which ingredients are notable,
* what those ingredients are generally used for,
* how the product relates to the user's current routine,
* whether there is ingredient overlap,
* whether there are reasons for caution,
* and what additional information may be needed before using it.

The purpose is **decision support**, not a guaranteed product verdict.

The system should not claim:

> "This product is perfect for you."

Instead, it should communicate a reasoned assessment such as:

> "This appears compatible with the information in your profile, but individual response can vary."

---

## 7.4 Ingredient Understanding

SkinSense should make skincare ingredients easier to understand.

Users should not need advanced chemistry knowledge to understand basic ingredient roles.

The system should explain ingredients in:

* simple language,
* useful context,
* user-relevant terms,
* and without unnecessary scientific jargon.

Where evidence or certainty is limited, the system should communicate that clearly.

---

## 7.5 Voice Interaction

Users should be able to communicate with SkinSense naturally through voice.

Examples include:

> "Meri skin aaj bohot oily lag rahi hai."

> "Ye serum mere routine mein add kar sakti hoon?"

> "Niacinamide ka kya kaam hai?"

> "Winter mein mujhe routine change karna chahiye kya?"

The voice layer should reduce friction for users who find typing inconvenient.

ElevenLabs may provide natural voice responses.

The core reasoning should remain powered by open-source/open-weight AI.

---

## 7.6 Progress Awareness

A lightweight progress/journal capability may allow users to record:

* when a product was introduced,
* what products they used,
* how their skin felt,
* changes they noticed,
* and other relevant self-reported observations.

This capability is intended to help users understand their own experience over time.

It must not claim medical causality merely because two events occurred at the same time.

For example:

> "Your journal shows that dryness was reported more frequently after you introduced Product X."

is acceptable as a pattern observation.

> "Product X caused your dryness."

is not acceptable unless appropriately supported by evidence beyond simple user records.

---

# 8. Core Product Principles

## 8.1 User First

The product is built for a real person.

Every major feature should answer:

> "Does this solve a problem this person actually has?"

Features should not be added simply because they demonstrate AI capabilities.

---

## 8.2 Explain, Don't Just Recommend

Whenever SkinSense provides a meaningful recommendation, it should explain why.

The user should learn something from the interaction.

The product should help users become better at making skincare decisions rather than making them permanently dependent on opaque recommendations.

---

## 8.3 Personalization Over Generic Advice

SkinSense should use the user's context whenever available.

A generic answer may be insufficient if the system already knows:

* the user's routine,
* their stated concerns,
* their current products,
* their preferences,
* or their previous observations.

---

## 8.4 Simplicity Over Complexity

More products do not automatically mean a better routine.

The system should avoid unnecessary steps and avoid recommending products simply to increase the apparent sophistication of the output.

---

## 8.5 Transparency Over False Confidence

SkinSense must distinguish between:

* known information,
* reasonable inference,
* incomplete information,
* uncertainty,
* and situations requiring professional advice.

The system must never create confidence merely to make the answer sound authoritative.

---

## 8.6 Open AI Must Be Core

Open-source/open-weight AI is not an optional decoration.

The open AI layer must perform meaningful work in the system, including where appropriate:

* understanding user context,
* reasoning over skincare information,
* creating personalized routines,
* interpreting ingredient information,
* comparing products with user context,
* generating explanations,
* supporting conversational interaction.

If the open AI component is removed, the main intelligence of SkinSense should meaningfully degrade.

---

## 8.7 Model Flexibility

The product should not become permanently dependent on a single model vendor.

The AI layer should be designed so that an appropriate open model can be replaced or upgraded with limited application-level changes.

Model-specific implementation details belong in the AI documentation.

---

## 8.8 Privacy-Aware by Design

Skincare profiles, user observations, voice interactions, and uploaded images can be personal.

The system should therefore minimize unnecessary data collection and keep sensitive data under user control where practical.

The exact privacy and storage implementation belongs in the security/privacy documentation.

---

# 9. Open Innovation Philosophy

The project should demonstrate a practical reason for choosing open AI.

Open AI may provide several advantages relevant to SkinSense:

### Control

The development team can control how the assistant is instructed and how its behavior is structured.

### Model Choice

The system can evaluate and swap between suitable open models rather than being permanently tied to one closed model.

### Local Inference Potential

The project can support local inference where model size and hardware permit it.

This creates the possibility of keeping more personal processing close to the user.

### Privacy

A local/open architecture can reduce the need to send every personal skincare interaction to a closed AI provider.

### Experimentation

The team can inspect, modify, evaluate, and iterate on the AI system instead of treating a proprietary API as an opaque dependency.

These are project principles.

Specific technical implementation decisions must be documented separately and must not be invented merely to strengthen the Hacktoberfest narrative.

---

# 10. What SkinSense Is Not

SkinSense is **not** intended to be:

* a dermatologist replacement,
* a medical diagnosis system,
* a skin-disease detection system,
* a guaranteed treatment engine,
* a product marketplace,
* an ecommerce platform,
* a social network,
* an influencer recommendation platform,
* a beauty-content feed,
* or a system that guarantees a product will work.

The project is a **personalized skincare education and decision-support companion**.

---

# 11. Medical and Safety Boundary

SkinSense operates in a health-adjacent domain.

Therefore, the product must maintain a clear boundary between:

**Skincare education and decision support**

and

**Medical diagnosis or treatment.**

The application should not present model output as a professional diagnosis.

Detailed rules for medical safety, prohibited claims, uncertainty handling, and escalation belong in:

`12_SAFETY.md`

That document takes precedence over product feature ambitions.

---

# 12. Product Scope

## MVP Scope

The MVP should contain the smallest complete experience that demonstrates the project's core value.

### Required

1. User skincare profile
2. Personalized routine generation
3. Product checking
4. Ingredient explanation
5. Personalized product/routine comparison
6. Open-source AI reasoning
7. Clear explanations
8. Basic voice interaction
9. Basic privacy-aware data handling

### Optional

1. Progress journal
2. Seasonal adaptation
3. Expanded voice workflows
4. Additional convenience features

Optional features must not delay the working core experience.

---

# 13. Success Criteria

The MVP is successful when the original friend can:

1. describe their skincare situation,
2. understand their resulting personal profile,
3. receive a useful and understandable routine,
4. check a skincare product,
5. understand the important ingredients in that product,
6. understand why the product may or may not fit their existing routine,
7. ask follow-up questions naturally,
8. and feel that the application actually reduces the uncertainty they previously experienced.

The project should be judged by **usefulness to the real person**, not by the number of AI features.

---

# 14. Product Quality Principles

A high-quality SkinSense experience should be:

### Clear

The user should understand what the system is saying without needing skincare expertise.

### Personalized

The response should reflect the user's context rather than simply reproduce generic skincare advice.

### Explainable

The user should understand the reasoning behind important recommendations.

### Conservative

The system should avoid overclaiming.

### Consistent

The same relevant user context should produce coherent guidance across different workflows.

### Respectful of uncertainty

The system should not pretend to know more than the available information supports.

### Visually simple

The interface should make skincare decisions easier rather than making the product feel like a medical dashboard.

---

# 15. Product Decision Framework

Before adding a feature, ask:

### Question 1

Does this solve a real problem for the original friend?

### Question 2

Does it improve skincare decision-making or understanding?

### Question 3

Does it meaningfully benefit from AI?

### Question 4

Does it preserve the project's safety boundary?

### Question 5

Does it make the product simpler or more useful?

If the answer is mostly "no", the feature should not be part of the MVP.

---

# 16. Source-of-Truth Boundaries

Different project questions belong to different documents.

Use this document for:

* project identity,
* vision,
* mission,
* product philosophy,
* high-level scope,
* high-level principles,
* high-level challenge alignment.

Do not use this document as the detailed source for:

* user research,
* UI specifications,
* skincare scientific knowledge,
* AI prompts,
* model configuration,
* database schemas,
* API contracts,
* safety rules,
* deployment instructions,
* testing procedures.

Those topics belong in their dedicated project documents.

---

# 17. Confirmed User Insight

The following observations are currently grounded in the original friend's responses:

### Major confusion

* How to determine skin type
* Which brand to choose

### Brand and ingredient confusion

* The user notices that different brands can contain the same ingredient.

### Routine understanding

The user is aware of a basic sequence such as:

> facewash → toner → serum → moisturizer → ...

but still has uncertainty about what should actually be used for their individual needs.

### Main uncertainty

The user wants to know:

> Is the skincare actually working?

### Ingredient understanding

The user wants to understand the purpose of chemicals/active ingredients/acids.

### Product selection

The current method is largely:

> trial and error

or:

> first understand your skin type.

These findings must remain grounded in user research.

Do not expand them into broader claims about all skincare users without additional evidence.

---

# 18. Project Personality

SkinSense should feel like:

> **A knowledgeable skincare friend who explains things clearly.**

It should not feel like:

> a doctor pretending to diagnose,

or:

> a salesperson trying to make the user buy products.

The assistant should be supportive, educational, transparent, and practical.

---

# 19. Final Product Positioning

### One-line positioning

> **SkinSense helps you understand your skin, make sense of skincare ingredients, build a personalized routine, and evaluate products before adding them to your routine.**

### Friend-centered positioning

> **Built for a friend who was tired of choosing skincare through trial and error.**

### Open-AI positioning

> **Powered at its core by open-source/open-weight AI so the intelligence behind personalization, reasoning, and explanation can remain controllable, customizable, and potentially local.**

---

# 20. Definition of Done for This Project Definition

This document is considered complete when the team can answer all of the following without ambiguity:

* Who are we building for?
* What real problem are we solving?
* What is the core product promise?
* What are the two primary product workflows?
* Why does AI matter?
* Why does open AI matter?
* What is the MVP?
* What is explicitly out of scope?
* What safety boundary must the product maintain?
* What principles should guide future product decisions?

Detailed implementation decisions should be made in the relevant downstream documents and must not contradict this project definition without an explicit documented decision.

---

# 21. Change Control

This document should change only when there is a meaningful change to the project's:

* core user/problem understanding,
* product positioning,
* product promise,
* MVP boundary,
* fundamental product principles,
* or Hacktoberfest project direction.

Minor implementation changes should **not** require edits to this document.

When a major change is made, record the reason and decision in the project's decision record rather than silently rewriting the project's history.

---

# 22. Current Status

**Project Stage:** Product definition / MVP preparation

**Core Problem:** Validated through initial real-user feedback

**Core Workflows:** Defined

**Open-source AI requirement:** Mandatory

**Voice Layer:** Planned

**ElevenLabs:** Planned as voice-output integration

**Detailed technical architecture:** To be defined in `14_SYSTEM_ARCHITECTURE.md`

**Detailed AI architecture:** To be defined in `07_AI_ARCHITECTURE.md`

**Detailed safety rules:** To be defined in `12_SAFETY.md`

**Detailed skincare knowledge:** To be defined in `06_SKINCARE_DOMAIN.md`

**Detailed UX:** To be defined in `05_UI_UX.md`

**Implementation:** Not yet finalized
