# 14 — System Architecture

## 1. Purpose

This document defines the complete technical architecture of **SkinSense**.

It explains how the major parts of the system work together:

- Web frontend
- Backend API
- Authentication and user context
- Skin profile and personalization
- AI reasoning
- Knowledge and retrieval
- Product image/OCR processing
- Ingredient and product analysis
- Routine generation
- Voice input and output
- Data storage
- Validation and safety controls
- External integrations
- Error handling
- Observability
- Development and production boundaries

This document is the architectural source of truth.

It defines **how the system is organized and how components communicate**, but does not replace the detailed requirements in:

- `03_PRODUCT_REQUIREMENTS.md`
- `06_SKINCARE_DOMAIN.md`
- `07_AI_ARCHITECTURE.md`
- `09_PRODUCT_ANALYSIS.md`
- `10_PERSONALIZATION.md`
- `11_VOICE_SYSTEM.md`
- `12_SAFETY.md`
- `13_DATA_MODEL.md`
- `15_SECURITY_PRIVACY.md`
- `18_DEPLOYMENT_DEMO.md`

---

# 2. System Identity

SkinSense is a **personalized skincare education and decision-support system**.

The system helps a user:

1. understand their reported skin characteristics,
2. build a simple personalized routine,
3. understand skincare ingredients,
4. inspect product information,
5. compare products with their current routine,
6. understand whether a product appears reasonably compatible with their stated context,
7. ask skincare questions using text or voice.

SkinSense is **not**:

- a medical diagnosis system,
- a dermatologist replacement,
- an automated treatment system,
- a prescription engine,
- an ecommerce marketplace,
- a brand-ranking platform,
- a guarantee engine for product effectiveness or safety.

The architecture must preserve this positioning at both product and technical levels.

---

# 3. Architectural Goals

The architecture should optimize for the following priorities.

## 3.1 Safety

Safety must be enforced before convenience, speed, or personalization.

The architecture must prevent the generative model from becoming the sole authority over safety-sensitive outputs.

---

## 3.2 Grounded personalization

AI responses should be based on the user's relevant context rather than generic skincare advice.

The system should know:

- what the user has reported,
- what products they currently use,
- what routine they follow,
- what concerns they have reported,
- what preferences they have specified,
- what information is unknown.

---

## 3.3 Open AI at the core

Open-source/open-weight AI must perform meaningful core product work.

The architecture should therefore keep the AI layer modular so the system can support:

- local inference,
- self-hosted inference,
- different open-weight models,
- model replacement,
- task-specific model selection,
- future optimization.

The UI and business logic must not be tightly coupled to a specific model.

---

## 3.4 Deterministic control around probabilistic AI

Generative AI is probabilistic.

Important system operations should not depend entirely on probabilistic generation.

The architecture therefore separates:

**AI reasoning**

from:

**deterministic validation and enforcement.**

Examples of deterministic responsibilities include:

- schema validation,
- required fields,
- enum validation,
- input validation,
- safety gating,
- authorization,
- data integrity,
- provenance tracking,
- API contracts.

---

## 3.5 Privacy-aware processing

Skincare profiles, product images, voice recordings, transcripts, and conversations can represent personal information.

The system should minimize unnecessary exposure to external services.

Where practical, sensitive processing should be capable of local or controlled processing.

---

## 3.6 Maintainability

Major subsystems should have clear boundaries.

Changing:

- the AI model,
- OCR engine,
- speech-to-text provider,
- text-to-speech provider,
- database implementation,
- frontend UI,

should not require rewriting the entire application.

---

## 3.7 Demo reliability

The architecture must remain practical for a Hacktoberfest challenge project.

The system should prioritize:

- understandable code,
- reliable core flows,
- simple setup,
- graceful failure,
- observable processing,
- reproducible demonstrations.

The architecture should not introduce infrastructure merely for theoretical scalability.

---

# 4. High-Level Architecture

Conceptually, SkinSense follows this structure:

```text
                    ┌─────────────────────────┐
                    │       SkinSense UI      │
                    │  Next.js / TypeScript   │
                    └────────────┬────────────┘
                                 │
                            HTTPS / API
                                 │
                    ┌────────────▼────────────┐
                    │       FastAPI API        │
                    │ Authentication / Routes  │
                    │ Validation / Orchestration│
                    └───────┬─────────┬────────┘
                            │         │
                 ┌──────────┘         └───────────────┐
                 │                                    │
        ┌────────▼─────────┐                ┌─────────▼─────────┐
        │  Application      │                │   Data Layer      │
        │  Services         │                │ Profile / Routine │
        │                   │                │ Product / Journal │
        └────────┬──────────┘                └───────────────────┘
                 │
        ┌────────▼─────────────────────────────────────┐
        │               AI Orchestration                │
        │ Context → Knowledge → Model → Validation      │
        └──────┬────────────┬──────────────┬───────────┘
               │            │              │
      ┌────────▼──────┐ ┌───▼─────────┐ ┌──▼───────────┐
      │ Open-Weight   │ │ Knowledge   │ │ Safety /     │
      │ AI Model      │ │ Layer       │ │ Validators   │
      └───────────────┘ └─────────────┘ └──────────────┘

Additional processing:

       Product Image
             │
             ▼
      Image Validation
             │
             ▼
            OCR
             │
             ▼
      Product Extraction
             │
             ▼
      Ingredient Analysis
             │
             ▼
      User Context Match
             │
             ▼
      Compatibility Result


       Voice Input
             │
             ▼
           STT
             │
             ▼
      Intent + Context
             │
             ▼
       Shared AI Pipeline
             │
             ▼
      Safety Validation
             │
             ▼
           TTS
```

