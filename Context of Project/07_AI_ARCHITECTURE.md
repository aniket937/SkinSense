# SkinSense — AI Architecture

## 1. Purpose

This document defines the architecture of the artificial intelligence layer used by SkinSense.

It describes:

- where AI is used,
- what responsibilities belong to AI,
- how user and product context reaches the AI,
- how domain knowledge is supplied,
- how AI outputs are structured,
- how outputs are validated,
- how safety constraints interact with AI,
- how local/open model inference can be supported,
- how external services such as ElevenLabs fit into the system,
- and how the AI layer remains replaceable and maintainable.

This document defines the **AI architecture and responsibility boundaries**.

It does not define:

- exact prompts,
- detailed skincare facts,
- detailed product OCR implementation,
- database schema,
- frontend design,
- deployment configuration.

Those belong to their dedicated documents.

---

# 2. Core AI Principle

The primary intelligence of SkinSense must come from an **open-source/open-weight AI model**.

The model must perform meaningful product work.

It must not be added only to:

- rewrite text,
- generate decorative copy,
- power a generic chatbot,
- or satisfy a challenge requirement superficially.

The AI must contribute to the core value of the product:

> **understanding a user's skincare context and connecting it with skincare/product information to provide personalized, explainable decision support.**

---

# 3. AI Responsibilities

The AI layer may perform the following responsibilities:

1. Interpret user-provided skincare information.
2. Build or refine the user's skincare context.
3. Generate personalized routine guidance.
4. Explain skincare ingredients.
5. Interpret product information.
6. Compare product ingredients with the user's current routine.
7. Identify relevant overlaps and considerations.
8. Answer context-aware skincare questions.
9. Summarize user-reported progress.
10. Understand voice-transcribed user input.
11. Generate natural-language explanations.
12. Apply reasoning over retrieved knowledge and structured context.

The AI must not independently perform medical diagnosis.

---

# 4. AI Is Not the Entire Application

SkinSense is not:

```text
User
 ↓
LLM
 ↓
Text
```

The intended architecture is:

```text
User Input
    ↓
Input Processing
    ↓
Context Building
    ↓
Knowledge / Data Retrieval
    ↓
Open AI Reasoning
    ↓
Structured Output
    ↓
Validation
    ↓
Safety Check
    ↓
Application Response
    ↓
UI / Voice
```

This separation is mandatory.

---

# 5. High-Level AI Architecture

```text id="3f7r2u"
                         ┌──────────────────┐
                         │      USER        │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                  Text                        Voice
                    │                           │
                    │                  Speech Recognition
                    │                           │
                    └──────────────┬────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ Input Processing │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Intent Detection │
                         │ + Context Build  │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       User Profile         Product Data      Knowledge Layer
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                         ┌──────────────────┐
                         │  Open AI Model   │
                         │     Reasoning    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Output Validator │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Safety Layer    │
                         └────────┬─────────┘
                                  │
                       ┌──────────┴──────────┐
                       ▼                     ▼
                    Text UI             Voice Output
                                           │
                                      ElevenLabs
```

---

# 6. AI Modes

SkinSense should not use one undifferentiated AI workflow for everything.

The AI layer should support distinct task modes.

## Mode 1 — Skin Profile Understanding

Purpose:

> Convert user responses into a structured skincare context.

Input:

- questionnaire responses,
- user observations,
- relevant existing information.

Output:

- structured profile attributes,
- concerns,
- preferences,
- unknown fields,
- confidence/uncertainty where useful.

---

## Mode 2 — Routine Generation

Purpose:

> Generate a personalized skincare routine from the user's available context.

Input:

```text
User Profile
+
Current Routine
+
Current Products
+
Stated Concerns
+
Relevant Context
+
Trusted Domain Knowledge
```

Output:

```text
Morning Routine
Evening Routine
Reasons
Considerations
Uncertainty
Safety Notes
```

---

## Mode 3 — Ingredient Explanation

Purpose:

> Explain an ingredient in plain language.

Input:

- ingredient name,
- product context if available,
- user context if relevant.

