# SkinSense — Data Model

## 1. Purpose

This document defines the logical data model for SkinSense.

It describes:

- core entities,
- entity relationships,
- fields and their meaning,
- ownership,
- source and provenance,
- temporary versus persistent data,
- AI-generated data,
- product data,
- skincare profile data,
- routine data,
- progress data,
- voice-related data,
- analysis records,
- timestamps,
- lifecycle,
- deletion behavior,
- and data integrity rules.

This document is the primary source of truth for the **logical data structure** of SkinSense.

It does not prescribe a specific database technology or deployment architecture.

---

# 2. Data Model Principles

SkinSense data must follow these principles:

## 2.1 Store What the Product Needs

Do not collect or persist information merely because it is technically available.

Every stored field should have a product purpose.

---

## 2.2 Separate User Facts From AI Interpretation

The system must distinguish:

```text
USER-PROVIDED INFORMATION
        vs
AI / SYSTEM INTERPRETATION
```

An AI inference must never silently become a permanent user fact.

---

## 2.3 Preserve Data Provenance

Where practical, the system should know where an important piece of information came from.

Possible origins:

```text
USER
PRODUCT_LABEL
OCR
MANUFACTURER
TRUSTED_SOURCE
SYSTEM
AI_INFERENCE
```

---

## 2.4 Separate Current State From History

Current routine/product information should remain easy to retrieve.

Historical events such as previous products and journal observations should remain separately identifiable.

---

## 2.5 Minimize Sensitive Data

Personal skincare information, images, transcripts, and voice-related information should be treated as potentially sensitive.

Only necessary data should be retained.

---

## 2.6 AI Output Is Not Automatically Trusted

AI-generated information should be stored and identified as generated content.

Important AI output must pass validation before becoming application state.

---

# 3. High-Level Data Architecture

The logical data model can be represented as:

```text
                         USER
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     SKIN PROFILE      ROUTINE          PREFERENCES
          │               │                │
          │               ▼                │
          │          ROUTINE ITEMS         │
          │               │                │
          │               ▼                │
          │            PRODUCTS ◄──────────┘
          │               │
          ▼               ▼
       CONCERNS      PRODUCT ANALYSIS
          │               │
          │               ▼
          │          INGREDIENTS
          │               │
          ▼               ▼
      JOURNAL       INGREDIENT KNOWLEDGE
          │
          ▼
    PROGRESS ANALYSIS

VOICE SESSION
      │
      ▼
TRANSCRIPT
      │
      ▼
NORMAL AI PIPELINE
```

---

# 4. Core Entity Groups

SkinSense data can be divided into the following groups.

## User Data

- User
- User Profile
- Skin Profile
- Concerns
- Preferences

## Routine Data

- Routine
- Routine Item
- Product Reference

## Product Data

- Product
- Product Source
- Product Image
- Product Analysis
- Product Claims

## Ingredient Data

- Ingredient
- Ingredient Alias
- Ingredient Knowledge
- Ingredient Source

## Progress Data

- Journal Entry
- Product Usage Event
- Progress Analysis

## Conversation Data

- Conversation Session
- Message
- Voice Session
- Transcript
- Voice Output

## AI Metadata

- AI Analysis
- Model Metadata
- Prompt Metadata
- Knowledge References

---

# 5. User Entity

The `User` entity represents the account or application identity of the person using SkinSense.

Conceptual fields:

```text
id
created_at
updated_at
status
```

Potential status values:

```text
ACTIVE
DISABLED
DELETED
```

The exact authentication fields are defined by the security/architecture layer.

---

# 6. User Identity Rules

The user entity should contain only identity/account information needed by the application.

Do not store unnecessary personal information.

The user's skincare context must be stored separately from authentication/account metadata.

---

# 7. User Profile Entity

`UserProfile` represents user-facing personal preferences and general information relevant to SkinSense.

Possible conceptual fields:

```text
user_id
display_name
preferred_language
voice_enabled
preferred_voice
routine_complexity
budget_preference
created_at
updated_at
```

Not every field must be collected in the MVP.

---

# 8. Skin Profile Entity

`SkinProfile` represents the user's current skincare context.

Conceptual structure:

```text
id
user_id
skin_behavior
sensitivity_context
confidence_state
source
created_at
updated_at
```

The profile should represent:

> **skincare context**

not:

> **medical diagnosis**.

---

# 9. Skin Profile Attribute Model

Where more detailed storage is needed, profile information may include:

```text
skin_behavior
oiliness
dryness
combination_behavior
sensitivity
other_observations
```

The exact representation may be normalized or structured depending on implementation.

---

# 10. Skin Profile Source

Every important profile attribute should conceptually be traceable to a source.

Examples:

```text
USER_REPORTED
QUESTIONNAIRE
USER_CORRECTION
SYSTEM_INTERPRETATION
```

AI-generated interpretation must remain distinguishable from explicit user statements.

---

# 11. Skin Profile Confidence

The system may store a state indicating how strongly a profile attribute is supported.

Conceptual values:

```text
USER_STATED
LIKELY
UNCERTAIN
UNKNOWN
```

This is not a medical confidence score.

It is a representation of information quality.

---

# 12. Skin Concerns

Users may have multiple skincare concerns.

A concern should be represented separately from skin type.

Conceptual structure:

```text
id
user_id
concern_type
priority
source
status
created_at
updated_at
```

Possible conceptual concern categories:

```text
OILINESS
DRYNESS
BREAKOUTS
UNEVEN_TEXTURE
PIGMENTATION
DULL_APPEARANCE
SENSITIVITY
OTHER
```

These are user concerns, not diagnoses.

---

# 13. Concern Priority