The architecture is intentionally modular.

---

# 5. Major System Layers

SkinSense is divided into the following architectural layers.

```text
Presentation Layer
        ↓
API Layer
        ↓
Application / Domain Services
        ↓
AI Orchestration Layer
        ↓
Knowledge / Analysis Layer
        ↓
Persistence Layer
        ↓
External Providers
```

Each layer has a different responsibility.

---

# 6. Presentation Layer

## 6.1 Responsibility

The frontend is responsible for:

- rendering the user interface,
- collecting user input,
- presenting structured AI results,
- managing user interaction state,
- handling loading states,
- handling errors,
- showing safety states,
- controlling voice interaction,
- displaying product analysis,
- maintaining client-side navigation state.

The frontend must not independently implement core skincare reasoning.

---

## 6.2 Technology Direction

The planned frontend stack is:

- Next.js
- TypeScript
- Tailwind CSS

Exact frontend libraries may change, but the architectural boundaries should remain stable.

---

## 6.3 Frontend modules

Suggested logical structure:

```text
frontend/
├── app/
├── components/
├── features/
│   ├── onboarding/
│   ├── profile/
│   ├── routine/
│   ├── product-checker/
│   ├── ingredients/
│   ├── voice/
│   ├── progress/
│   └── settings/
├── services/
├── hooks/
├── types/
├── utils/
└── state/
```

These are logical boundaries, not mandatory final directory names.

---

# 7. Frontend Feature Architecture

Each major feature should communicate with backend services through well-defined API calls.

Example:

```text
Routine Page
    ↓
Routine API Client
    ↓
GET/POST Routine Endpoint
    ↓
FastAPI
    ↓
Routine Service
    ↓
Personalization Context
    ↓
AI Orchestrator
    ↓
Validated Routine Result
    ↓
Frontend
```

The frontend should never directly call the model provider for core product functionality.

This prevents:

- exposed model credentials,
- inconsistent safety behavior,
- duplicated prompts,
- bypassing validation,
- uncontrolled model responses.

---

# 8. API Layer

## 8.1 Responsibility

FastAPI acts as the primary application boundary between frontend and backend services.

It is responsible for:

- HTTP routing,
- authentication,
- authorization,
- request validation,
- response validation,
- error translation,
- service orchestration,
- rate limiting where applicable,
- file upload validation,
- API-level logging,
- request correlation.

---

## 8.2 API principle

API routes should remain **thin**.

A route should generally:

1. authenticate the user,
2. validate the request,
3. call the appropriate application service,
4. return a validated response.

Business logic should not be duplicated across route handlers.

---

# 9. Suggested API Domains

Logical endpoint groups include:

```text
/auth
/profile
/routine
/products
/ingredients
/analysis
/conversations
/voice
/progress
/settings
/health
```

Example conceptual API structure:

```text
POST   /auth/...
GET    /profile
PATCH  /profile

POST   /routine/generate
GET    /routine/current
PATCH  /routine

POST   /products/input
POST   /products/analyze
GET    /products/{id}

GET    /ingredients/{id}

POST   /analysis/compatibility

POST   /conversations
POST   /conversations/{id}/messages

POST   /voice/transcribe
POST   /voice/respond
POST   /voice/synthesize

POST   /progress
GET    /progress

DELETE /account/data

GET    /health
```

The exact endpoint names are implementation decisions and may evolve.

The underlying architectural responsibility must remain consistent.

---

# 10. Application Service Layer

The application/service layer translates API requests into business operations.

Suggested services:

```text
ProfileService
RoutineService
ProductService
ProductAnalysisService
IngredientService
CompatibilityService
ConversationService
VoiceService
ProgressService
SafetyService
PersonalizationService
```

A service should coordinate multiple lower-level components without exposing implementation details to API routes.

Example:

```text
RoutineService
 ├── load profile
 ├── load relevant products
 ├── build personalization context
 ├── retrieve domain knowledge
 ├── call AI orchestrator
 ├── validate output
 ├── apply safety policy
 ├── store routine generation record
 └── return result
```

---

# 11. Domain Logic vs AI Logic

A critical architectural distinction is required.

Not everything should be delegated to AI.

## Deterministic logic should handle:

- authentication,
- authorization,
- database operations,
- validation,
- file-size limits,
- supported file types,
- required fields,
- data normalization,
- state transitions,
- known safety rules,
- provenance,
- access control,
- output schemas.

## AI should handle:

- natural-language understanding,
- contextual explanation,
- personalized reasoning,
- routine explanation,
- ingredient explanations,
- interpretation of product context,
- natural-language question answering,
- conversational interaction.

The system should avoid using an LLM for tasks that can be reliably implemented with deterministic logic.

---

# 12. AI Orchestration Layer

The AI orchestration layer is the core intelligence boundary of SkinSense.

It should sit behind an internal service abstraction.

Conceptually:

```text
Application Service
        ↓
AI Orchestrator
        ↓
Task Router
        ↓
Context Builder
        ↓
Knowledge Retrieval
        ↓
Prompt Construction
        ↓
Open-Weight Model
        ↓
Structured Output Parser
        ↓
Semantic Validation
        ↓
Safety Validation
        ↓
Final AI Result
```

The AI orchestration layer should not be exposed directly to the frontend.

---

# 13. AI Task Router

Different requests should be assigned a task type.

Example:

```text
PROFILE_ANALYSIS
ROUTINE_GENERATION
INGREDIENT_EXPLANATION
PRODUCT_ANALYSIS
COMPATIBILITY_ANALYSIS
GENERAL_QA
PROGRESS_INTERPRETATION
VOICE_QA
```

The router determines:

- which prompt is used,
- what context is required,
- what output schema is expected,
- what safety rules apply,
- whether retrieval is required.

---

# 14. Model Adapter Architecture

SkinSense should not hardcode the application to a single model.

Use a model abstraction conceptually similar to:

```text
AIModelAdapter
├── generate()
├── generate_structured()
├── get_model_info()
└── health_check()
```

Possible implementations:

```text
LocalOpenModelAdapter
RemoteOpenModelAdapter
DevelopmentMockAdapter
```

The exact model and runtime can change during implementation.

Potential open-weight models may be evaluated based on:

- license,
- hardware requirements,
- reasoning quality,
- multilingual support,
- structured output reliability,
- inference latency,
- local deployment feasibility,
- memory requirements.

A model should not be selected merely because it is popular.

---

# 15. Context Builder

The context builder converts stored user information into a task-specific AI context.

For example:

```text
User Profile
    +
Skin Profile
    +
Current Routine
    +
Known Products
    +
Current Concerns
    +
Preferences
    +
Relevant Conversation
    +
Relevant Product Data
    +
Relevant Knowledge
    +
Safety Signals
```

However, the entire user history must not automatically be passed into every model call.

Context should be minimized based on the task.

---

# 16. Knowledge Layer

The AI must not rely exclusively on model memory for domain-critical information.

The knowledge layer provides grounded information about:

- skincare concepts,
- ingredient functions,
- product terminology,
- routine principles,
- safety considerations,
- source information,
- product metadata where available.

Conceptual flow:

```text
User Query
    ↓
Task Identification
    ↓
Relevant Knowledge Retrieval
    ↓
Evidence Selection
    ↓
Context Packaging
    ↓
AI Reasoning
```

Knowledge records should preserve provenance as defined in `13_DATA_MODEL.md`.

---

# 17. Retrieval Architecture

Retrieval may combine:

- structured database lookup,
- exact ingredient matching,
- product metadata lookup,
- semantic search,
- curated knowledge retrieval.

A query should prefer exact structured information where possible.

For example:

```text
"Does this product contain niacinamide?"

          ↓

Exact normalized ingredient lookup

          ↓

Known result
```

This should not require generative reasoning merely to determine whether an exact ingredient exists.

Generative AI can then explain the meaning of that ingredient.

---

# 18. Product Analysis Architecture

Product analysis is a separate processing pipeline.

```text
User Product Input
       ↓
Input Validation
       ↓
Image Validation
       ↓
OCR / Text Extraction
       ↓
Field Extraction
       ↓
Ingredient Normalization
       ↓
Product Resolution
       ↓
Knowledge Retrieval
       ↓
Product Understanding
       ↓
User Context Comparison
       ↓
Compatibility Assessment
       ↓
Safety Validation
       ↓
Structured Result
       ↓
Frontend
```

---

# 19. Product Input Sources

The system may receive product information through:

- image upload,
- manually entered product name,
- manually pasted ingredient list,
- text extracted from an image,
- future structured product information source.

Every extracted field should ideally retain provenance.

For example:

```text
Ingredient:
niacinamide

Source:
user_uploaded_image

Confidence:
high

Extraction method:
OCR
```

This is preferable to treating extracted data as unquestionable truth.

---

# 20. OCR Boundary

OCR should have a narrow responsibility:

> convert visible product text into machine-readable text.

OCR should not decide:

- whether the product is suitable,
- whether an ingredient is dangerous,
- whether the user should use the product,
- whether a product will work.

Those decisions belong to later processing stages.

---

# 21. OCR Confidence

When OCR quality is poor, the system should explicitly reflect uncertainty.

Conceptual states:

```text
HIGH_CONFIDENCE
MEDIUM_CONFIDENCE
LOW_CONFIDENCE
FAILED
```

Low-confidence extraction must not silently become authoritative product information.

The UI should be able to request confirmation or manual correction.

---

# 22. Ingredient Normalization

Different text representations may refer to the same ingredient.

The normalization layer can map:

```text
Raw OCR text
      ↓
Clean text
      ↓
Alias matching
      ↓
Canonical ingredient
```

Example:

```text
"vit b3"
"niacinamide"
```

may be mapped to an appropriate canonical representation when supported by the knowledge layer.

Normalization must not invent an equivalence when the evidence is insufficient.

---

# 23. Product Compatibility Architecture

Compatibility is a contextual assessment rather than a universal product rating.

Conceptually:

```text
Product
   +
Ingredient Profile
   +
User Skin Profile
   +
Current Routine
   +
Current Concerns
   +
Known Preferences
   +
Known Restrictions
   +
Available Evidence
   ↓
Compatibility Engine
   ↓
Safety Validation
   ↓
Assessment
```

Possible outcome categories include:

```text
REASONABLY_COMPATIBLE
CONSIDER_CAREFULLY
INSUFFICIENT_INFORMATION
SAFETY_ESCALATION
```

These states are defined further in `12_SAFETY.md`.

The system must never convert these categories into an unsupported guarantee such as:

> "This product is definitely safe for you."

---

# 24. Routine Generation Architecture

Routine generation follows:

```text
User Profile
      ↓
Current Product Inventory
      ↓
Preferences / Constraints
      ↓
Skin Context
      ↓
Relevant Knowledge
      ↓
Routine AI Task
      ↓
Structured Routine
      ↓
Schema Validation
      ↓
Safety Validation
      ↓
Complexity Check
      ↓
Persist Routine
      ↓
Present Routine
```

The architecture should prioritize a **simple, understandable routine**.

The system should not generate additional products merely to make the response appear sophisticated.

---

# 25. Existing Product Preservation

Before recommending a new product, the routine service should inspect known user products where available.