Output:

```text
Ingredient
What it is
Common role
Relevant considerations
User-specific context if appropriate
```

The AI should use knowledge retrieval rather than rely exclusively on model memory for important domain facts.

---

## Mode 4 — Product Analysis

Purpose:

> Understand a supplied product and its available ingredient information.

Input:

```text
Product Name
Ingredient List
Product Claims
Usage Information
User Context
```

Output:

```text
Product Summary
Important Ingredients
Ingredient Roles
Potential Considerations
Routine Relationship
Unknown Information
```

Detailed extraction and product-processing behavior belongs in:

`09_PRODUCT_ANALYSIS.md`

---

## Mode 5 — Product Compatibility

Purpose:

> Determine how a product relates to the user's existing routine and context.

Input:

```text
User Profile
Current Routine
Existing Products
New Product
Ingredient Information
Relevant Knowledge
```

Output:

```text
Assessment
Reasons
Ingredient / Routine Overlap
Considerations
Unknowns
Safety Notes
```

The result is a decision-support assessment, not a guarantee.

---

## Mode 6 — Conversational Question Answering

Purpose:

> Answer a user's natural-language skincare question using the current context.

Example:

> "Can I add this serum to what I already use?"

Pipeline:

```text
Question
↓
Intent Understanding
↓
Relevant Context Retrieval
↓
Relevant Knowledge Retrieval
↓
Open AI Reasoning
↓
Validation
↓
Safety
↓
Answer
```

---

## Mode 7 — Progress Interpretation

Purpose:

> Summarize patterns in user-reported observations.

Input:

- dated journal entries,
- product usage history,
- user-reported observations.

Output:

```text
Observed Changes
Possible Pattern
Limitations
```

The AI must not claim causation merely from temporal correlation.

---

# 7. AI Architecture Layers

The AI system should be divided into logical layers.

## Layer 1 — Input Layer

Responsible for receiving:

- text,
- speech-transcribed text,
- questionnaire data,
- product data,
- ingredient data.

---

## Layer 2 — Context Layer

Responsible for collecting only the context relevant to the current task.

Possible context:

```text
User Profile
Current Concern
Current Routine
Current Products
Product Being Analyzed
Conversation Context
Journal Context
Relevant Environmental Context
```

The system should avoid sending irrelevant data to the model.

---

## Layer 3 — Knowledge Layer

Provides trusted skincare information to the AI.

Potential sources:

- curated domain knowledge,
- verified ingredient information,
- authoritative skincare guidance,
- product information,
- structured references.

The knowledge layer should be separated from model-generated content.

---

## Layer 4 — Reasoning Layer

An open model interprets:

```text
User Context
+
Product Context
+
Retrieved Knowledge
+
Task
```

and generates the requested structured result.

---

## Layer 5 — Validation Layer

The raw model output must be checked before it becomes application data.

Validation should include:

- schema validation,
- required-field validation,
- type validation,
- consistency checks,
- unsupported-claim checks where practical,
- safety-related checks.

---

## Layer 6 — Safety Layer

Safety constraints must be applied before the output is shown to the user.

The safety layer should detect when a result:

- makes a diagnosis,
- creates unjustified certainty,
- makes a prohibited medical claim,
- recommends action beyond the product scope,
- or requires escalation.

Detailed rules belong in:

`12_SAFETY.md`

---

## Layer 7 — Presentation Layer

Validated AI output is converted into:

- UI content,
- structured cards,
- explanations,
- conversational text,
- or voice output.

The frontend should not directly render arbitrary raw model output wherever structured output is available.

---

# 8. Open Model Strategy

The AI layer should use a suitable open-weight/openly licensed model.

A current candidate for the reasoning layer is:

> **Qwen3 or another suitable open model selected during implementation.**

The final model choice must be based on:

- license suitability,
- local inference feasibility,
- reasoning quality,
- structured-output reliability,
- multilingual capability,
- hardware requirements,
- response latency,
- and project constraints.

The application architecture must remain **model-agnostic**.

Do not tightly couple business logic to one model's API format.

---