If users provide multiple concerns, they may optionally indicate priority.

Example:

```text
PRIMARY
SECONDARY
LOWER_PRIORITY
```

The exact implementation may use numeric or categorical priority.

The system must not infer clinical severity from user priority.

---

# 14. User Preferences

Preferences should be represented separately from skin context.

Possible preferences:

```text
routine_complexity
budget_range
preferred_product_texture
fragrance_preference
language
voice_preference
```

Preferences are not medical facts.

---

# 15. Stable vs Temporary User Data

The data model should distinguish:

### Stable Context

Information intended to remain relevant.

Examples:

- preferred routine complexity,
- language preference,
- current product list.

### Temporary Observation

Information related to a particular moment.

Examples:

- "skin feels dry today,"
- "skin feels more oily this week."

Temporary observations belong primarily in journal/progress data.

---

# 16. Current Routine Entity

`Routine` represents a user's currently selected or saved skincare routine.

Conceptual fields:

```text
id
user_id
name
status
version
created_at
updated_at
```

Possible statuses:

```text
ACTIVE
ARCHIVED
DRAFT
```

Only one routine should normally be treated as the active routine for a given context unless the product explicitly supports multiple routines.

---

# 17. Routine Versioning

Routine changes should be traceable where practical.

Example:

```text
Routine v1
   ↓
User changes profile
   ↓
Routine v2
```

This helps understand:

- what changed,
- why it changed,
- what the user previously used.

A complete version-history implementation is optional for the MVP but should not be prevented by the data model.

---

# 18. Routine Item Entity

Each routine contains ordered items.

Conceptual fields:

```text
id
routine_id
product_id
category
time_of_day
step_order
frequency
optional
status
notes
created_at
updated_at
```

Possible time values:

```text
MORNING
EVENING
OPTIONAL
OTHER
```

---

# 19. Routine Item Product Reference

A routine item may reference:

- a specific stored product,
- a general product category,
- or a user-owned product.

Therefore, the data model should not require every routine step to correspond to a known commercial product.

Example:

```text
Routine Item:
Category = SUNSCREEN
Product = unknown
```

This is a valid state.

---

# 20. Product Entity

`Product` represents a skincare product known to the system.

Conceptual fields:

```text
id
brand
name
category
country_or_region
version
status
created_at
updated_at
```

Not every field must be available.

---

# 21. Product Identity

Product identity should be based on reliable information.

Potential identity components:

```text
brand
product_name
category
variant
region
version
```

The system must not assume that two similarly named products are the same.

---

# 22. User Product Relationship

A product may have a user-specific relationship.

Conceptual relationship states:

```text
CURRENT
PAUSED
PAST
CONSIDERING
NOT_OWNED
UNKNOWN
```

This relationship should ideally be separate from the global product record.

---

# 23. UserProduct Entity

A user-specific product relationship may conceptually contain:

```text
id
user_id
product_id
status
started_at
ended_at
user_notes
created_at
updated_at
```

This allows the same product to exist globally while different users have different relationships with it.

---

# 24. Product Input Entity

Each product-analysis attempt may begin with an input record.

Conceptual fields:

```text
id
user_id
input_type
raw_reference
created_at
```

Possible input types:

```text
IMAGE
INGREDIENT_LIST
MANUAL_ENTRY
EXTERNAL_PRODUCT_REFERENCE
```

---

# 25. Product Image Entity

A product image represents an uploaded or captured image used for analysis.

Conceptual fields:

```text
id
product_input_id
storage_reference
image_type
created_at
deleted_at
```

Possible image types:

```text
FRONT_LABEL
BACK_LABEL
INGREDIENT_LIST
OTHER
```

---

# 26. Image Processing Metadata

Where practical, the system may store non-sensitive processing metadata:

```text
width
height
quality_status
processing_status
ocr_status
```

Raw image retention should be controlled by the privacy policy.

---

# 27. OCR Result Entity

OCR output should be treated separately from verified product data.

Conceptual fields:

```text
id
product_input_id
raw_text
processing_status
confidence_summary
created_at
```

OCR output is **extracted data**, not automatically verified truth.

---

# 28. OCR Provenance

The system should preserve the relationship:

```text
Image
 ↓
OCR Result
 ↓
Extracted Product Fields
```

This allows debugging when an ingredient was incorrectly recognized.

---

# 29. Product Field Entity

If normalized product information is extracted from an input, the field should conceptually retain its source.

Example:

```text
field_name
field_value
source
confidence_state
```

Possible source:

```text
USER_PROVIDED
OCR_EXTRACTED
MANUFACTURER
TRUSTED_SOURCE
SYSTEM_INTERPRETED
```

---

# 30. Ingredient Entity

`Ingredient` represents a normalized skincare ingredient concept.

Conceptual fields:

```text
id
canonical_name
category
status
created_at
updated_at
```

The ingredient entity represents identity.

Its scientific/general information belongs in the knowledge layer.

---

# 31. Ingredient Alias Entity

Different textual names may refer to the same canonical ingredient.

Conceptual fields:

```text
id
ingredient_id
alias
source
created_at
```

Examples may include:

- capitalization variants,
- approved alternate names,
- naming conventions.

Only validated aliases should be stored.

---

# 32. ProductIngredient Entity

This entity represents that a product contains an ingredient.

Conceptual fields:

```text
id
product_id
ingredient_id
raw_name
normalized_name
position
identification_status
source
created_at
```

---

# 33. Ingredient Position

If the ingredient list has a known order, preserve the ingredient's relative position.

Example:

```text
Water → position 1
Glycerin → position 2
...
```

Position should not be treated as an exact concentration.

---

# 34. Ingredient Identification Status

Possible states:

```text
IDENTIFIED
PARTIALLY_IDENTIFIED
UNCERTAIN
UNKNOWN
```

An uncertain ingredient must not be presented as confidently identified.

---

# 35. Ingredient Concentration

If an exact concentration is explicitly known, it may be stored.

Conceptual field:

```text
concentration_value
concentration_unit
concentration_source
```

If unavailable:

```text
concentration = NULL
```

Do not infer concentration.

---

# 36. Product Claims Entity

Product claims represent manufacturer or packaging claims.

Conceptual fields:

```text
id
product_id
claim_text
claim_type
source
created_at
```

Possible claim types:

```text
HYDRATING
BRIGHTENING
OIL_CONTROL
ANTI_AGING
ACNE_FOCUSED
OTHER
```

Claims must remain distinct from evidence-backed domain knowledge.

---

# 37. Product Instructions Entity

Where relevant, product-specific instructions can be stored.

Conceptual fields:

```text
id
product_id
instruction_text
source
created_at
```

Instructions should not be silently replaced with AI-generated instructions.

---

# 38. Product Warning Entity

Relevant product warnings may be stored separately.

Conceptual fields:

```text
id
product_id
warning_text
source
created_at
```

Warnings should remain linked to the product information from which they originated.

---

# 39. Product Source Entity

A product may have one or more information sources.

Conceptual fields:

```text
id
product_id
source_type
source_reference
source_name
retrieved_at
verification_status
created_at
```

Possible source types:

```text
USER_LABEL
MANUFACTURER
TRUSTED_DATABASE
OTHER
```

---

# 40. Product Source Verification

Possible verification states:

```text
VERIFIED
LIKELY
AMBIGUOUS
UNVERIFIED
```

The application should avoid treating unverified sources as definitive product facts.

---

# 41. Knowledge Source Entity

A skincare knowledge source represents an authoritative or approved source used by the domain/AI system.

Conceptual fields:

```text
id
source_name
source_type
reference
title
published_at
retrieved_at
status
```

Possible source types:

```text
GOVERNMENT
DERMATOLOGY_ORGANIZATION
SCIENTIFIC_LITERATURE
MEDICAL_REFERENCE
MANUFACTURER
OTHER
```

---

# 42. Ingredient Knowledge Entity

This represents structured knowledge about an ingredient.

Conceptual fields:

```text
id
ingredient_id
what_it_is
common_roles
considerations
evidence_level
knowledge_version
updated_at
```

---

# 43. Ingredient Knowledge Source Relationship

Knowledge claims should be traceable to their sources where practical.

Conceptual:

```text
Ingredient Knowledge
      ↓
Knowledge Reference
      ↓
Knowledge Source
```

This is important for evidence-aware responses.

---

# 44. Evidence Level

A knowledge item may have a conceptual evidence level:

```text
HIGH
MODERATE
LIMITED
UNKNOWN
```

This does not need to be shown directly to users in the MVP unless useful.

It is primarily a reasoning/grounding attribute.

---

# 45. Product Analysis Entity

`ProductAnalysis` represents one completed or attempted analysis of a product.

Conceptual fields:

```text
id
user_id
product_input_id
product_id
analysis_status
analysis_type
created_at
updated_at
completed_at
```

Possible statuses:

```text
PROCESSING
ANALYSIS_COMPLETE
ANALYSIS_PARTIAL
MORE_INFORMATION_NEEDED
FAILED
SAFETY_ESCALATION
```

---

# 46. Product Analysis Type

Possible analysis types:

```text
PRODUCT_OVERVIEW
INGREDIENT_ANALYSIS
COMPATIBILITY
COMPARISON
```

---

# 47. Product Analysis Result

The analysis result may contain structured data such as:

```text
summary
key_ingredients
compatibility_assessment
reasons
overlaps
considerations
unknowns
safety_notes
```

The actual schema is defined in the AI/prompt and architecture documents.

The database should preserve validated structured output rather than only raw text where possible.

---

# 48. Compatibility Assessment Entity

A user-specific compatibility result may conceptually contain:

```text
id
analysis_id
assessment
summary
reasons
overlaps
considerations
unknowns
created_at
```

Possible assessment states:

```text
REASONABLY_COMPATIBLE
CONSIDER_CAREFULLY
INSUFFICIENT_INFORMATION
PROFESSIONAL_EVALUATION_RECOMMENDED
```

These are product-analysis states, not medical diagnoses.

---

# 49. Product Analysis Provenance

An analysis should ideally be traceable to:

```text
Product Input
+
User Context
+
Relevant Routine
+
Knowledge References
+
AI Model
+
Prompt Version
```

This is important for debugging and reproducibility.

---

# 50. Analysis Metadata Entity

An analysis metadata record may contain:

```text
model_id
model_version
prompt_id
prompt_version
knowledge_version
processing_duration
retry_count
validation_status
created_at
```

Sensitive prompt/context content should not be stored unnecessarily.

---

# 51. Routine Generation Record

Each generated routine may optionally be stored as an AI generation event.

Conceptual fields:

```text
id
user_id
routine_id
model_id
model_version
prompt_version
generation_status
created_at
```

This makes AI-generated routines distinguishable from manually edited routines.

---

# 52. AI Generation Status

Possible states:

```text
REQUESTED
GENERATED
VALIDATED
REJECTED
FAILED
```

A routine should not become active simply because the model generated it.

---

# 53. User Approval of AI Output

AI-generated routines or major analyses should support an explicit application-level status such as:

```text
DRAFT
REVIEWED
ACTIVE
ARCHIVED
```

This preserves the distinction between:

> AI suggestion

and:

> user-selected current routine.

---

# 54. Journal Entry Entity