Conceptual logic:

```text
Existing suitable product?
        │
        ├── Yes → consider reuse
        │
        └── No → consider alternative
```

The architecture therefore avoids treating every interaction as a product-discovery request.

---

# 26. Personalization Architecture

Personalization should be implemented as a reusable context service.

```text
User Data
    ↓
PersonalizationService
    ↓
Task-Specific Context
    ↓
AI Task
```

The personalization service may construct different context for different requests.

Example:

### Ingredient question

Needs:

- ingredient of interest,
- relevant user profile information,
- relevant concerns,
- relevant routine context.

### Product compatibility question

Needs:

- product ingredients,
- current routine,
- skin profile,
- concerns,
- sensitivities,
- known preferences.

### General skincare question

May require much less context.

This minimizes irrelevant context and reduces accidental personalization errors.

---

# 27. Conversation Architecture

Conversation is treated as a product feature, not an independent AI system.

```text
Conversation Session
        ↓
User Message
        ↓
Intent Detection
        ↓
Relevant Context
        ↓
Task Router
        ↓
AI Pipeline
        ↓
Validated Response
        ↓
Conversation History
```

The conversation system must not bypass standard safety and validation layers.

---

# 28. Voice Architecture

Voice uses the same intelligence pipeline as text.

```text
Microphone
    ↓
Audio Validation
    ↓
Speech-to-Text
    ↓
Transcript
    ↓
Intent / Context
    ↓
Shared SkinSense AI Pipeline
    ↓
Safety Validation
    ↓
Response Text
    ↓
Text-to-Speech
    ↓
Audio Playback
```

The voice layer should not maintain its own skincare rules.

---

# 29. Speech-to-Text

The STT layer converts audio into text.

Candidate technology:

- Whisper
- faster-whisper

STT quality metadata should be retained where useful.

The system should accommodate:

- English,
- Hinglish/mixed speech,
- natural conversational phrasing,
- imperfect pronunciation,
- corrections.

Incorrect transcription must not automatically become a user fact.

---

# 30. Text-to-Speech

ElevenLabs is planned as the TTS layer.

The architecture should treat ElevenLabs as:

```text
Presentation / Voice Output Provider
```

not as the core reasoning engine.

The system should still function in text mode if TTS is unavailable.

---

# 31. Voice Privacy Boundary

Audio should be treated as potentially sensitive input.

The architecture should support:

- explicit recording state,
- cancellation,
- minimal retention,
- clear processing status,
- deletion according to supported retention policy,
- provider boundary awareness.

Detailed privacy rules belong to `15_SECURITY_PRIVACY.md`.

---

# 32. Authentication Boundary

Authentication should be handled at the API boundary.

Conceptual flow:

```text
Frontend
   ↓
Authentication
   ↓
Session / Token
   ↓
FastAPI
   ↓
Identity Resolution
   ↓
Authorization
   ↓
Application Service
```

Every user-specific resource access must be associated with an authenticated user identity.

Backend services must not trust user identifiers supplied purely by the client.

---

# 33. Authorization

Authorization determines whether the authenticated user can access or modify a resource.

Examples:

```text
User A
  ↓
Profile A → allowed

User A
  ↓
Profile B → denied
```

Authorization checks should be performed server-side.

---

# 34. Data Layer

The persistence layer stores structured application data.

The logical model is defined in `13_DATA_MODEL.md`.

The data layer should support:

- user profiles,
- skin profiles,
- routines,
- products,
- product analyses,
- ingredient knowledge,
- conversations,
- voice metadata,
- progress records,
- provenance,
- model and prompt versions.

The exact database technology remains an implementation decision unless explicitly finalized elsewhere.

---

# 35. Repository / Data Access Boundary

Application services should not directly depend on raw database implementation details where avoidable.

Conceptually:

```text
Service
   ↓
Repository / Data Access Layer
   ↓
Database
```

This helps isolate:

- query logic,
- transaction handling,
- persistence implementation,
- testing.

---

# 36. Transaction Boundaries

Operations that modify multiple related records should use an appropriate transactional boundary.

Example:

```text
Generate Routine
   ├── create generation record
   ├── save routine
   └── save routine items
```

If the operation fails partway through, the system should avoid leaving inconsistent state.

---

# 37. Data Provenance

Important information should retain its origin.

Examples:

```text
USER_REPORTED
OCR_EXTRACTED
DATABASE_MATCHED
KNOWLEDGE_SOURCE
AI_INTERPRETED
SYSTEM_DERIVED
```

These categories should not be treated as interchangeable.

Especially:

```text
AI_INTERPRETED
```

must not be represented as:

```text
USER_CONFIRMED_FACT
```

without explicit confirmation.

---

# 38. AI Request Lifecycle

A standard AI request should follow:

```text
1. Receive request
2. Authenticate user
3. Authorize access
4. Validate input
5. Identify task
6. Build relevant context
7. Retrieve knowledge
8. Construct prompt
9. Execute open model
10. Parse structured output
11. Validate schema
12. Validate semantics
13. Run safety checks
14. Apply response constraints
15. Store required metadata
16. Return response
```

The pipeline should fail closed for critical validation failures.

---

# 39. AI Response Validation

AI-generated responses should be validated at multiple levels.

## Level 1 — Syntax

Is the output valid?

Examples:

- valid JSON,
- valid object structure,
- correct data types.

---

## Level 2 — Schema

Does it contain required fields?

Example:

```text
routine
  ├── morning
  └── evening
```

---

## Level 3 — Semantic

Does the output make sense?

Examples:

- routine contains valid step types,
- ingredient claims match retrieved knowledge,
- required explanation fields are present.

---