# 9. Model Abstraction

Application code should not directly assume one specific model provider or runtime.

Conceptually:

```text
Application
    ↓
AI Service Interface
    ↓
Model Adapter
    ├── Local Open Model
    ├── Alternative Open Model
    └── Development/Test Model
```

The application should interact with the AI through stable internal interfaces.

Example conceptual operations:

```text
generate_skin_profile()
generate_routine()
explain_ingredient()
analyze_product()
assess_compatibility()
answer_question()
summarize_progress()
```

These are logical capabilities, not mandatory function names.

---

# 10. Local Inference

Local inference is a preferred architectural capability where practical.

Conceptually:

```text
Application
    ↓
Local AI Runtime
    ↓
Open Model
```

Possible local runtimes may include an appropriate model-serving or inference tool.

The exact runtime should be selected during implementation based on:

- model compatibility,
- hardware,
- latency,
- memory requirements,
- and ease of development.

The application must not assume that all users have sufficient hardware for local inference.

---

# 11. Remote Open Model Support

The architecture may also support an open model hosted remotely.

```text
Application
    ↓
AI Service
    ↓
Open Model Endpoint
```

A remotely hosted open model can still preserve model flexibility, but it may change the privacy and cost characteristics of the product.

The production deployment mode must document clearly what data leaves the user's environment.

---

# 12. Local-First Principle

Where feasible, the architecture should support:

```text
User Data
↓
Local / controlled storage
↓
Local open model
↓
Result
```

rather than requiring every interaction to be sent to a closed external model.

This is an architectural goal, not a claim that every future deployment will be completely offline.

---

# 13. Context Builder

The Context Builder is responsible for creating a focused context package for each AI request.

Example:

```text
Task:
Check This Product

User:
Combination skin
Concerns:
- oiliness
- occasional breakouts

Current routine:
- cleanser
- moisturizer
- sunscreen

New product:
serum

Ingredients:
...
```

The model should not receive unnecessary unrelated information.

---

# 14. Context Prioritization

When context is large, prioritize information based on the current task.

For product compatibility:

```text
1. Current product
2. Ingredient information
3. Current routine
4. Relevant user profile
5. Relevant history
6. General knowledge
```

For routine generation:

```text
1. User profile
2. Stated concerns
3. Current routine/products
4. Preferences
5. Relevant context
6. Domain knowledge
```

The exact ordering may evolve based on evaluation.

---

# 15. Retrieval-Augmented Generation

Where reliable domain knowledge is required, SkinSense should use retrieval rather than relying entirely on model memory.

Conceptual flow:

```text
User Question
     ↓
Determine Knowledge Needed
     ↓
Retrieve Relevant Sources
     ↓
Construct Context
     ↓
Open Model
     ↓
Structured Answer
```

Retrieval may provide:

- ingredient information,
- authoritative skincare guidance,
- product-label information,
- relevant safety information.

The model should not invent facts merely because retrieval returned nothing.

---

# 16. Knowledge Source Separation

Retrieved information should remain distinguishable from:

- user-provided data,
- product-provided data,
- model-generated interpretation.

Conceptually:

```text
USER FACTS
PRODUCT FACTS
DOMAIN FACTS
AI INTERPRETATION
```

The final response may combine these, but internal processing should preserve their origin.

---

# 17. Source-Aware Reasoning

Important domain claims should ideally be traceable to the information source used to support them.

For example:

```text
Ingredient claim
→ source reference

Product ingredient
→ product label/source

Safety statement
→ approved safety guidance
```

The user-facing UI does not need to display all internal retrieval metadata, but the system should maintain provenance where practical.

---

# 18. Structured AI Outputs

The application should prefer structured AI responses over unrestricted prose.

Conceptual routine output:

```json
{
  "morning": [],
  "evening": [],
  "reasons": [],
  "considerations": [],
  "uncertainties": [],
  "safety_notes": []
}
```

Conceptual product-analysis output:

```json
{
  "product": {},
  "ingredients": [],
  "compatibility": {},
  "considerations": [],
  "unknowns": [],
  "safety_notes": []
}
```