`JournalEntry` represents a user-recorded observation.

Conceptual fields:

```text
id
user_id
entry_date
observation_text
associated_product_id
associated_routine_id
created_at
updated_at
deleted_at
```

The journal should prioritize the user's own observations.

---

# 55. Journal Entry Types

Potential types:

```text
GENERAL_OBSERVATION
PRODUCT_OBSERVATION
ROUTINE_OBSERVATION
SKIN_FEEL
REACTION_REPORT
OTHER
```

The exact set may evolve.

---

# 56. Journal Observation Source

The observation may originate from:

```text
MANUAL_TEXT
VOICE_TRANSCRIPT
STRUCTURED_INPUT
```

A voice-generated journal entry should preserve that it came from the user's spoken statement.

---

# 57. Product Usage Event

If progress tracking is enabled, the system may record product usage events.

Conceptual fields:

```text
id
user_id
product_id
routine_id
usage_date
notes
source
created_at
```

This helps correlate product use with user-reported observations without claiming causation.

---

# 58. Progress Analysis Entity

An AI-generated progress summary can be represented separately from raw journal data.

Conceptual fields:

```text
id
user_id
date_range_start
date_range_end
analysis_status
summary
observed_changes
possible_patterns
limitations
created_at
```

The raw journal remains the source of the user's observations.

---

# 59. Progress Analysis Principle

Progress analysis must never overwrite the underlying observations.

Example:

```text
Journal:
"My skin felt less oily."

AI Summary:
"Recent entries contain repeated reports of reduced oiliness."
```

The original entry remains unchanged.

---

# 60. Progress Analysis Provenance

Progress summaries should ideally preserve:

```text
journal entries used
product usage records used
model version
prompt version
created_at
```

This helps reproduce or review AI-generated summaries.

---

# 61. Conversation Session Entity

A `ConversationSession` represents a context-aware conversation.

Conceptual fields:

```text
id
user_id
context_type
context_reference
created_at
updated_at
status
```

Possible context types:

```text
GENERAL
ROUTINE
PRODUCT
INGREDIENT
PROGRESS
```

---

# 62. Message Entity

A conversation may contain messages.

Conceptual fields:

```text
id
session_id
role
content
input_type
created_at
```

Possible roles:

```text
USER
ASSISTANT
SYSTEM
```

Internal/system messages should not necessarily be exposed to the user.

---

# 63. Message Input Type

Possible values:

```text
TEXT
VOICE
SYSTEM_EVENT
```

---

# 64. Voice Session Entity

A voice session represents a speech interaction.

Conceptual fields:

```text
id
user_id
conversation_session_id
status
language
created_at
completed_at
```

Possible statuses:

```text
RECORDING
TRANSCRIBING
PROCESSING
COMPLETED
FAILED
CANCELLED
```

---

# 65. Voice Audio Reference

If raw audio is stored, it should be represented by a reference rather than embedded directly into application records.

Conceptual:

```text
audio_storage_reference
retention_status
created_at
deleted_at
```

The default should be to minimize raw-audio retention unless the product explicitly requires it.

---

# 66. Transcript Entity

A transcript represents speech converted into text.

Conceptual fields:

```text
id
voice_session_id
text
language
stt_model
stt_version
confidence_state
created_at
```

The transcript is still derived from user input and should be treated carefully.

---

# 67. Transcript Correction

If the user edits the transcript before submitting it:

```text
original_transcript
edited_transcript
```

may be stored where useful.

The edited version should become the authoritative input for downstream reasoning.

---

# 68. Voice Output Entity

An output generated by ElevenLabs may conceptually contain:

```text
id
message_id
provider
voice_id
language
audio_reference
status
created_at
```

It should refer to the validated response text rather than store a separate independent meaning.

---

# 69. AI Request Entity

An AI request can be tracked independently for observability.

Conceptual fields:

```text
id
user_id
task_type
model_id
model_version
prompt_id
prompt_version
status
started_at
completed_at
latency_ms
retry_count
```

---

# 70. AI Request Task Types

Possible values:

```text
PROFILE_UNDERSTANDING
ROUTINE_GENERATION
INGREDIENT_EXPLANATION
PRODUCT_ANALYSIS
PRODUCT_COMPATIBILITY
GENERAL_QA
PROGRESS_SUMMARY
SAFETY_RESPONSE
VOICE_FORMATTING
```

These should correspond to actual supported AI capabilities.

---

# 71. AI Result Entity

AI results may be represented separately from AI requests.

Conceptual fields:

```text
id
ai_request_id
result_type
structured_output
validation_status
safety_status
created_at
```

---

# 72. AI Validation Metadata

For important results, track:

```text
schema_valid
semantic_valid
safety_valid
validation_version
validated_at
```

This provides evidence that output passed application-level checks.

---

# 73. AI Result Status

Possible values:

```text
GENERATED
VALIDATED
REPAIRED
REJECTED
FAILED
```

---

# 74. Knowledge Reference Entity

A specific AI result may depend on one or more knowledge references.

Conceptual:

```text
id
ai_result_id
knowledge_source_id
reference_type
reference_location
created_at
```

This enables source tracing.

---

# 75. User Data Ownership

The user owns or controls their personal application data conceptually.

This includes:

- skin profile,
- preferences,
- current routine,
- current products,
- journal entries,
- conversation content where retained,
- uploaded personal images,
- voice data where retained.

The exact legal/data-rights implementation depends on the final deployment context and policies.

---

# 76. Product Data vs User Data

These must remain separate.

Example:

```text
Product:
"Serum X contains Ingredient Y."

User:
"Serum X is currently used by this user."
```

The first is global product data.

The second is user-specific relationship data.

---