## Level 4 — Safety

Does the response violate any safety rule?

Examples:

- diagnosis,
- unsupported guarantee,
- unsafe treatment instruction,
- dangerous recommendation,
- false reassurance.

Only outputs passing the required checks should reach the user.

---

# 40. Safety Architecture

Safety is a cross-cutting architectural concern.

```text
                 ┌────────────────────┐
                 │    Safety Policy   │
                 └─────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Input Safety     AI Output Safety    Action Safety
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                    Final Response
```

Safety must not exist only inside an LLM prompt.

At minimum, the architecture should include:

- deterministic policy checks,
- model-level instructions,
- escalation logic,
- output validation,
- uncertainty handling.

Detailed policy is defined in `12_SAFETY.md`.

---

# 41. Safety Escalation Path

When serious or concerning user-reported symptoms are detected:

```text
User Input
    ↓
Safety Detection
    ↓
Safety Escalation
    ↓
Stop Normal Recommendation
    ↓
Appropriate Professional / Emergency Guidance
```

The system must not continue generating ordinary product recommendations as though no escalation occurred.

---

# 42. Error Handling Architecture

Errors should be categorized rather than shown as raw exceptions.

Suggested categories:

```text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
NOT_FOUND
OCR_ERROR
AI_MODEL_ERROR
AI_VALIDATION_ERROR
KNOWLEDGE_ERROR
PROVIDER_ERROR
STORAGE_ERROR
RATE_LIMIT_ERROR
SAFETY_ESCALATION
UNKNOWN_ERROR
```

---

# 43. Error Response Strategy

Backend errors should expose safe, understandable messages.

Example:

```json
{
  "error": {
    "code": "AI_MODEL_ERROR",
    "message": "SkinSense could not complete the analysis right now.",
    "retryable": true
  }
}
```

Internal implementation details should not be exposed to users.

The frontend should translate errors into user-friendly UI states.

---

# 44. Graceful AI Failure

The application should not collapse if the AI model fails.

Possible fallback behavior:

```text
AI unavailable
    ↓
Show previously saved routine
    OR
Provide ingredient/product data already available
    OR
Ask user to retry
    OR
Provide non-generative basic guidance
```

The system must never fabricate a successful result to hide an AI failure.

---

# 45. External Integrations

External services should be accessed through adapters.

Examples:

```text
Open-Weight Model Runtime
        ↓
AI Model Adapter

OCR Engine
        ↓
OCR Adapter

Speech-to-Text
        ↓
STT Adapter

ElevenLabs
        ↓
TTS Adapter
```

This prevents vendor-specific implementations from leaking throughout the application.

---

# 46. Adapter Principle

An external integration should ideally be replaceable without changing the feature-level service.

Bad architecture:

```text
RoutineService
   ↓
specific_model_library_calls
```

Preferred architecture:

```text
RoutineService
   ↓
AIOrchestrator
   ↓
ModelAdapter
   ↓
Selected Runtime
```

This is particularly important for the Hacktoberfest open-AI requirement.

---

# 47. Configuration Architecture

Environment-specific configuration should be externalized.

Examples include:

```text
MODEL_PROVIDER
MODEL_NAME
MODEL_ENDPOINT
DATABASE_URL
AUTH_SECRET
ELEVENLABS_API_KEY
STT_CONFIGURATION
OCR_CONFIGURATION
LOG_LEVEL
ENVIRONMENT
```

Secrets must never be committed to source control.

Development defaults should not silently become production credentials.

---

# 48. Environment Separation

Conceptually support:

```text
Development
Testing
Production
```

Example:

```text
Development
├── mock providers
├── local model
├── local database
└── verbose logs

Testing
├── deterministic fixtures
├── mocked external services
└── safety regression tests

Production / Demo
├── configured providers
├── controlled credentials
├── validated model
└── appropriate logging
```

The exact infrastructure is documented separately.

---

# 49. Caching Architecture

Caching can reduce repeated processing.

Potential cacheable information:

- normalized ingredient information,
- known product metadata,
- repeated knowledge retrieval,
- safe reusable product analysis,
- generated audio where appropriate.

However, personalized analysis should be cached carefully.

A response based on:

```text
User A's skin profile
```

must not accidentally be reused for:

```text
User B
```

---

# 50. Idempotency

Operations that can be retried should avoid accidental duplicate creation.

Examples:

- product upload,
- product analysis,
- voice generation,
- routine generation,
- journal event creation.

Where appropriate, requests can use idempotency identifiers.

---

# 51. Request Correlation

Each important request should have a correlation identifier.

Conceptually:

```text
Request ID
   ↓
Frontend Request
   ↓
FastAPI
   ↓
Application Service
   ↓
AI Orchestrator
   ↓
Model Provider
```

This makes debugging possible across multiple layers.

---

# 52. Observability

The system should produce enough telemetry to understand:

- request success/failure,
- latency,
- model latency,
- OCR failures,
- validation failures,
- safety escalations,
- provider failures,
- API errors.

However, logs must not indiscriminately contain:

- full user conversations,
- raw sensitive voice data,
- unnecessary personal profile information,
- full uploaded images,
- authentication secrets.

Observability must be privacy-aware.

---

# 53. AI Observability

For AI requests, useful metadata includes:

```text
request_id
task_type
model_name
model_version
prompt_version
knowledge_version
latency
input_token_count where available
output_token_count where available
validation_status
safety_status
```

The system should avoid storing hidden chain-of-thought.

Only user-facing explanations and required structured reasoning fields should be retained.

---

# 54. Frontend State Architecture

Frontend state can be divided into:

## Server state

Examples:

- profile,
- routine,
- product analysis,
- ingredient data,
- journal history.