The exact schemas are defined in:

`08_AI_PROMPTS.md`

and implemented according to the application contracts defined in:

`14_SYSTEM_ARCHITECTURE.md`

---

# 19. Schema Validation

Every structured AI result must be validated before reaching the UI.

Conceptual flow:

```text
Model Output
    ↓
JSON Parse
    ↓
Schema Validation
    ├── Valid → Continue
    └── Invalid → Retry / Repair / Fail Safely
```

The system must not trust model-generated JSON simply because it is syntactically valid.

Semantic validation may also be required.

---

# 20. Semantic Validation

Examples of semantic checks:

- routine step has a recognizable purpose,
- ingredient names are not empty,
- product compatibility contains supporting reasoning,
- unknown information is not presented as known,
- safety fields exist where relevant,
- prohibited medical language is not present,
- unsupported claims are not presented as facts.

Validation must happen outside the model where practical.

---

# 21. Retry Strategy

If the model returns an invalid structured response:

```text
First attempt
   ↓
Validation
   ↓
Invalid
   ↓
Constrained retry
   ↓
Validation
   ├── Valid → Continue
   └── Invalid → Safe failure
```

Retries should have a limit.

The system must not enter an infinite retry loop.

---

# 22. Safe Failure Strategy

When a valid AI result cannot be produced:

- preserve user input,
- explain that analysis could not be completed,
- offer a retry,
- offer an alternative input method where practical,
- never fabricate an answer.

Example:

> "I couldn't reliably analyze this product from the information provided. Try a clearer ingredient photo or paste the ingredient list."

---

# 23. AI Confidence and Uncertainty

The system should not treat a model's self-reported "confidence score" as objective truth.

Instead, uncertainty should be derived where possible from:

- missing inputs,
- ambiguous product information,
- incomplete ingredient lists,
- conflicting sources,
- unknown formulation details,
- and task limitations.

The user-facing result should communicate meaningful uncertainty.

---

# 24. Confidence Representation

Possible internal states:

```text
SUFFICIENT_INFORMATION
LIMITED_INFORMATION
AMBIGUOUS_INFORMATION
INSUFFICIENT_INFORMATION
SAFETY_ESCALATION
```

These are conceptual states.

The final implementation may use a different representation if it preserves the same meaning.

---

# 25. Hallucination Control

The AI architecture must actively reduce hallucination.

Core rules:

### Do not invent product data

If the ingredient list cannot be read, do not guess it.

### Do not invent concentrations

If concentration is unavailable, do not infer an exact percentage.

### Do not invent user information

Unknown user attributes remain unknown.

### Do not invent sources

A source must exist if the system claims that a statement came from a source.

### Do not fill missing information silently

Ask the user or communicate the limitation.

---

# 26. AI Grounding Hierarchy

When answering a question, prioritize information approximately in this order:

```text
1. Explicit user-provided facts
2. Verified product information
3. Retrieved authoritative domain knowledge
4. Structured application data
5. General model knowledge
6. Model inference
```

The system should not override explicit reliable user information with a generic assumption.

---

# 27. User Context Is Not Medical Truth

The AI may use statements such as:

> "User reports oily skin."

It should not silently transform them into:

> "User medically has oily skin."

User-provided observations and system interpretation must remain conceptually distinct.

---

# 28. Routine Generation Architecture

The routine generator should follow:

```text
User Profile
     ↓
Current Products
     ↓
Stated Concerns
     ↓
Preferences
     ↓
Relevant Domain Knowledge
     ↓
Constraint Builder
     ↓
Open Model
     ↓
Structured Routine
     ↓
Validation
     ↓
Safety
     ↓
Routine UI
```

---

# 29. Routine Constraints

The AI should consider:

- simplicity,
- current products,
- user goals,
- known sensitivities,
- relevant active ingredients,
- product instructions where available,
- and safety boundaries.

It should not optimize for:

- maximum number of products,
- novelty,
- brand promotion,
- or impressive-looking routines.

---

# 30. Product Analysis Architecture