# 77. Ingredient Knowledge vs AI Interpretation

These must remain separate.

Example:

```text
Ingredient Knowledge:
"Niacinamide is commonly used for..."

AI Interpretation:
"This may be relevant to your stated concerns..."
```

The second is personalized reasoning, not domain knowledge.

---

# 78. Current State vs Historical Record

The data model should distinguish:

```text
CURRENT ROUTINE
```

from:

```text
PAST ROUTINE
```

and:

```text
CURRENT PRODUCT
```

from:

```text
PAST PRODUCT
```

Historical records should not accidentally appear as current context.

---

# 79. Soft Deletion

Where appropriate, records may use:

```text
deleted_at
```

instead of immediate physical deletion.

However, sensitive data must still be removed according to the actual privacy/deletion policy.

Soft deletion must not become a reason to retain personal information indefinitely.

---

# 80. Data Retention

Retention should be based on product necessity.

Potential policies:

### User profile

Retain while account is active or until deletion.

### Current routine

Retain while relevant.

### Journal

Retain according to user controls.

### Voice audio

Prefer minimal retention.

### AI observability metadata

Retain only as long as necessary for debugging/operations.

### Raw OCR/product images

Retain only when useful and permitted.

Exact retention periods belong in `15_SECURITY_PRIVACY.md`.

---

# 81. Deletion Relationships

Deleting a user should eventually remove or anonymize related personal records according to the privacy design.

Conceptually:

```text
User
 ↓
Profile
 ↓
Routine
 ↓
User Products
 ↓
Journal
 ↓
Conversations
 ↓
Voice Data
 ↓
Personalized Analyses
```

Global product/ingredient knowledge does not belong to the user's personal deletion graph.

---

# 82. Referential Integrity

The system should avoid dangling references.

Examples:

A routine item should not reference a product record that no longer exists unless the relationship intentionally preserves historical information.

A journal entry should not lose its user association.

An analysis should preserve enough metadata to determine which product/context it analyzed.

---

# 83. Historical Integrity

Historical records should not be retroactively modified merely because the user later changes their profile.

Example:

A product analysis performed in October should not silently become an analysis using a January profile.

Important analyses should reference the context used at the time where practical.

---

# 84. Snapshotting AI Context

For important AI-generated outputs, the system may preserve a validated context snapshot or equivalent reference.

Conceptually:

```text
AI Analysis
   ↓
Context Version
   ├── User Profile Version
   ├── Routine Version
   └── Product Data Version
```

This improves reproducibility.

The exact storage strategy is an implementation decision.

---

# 85. Sensitive Fields

Potentially sensitive fields include:

- face images,
- voice recordings,
- user-reported reactions,
- private conversations,
- personal preferences,
- health-adjacent information.

These fields should receive stronger privacy controls.

---

# 86. Avoid Storing Unnecessary Raw Prompts

The application should not automatically store every complete AI prompt containing the user's personal context.

For debugging, store metadata where possible instead of duplicating sensitive context.

---

# 87. Data Classification

A useful conceptual classification is:

### PUBLIC DOMAIN DATA

General ingredient/product information.

### APPLICATION DATA

System configuration and non-personal metadata.

### USER PERSONAL DATA

Profile, routine, products, preferences.

### SENSITIVE USER CONTENT

Images, voice, private observations, potentially health-related conversations.

Different storage/access policies may apply to each category.

---

# 88. User Product Data vs Global Product Data

Global product:

```text
Product ID: P123
```

User relationship:

```text
User A → P123 → CURRENT
User B → P123 → CONSIDERING
```

This separation is required.

---

# 89. Product Analysis Ownership

A product may be globally known, but a personalized compatibility analysis belongs to the user context that produced it.

Example:

```text
Product Analysis A
→ User A
→ Product X
→ User A's routine
```

It should not become a universal statement about Product X.

---

# 90. Personalized Analysis Reuse

General product analysis can sometimes be reused.

However:

```text
General product facts
```

may be reusable while:

```text
User-specific compatibility
```

must remain user-specific.

---

# 91. Data Validation

Every persisted object should satisfy application-level validation.

Examples:

- user ID exists,
- product ID exists where required,
- enum values are valid,
- timestamps are valid,
- required fields are present,
- relationships are consistent.

AI output must pass validation before persistence.

---

# 92. Data Normalization

Repeated information should not unnecessarily be duplicated.

Example:

Do not store the full ingredient definition independently inside every product.

Instead:

```text
Product
 ↓
Ingredient
 ↓
Ingredient Knowledge
```

---

# 93. Controlled Duplication

Some duplication may be justified for:

- historical snapshots,
- auditability,
- performance,
- reproducibility.

When duplication is introduced, its purpose should be documented.

---

# 94. Data Versioning

Data that materially changes AI behavior may need version information.

Potential versioned objects:

```text
User Profile
Routine
Product formulation
Ingredient Knowledge
AI Prompt
AI Model
```

---

# 95. Time Fields

Important persistent entities should generally have:

```text
created_at
updated_at
```

Historical/event entities may also have:

```text
occurred_at
started_at
ended_at
```

The distinction matters.

Example:

```text
created_at:
When the journal record was entered.

occurred_at:
When the user actually experienced the observation.
```

---

# 96. Time Zone

User-facing dates should respect the user's configured timezone where relevant.

Stored timestamps should use a consistent backend representation.

The exact implementation belongs in the architecture layer.

---

# 97. Data Relationships Summary

Core relationships:

```text
User
 ├── 1:1 SkinProfile
 ├── 1:N Concerns
 ├── 1:1 / 1:N Preferences
 ├── 1:N Routines
 ├── 1:N UserProducts
 ├── 1:N JournalEntries
 ├── 1:N Conversations
 ├── 1:N VoiceSessions
 └── 1:N ProductAnalyses

Routine
 └── 1:N RoutineItems

RoutineItem
 └── N:1 Product (optional)

Product
 ├── 1:N ProductIngredients
 ├── 1:N ProductSources
 ├── 1:N ProductClaims
 ├── 1:N ProductInstructions
 └── 1:N ProductWarnings

Ingredient
 ├── 1:N IngredientAliases
 └── 1:N IngredientKnowledge

ProductAnalysis
 ├── N:1 Product
 ├── N:1 User
 ├── N:1 ProductInput
 └── 1:1 CompatibilityAssessment

JournalEntry
 ├── N:1 User
 ├── N:1 Product (optional)
 └── N:1 Routine (optional)

AIRequest
 └── 1:N AIResult
```

---

# 98. User Profile to Routine Relationship

The profile itself should not contain the entire routine.

Correct:

```text
User
 ↓
Skin Profile

User
 ↓
Routine
```

The routine can use the profile during generation.

This keeps the data model modular.

---

# 99. User Profile to Product Relationship

The profile should not contain complete product records.

Correct:

```text
User
 ↓
UserProduct
 ↓
Product
```

This avoids duplicating global product information.

---

# 100. Product to Ingredient Relationship

The product should reference normalized ingredients.

```text
Product
 ↓
ProductIngredient
 ↓
Ingredient
```

The raw ingredient text should remain available where useful for provenance.

---

# 101. Ingredient Knowledge Relationship

```text
Ingredient
 ↓
IngredientKnowledge
 ↓
KnowledgeSource
```

This separates domain facts from product data.

---

# 102. AI to Data Relationship

AI does not own the primary user data.

Instead:

```text
Application Data
      ↓
Context Builder
      ↓
AI
      ↓
Validated Result
      ↓
Application Data
```

This prevents the model from becoming the source of truth.

---

# 103. AI-Generated Data Must Be Identifiable

Any persisted AI-generated result should be identifiable as generated.

Possible metadata:

```text
generated_by = AI
model_id
model_version
prompt_version
created_at
```

User-edited changes should also be distinguishable where practical.

---

# 104. User-Edited AI Results

If a user edits an AI-generated routine:

```text
AI-generated routine
      ↓
User edits
      ↓
Current routine
```

The final current routine should not incorrectly be labeled as entirely AI-generated.

---

# 105. Data Provenance Model

Important information should conceptually follow:

```text
VALUE
 ↓
SOURCE
 ↓
CONFIDENCE / STATUS
 ↓
TIME
```

Example:

```text
Ingredient:
Niacinamide

Source:
User product label

Status:
Identified

Observed:
2026-10-04
```

---

# 106. Unknown Value Handling

Do not use fake values such as:

```text
"unknown"
"n/a"
"not available"
```

in fields where `NULL` or an explicit status is more appropriate.

This allows the application to distinguish:

```text
unknown
vs
not applicable
vs
not provided
```

---

# 107. Empty Collections

Collections should normally be represented as empty when no records exist rather than fabricated placeholder objects.

Example:

```text
ingredients: []
```

not:

```text
ingredients: [{name: "Unknown"}]
```

---

# 108. Duplicate Prevention

The system should avoid accidental duplicate records.

Potential uniqueness areas:

- canonical ingredient identity,
- user-product relationship,
- active routine,
- product aliases,
- source references.

Exact constraints belong in the database implementation.

---

# 109. Product Deduplication

Two product inputs may refer to the same global product.

The system should attempt to reuse a known product record when reliable identity matching exists.

It must not merge products merely because their names look similar.

---

# 110. Ingredient Deduplication

Different textual names that are validated aliases of the same ingredient should map to one canonical ingredient.

Uncertain names must remain uncertain rather than being force-merged.

---

# 111. Routine Deduplication

Repeated AI-generated routines should not automatically create many active routines.

The application should explicitly manage:

- drafts,
- active routines,
- archived routines.

---

# 112. Analysis Deduplication

Repeated analysis requests may be cached or reused when appropriate.

However, personalized compatibility analysis should consider current user context.

---

# 113. Data Caching

Cacheable data may include:

- product metadata,
- ingredient knowledge,
- non-personal analysis results.

Personalized results require additional privacy/context considerations.

Caching must not accidentally expose one user's personalized result to another user.

---

# 114. Data Access Boundary

The application should conceptually enforce:

```text
User A
 ↓
Only User A's personal data
```

Global product/ingredient information can be shared.

Personalized analysis and private context must remain isolated.

---

# 115. Role-Based Access

Administrative access, if added later, should be separated from ordinary user access.

A normal user should not access another user's:

- profile,
- journal,
- conversations,
- voice data,
- personalized analyses.

Detailed authorization belongs in `15_SECURITY_PRIVACY.md`.

---

# 116. Data Export

Where appropriate, users may be able to export their personal data.

Potential export categories:

- profile,
- routine,
- products,
- journal,
- analyses.

The exact feature is optional for MVP.

---

# 117. Data Import

Importing profile/routine data may be added later.

Imported data must preserve:

- origin,
- timestamp where available,
- validation state.

Imported data must not automatically be treated as verified current information.

---

# 118. Data Lifecycle Example

Example for a new product:

```text
User uploads image
        ↓
ProductInput created
        ↓
ProductImage stored
        ↓
OCRResult created
        ↓
Ingredient extraction
        ↓
Product created / matched
        ↓
ProductIngredient records
        ↓
Knowledge retrieved
        ↓
ProductAnalysis created
        ↓
Compatibility assessment
        ↓
Validated result
        ↓
User sees result
```

---