## UI state

Examples:

- modal open,
- selected tab,
- loading indicator,
- current recording state.

## Temporary interaction state

Examples:

- draft questionnaire answer,
- uploaded image preview,
- unsent message.

These categories should not be mixed unnecessarily.

---

# 55. Product Analysis State Machine

Product processing benefits from explicit states.

```text
IDLE
 ↓
UPLOADING
 ↓
VALIDATING
 ↓
EXTRACTING
 ↓
NORMALIZING
 ↓
ANALYZING
 ↓
VALIDATING_RESULT
 ↓
COMPLETED
```

Failure may move to:

```text
FAILED
```

or:

```text
NEEDS_USER_CONFIRMATION
```

This allows the UI to display accurate progress instead of a generic spinner.

---

# 56. Voice State Machine

Suggested voice states:

```text
IDLE
 ↓
RECORDING
 ↓
PROCESSING_AUDIO
 ↓
TRANSCRIBING
 ↓
UNDERSTANDING
 ↓
GENERATING
 ↓
SYNTHESIZING
 ↓
PLAYING
```

Possible interruption states:

```text
CANCELLED
FAILED
RETRYABLE_ERROR
```

The UI should always reflect the current state.

---

# 57. Routine State Model

A routine may move through:

```text
DRAFT
ACTIVE
PAUSED
ARCHIVED
```

A generated routine should not automatically destroy the previous active routine.

Instead, generation history should be preserved.

This supports:

- comparison,
- rollback,
- traceability,
- progress interpretation.

---

# 58. Product Analysis Persistence

A product analysis should retain enough metadata to understand how it was produced.

Conceptually:

```text
ProductAnalysis
├── input reference
├── extracted product data
├── normalized ingredients
├── user context reference
├── model version
├── prompt version
├── knowledge version
├── validation result
├── safety result
├── final assessment
└── timestamp
```

This follows the provenance model defined in `13_DATA_MODEL.md`.

---

# 59. Security Boundary

Security concerns should be enforced around every external boundary.

```text
Browser
   ↓
HTTPS
   ↓
API authentication
   ↓
Authorization
   ↓
Validated application service
   ↓
Controlled data access
```

For AI:

```text
User input
   ↓
Input sanitization / trust labeling
   ↓
Prompt construction
   ↓
Model
```

Detailed security requirements are defined in `15_SECURITY_PRIVACY.md`.

---

# 60. Prompt Injection Defense

Inputs may contain arbitrary text.

Potential attack sources include:

- user messages,
- copied product descriptions,
- OCR results,
- external product text,
- retrieved documents.

These must be treated as **data**, not as trusted system instructions.

Conceptual separation:

```text
SYSTEM RULES
    >
APPLICATION RULES
    >
RETRIEVED KNOWLEDGE
    >
USER DATA
    >
EXTERNAL PRODUCT TEXT
```

User/product content must never be allowed to override system safety rules.

---

# 61. File Processing Boundary

Uploaded images should pass through controlled processing.

```text
Browser
   ↓
Upload Validation
   ↓
File Type Validation
   ↓
File Size Validation
   ↓
Safe Processing
   ↓
OCR / Analysis
```

The backend should not assume that a client-provided file extension is trustworthy.

---

# 62. Shared Context Across Features

SkinSense should maintain a coherent user context across features.

Example:

```text
User completes Skin Profile
        ↓
Routine uses profile
        ↓
Product Checker uses profile + routine
        ↓
Ingredient questions use relevant profile
        ↓
Voice questions use same context
```

The system should avoid creating isolated mini-profiles for every feature.

There should be one canonical user context model with task-specific projections.

---

# 63. Cross-Feature Example

Suppose the user has:

```text
Reported:
- dry-feeling skin
- sensitivity concern

Current routine:
- cleanser
- moisturizer
- sunscreen

New product:
- serum
```

The Product Checker can use:

```text
Skin Profile
+
Concern Context
+
Current Routine
+
Product Ingredients
```

Then the system may produce a contextual assessment.

The result must still clearly separate:

- known product facts,
- user-reported information,
- system interpretation,
- uncertainty.

---

# 64. Progress Architecture

The optional progress system should record observations rather than manufacture medical conclusions.

Example:

```text
Date
   ↓
User observation
   ↓
Journal entry
   ↓
Product usage event
   ↓
Timeline
   ↓
AI interpretation
```

AI may identify patterns in recorded observations, but the architecture must not automatically interpret correlation as causation.

---

# 65. Data Deletion Architecture

User data deletion should propagate through relevant data stores.

Conceptually:

```text
Delete Account / Data
        ↓
Identify User-owned Data
        ↓
Delete / Anonymize according to policy
        ↓
Invalidate Sessions
        ↓
Remove associated references
        ↓
Confirm completion
```

External providers must be considered where copies may exist.

The exact retention and deletion rules belong to `15_SECURITY_PRIVACY.md`.

---

# 66. Health Check Architecture

The backend should expose a lightweight health mechanism.

Example:

```text
GET /health
```

Possible status categories:

```text
API_OK
DATABASE_DEGRADED
AI_UNAVAILABLE
STT_UNAVAILABLE
TTS_UNAVAILABLE
OCR_UNAVAILABLE
```

The system should distinguish:

- application availability,
- dependency availability.

An unavailable optional provider should not automatically mean the entire application is unusable.

---

# 67. Dependency Isolation

Core features should degrade independently where possible.

Example:

### ElevenLabs unavailable

Text interaction should continue.

### Voice unavailable

Text skincare functionality should continue.

### OCR unavailable

Manual product ingredient entry should remain possible.

### AI unavailable

Saved information and non-generative functionality should remain accessible.