The product-analysis AI should not perform every task itself.

Conceptually:

```text
Product Image
     ↓
Image / OCR Processing
     ↓
Extracted Text
     ↓
Ingredient Normalization
     ↓
Structured Product Data
     ↓
Knowledge Retrieval
     ↓
Open AI Analysis
```

This separation improves reliability.

Detailed implementation belongs in:

`09_PRODUCT_ANALYSIS.md`

---

# 31. Ingredient Reasoning Architecture

For an ingredient question:

```text
Ingredient Input
      ↓
Normalize Ingredient
      ↓
Retrieve Trusted Information
      ↓
Combine With User/Product Context
      ↓
Open AI Explanation
      ↓
Validation
      ↓
Safety
      ↓
Display
```

The model should not need to memorize the entire skincare domain.

---

# 32. Compatibility Reasoning

Compatibility should be treated as a contextual reasoning problem.

Conceptual model:

```text
NEW PRODUCT
     +
CURRENT ROUTINE
     +
USER CONTEXT
     +
INGREDIENT KNOWLEDGE
     +
USAGE CONTEXT
     ↓
AI REASONING
     ↓
CONSIDERATIONS
```

The result should explain relevant factors rather than outputting an unexplained score.

---

# 33. Compatibility Is Not a Guarantee

The AI architecture must explicitly distinguish:

> **"No obvious issue identified from the available information."**

from:

> **"Guaranteed safe."**

and:

> **"May fit the user's stated routine."**

from:

> **"Will work for this user."**

The application should not generate guarantees that the available data cannot support.

---

# 34. Conversational Memory

The conversation system may maintain short-term context for the current session.

Example:

```text
User:
Check this serum.

AI:
Analysis...

User:
What about using it at night?
```

The system should understand the reference to the serum if the context is still active.

Long-term memory should be explicitly stored and structured.

Do not rely on a chat transcript alone as the user's permanent profile.

---

# 35. Long-Term Personalization Context

Long-term information should be stored outside the model.

Potential stored context:

```text
User Profile
Current Products
Current Routine
Preferences
Journal Entries
Previous Product Analyses
```

The AI receives only relevant information for each request.

---

# 36. Memory Safety

The AI should not infer permanent user facts from temporary statements without appropriate handling.

For example:

> "My skin is oily today."

must not automatically become:

> "User has oily skin permanently."

Temporary observations and stable profile attributes should be represented separately.

---

# 37. Voice AI Architecture

Voice is an interface over the same AI core.

```text
Voice Input
    ↓
Speech-to-Text
    ↓
Text
    ↓
Normal SkinSense AI Pipeline
    ↓
Response Text
    ↓
ElevenLabs
    ↓
Voice Output
```

There should not be a separate "voice brain."

---

# 38. Speech-to-Text Boundary

Speech recognition is responsible for:

- converting audio to text,
- preserving the user's intended language as accurately as possible,
- handling supported languages,
- returning errors when speech is unclear.

Speech recognition should not interpret skincare meaning.

That belongs to the core AI pipeline.

---

# 39. ElevenLabs Boundary

ElevenLabs is responsible for:

- converting approved response text to speech,
- providing natural voice output,
- optional voice customization.

ElevenLabs is not responsible for:

- user-profile reasoning,
- product compatibility,
- skincare knowledge,
- safety decisions,
- recommendation generation.

If ElevenLabs is unavailable:

```text
AI response text
   ↓
Text UI remains available
```

---

# 40. Multilingual Considerations

The AI architecture should support natural-language input where the selected model and speech stack support it.

The system should avoid assuming that the user always speaks English.

Potential interaction:

```text
Hindi / Hinglish / English
       ↓
Speech Recognition
       ↓
Normalized text/context
       ↓
Open AI
       ↓
User-preferred language
       ↓
Text / Voice
```

Language preservation should be explicit where possible.

---

# 41. AI Language Behavior

The AI should adapt its response language to the user's active language preference or current input.

It should not randomly switch languages.

Technical terms should be explained where necessary.

The user should not need advanced skincare vocabulary to use the system.