# 119. Data Lifecycle Example — Routine

```text
User profile
     ↓
Routine request
     ↓
AI generation
     ↓
Validation
     ↓
Routine draft
     ↓
User review
     ↓
Active routine
```

---

# 120. Data Lifecycle Example — Voice

```text
Voice input
     ↓
VoiceSession
     ↓
Audio processing
     ↓
Transcript
     ↓
Message
     ↓
Normal AI pipeline
     ↓
Validated response
     ↓
Voice output
```

---

# 121. Data Lifecycle Example — Progress

```text
User observation
     ↓
JournalEntry
     ↓
Product / Routine association
     ↓
Multiple observations
     ↓
ProgressAnalysis
     ↓
User-facing summary
```

---

# 122. Data Integrity Rules

The following must always hold:

```text
A user-owned record must belong to a valid user.

A routine item must belong to a valid routine.

A product relationship must reference a valid user and product.

A product ingredient must reference a valid product and ingredient.

An AI result must reference a valid AI request.

A product analysis must reference the product/context used for analysis.

A journal entry must preserve its original user observation.

Deleted user data must not remain accidentally accessible through active application queries.
```

---

# 123. Data Safety Rules

Never store:

- API keys,
- passwords in plaintext,
- authentication tokens inside ordinary domain records,
- unnecessary raw AI prompts,
- unnecessary raw voice data.

Secrets belong in secure configuration.

---

# 124. Data and AI Hallucination

AI-generated facts must not be written directly into trusted global knowledge tables.

For example:

Wrong:

```text
AI says:
Ingredient X does Y

↓
Write directly to global ingredient knowledge
```

Correct:

```text
AI generated statement
↓
Validated / sourced
↓
Approved knowledge update
```

AI output and domain knowledge must remain separate.

---

# 125. Data and Product Claims

AI must not convert a manufacturer claim into a verified product fact without preserving the source distinction.

Correct:

```text
Product Claim:
"Manufacturer states..."
```

not:

```text
Verified scientific fact:
...
```

unless appropriately supported.

---

# 126. Data and User Corrections

When a user corrects a profile or product interpretation:

The corrected value should become the current authoritative user value where appropriate.

Previous AI interpretations should not silently overwrite the correction.

---

# 127. Data and Temporary Observations

A journal entry such as:

> "My skin feels dry today."

should remain a timestamped observation.

It should not automatically overwrite:

```text
skin_behavior = DRY
```

without an explicit profile update.

---

# 128. Data and Seasonal Changes

Seasonal/environmental observations should remain contextual.

Example:

```text
Journal:
"Skin feels drier this winter."
```

does not automatically change permanent skin profile data.

---

# 129. Data and AI Context Snapshots

When reproducing an old AI response, the system should use the historical context used for that response where practical rather than the user's current state.

---

# 130. Data Model for Offline Mode

If local/offline mode is supported, the same logical entities should remain valid.

```text
User
Profile
Routine
Product
Ingredient
Journal
Analysis
```

The storage mechanism may differ, but the logical model should remain compatible.

---

# 131. Synchronization Considerations

If both local and remote storage are eventually supported, synchronization must distinguish:

- user edits,
- AI-generated data,
- timestamps,
- conflicts,
- deletion state.

Do not automatically allow one side to overwrite newer user data.

Full synchronization design belongs in the architecture documentation.

---

# 132. Data Model for Model Swapping

Changing the AI model must not require changing core user/product entities.

For example:

```text
User Profile
+
Product
+
Ingredient
```

should remain model-independent.

Only AI metadata identifies which model generated a result.

---

# 133. AI Model Metadata

AI-generated records may reference:

```text
model_provider
model_id
model_version
runtime
```

This is metadata, not part of the domain data itself.

---

# 134. Prompt Metadata

AI-generated records may also reference:

```text
prompt_id
prompt_version
```

This allows later reproduction and debugging.

---

# 135. Knowledge Version Metadata

Where relevant:

```text
knowledge_version
```

may be attached to AI results.

This helps distinguish output generated using different domain-knowledge revisions.

---

# 136. Data Consistency With Product Analysis

A product analysis should not modify the user's current routine automatically.

Correct:

```text
Analyze Product
↓
Return Result
↓
User Decides
↓
Optional Routine Update
```

Incorrect:

```text
Analyze Product
↓
Automatically change routine
```

---

# 137. Data Consistency With Voice

Voice-generated information should follow the same persistence rules as typed input.

Voice is an input mechanism, not a separate data domain.

---

# 138. Data Consistency With Progress

A voice statement should only become a journal entry when the application determines that it represents a journal action or explicitly supported behavior.

Do not automatically record every conversational statement as permanent history.

---

# 139. Data Quality States

Important entities may use:

```text
VERIFIED
USER_PROVIDED
EXTRACTED
INTERPRETED
UNCERTAIN
UNKNOWN
```

The exact enum may vary by entity.

The underlying principle should remain consistent.

---

# 140. Data Source Priority

When multiple values exist for the same field:

```text
Verified source
>
Explicit user input
>
Reliable external source
>
System interpretation
>
AI inference
```

The exact precedence depends on the field.

Safety and product identity may require field-specific rules.

---

# 141. No Silent Overwrites

A new AI inference must not silently overwrite:

- an explicit user fact,
- verified product data,
- or an existing confirmed value.

Changes should be deliberate.

---

# 142. Data Validation Before AI

Before sending data to the AI, validate:

- profile structure,
- product structure,
- ingredient structure,
- routine structure,
- required fields.

Bad data should not be passed downstream blindly.

---

# 143. Data Validation After AI

After AI returns:

```text
Model Output
 ↓
Schema Validation
 ↓
Semantic Validation
 ↓
Safety Validation
 ↓
Persistence
```