This creates a more resilient system.

---

# 68. Core vs Optional Components

## Core

```text
Frontend
FastAPI Backend
User Context
Product/Routine Services
Open AI Model
Validation
Safety Layer
Persistence
```

## Important supporting components

```text
Knowledge Layer
OCR
STT
```

## Enhancement components

```text
ElevenLabs TTS
Progress Analytics
Seasonal Adaptation
Advanced caching
```

A failure in an enhancement should not destroy the MVP.

---

# 69. Architectural Dependency Direction

Dependencies should generally move inward.

Preferred:

```text
UI
 ↓
API
 ↓
Application Services
 ↓
Domain / AI / Data abstractions
 ↓
Infrastructure adapters
```

Avoid:

```text
Database logic → UI
Model-specific code → UI
External provider → business rules
```

This keeps architecture maintainable.

---

# 70. Suggested Backend Structure

A conceptual FastAPI structure:

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── profile.py
│   │   ├── routine.py
│   │   ├── products.py
│   │   ├── ingredients.py
│   │   ├── analysis.py
│   │   ├── conversations.py
│   │   ├── voice.py
│   │   ├── progress.py
│   │   └── health.py
│   │
│   ├── services/
│   ├── domain/
│   ├── schemas/
│   ├── repositories/
│   ├── ai/
│   ├── knowledge/
│   ├── safety/
│   ├── integrations/
│   ├── storage/
│   ├── config/
│   └── utils/
│
└── tests/
```

The exact directory organization may evolve.

The architectural responsibilities should not.

---

# 71. Suggested AI Structure

A conceptual AI subsystem:

```text
ai/
├── orchestrator/
├── router/
├── context/
├── models/
│   ├── base.py
│   ├── local.py
│   └── mock.py
├── prompts/
├── schemas/
├── validators/
├── retrieval/
├── safety/
├── evaluators/
└── telemetry/
```

Responsibilities should remain separated.

---

# 72. Suggested Integration Structure

External providers should be isolated:

```text
integrations/
├── llm/
├── ocr/
├── stt/
├── tts/
└── storage/
```

Each provider should expose an internal application-friendly interface.

---

# 73. End-to-End Example: Build My Routine

```text
User opens Build My Routine
          ↓
Frontend collects questionnaire
          ↓
POST /routine/generate
          ↓
FastAPI authentication
          ↓
Request validation
          ↓
RoutineService
          ↓
Load UserProfile
          ↓
Load SkinProfile
          ↓
Load existing products
          ↓
PersonalizationService
          ↓
Retrieve relevant skincare knowledge
          ↓
AI Orchestrator
          ↓
Open-weight model
          ↓
Structured routine result
          ↓
Schema validation
          ↓
Safety validation
          ↓
Complexity / consistency validation
          ↓
Persist generation + routine
          ↓
Return response
          ↓
Frontend renders AM/PM routine
```

---

# 74. End-to-End Example: Check This Product

```text
User uploads product image
          ↓
Frontend upload
          ↓
POST /products/input
          ↓
Backend validates file
          ↓
Image processing
          ↓
OCR
          ↓
Extract product fields
          ↓
Ingredient normalization
          ↓
Product knowledge retrieval
          ↓
Load user skin context
          ↓
Load current routine
          ↓
ProductAnalysisService
          ↓
AI product interpretation
          ↓
Compatibility assessment
          ↓
Semantic validation
          ↓
Safety validation
          ↓
Persist analysis
          ↓
Frontend displays:
  - product information
  - ingredients
  - ingredient explanations
  - routine overlap
  - compatibility assessment
  - uncertainty / limitations
```

---

# 75. End-to-End Example: Voice Question

User says:

> "Ye serum mere routine ke saath theek rahega?"

Architecture:

```text
Microphone
    ↓
Audio Capture
    ↓
STT
    ↓
Transcript
    ↓
Language / intent handling
    ↓
Identify active product
    ↓
Load user context
    ↓
Compatibility / Q&A task
    ↓
Knowledge retrieval
    ↓
Open-weight model
    ↓
Structured result
    ↓
Safety validation
    ↓
Response text
    ↓
ElevenLabs TTS
    ↓
Playback
```

The same safety and reasoning pipeline used for text must be reused.

---

# 76. Concurrency Considerations

Long-running tasks should not unnecessarily block normal API requests.

Potentially longer operations include:

- OCR,
- large model inference,
- speech transcription,
- text-to-speech generation.

The implementation may use asynchronous processing or background execution where justified.

However, complexity should be introduced only when actual workload requires it.

For an MVP, a simple synchronous architecture can be preferable when latency remains acceptable.

---

# 77. Performance Priorities

Optimization priorities should be:

```text
1. Correctness
2. Safety
3. Reliability
4. Reasonable latency
5. Resource efficiency
```

Do not sacrifice correctness for a small latency improvement in safety-sensitive processing.

---

# 78. Model Latency Strategy

The system should avoid loading multiple large models unnecessarily.

Possible strategies include:

- lazy model loading,
- persistent model process,
- task-specific model routing,
- caching,
- batched processing where appropriate.

Exact optimization depends on the selected model and available hardware.

---

# 79. Local Inference Strategy

Local inference is a major architectural option because it can support:

- privacy,
- predictable provider dependence,
- model control,
- experimentation,
- open innovation.

Conceptually:

```text
SkinSense Backend
      ↓
Model Adapter
      ↓
Local Inference Runtime
      ↓