---

# 42. AI Prompt Separation

Prompts must remain outside application business logic wherever practical.

The AI architecture should conceptually separate:

```text
System Behavior
+
Task Instructions
+
Domain Context
+
User Context
+
Product Context
+
Output Schema
```

Exact prompt construction belongs to:

`08_AI_PROMPTS.md`

---

# 43. Tool Use

Where tools are used, the model should not directly control arbitrary application functionality.

The application should expose narrowly scoped operations.

Examples:

```text
retrieve_ingredient()
retrieve_product()
retrieve_user_profile()
retrieve_routine()
save_journal_entry()
```

The exact tool list must be defined based on actual requirements.

---

# 44. Tool Safety

Any AI-triggered tool operation that modifies user data must use application-level validation and authorization.

The model must not be trusted as an authorization mechanism.

For example:

```text
AI requests:
"Save this journal entry."

Application:
Validate
→ authorize
→ sanitize
→ persist
```

---

# 45. Deterministic vs Generative Responsibilities

Where deterministic logic is more reliable, use deterministic code.

Examples:

- data validation,
- date formatting,
- schema validation,
- authentication,
- permission checks,
- database writes,
- arithmetic,
- known product-field normalization.

Use AI where interpretation or natural-language reasoning is genuinely beneficial.

This reduces hallucination and improves reliability.

---

# 46. Example Responsibility Split

### Deterministic code

```text
Is ingredient list empty?
Is user authenticated?
Is required field present?
Is JSON schema valid?
Can this user edit this record?
```

### AI

```text
What does this ingredient mean in simple language?
How does this product relate to this user's stated routine?
How can this routine be explained clearly?
What is the relevant context of this question?
```

This separation should be maintained throughout implementation.

---

# 47. AI Observability

AI requests should be observable without exposing sensitive user content unnecessarily.

Useful metadata may include:

- task type,
- request duration,
- model identifier,
- validation result,
- retry count,
- failure category.

Avoid logging:

- full private voice recordings,
- unnecessary personal profile data,
- secrets,
- full sensitive prompts in production logs unless explicitly justified.

Detailed privacy rules belong in `15_SECURITY_PRIVACY.md`.

---

# 48. AI Cost Awareness

The system should avoid sending unnecessarily large contexts to the model.

Potential optimizations:

- relevant-context selection,
- retrieval instead of full knowledge injection,
- structured summaries,
- short-term conversation windows,
- cached static knowledge where appropriate.

Cost optimization must not remove required context or weaken safety.

---

# 49. Latency Awareness

AI interactions may be slower than normal UI operations.

The architecture should separate:

```text
Fast deterministic operation
```

from:

```text
Longer AI operation
```

where practical.

The frontend should receive a useful processing state.

---

# 50. Model Swapping

The architecture should allow:

```text
Qwen3
   ↓
Alternative Open Model
   ↓
Future Open Model
```

without changing:

- frontend product logic,
- database design,
- user journeys,
- or safety architecture.

The model-specific adapter may change.

---

# 51. Model Evaluation

Changing the model must not be treated as a simple dependency upgrade.

A replacement model should be evaluated against a common test set covering:

- routine quality,
- ingredient explanations,
- product comparisons,
- structured output,
- hallucination resistance,
- safety behavior,
- multilingual behavior where required.

Detailed AI evaluation belongs in:

`16_TESTING.md`

---

# 52. AI Versioning

The system should be able to identify the AI configuration used to produce an important result.

Potential metadata:

```text
model_id
model_version
prompt_version
knowledge_version
```

This can help debug changes between model versions.

Exact storage requirements belong in the data architecture.

---

# 53. Prompt Versioning

Prompt changes can materially change AI behavior.

Therefore, prompt versions should be trackable.

The application should avoid silently changing core prompt behavior without recording the change.

Detailed prompt management belongs in:

`08_AI_PROMPTS.md`

---

# 54. Knowledge Versioning

Knowledge updates can also change outputs.

The system should ideally be able to identify the relevant knowledge revision for important analysis.