Only validated results should become trusted application records.

---

# 144. Data Model and Security

The data model supports, but does not replace, the security model.

Authentication, authorization, encryption, key management, access controls, and threat mitigation belong in:

`15_SECURITY_PRIVACY.md`

---

# 145. Data Model and Privacy

Privacy rules may impose additional constraints on:

- retention,
- deletion,
- export,
- third-party data sharing,
- voice storage,
- image storage.

Those constraints override convenience.

---

# 146. Data Model and UI

The UI should not expose every internal data field.

For example:

```text
model_version
prompt_version
validation_status
```

may remain internal.

User-facing information should be designed according to `05_UI_UX.md`.

---

# 147. Data Model and API

API payloads should be derived from the logical data model but should not necessarily expose the entire database entity.

Example:

```text
Database entity:
UserProfile
```

may become:

```text
API response:
public_profile_view
```

with sensitive/internal fields omitted.

Exact API contracts belong in `14_SYSTEM_ARCHITECTURE.md`.

---

# 148. Data Model and Testing

Each major entity should have tests for:

- creation,
- validation,
- update,
- deletion,
- relationships,
- invalid references,
- duplicate handling,
- user isolation.

AI-generated records require additional validation tests.

---

# 149. Data Model and Demo

Demo data should use clearly identified test/demo records.

Do not use a real person's sensitive data in public demos without appropriate permission and safeguards.

---

# 150. Minimum MVP Data Entities

The smallest useful MVP requires approximately:

```text
User
UserProfile
SkinProfile
Concern
Routine
RoutineItem
Product
UserProduct
ProductInput
ProductIngredient
Ingredient
IngredientKnowledge
ProductAnalysis
CompatibilityAssessment
ConversationSession
Message
VoiceSession
Transcript
AIRequest
AIResult
```

Optional:

```text
JournalEntry
ProductUsageEvent
ProgressAnalysis
VoiceOutput
```

---

# 151. MVP Simplification Principle

Do not create separate entities merely because they look architecturally sophisticated.

If an entity does not provide clear value for:

- data integrity,
- product functionality,
- privacy,
- history,
- or future extensibility,

consider whether it should remain part of the MVP.

The logical model can remain conceptually rich without requiring every entity to be implemented immediately.

---

# 152. Database Implementation Independence

This document intentionally does not require:

- SQLite,
- PostgreSQL,
- MongoDB,
- Supabase,
- or any specific database.

The implementation should choose the appropriate storage technology while preserving the logical relationships defined here.

---

# 153. Recommended MVP Relationship Summary

```text
USER
 │
 ├── USER_PROFILE
 │       └── SKIN_PROFILE
 │             └── CONCERNS
 │
 ├── ROUTINE
 │      └── ROUTINE_ITEMS
 │              └── PRODUCT
 │
 ├── USER_PRODUCTS
 │      └── PRODUCT
 │
 ├── PRODUCT_ANALYSIS
 │      ├── PRODUCT_INPUT
 │      ├── PRODUCT
 │      └── COMPATIBILITY_ASSESSMENT
 │
 ├── JOURNAL_ENTRIES
 │
 ├── CONVERSATION_SESSIONS
 │      └── MESSAGES
 │             └── VOICE_SESSION
 │                    └── TRANSCRIPT
 │
 └── AI_REQUESTS
        └── AI_RESULTS

PRODUCT
   └── PRODUCT_INGREDIENTS
          └── INGREDIENT
                 └── INGREDIENT_KNOWLEDGE
                        └── KNOWLEDGE_SOURCE
```

---

# 154. Data Model Change Rules

Changes to the logical data model should be made when:

- a product requirement introduces new persistent information,
- an existing relationship is insufficient,
- privacy requirements change,
- historical traceability requires additional fields,
- or an important data-integrity problem is discovered.

Do not change the model solely for convenience without checking affected product and architecture documents.

---

# 155. Migration Principle

When changing the data model after implementation:

```text
Current Model
 ↓
Migration
 ↓
New Model
 ↓
Validation
 ↓
Existing Data Integrity Check
```

Existing user data must not be silently lost.

---

# 156. Data Model Source-of-Truth Rules

Use this document for:

- entities,
- relationships,
- fields,
- data ownership,
- lifecycle,
- provenance,
- persistence,
- historical state,
- AI metadata,
- product data structure,
- user data structure.

Use:

- `03_PRODUCT_REQUIREMENTS.md` → what data the product needs
- `06_SKINCARE_DOMAIN.md` → domain concepts
- `07_AI_ARCHITECTURE.md` → AI data flow
- `08_AI_PROMPTS.md` → AI output structure
- `09_PRODUCT_ANALYSIS.md` → product-analysis behavior
- `10_PERSONALIZATION.md` → user-context behavior
- `11_VOICE_SYSTEM.md` → voice behavior
- `12_SAFETY.md` → safety handling
- `14_SYSTEM_ARCHITECTURE.md` → actual database/API implementation
- `15_SECURITY_PRIVACY.md` → data protection
- `16_TESTING.md` → data testing

If security/privacy requirements conflict with convenience, privacy and security take precedence.

---

# 157. Final Data Principle

SkinSense should treat data as more than database records.

Every important piece of information should answer:

```text
What is it?
      ↓
Who does it belong to?
      ↓
Where did it come from?
      ↓
How certain is it?
      ↓
When was it true?
      ↓
Who is allowed to access it?
      ↓
Can it be corrected or deleted?
```

The data model exists to ensure that SkinSense can remain:

> **personalized without being chaotic, AI-powered without treating AI as truth, and useful without unnecessarily collecting or retaining personal information.**