Open-Weight Model
```

The application should not assume local inference exists everywhere.

A remote deployment of an open model can remain an architectural option.

---

# 80. Model Swappability

Changing models should primarily affect:

```text
Model Configuration
+
Model Adapter
+
Prompt Compatibility
+
Evaluation
```

It should not require major changes to:

- frontend screens,
- user profile schema,
- product data schema,
- API contracts.

This is one of the important architectural benefits of the abstraction.

---

# 81. Versioning

The system should track versions for AI-critical components.

At minimum:

```text
model_version
prompt_version
knowledge_version
analysis_version
```

This enables comparison of outputs across changes.

Example:

```text
Analysis A
model = X
prompt = 1.4
knowledge = 2.1
```

---

# 82. Reproducibility

When possible, an analysis should be reproducible from:

- stored input,
- relevant user context,
- model identifier,
- prompt version,
- knowledge version,
- configuration.

Perfect deterministic reproduction may not always be possible for generative models.

The architecture should therefore aim for **traceability**, not falsely promise deterministic identical outputs.

---

# 83. Testing Architecture

Testing should occur at multiple layers.

```text
Frontend tests
       ↓
API tests
       ↓
Service tests
       ↓
AI schema tests
       ↓
Safety tests
       ↓
Integration tests
       ↓
End-to-end tests
```

Critical safety and validation behavior should have deterministic regression tests.

Detailed testing strategy is defined in `16_TESTING.md`.

---

# 84. Mock Architecture

External and AI dependencies should be mockable.

Examples:

```text
MockModel
MockOCR
MockSTT
MockTTS
MockKnowledgeRepository
```

This enables:

- local development,
- deterministic tests,
- fast CI,
- provider failure testing,
- UI development without model access.

---

# 85. Architecture for Hackathon Development

The architecture must remain understandable to contributors.

A contributor should be able to answer:

> "Where do I add a new feature?"

Typical path:

```text
New feature
 ↓
Product requirement
 ↓
User flow
 ↓
Frontend feature
 ↓
API endpoint
 ↓
Application service
 ↓
AI task if needed
 ↓
Validation
 ↓
Persistence
 ↓
Tests
```

Feature development should not require modifying unrelated subsystems.

---

# 86. Change Management

When architectural changes are made:

1. identify the affected source-of-truth document,
2. update the architectural decision,
3. update dependent documentation,
4. update interfaces/contracts,
5. update tests,
6. verify that safety behavior is unchanged or intentionally improved.

Do not silently introduce architectural changes through implementation code.

---

# 87. Architectural Decision Principles

When multiple technologies can satisfy a requirement, prefer the option that provides:

1. simpler implementation,
2. clear open-source compatibility,
3. local development support,
4. maintainable interfaces,
5. reliable testing,
6. lower unnecessary infrastructure complexity,
7. better privacy control.

Technology choice should serve the product problem rather than become the product itself.

---

# 88. What Must Never Happen Architecturally

The implementation must never create a path where:

```text
Frontend → LLM directly
```

for production core reasoning.

It must never create:

```text
OCR → automatic medical conclusion
```

It must never create:

```text
AI output → frontend without validation
```

It must never create:

```text
AI interpretation → stored as user-confirmed fact
```

It must never create:

```text
voice response → TTS before safety validation
```

It must never create:

```text
external product text → trusted system instruction
```

It must never create:

```text
product ingredient presence → guaranteed suitability
```

---

# 89. Minimum Viable Architecture

The MVP should be capable of operating with:

```text
Next.js Frontend
       ↓
FastAPI Backend
       ↓
Application Services
       ↓
Open-Weight AI Model
       ↓
Validation + Safety
       ↓
Persistent Data
```

With additional processing:

```text
Product Image → OCR → Product Analysis
Voice → STT → Shared AI → TTS
```

This is the minimum architecture required to demonstrate the central SkinSense concept.

---

# 90. Architectural Quality Bar

A feature is architecturally complete when:

- frontend does not contain business reasoning,
- API contracts are explicit,
- authentication is enforced,
- user context is loaded server-side,
- AI calls go through the orchestrator,
- AI output is schema-validated,
- safety checks run before presentation,
- external integrations are isolated,
- important data has provenance,
- errors are handled intentionally,
- sensitive data is not unnecessarily logged,
- the feature has test coverage appropriate to its risk,
- model replacement does not require major product rewrites.

---

# 91. Final Architecture Summary

SkinSense should be understood as a **layered, modular, safety-aware AI application**, not simply as a web interface connected to an LLM.

The central architecture is:

```text
                    SKINSENSE
                        │
                        ▼
                Next.js Frontend
                        │
                        ▼
                  FastAPI API
                        │
                        ▼
              Application Services
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
   Personalization   Product       Conversation
          │          Analysis           │
          │             │               │
          └─────────────┼───────────────┘
                        ▼
                 AI Orchestrator
                        │
              ┌─────────┼─────────┐
              │         │         │
              ▼         ▼         ▼
          Context    Knowledge   Open Model
              │         │         │
              └─────────┼─────────┘
                        ▼
                Structured Output
                        │
                        ▼
                 Semantic Validation
                        │
                        ▼
                  Safety Validation
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       Persistence             Presentation
                                  │
                         ┌────────┴────────┐
                         │                 │
                         ▼                 ▼
                       Text              Voice
                                           │
                                      STT / TTS
```

The defining architectural principle is:

> **AI provides the intelligence, application services provide the product logic, deterministic validation provides control, and the safety layer determines what is allowed to reach the user.**

The system should remain modular enough to change models, providers, and infrastructure without changing the product's fundamental behavior.

The system should remain simple enough that contributors can understand it, test it, and extend it.

Most importantly, the architecture must preserve the original product purpose defined in `02_USER_PROBLEM.md`: helping a real user make better skincare decisions with more understanding and less blind trial-and-error.