This becomes especially useful when:

- ingredient information is updated,
- source guidance changes,
- product data changes.

---

# 55. Safety Precedence

The AI architecture follows this precedence:

```text id="2mi7bc"
Safety constraints
      ↓
Application constraints
      ↓
User context
      ↓
Task requirements
      ↓
Domain knowledge
      ↓
Generative flexibility
```

The model should never override a higher-level constraint simply because it can produce a plausible answer.

---

# 56. No Hidden Chain-of-Thought Exposure

The application should never request or display private chain-of-thought reasoning from the model.

Instead, the product should generate concise, user-facing explanations based on validated outputs.

For example:

Allowed:

> "This product contains ingredients that overlap with your current routine, so introducing another active may add unnecessary complexity."

Not:

> "Here is the model's private internal reasoning process..."

---

# 57. AI Output Contract

Every AI task should define:

```text id="yx8v8p"
INPUT CONTRACT
    ↓
TASK
    ↓
CONTEXT
    ↓
OUTPUT SCHEMA
    ↓
VALIDATION
    ↓
SAFETY
```

This creates predictable boundaries between the application and the model.

---

# 58. AI Service Boundary

The rest of the application should communicate with an internal AI service rather than directly calling the model runtime throughout the codebase.

Conceptually:

```text
Frontend
   ↓
Backend
   ↓
AI Service
   ↓
Context Builder
   ↓
Retriever
   ↓
Model Adapter
   ↓
Validator
   ↓
Backend Response
```

This prevents AI-specific logic from spreading throughout the application.

---

# 59. AI Service Responsibilities

The AI service should:

- prepare model requests,
- select relevant context,
- perform retrieval where required,
- invoke the model,
- parse responses,
- validate schemas,
- request bounded retries,
- produce normalized application outputs,
- expose failure states.

It should not:

- directly manage frontend UI,
- own authentication,
- bypass safety,
- directly modify arbitrary database records without application authorization.

---

# 60. AI Data Flow Example — Build Routine

```text
Questionnaire
    ↓
Structured User Profile
    ↓
Routine Request
    ↓
Relevant User Context
    ↓
Relevant Skincare Knowledge
    ↓
Open Model
    ↓
Structured Routine
    ↓
Schema Validation
    ↓
Safety Validation
    ↓
Routine Response
    ↓
UI
```

---

# 61. AI Data Flow Example — Check Product

```text
Product Image / Ingredient List
    ↓
Product Processing
    ↓
Structured Product Information
    ↓
Ingredient Knowledge Retrieval
    ↓
User Profile + Current Routine
    ↓
Open Model
    ↓
Compatibility Analysis
    ↓
Validation
    ↓
Safety
    ↓
Product Result
    ↓
UI / Voice
```

---

# 62. AI Data Flow Example — Voice

```text
Microphone
    ↓
Speech Recognition
    ↓
Text
    ↓
Intent / Context
    ↓
Relevant Context Retrieval
    ↓
Open Model
    ↓
Validated Answer
    ↓
Text UI
    ↓
ElevenLabs
    ↓
Voice
```

---

# 63. AI Data Flow Example — Ingredient Question

```text
Ingredient Question
    ↓
Ingredient Identification
    ↓
Knowledge Retrieval
    ↓
User/Product Context
    ↓
Open Model
    ↓
Structured Explanation
    ↓
Validation
    ↓
Safety
    ↓
User Response
```

---

# 64. Fallback Architecture

SkinSense should support graceful fallback at every major AI dependency.

### Speech recognition unavailable

```text
Voice
 ↓
Failure
 ↓
Text Input
```

### Open model unavailable

```text
AI Request
 ↓
Failure
 ↓
Retry / safe error
```

### Knowledge retrieval unavailable

```text
Retrieval failure
 ↓
Do not invent authoritative facts
 ↓
Explain limitation / safe fallback
```

### ElevenLabs unavailable

```text
Text answer remains available
```

---

# 65. Offline Capability

An offline-capable mode may be supported where practical.

Potential offline architecture:

```text
Local UI
+
Local storage
+
Local speech model
+
Local open AI model
+
Local curated knowledge
```

Not every capability must work fully offline.

The actual offline scope must be documented and tested rather than claimed prematurely.

---

# 66. Privacy-Aware AI Processing

When possible, AI processing should minimize unnecessary exposure of user information.

For each request, the system should ask:

> "What information does the model actually need?"

For example, an ingredient definition may not require the user's complete skincare history.

---

# 67. Personal Data Minimization

Do not send:

- unnecessary profile fields,
- unrelated journal entries,
- unrelated previous conversations,
- unnecessary voice metadata.

Context should be task-specific.

This improves:

- privacy,
- latency,
- cost,
- and reasoning clarity.

---

# 68. AI and User Control

The AI should recommend, explain, or flag considerations.

It should not:

- silently modify a user's routine,
- silently delete products,
- silently store new permanent profile facts,
- silently purchase products,
- or take irreversible actions.

Any consequential action should remain under application/user control.

---

# 69. AI Architecture Anti-Patterns

Do not build:

### Generic chatbot architecture

```text
Everything
 ↓
One LLM call
 ↓
Text
```

### Closed-model dependency

```text
All intelligence
 ↓
Closed API
```

### Raw model output rendering

```text
LLM output
 ↓
Direct HTML
```

### Unvalidated JSON

```text
LLM JSON
 ↓
Database
```

### AI-only security

```text
"Model says this is allowed"
```

### AI-only domain truth

```text
"Model remembers it"
```

---

# 70. Reliability Principles

The AI layer should prefer:

> **grounded + structured + validated**

over:

> **creative + verbose + confident**

The project's objective is useful skincare decision support, not unrestricted text generation.

---

# 71. AI Quality Hierarchy

When optimizing the AI layer, prioritize:

```text
1. Safety
2. Factual grounding
3. Correct use of user context
4. Structured output reliability
5. Useful reasoning
6. Clear explanation
7. Latency
8. Conversational polish
```

A faster unsafe answer is worse than a slower safe answer.

---

# 72. Current AI Architecture Boundary

For the MVP, the AI system should support at minimum:

```text
User Profile Understanding
Routine Generation
Product Analysis
Ingredient Explanation
Product Compatibility
Text Q&A
```

Voice is an interface over these capabilities.

Progress interpretation and advanced personalization can be added without changing the core AI architecture.

---

# 73. Definition of Done

The AI architecture is considered sufficiently implemented when:

- core AI capabilities are separated by task,
- open-source/open-weight AI performs meaningful core reasoning,
- user context is structured,
- relevant knowledge can be retrieved,
- model output uses defined schemas,
- outputs are validated,
- failures have controlled recovery,
- model-specific code is isolated,
- voice uses the same core AI pipeline,
- safety is applied before user-facing output,
- sensitive context is minimized,
- and the system can evaluate or replace the model without redesigning the entire product.

---

# 74. Source-of-Truth Boundaries

Use this document for:

- AI responsibilities,
- AI pipeline,
- AI layers,
- model abstraction,
- context management,
- retrieval architecture,
- structured output strategy,
- AI validation,
- model swapping,
- voice-to-AI relationship.

Use:

- `06_SKINCARE_DOMAIN.md` → skincare knowledge
- `08_AI_PROMPTS.md` → exact prompts and output instructions
- `09_PRODUCT_ANALYSIS.md` → product-analysis processing
- `10_PERSONALIZATION.md` → personalization rules
- `11_VOICE_SYSTEM.md` → voice implementation
- `12_SAFETY.md` → safety rules
- `13_DATA_MODEL.md` → persistence
- `14_SYSTEM_ARCHITECTURE.md` → complete application architecture
- `16_TESTING.md` → AI evaluation

---

# 75. Final AI Principle

SkinSense should use AI to perform the part humans currently find difficult:

> **connecting skincare information to the user's own context and explaining that connection clearly.**

The AI should not be treated as an oracle.

It should function as a:

> **grounded, explainable, privacy-aware decision-support engine powered by open-source/open-weight AI.**