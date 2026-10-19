# 17 — Development Guide

## 1. Purpose

This document defines how **SkinSense** should be developed, maintained, reviewed, tested, and extended.

It converts the product and architecture documents into a practical engineering workflow.

This document covers:

- Repository organization
- Development environments
- Local setup
- Frontend development
- Backend development
- AI development
- Product analysis development
- Voice development
- Database changes
- Configuration
- API contracts
- Coding conventions
- Git workflow
- OpenCode development workflow
- Feature implementation process
- Debugging
- Documentation synchronization
- Code review
- Pull requests
- Contributor workflow
- Development quality gates

This document does not replace:

- `03_PRODUCT_REQUIREMENTS.md` for requirements
- `04_USER_FLOWS.md` for user journeys
- `05_UI_UX.md` for visual/interaction design
- `07_AI_ARCHITECTURE.md` for AI architecture
- `12_SAFETY.md` for skincare safety rules
- `15_SECURITY_PRIVACY.md` for security/privacy
- `16_TESTING.md` for detailed testing

---

# 2. Development Philosophy

SkinSense should be developed as a **real product**, not as a collection of disconnected AI demos.

Every implementation decision should answer:

> Does this improve the user's ability to understand their skincare context and make a better-informed decision?

Technical sophistication is useful only when it supports that goal.

---

# 3. Source-of-Truth Hierarchy

When two pieces of documentation appear to conflict, use this priority order:

```text id="7d2qg3"
1. User-validated facts
2. 02_USER_PROBLEM.md
3. 03_PRODUCT_REQUIREMENTS.md
4. 12_SAFETY.md
5. 06_SKINCARE_DOMAIN.md
6. 07_AI_ARCHITECTURE.md
7. 14_SYSTEM_ARCHITECTURE.md
8. Other implementation documentation
9. Existing code
10. Developer assumptions
```

Existing code must not automatically be treated as correct.

If code conflicts with the intended product or safety rules, the code should be changed.

---

# 4. Repository Structure

The repository should follow a clear separation between product code and project documentation.

Conceptual structure:

```text id="4n8f2h"
skinsense/
│
├── AGENTS.md
│
├── docs/
│   ├── 01_PROJECT.md
│   ├── 02_USER_PROBLEM.md
│   ├── 03_PRODUCT_REQUIREMENTS.md
│   ├── 04_USER_FLOWS.md
│   ├── 05_UI_UX.md
│   ├── 06_SKINCARE_DOMAIN.md
│   ├── 07_AI_ARCHITECTURE.md
│   ├── 08_AI_PROMPTS.md
│   ├── 09_PRODUCT_ANALYSIS.md
│   ├── 10_PERSONALIZATION.md
│   ├── 11_VOICE_SYSTEM.md
│   ├── 12_SAFETY.md
│   ├── 13_DATA_MODEL.md
│   ├── 14_SYSTEM_ARCHITECTURE.md
│   ├── 15_SECURITY_PRIVACY.md
│   ├── 16_TESTING.md
│   ├── 17_DEVELOPMENT.md
│   ├── 18_DEPLOYMENT_DEMO.md
│   └── 19_HACKTOBERFEST.md
│
├── frontend/
├── backend/
├── ai/
├── tests/
├── scripts/
├── .env.example
├── README.md
└── project configuration files
```

The exact final structure may evolve.

The important principle is separation of concerns.

---

# 5. Root AGENTS.md

`AGENTS.md` is the high-level engineering constitution for coding agents and contributors.

It should contain:

- project identity,
- non-negotiable rules,
- documentation precedence,
- important safety boundaries,
- architecture boundaries,
- coding expectations,
- testing expectations,
- prohibited shortcuts.

It should not contain the entire application specification.

Detailed information remains in `docs/`.

---

# 6. Area-Specific AGENTS.md

Where useful, add localized instructions.

Suggested:

```text id="q6s5r8"
frontend/AGENTS.md
backend/AGENTS.md
ai/AGENTS.md
```

Each should explain only what is specific to that area.

Example:

### frontend/AGENTS.md

Can define:

- component conventions,
- accessibility requirements,
- API client patterns,
- state-management expectations,
- UI testing rules.

### backend/AGENTS.md

Can define:

- service boundaries,
- repository conventions,
- schema handling,
- error handling,
- authentication requirements.

### ai/AGENTS.md

Can define:

- model adapter rules,
- prompt versioning,
- output schemas,
- evaluation requirements,
- safety validation.

---

# 7. Documentation Before Implementation

A feature should not be implemented purely from an informal idea.

Before coding a meaningful feature:

```text id="n8d3ec"
Problem
 ↓
Requirement
 ↓
User Flow
 ↓
Architecture
 ↓
Implementation
 ↓
Testing
```

The relevant documentation should be reviewed first.

This is especially important for:

- AI features,
- safety-sensitive features,
- data-model changes,
- new integrations.

---

# 8. Feature Development Workflow

The standard feature workflow is:

```text id="oox2he"
1. Understand the problem
2. Identify the requirement
3. Review relevant documentation
4. Define acceptance criteria
5. Design implementation
6. Define API/data changes
7. Implement smallest correct version
8. Add tests
9. Run static validation
10. Run integration tests
11. Review security/safety implications
12. Update documentation
13. Perform manual verification
14. Merge
```

Do not begin by writing large amounts of code without defining the feature boundary.

---

# 9. Start Small

Implementation should proceed vertically.

Instead of building:

```text id="rj8hba"
all frontend
→ all backend
→ all AI
→ all voice
```

prefer:

```text id="7hzqv2"
One complete feature
Frontend
+
Backend
+
AI
+
Validation
+
Storage
+
Tests
```

Then expand.

This makes problems easier to isolate.

---

# 10. Recommended MVP Development Order

The initial implementation order should prioritize the central user journey.

Suggested sequence:

```text id="fz4y9y"
1. Project foundation
2. Authentication/session foundation
3. User profile
4. Skin profile
5. Dashboard
6. Build My Routine
7. Ingredient Explainer
8. Product Checker
9. Compatibility analysis
10. Text Q&A
11. Voice interaction
12. Progress Journal
13. Seasonal adaptation
14. Hardening and demo polish
```

P1 features should not delay the working P0 path.

---

# 11. Development Milestones

A practical development progression:

## Milestone 1 — Foundation

- repository setup,
- frontend shell,
- backend shell,
- environment configuration,
- database connection,
- basic API health check.

## Milestone 2 — Core User Context

- authentication,
- user profile,
- skin profile,
- onboarding.

## Milestone 3 — Core AI

- AI adapter,
- model integration,
- context builder,
- prompt system,
- structured validation.

## Milestone 4 — Product Experience

- routine generation,
- ingredient explorer,
- product checker,
- compatibility.

## Milestone 5 — Voice

- STT,
- shared AI pipeline,
- TTS.

## Milestone 6 — Hardening

- safety regression,
- security testing,
- failure handling,
- demo environment,
- documentation.

---

# 12. Frontend Development

The frontend should be developed as feature-oriented UI.

Suggested conceptual structure:

```text id="3h2s7z"
frontend/
├── app/
├── components/
├── features/
│   ├── onboarding/
│   ├── profile/
│   ├── dashboard/
│   ├── routine/
│   ├── products/
│   ├── ingredients/
│   ├── conversations/
│   ├── voice/
│   ├── progress/
│   └── settings/
│
├── services/
├── hooks/
├── state/
├── types/
├── utils/
└── tests/
```

Avoid a huge shared component folder containing feature-specific business logic.

---

# 13. Frontend Component Principles

Components should ideally:

- have one clear responsibility,
- be reusable where reuse is real,
- remain accessible,
- avoid embedding API/business logic unnecessarily,
- support clear loading and error states.

Avoid creating abstractions before there is a demonstrated need for reuse.

---

# 14. Page vs Feature Responsibility

A page should compose features.

For example:

```text id="ypafuv"
Dashboard Page
├── ProfileSummary
├── RoutineSummary
├── RecentProductAnalysis
└── QuickActions
```

The page should not directly contain:

- AI prompt construction,
- database queries,
- authorization logic,
- product compatibility rules.

---

# 15. Frontend API Layer

Frontend API communication should be centralized.

Conceptually:

```text id="3a4it0"
UI Component
   ↓
Feature Hook / Action
   ↓
API Client
   ↓
FastAPI
```

Avoid making raw network calls from many independent components with duplicated logic.

---

# 16. Frontend Type Safety

Types should mirror API contracts.

Where practical, define shared or generated schemas so the frontend does not guess backend fields.

Example:

```text id="8j2z51"
API response:
compatibility_status

Frontend:
CompatibilityStatus
```

Do not duplicate incompatible definitions.

---

# 17. Loading States

Every network-dependent feature should define an explicit loading state.

Examples:

```text id="rwf0ic"
Loading profile
Generating routine
Analyzing product
Explaining ingredient
Transcribing voice
Synthesizing response
```

Loading UI must communicate what is actually happening where possible.

Avoid indefinite generic spinners.

---

# 18. Error States

Each feature should define:

- user-facing error message,
- retry path,
- fallback behavior,
- preserved user input where possible.

Example:

```text id="3t3kya"
Product analysis failed.

[Try Again]

Your uploaded image is still available.
```

Do not force unnecessary re-entry of information.

---

# 19. Backend Development

FastAPI should be organized around clear responsibility boundaries.

Conceptual structure:

```text id="dkd8b4"
backend/
└── app/
    ├── api/
    ├── services/
    ├── domain/
    ├── schemas/
    ├── repositories/
    ├── ai/
    ├── knowledge/
    ├── safety/
    ├── integrations/
    ├── storage/
    ├── config/
    └── utils/
```

The exact organization may change if a different structure provides equal or better separation.

---

# 20. API Route Principles

API routes should remain thin.

A route should generally:

```text id="g6ztq9"
Authenticate
 ↓
Validate request
 ↓
Authorize access
 ↓
Call service
 ↓
Return validated response
```

Avoid putting large business workflows directly inside route handlers.

---

# 21. Service Layer

Services should express business operations.

Example:

```text id="w7p6nu"
ProductAnalysisService.analyze_product()
```

can coordinate:

- product input,
- OCR,
- normalization,
- knowledge,
- AI,
- safety,
- persistence.

The API route should not coordinate all of these independently.

---

# 22. Repository Layer

Repositories handle persistence concerns.

Example:

```text id="1mtd2w"
UserRepository
RoutineRepository
ProductRepository
AnalysisRepository
ConversationRepository
```

Repositories should be responsible for data access rather than product reasoning.

---

# 23. Schema Layer

Use explicit schemas for:

- incoming API requests,
- outgoing API responses,
- internal AI results,
- persistence boundaries where appropriate.

Schemas should make invalid states difficult to represent.

---

# 24. Domain Objects

Where useful, represent important domain concepts explicitly.

Examples:

```text id="3d2u91"
SkinProfile
Routine
RoutineItem
Product
Ingredient
ProductAnalysis
CompatibilityAssessment
JournalEntry
```

Avoid treating everything as an unrestricted dictionary.

---

# 25. Input Validation

Validate inputs at the API boundary and again at critical internal boundaries.

Examples:

```text id="wk6nbb"
Profile input
Product image
OCR result
Ingredient list
Voice transcript
AI result
```

Different boundaries require different validation.

---

# 26. Error Handling Convention

Use predictable internal error categories.

Example:

```text id="apqs78"
ValidationError
AuthorizationError
NotFoundError
ProviderError
AIValidationError
SafetyEscalationError
StorageError
```

Convert them to controlled API responses.

Do not expose raw internal exceptions.

---

# 27. Database Development

Database changes should be managed through migrations or an equivalent controlled mechanism.

Never modify a production database manually without documenting the change.

---

# 28. Database Migration Workflow

Preferred sequence:

```text id="0jrvnp"
Change data model
 ↓
Create migration
 ↓
Run locally
 ↓
Run tests
 ↓
Verify existing data compatibility
 ↓
Apply in staging/demo
 ↓
Apply in production
```

Every schema change should have a rollback or recovery strategy where practical.

---

# 29. Backward Compatibility

Before changing an existing schema:

Ask:

- Will old records still load?
- Will existing API clients break?
- Will frontend and backend deploy at different times?
- Does the migration require data backfill?

Avoid breaking changes unless necessary.

---

# 30. Data Model Discipline

Use `13_DATA_MODEL.md` as the source of truth for logical entities.

Do not casually introduce duplicate representations.

For example, avoid creating:

```text id="b4g0x2"
user_skin_profile
user_skin_info
user_skin_data
```

for the same concept unless there is a clearly different responsibility.

---

# 31. AI Development

AI is treated as an application subsystem rather than a direct utility call.

The preferred flow is:

```text id="7m0v5q"
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
Prompt
 ↓
Open-Weight Model
 ↓
Structured Output
 ↓
Validation
 ↓
Safety
```

---

# 32. AI Model Adapter

Do not scatter model-specific SDK calls across the backend.

Instead:

```text id="56tu2d"
AIModelAdapter
```

should abstract model execution.

Possible implementations:

```text id="u5b70u"
LocalOpenModelAdapter
RemoteOpenModelAdapter
MockModelAdapter
```

This preserves model swappability.

---

# 33. Model Selection Workflow

Before changing the model:

1. verify license,
2. verify hardware requirements,
3. benchmark basic inference,
4. test structured output,
5. test multilingual/Hinglish behavior where required,
6. run safety regression,
7. run golden cases,
8. compare latency,
9. record the selected version.

Do not choose a model solely from general benchmark rankings.

---

# 34. Prompt Development

Prompts should be treated like source code.

Each important prompt should have:

- task purpose,
- expected inputs,
- output schema,
- safety requirements,
- grounding requirements,
- version identifier.

Changes to critical prompts require regression evaluation.

---

# 35. Prompt Storage

Logical prompt organization may look like:

```text id="1qj2t9"
ai/
└── prompts/
    ├── profile/
    ├── routine/
    ├── ingredient/
    ├── product/
    ├── compatibility/
    ├── qa/
    ├── progress/
    └── voice/
```

These files should remain aligned with `08_AI_PROMPTS.md`.

That document defines the intended prompt architecture.

---

# 36. Prompt Context Construction

Do not construct prompts by concatenating arbitrary user or database text.

Preferred:

```text id="9t7r6h"
Structured user context
+
Structured product context
+
Structured knowledge
+
Task instruction
```

This makes:

- privacy review,
- prompt injection defense,
- testing,
- debugging,

much easier.

---

# 37. AI Output Schemas

Every structured task should have an explicit schema.

Example conceptual result:

```json id="ftrgl3"
{
  "summary": "string",
  "assessment": "enum",
  "key_points": ["string"],
  "limitations": ["string"],
  "safety_state": "enum"
}
```

The exact schema depends on the task.

Invalid model output should not directly reach the frontend.

---

# 38. AI Retry Strategy

When structured output fails:

```text id="c3q7x6"
Model response
 ↓
Parse
 ↓
Validation fails
 ↓
Repair / retry when safe
 ↓
Validate again
 ↓
Success or controlled failure
```

Retries should have bounded limits.

Never retry indefinitely.

---

# 39. AI Failure Policy

If the model cannot produce a valid answer after allowed retries:

```text id="xk7v4h"
Return controlled failure
```

Do not:

```text id="e6s1p3"
invent a fallback AI result
```

unless that fallback is explicitly implemented and safe.

---

# 40. AI Output Logging

Log metadata, not unnecessary private model context.

Useful:

```text id="e8r7nq"
request_id
task_type
model_version
prompt_version
validation_status
safety_status
latency
```

Avoid logging:

- full prompt,
- full private conversation,
- full profile,
- raw voice data.

---

# 41. Knowledge Development

Knowledge should be structured and traceable.

When adding a new ingredient or domain entry:

```text id="f6m2n4"
Identify source
 ↓
Verify content
 ↓
Store structured knowledge
 ↓
Record provenance
 ↓
Test affected AI cases
```

Do not add unsupported claims merely because they are common online.

---

# 42. Knowledge Source Review

Preferred evidence hierarchy:

```text id="t52wbh"
Government / regulatory
        ↓
Professional dermatology organizations
        ↓
Peer-reviewed research
        ↓
Established medical references
        ↓
Manufacturer information
        ↓
General content
        ↓
Social media / informal posts
```

This hierarchy is defined in `06_SKINCARE_DOMAIN.md`.

---

# 43. Product Analysis Development

Product analysis should be built as independent stages.

Recommended pipeline:

```text id="xv1e8c"
Input
 ↓
Image Validation
 ↓
OCR
 ↓
Extraction
 ↓
Normalization
 ↓
Product Resolution
 ↓
Knowledge
 ↓
AI Analysis
 ↓
Compatibility
 ↓
Safety
 ↓
Persistence
```

Each stage should be independently testable.

---

# 44. OCR Development

OCR integration should return structured results.

Example conceptual object:

```json id="lk1t2h"
{
  "text": "...",
  "confidence": 0.92,
  "fields": {},
  "status": "success"
}
```

The application layer should not depend on OCR-specific raw response formats.

---

# 45. OCR Provider Adapter

Use a narrow interface.

Conceptually:

```text id="y6rvf8"
OCRAdapter
├── extract_text()
├── extract_fields()
└── health_check()
```

The exact API depends on the chosen OCR implementation.

---

# 46. Ingredient Normalization Development

Normalization should be deterministic where possible.

Pipeline:

```text id="k7d3nz"
OCR text
 ↓
cleaning
 ↓
alias matching
 ↓
canonical ingredient
```

Use AI only where interpretation is genuinely required.

Do not use an LLM for an exact string lookup that can be handled deterministically.

---

# 47. Product Resolution

Product matching may be uncertain.

Possible states:

```text id="1k93cz"
EXACT_MATCH
LIKELY_MATCH
MULTIPLE_MATCHES
NO_MATCH
USER_CONFIRMATION_REQUIRED
```

Do not silently select a product when multiple candidates are plausible.

---

# 48. Compatibility Development

Compatibility should use structured evidence.

Conceptual input:

```text id="bcw6x4"
product_ingredients
+
current_routine
+
skin_context
+
concerns
+
known_preferences
+
knowledge
```

Output:

```text id="91fky6"
assessment
+
reasons
+
uncertainty
+
safety_state
```

---

# 49. Personalization Development

Personalization logic should distinguish:

```text id="2cy2jj"
Explicit user fact
System-derived value
Temporary observation
AI interpretation
Unknown information
```

Do not silently convert one category into another.

---

# 50. Voice Development

Voice should reuse the text pipeline.

Preferred:

```text id="6m2j9z"
STT
 ↓
Text request
 ↓
Existing task router
 ↓
Existing AI pipeline
 ↓
Existing safety validation
 ↓
Response text
 ↓
TTS
```

Avoid implementing a separate "voice AI" system with different logic.

---

# 51. Voice Provider Isolation

STT and TTS should be accessed through adapter interfaces.

Conceptually:

```text id="d7w8g1"
STTAdapter
TTSAdapter
```

This allows provider replacement.

---

# 52. ElevenLabs Development Rule

ElevenLabs should only receive the final approved response text.

The pipeline must be:

```text id="mr2c5x"
AI
 ↓
Schema validation
 ↓
Semantic validation
 ↓
Safety validation
 ↓
TTS
```

Never:

```text id="00wq6p"
AI
 ↓
TTS
 ↓
Safety
```

---

# 53. Frontend + Backend Contract Development

When an API changes:

```text id="ah7zlm"
Update backend schema
 ↓
Update endpoint behavior
 ↓
Update API client/types
 ↓
Update UI
 ↓
Update tests
 ↓
Update documentation
```

Do not modify only the frontend and assume the API contract remains valid.

---

# 54. API Versioning

For an MVP, avoid unnecessary versioning complexity.

However, if a breaking API change is unavoidable, make it explicit.

Potential strategies include:

```text id="y1h3n7"
versioned route
or
versioned schema
```

Choose the simplest strategy that protects compatibility.

---

# 55. Configuration Management

Configuration should be centralized.

Code should distinguish:

```text id="0nqmxu"
application configuration
```

from:

```text id="4t5a0b"
secret configuration
```

Avoid scattering environment variable reads throughout the codebase.

---

# 56. Configuration Validation

At startup, validate required configuration.

Example:

```text id="snm3j1"
Required model configuration missing
→ clear startup error

Required database configuration missing
→ clear startup error

Optional TTS configuration missing
→ application starts with voice output disabled
```

Optional integrations should not unnecessarily prevent the whole system from running.

---

# 57. Environment Files

Provide:

```text id="u7d3as"
.env.example
```

with:

- required variable names,
- placeholder values,
- comments explaining purpose.

Do not store real credentials.

---

# 58. Local Development

A contributor should be able to understand:

```text id="2v1vbl"
How to install dependencies
How to configure environment
How to start frontend
How to start backend
How to configure AI
How to run tests
```

These instructions should be reflected in `README.md` and remain synchronized with the actual repository.

---

# 59. Recommended Local Startup

Conceptually:

```text id="m8g4la"
Terminal 1
→ frontend

Terminal 2
→ backend

Terminal 3
→ AI/model runtime if separate
```

Optional providers such as:

- OCR,
- STT,
- TTS,

should be started/configured only when required.

---

# 60. Development Profiles

Useful development modes include:

```text id="y23v1q"
FULL
MOCK_AI
MOCK_EXTERNAL
MINIMAL
```

For example:

### Mock AI mode

Allows frontend/backend development without loading a large model.

### Full mode

Runs the actual intended AI path.

The exact implementation can vary.

---

# 61. Mock Data

Provide controlled fixtures for:

- sample user,
- sample skin profile,
- sample routine,
- sample product,
- sample ingredient,
- sample analysis.

These should be deterministic and safe for public development.

---

# 62. Seed Scripts

If seed scripts are used:

```text id="1apx2w"
scripts/
├── seed_dev
├── seed_demo
└── reset_demo
```

The script names are illustrative.

A developer should know exactly whether a script:

- creates data,
- modifies data,
- deletes data.

Destructive operations should require explicit intent.

---

# 63. Script Safety

Scripts that can delete or overwrite data should not run automatically during ordinary startup.

Avoid:

```text id="r4u1bm"
application startup
→ reset database
```

unless operating in an explicitly isolated test environment.

---

# 64. Git Workflow

Use Git for all meaningful development.

Keep commits focused.

Preferred:

```text id="3f79wj"
feat: add routine generation API
feat: add product OCR pipeline
fix: reject cross-user analysis access
test: add compatibility regression cases
docs: update AI architecture
```

Avoid giant mixed commits such as:

```text id="d8j5gr"
final changes
```

---

# 65. Commit Principles

A good commit should:

- represent one logical change,
- be understandable,
- be reviewable,
- leave the project in a valid state where practical.

Do not mix:

```text id="7py5jd"
database migration
+
unrelated UI redesign
+
prompt rewrite
```

unless there is a genuine dependency.

---

# 66. Branching

Use a simple branching model appropriate to the project size.

Conceptually:

```text id="8fjjcx"
main
 │
 ├── feature/...
 ├── fix/...
 └── docs/...
```

Avoid complicated branching strategies that provide little value for a small challenge project.

---

# 67. Pull Request Scope

A pull request should explain:

- what changed,
- why it changed,
- what requirement it addresses,
- tests performed,
- security/safety implications,
- documentation changes.

For AI changes, also include:

- model version,
- prompt version,
- evaluation impact.

---

# 68. Code Review Priorities

Review in this order:

```text id="xgixqm"
1. Correctness
2. Safety
3. Security
4. Data integrity
5. Architecture
6. Test coverage
7. Maintainability
8. Performance
9. Style
```

Do not spend review time on formatting while overlooking a cross-user authorization bug.

---

# 69. AI Code Review

AI-related pull requests should specifically check:

```text id="n49r2w"
[ ] Correct model adapter usage
[ ] Context is minimized
[ ] Prompt injection boundaries preserved
[ ] Output schema exists
[ ] Output validation exists
[ ] Safety validation runs
[ ] No sensitive data logged
[ ] Model/provider changes documented
[ ] Regression tests updated
```

---

# 70. Safety Code Review

Any feature that can produce skincare guidance should be checked against `12_SAFETY.md`.

Review questions:

```text id="4vnj1b"
Can this feature diagnose?
Can it guarantee safety?
Can it invent product information?
Can it encourage unsafe combinations?
Can it override an escalation state?
Can personalization override safety?
```

A "yes" indicates the implementation requires redesign or additional controls.

---

# 71. Security Code Review

Security-sensitive changes should be checked for:

```text id="3t1c6c"
Authentication
Authorization
Data ownership
Input validation
File handling
Secrets
Logging
External calls
Prompt injection
XSS
Injection vulnerabilities
```

---

# 72. Avoid Overengineering

SkinSense is a focused product challenge.

Do not introduce:

- microservices without need,
- complex event buses without a real use case,
- unnecessary message queues,
- multiple databases merely for fashion,
- advanced orchestration frameworks without clear benefit,
- elaborate infrastructure before the MVP works.

Prefer a clean modular monolith when it satisfies the requirements.

---

# 73. Modular Monolith Preference

A practical MVP may look like:

```text id="7w0d7e"
Next.js
    +
FastAPI
    +
AI subsystem
    +
Database
```

Internally these components can still have strong boundaries.

This provides many benefits of service separation without excessive operational complexity.

---

# 74. When to Split a Service

A component may be separated when:

- it has independent scaling needs,
- it has a strong runtime dependency,
- it requires a different environment,
- it is operationally isolated,
- the separation solves a real problem.

Do not split services merely because the folder structure looks cleaner.

---

# 75. Development of New AI Tasks

Adding a new AI capability should follow:

```text id="7km8zs"
Define user problem
 ↓
Define task
 ↓
Define required context
 ↓
Define knowledge needs
 ↓
Define output schema
 ↓
Define safety boundaries
 ↓
Create prompt
 ↓
Implement task handler
 ↓
Add validation
 ↓
Add tests
 ↓
Add evaluation cases
 ↓
Integrate into API/UI
```

---

# 76. New AI Task Checklist

Before merging a new task:

```text id="2x8s2r"
[ ] Task is required by product scope
[ ] Context is defined
[ ] Input schema exists
[ ] Output schema exists
[ ] Prompt is versioned
[ ] Knowledge requirements are defined
[ ] Safety requirements are defined
[ ] Validation exists
[ ] Failure path exists
[ ] Regression examples exist
```

---

# 77. New Product-Analysis Capability

For new product analysis logic:

```text id="4vx0nf"
Input
 ↓
Extraction
 ↓
Normalization
 ↓
Knowledge
 ↓
Reasoning
 ↓
Validation
 ↓
Safety
```

Do not implement a feature that jumps directly from OCR output to recommendation.

---

# 78. New Voice Capability

For a new voice capability:

```text id="0x0r5h"
Voice input
 ↓
STT
 ↓
Existing intent/task routing
 ↓
Existing AI logic
 ↓
Existing safety validation
 ↓
TTS
```

Do not duplicate business logic for voice.

---

# 79. UI Development Rule

The UI should communicate uncertainty honestly.

Use states such as:

```text id="i3u0iq"
Known
Likely
Needs confirmation
Insufficient information
Safety escalation
```

Avoid UI elements that visually imply stronger certainty than the underlying result.

---

# 80. Avoid Medicalized UI

Do not accidentally make SkinSense look like:

- a diagnostic console,
- hospital software,
- a clinical report generator,
- an automated medical instrument.

Avoid:

```text id="qld8zq"
Diagnosis:
85% confidence

Disease:
detected
```

The architecture does not support such claims.

---

# 81. Avoid Ecommerce Bias

The UI should not reward adding more products.

Avoid business logic such as:

```text id="f3egz0"
Every concern
→ new product
```

The product is about decision support, not product upselling.

---

# 82. Existing Product First

Before generating a new product suggestion, the system should inspect whether an existing suitable product already satisfies the need.

This principle should appear in:

- routine logic,
- product comparison,
- personalization,
- AI prompts,
- tests.

---

# 83. Simple Routine Principle

The implementation should favor:

```text id="c1ww6b"
minimum effective complexity
```

rather than maximum recommendation count.

The system should explain why each added step exists.

---

# 84. Debugging Workflow

When a feature fails, debug from the boundary inward.

Recommended:

```text id="8z43fp"
1. Reproduce
2. Capture request/response metadata
3. Determine failing layer
4. Check validation
5. Check service logic
6. Check provider
7. Check persistence
8. Fix root cause
9. Add regression test
```

Do not patch symptoms blindly.

---

# 85. AI Debugging Workflow

For AI failures:

```text id="aj5c3h"
1. Identify task
2. Inspect structured input context
3. Check knowledge retrieval
4. Check prompt version
5. Check model/version
6. Inspect validation failure
7. Determine hallucination/grounding/safety issue
8. Fix the correct layer
9. Add regression case
```

Do not immediately rewrite the entire prompt.

---

# 86. AI Debugging: Layer Ownership

If the model received incorrect information:

```text id="l6f2bc"
Context Builder issue
```

If the model received correct information but ignored required output fields:

```text id="r0p1de"
Prompt/schema issue
```

If the model returned valid structure but unsafe content:

```text id="p5n4cg"
Safety validation issue
```

If the UI displays safe output as unsafe:

```text id="45n6wh"
Presentation issue
```

Fix the responsible layer.

---

# 87. OCR Debugging Workflow

For product analysis failures:

```text id="2t2e6h"
Check uploaded image
 ↓
Check OCR result
 ↓
Check OCR confidence
 ↓
Check field extraction
 ↓
Check normalization
 ↓
Check product resolution
 ↓
Check AI context
 ↓
Check compatibility
```

Do not assume every product-analysis problem is an AI problem.

---

# 88. Voice Debugging Workflow

For voice failures:

```text id="0jh3o7"
Audio capture
 ↓
Audio validation
 ↓
STT
 ↓
Transcript
 ↓
Intent
 ↓
AI
 ↓
Safety
 ↓
TTS
 ↓
Playback
```

Identify which stage failed before changing code.

---

# 89. Logs During Debugging

Debug logs may be more detailed in development, but must still avoid unnecessary sensitive data.

Use identifiers and metadata.

For example:

```text id="5j4ce7"
request_id=abc123
task=product_analysis
stage=ocr
status=failed
```

Avoid:

```text id="r7e5co"
full uploaded image
full transcript
full private profile
```

---

# 90. Observability During Development

Useful development signals include:

- API request duration,
- AI latency,
- OCR latency,
- STT latency,
- TTS latency,
- validation failures,
- exception type,
- provider status,
- request IDs.

These make debugging faster without storing unnecessary sensitive content.

---

# 91. Local AI Development

When developing with a local open-weight model:

```text id="l4s97o"
Start model runtime
 ↓
Run health check
 ↓
Verify adapter
 ↓
Run simple structured generation
 ↓
Run task-specific evaluations
 ↓
Integrate with application
```

Do not start application development by assuming the model integration works.

Verify the model boundary first.

---

# 92. Model Benchmarking

Before adopting a model, test actual SkinSense workloads:

```text id="x3a9vk"
Profile reasoning
Routine generation
Ingredient explanation
Product interpretation
Compatibility
Hinglish Q&A
Structured JSON generation
Safety behavior
```

A general-purpose benchmark is not a substitute for application-specific evaluation.

---

# 93. Prompt Iteration Process

For prompt improvement:

```text id="70z1mp"
Current prompt
 ↓
Observed failure
 ↓
Identify failure category
 ↓
Minimal change
 ↓
Run regression suite
 ↓
Compare result
 ↓
Accept or revert
```

Avoid changing prompts repeatedly without recording what each change was intended to solve.

---

# 94. Prompt Change Log

Critical prompts should have clear version history.

Example:

```text id="q5v8i6"
v1.0 — initial task
v1.1 — improved uncertainty handling
v1.2 — added product-context boundary
v1.3 — improved concise explanations
```

The exact versioning format may vary.

---

# 95. Schema Evolution

When AI output schemas change:

```text id="e0f3rv"
Update schema
 ↓
Update prompt
 ↓
Update parser
 ↓
Update validator
 ↓
Update application service
 ↓
Update frontend
 ↓
Update fixtures
 ↓
Run regression
```

Do not update only the prompt.

---

# 96. Feature Flags

Feature flags may be used for:

- experimental AI model,
- seasonal adaptation,
- progress feature,
- voice mode,
- beta UI.

Feature flags should not be used to hide broken safety logic.

Safety rules remain active regardless of experimental feature state.

---

# 97. Experimental Features

Mark unfinished features explicitly.

Example:

```text id="4y8wli"
P1
Experimental
Demo-only
Not production-ready
```

Do not let an experimental AI capability silently become part of the primary recommendation pipeline.

---

# 98. Backward Compatibility for Model Changes

When the model changes:

- API contracts should remain stable,
- database structure should remain stable where possible,
- task interfaces should remain stable,
- evaluation suite should remain reusable.

The model adapter is the preferred change boundary.

---

# 99. Provider Replacement

A provider replacement should ideally require changes in:

```text id="b7i8qy"
Provider adapter
Configuration
Integration tests
```

rather than:

```text id="3cw7rj"
entire application
```

This is especially important for:

- OCR,
- STT,
- TTS,
- model runtime.

---

# 100. Dependency Update Workflow

When updating a dependency:

```text id="q4u2j7"
Identify reason
 ↓
Review changelog/security impact
 ↓
Update
 ↓
Run tests
 ↓
Run build
 ↓
Run relevant integration tests
 ↓
Review behavior
```

Do not combine many unrelated major dependency updates into one large unexplained change.

---

# 101. Documentation Sync Rule

Whenever behavior changes, review whether these documents need updates:

```text id="9u3j7g"
Requirements
User flow
Architecture
AI prompts
Safety
Security
Data model
Testing
Deployment
Hackathon submission
```

The code and context documents must remain aligned.

---

# 102. Documentation Change Example

If product analysis changes from:

```text id="7f5h4x"
manual ingredient list
```

to:

```text id="1cn6k2"
OCR-based ingredient extraction
```

review at minimum:

```text id="w9t3er"
03_PRODUCT_REQUIREMENTS.md
04_USER_FLOWS.md
09_PRODUCT_ANALYSIS.md
14_SYSTEM_ARCHITECTURE.md
16_TESTING.md
18_DEPLOYMENT_DEMO.md
```

---

# 103. OpenCode Development Workflow

SkinSense is being developed with **OpenCode**, so coding-agent use must still follow the same architecture and safety rules as human development.

OpenCode should not be treated as an authority on product requirements.

It is an implementation assistant.

---

# 104. OpenCode Context Strategy

Do not provide every document to every request.

Use the smallest relevant documentation set.

Examples:

### UI task

Load:

```text id="j6m3mf"
01_PROJECT
03_PRODUCT_REQUIREMENTS
04_USER_FLOWS
05_UI_UX
```

### AI task

Load:

```text id="7ss4ev"
03_PRODUCT_REQUIREMENTS
06_SKINCARE_DOMAIN
07_AI_ARCHITECTURE
08_AI_PROMPTS
12_SAFETY
```

### Database task

Load:

```text id="3b6b73"
03_PRODUCT_REQUIREMENTS
13_DATA_MODEL
14_SYSTEM_ARCHITECTURE
15_SECURITY_PRIVACY
16_TESTING
```

### Deployment task

Load:

```text id="ok11dk"
14_SYSTEM_ARCHITECTURE
15_SECURITY_PRIVACY
18_DEPLOYMENT_DEMO
```

This reduces unnecessary context and hallucination risk.

---

# 105. OpenCode Task Instruction Pattern

A coding-agent task should include:

```text id="m2g8o8"
Goal
Relevant files
Constraints
Source-of-truth documents
Acceptance criteria
Tests required
What must not be changed
```

Example:

```text
Implement product-analysis result rendering.

Read:
05_UI_UX.md
09_PRODUCT_ANALYSIS.md
12_SAFETY.md

Do not modify:
backend contracts
AI prompts
database schema

Acceptance:
- displays ingredient list
- displays uncertainty
- displays safety state
- handles analysis failure
- tests pass
```

This is preferable to:

> "Build product checker."

---

# 106. OpenCode Implementation Sequence

For complex features, ask the coding agent to work in stages:

```text id="zqg3hs"
1. Inspect repository
2. Identify affected files
3. Propose implementation
4. Implement
5. Run tests
6. Fix failures
7. Summarize changed files
```

Avoid asking the agent to rewrite the entire project when only one subsystem needs modification.

---

# 107. Do Not Allow Silent Scope Expansion

The coding agent must not independently add:

- unrelated features,
- new product categories,
- new user personas,
- medical diagnosis,
- ecommerce functionality,
- unnecessary integrations,
- major infrastructure.

When implementation encounters an unspecified choice, it should preserve the existing architecture and choose the smallest compatible solution.

---

# 108. Agent Hallucination Prevention

A coding agent must not invent:

- API endpoints that do not exist,
- environment variables without documenting them,
- database fields without updating the model,
- providers that are not approved,
- product facts,
- skincare facts,
- unsupported safety rules.

When information is genuinely missing, use an explicit implementation assumption rather than silently presenting it as confirmed fact.

---

# 109. Generated Code Review

AI-generated code must receive the same review as human-written code.

Check:

```text id="ju5s6o"
Correctness
Security
Safety
Architecture
Tests
Dependency impact
Maintainability
```

Never merge generated code merely because:

- it compiles,
- the UI looks correct,
- the agent claims the task is complete.

---

# 110. Agent Output Requirements

After a coding task, the agent should report:

```text id="1n9j08"
Changed files
Added functionality
Tests run
Test results
Known limitations
Any assumptions
```

Do not accept vague statements such as:

> "Everything is fixed."

---

# 111. AI Coding Agent Safety

The coding agent must not:

- remove safety validation to make tests pass,
- bypass authorization for convenience,
- hardcode secrets,
- disable security checks,
- remove failing tests without justification,
- weaken validation to accommodate model output,
- fabricate product/medical data.

The correct response to a failing safety test is to fix the implementation, not weaken the test.

---

# 112. Development Quality Gates

Before merging a feature:

```text id="db4jpd"
[ ] Code compiles / type checks
[ ] Lint passes
[ ] Unit tests pass
[ ] Relevant integration tests pass
[ ] AI tests pass where applicable
[ ] Safety tests pass
[ ] Security tests pass where applicable
[ ] No secret exposure
[ ] Documentation updated
```

---

# 113. Definition of Ready

A feature is ready for implementation when:

```text id="zv6fjs"
[ ] Problem is clear
[ ] Requirement is defined
[ ] User flow is understood
[ ] Acceptance criteria exist
[ ] Architecture impact is known
[ ] Data impact is known
[ ] Security impact is known
[ ] Safety impact is known
[ ] Testing approach is understood
```

---

# 114. Definition of Done

A feature is done when:

```text id="b8b0m7"
[ ] Requirement implemented
[ ] UI implemented
[ ] API implemented if needed
[ ] Persistence implemented if needed
[ ] AI integration implemented if needed
[ ] Validation implemented
[ ] Safety controls implemented
[ ] Security controls verified
[ ] Tests added
[ ] Errors handled
[ ] Documentation updated
[ ] Manual verification completed
```

---

# 115. Code Style

Code style should be:

- consistent,
- readable,
- explicit,
- unsurprising.

Prefer straightforward code over clever code.

A contributor should be able to understand a function without reverse-engineering a framework abstraction.

---

# 116. Naming Conventions

Names should describe behavior.

Prefer:

```text id="8dfq90"
build_personalization_context()
analyze_product()
validate_ai_output()
get_user_routine()
```

over:

```text id="nng6ke"
process()
handle()
run()
doThing()
```

unless the context makes the meaning completely obvious.

---

# 117. Function Size

Functions should generally perform one logical operation.

If a function:

- authenticates,
- queries six tables,
- builds a prompt,
- calls the model,
- validates output,
- stores results,

it is probably doing too much.

Break it into service-level operations.

---

# 118. Comments

Comments should explain:

- why something is necessary,
- non-obvious constraints,
- safety/security rationale,
- complex implementation details.

Avoid comments that merely repeat the code.

Poor:

```text
# increment count
count += 1
```

Better:

```text
# Preserve the previous analysis until the new result passes validation.
```

---

# 119. Error Messages in Code

Internal error messages should be:

- descriptive,
- safe,
- actionable for developers,
- free of secrets.

User-facing messages should be separately crafted where necessary.

---

# 120. Logging Convention

Logs should include useful metadata.

Example:

```text id="l2jz7a"
request_id
feature
stage
status
latency
error_code
```

Avoid arbitrary `print()` statements scattered throughout production code.

Use the project's logging mechanism consistently.

---

# 121. Type Safety

Where the language and framework support strong typing, use it.

Avoid unnecessarily broad types such as:

```text id="4c9g7c"
Any
dict
object
```

when a meaningful type can be defined.

This is especially important for AI structured outputs.

---

# 122. Explicit Enums

Controlled states should use explicit enums or equivalent constraints.

Examples:

```text id="zo0vcm"
SafetyState
AnalysisStatus
RoutineStatus
OCRStatus
VoiceState
CompatibilityState
```

This reduces invalid states.

---

# 123. Null and Unknown Handling

Do not confuse:

```text id="4z9q7p"
null
```

with:

```text id="6kv5z0"
unknown
```

or:

```text id="37jvuy"
not applicable
```

The semantic distinction should be clear where it matters.

---

# 124. User Data vs AI Data in Code

Use explicit naming.

Prefer:

```text id="m1c8cx"
user_reported_skin_type
```

over:

```text id="cgqdcv"
skin_type
```

when the distinction matters.

Similarly:

```text id="k1l4yq"
ai_interpretation
```

should not be named like a canonical user fact.

---

# 125. API Security During Development

Never weaken production security merely to simplify frontend development.

Instead use:

- local development configuration,
- test users,
- mocks,
- development-only credentials,
- controlled dev CORS.

Do not introduce permanent security bypasses.

---

# 126. Feature-Specific Security Review

For each feature, ask:

### Profile

Can another user access it?

### Routine

Can another user modify it?

### Product

Can another user see the upload?

### Conversation

Can another user retrieve messages?

### Voice

Can another user access audio/transcripts?

### AI

Can model context accidentally contain another user's data?

These questions should become tests.

---

# 127. Data Consistency Rules

Avoid silent overwrites.

When modifying user-owned information:

- understand whether history should remain,
- preserve provenance,
- update timestamps,
- maintain references.

The database should represent the actual application state.

---

# 128. Background Processing

Background jobs may eventually be useful for:

- long OCR processing,
- large model inference,
- audio processing,
- cleanup,
- scheduled maintenance.

However, background jobs should not be introduced merely because they are common architectural patterns.

For the MVP, use the simplest reliable mechanism.

---

# 129. Event-Driven Architecture

An event-driven system may be considered later for:

- analysis completion,
- journal updates,
- notifications.

It is not required for the MVP unless a concrete use case demands it.

Do not introduce event infrastructure without measurable benefit.

---

# 130. API Idempotency

When endpoint retries could create duplicate records, define an idempotency strategy.

The implementation should document:

- idempotency key,
- storage duration,
- duplicate detection behavior.

---

# 131. Cleanup Jobs

If temporary records or files exist, cleanup must have an explicit implementation path.

Possible categories:

```text id="v8dyfi"
Temporary uploads
Expired processing records
Generated transient audio
Stale sessions
```

Cleanup should be safe and observable.

---

# 132. Dependency Health Checks

External integrations should expose health information where practical.

Examples:

```text id="xw6b8g"
AI model available
OCR available
STT available
TTS available
Database available
```

The application should distinguish required dependencies from optional ones.

---

# 133. Development Health Endpoint

A health endpoint can help identify:

```text id="h8d3ms"
API running
Database connected
Model reachable
Optional services status
```

The endpoint should not expose sensitive configuration values.

---

# 134. Test-Driven Fixes

When a bug is found:

```text id="4uy7at"
Bug
 ↓
Regression test
 ↓
Fix
 ↓
Re-run suite
```

This converts discovered failures into permanent protection.

---

# 135. Bug Classification

Classify bugs as:

```text id="9n1qv4"
UI
API
Data
AI
OCR
Voice
Safety
Security
Infrastructure
Documentation
```

This makes recurring problem areas visible.

---

# 136. AI Failure Classification

Useful AI-specific labels:

```text id="g6c7k5"
Wrong task
Missing context
Bad retrieval
Hallucination
Overconfidence
Schema failure
Safety failure
Prompt injection
Language failure
Poor personalization
```

The classification helps determine whether to fix:

- context,
- prompt,
- knowledge,
- model,
- validator,
- UI.

---

# 137. Avoid Fixing Model Problems with UI Tricks

Do not hide a model failure by:

- removing output fields,
- softening labels,
- hiding uncertainty,
- replacing results with marketing copy.

The correct layer should be improved.

---

# 138. Avoid Fixing Safety with Prompts Alone

Prompts are important but are not enough.

Critical safety behavior should also be enforced through:

- deterministic validation,
- state checks,
- output filters,
- escalation logic.

---

# 139. Avoid Fixing Privacy with UI Copy Alone

A message saying:

> "Your data is private."

does not create privacy.

Privacy must be enforced by:

- data minimization,
- authorization,
- provider boundaries,
- storage policies,
- logging controls,
- deletion mechanisms.

---

# 140. Development Environment Reproducibility

The repository should define:

- supported runtime versions,
- required dependencies,
- environment variables,
- setup commands,
- test commands.

Use lockfiles and pinned versions where appropriate.

---

# 141. Version Control of Model Artifacts

Large model weights should not automatically be committed to Git.

Use an appropriate model/artifact strategy.

The repository should document:

- expected model name/version,
- where to obtain it,
- how to verify it,
- where it is stored locally.

---

# 142. Version Control of Prompt Artifacts

Prompts are part of the software behavior.

They should be version-controlled.

Do not store critical prompts only inside:

- personal notes,
- external chats,
- local editor history.

---

# 143. Version Control of Evaluation Artifacts

Important AI evaluation cases should also be version-controlled where they do not contain private data.

Examples:

```text id="j9zz5j"
golden cases
safety regression cases
schema fixtures
product analysis fixtures
```

---

# 144. Local Development Data Policy

Local development should use:

```text id="7v5y1y"
synthetic users
synthetic conversations
safe sample products
safe fixture images
```

Do not depend on a real friend's private account to run the application.

---

# 145. Public Repository Readiness

Before making the repository public, inspect for:

```text id="j1s9l5"
Secrets
Private data
Unlicensed assets
Private images
Private conversations
Debug credentials
Local paths
Temporary files
Provider tokens
```

Public code should be safe to inspect.

---

# 146. Open-Source Contributor Readiness

A contributor should be able to:

```text id="y3wq4v"
Clone repository
 ↓
Read README
 ↓
Read AGENTS.md
 ↓
Understand architecture
 ↓
Set environment
 ↓
Start application
 ↓
Run tests
 ↓
Choose a small issue
 ↓
Implement
 ↓
Run tests
 ↓
Submit contribution
```

The project should minimize hidden setup requirements.

---

# 147. Issue Creation

Issues should describe:

```text id="h4t8pz"
Problem
Expected behavior
Current behavior
Relevant feature
Acceptance criteria
```

For AI issues, also mention:

```text
model
prompt
task
example input/output
```

where appropriate.

---

# 148. Good First Issues

Potential contributor-friendly work includes:

- UI accessibility improvement,
- error-state refinement,
- component tests,
- documentation correction,
- fixture creation,
- validation improvements,
- non-sensitive UI enhancements.

Safety and authentication changes should receive more experienced review.

---

# 149. Contribution Risk Levels

### Low-risk contribution

Examples:

- documentation,
- styling,
- isolated UI component,
- non-critical test fixture.

### Medium-risk contribution

Examples:

- API endpoint,
- database query,
- personalization logic.

### High-risk contribution

Examples:

- authentication,
- safety,
- AI prompts,
- AI model adapter,
- privacy logic,
- user-data deletion.

High-risk changes require stronger review and regression testing.

---

# 150. Development Anti-Patterns

Avoid:

### Giant route handlers

Business logic inside API routes.

### Direct frontend-to-model calls

Bypasses central validation.

### AI for deterministic checks

Adds unnecessary uncertainty.

### Database-driven prompt dumping

Leaks irrelevant data.

### Hardcoded provider logic

Makes replacement difficult.

### Silent assumptions

Creates hallucinated requirements.

### "Temporary" security bypasses

These often become permanent.

### One-file architecture

Makes debugging and maintenance difficult.

### Premature microservices

Adds operational complexity before it is needed.

---

# 151. Development Workflow for a Typical Feature

Example:

> Add "Explain Ingredient" feature.

### Step 1

Review:

```text
03_PRODUCT_REQUIREMENTS.md
06_SKINCARE_DOMAIN.md
07_AI_ARCHITECTURE.md
08_AI_PROMPTS.md
12_SAFETY.md
14_SYSTEM_ARCHITECTURE.md
16_TESTING.md
```

### Step 2

Define:

```text
Input:
ingredient identifier

Output:
structured explanation
```

### Step 3

Implement:

```text
Frontend
 ↓
API
 ↓
IngredientService
 ↓
Knowledge retrieval
 ↓
AI Orchestrator
 ↓
Validation
 ↓
Safety
```

### Step 4

Add:

```text
unit tests
integration tests
AI golden cases
safety cases
E2E
```

### Step 5

Update documentation if behavior changed.

---

# 152. Development Workflow for Product Checker

```text id="k0j5pl"
Define product input
 ↓
Implement upload endpoint
 ↓
Add file validation
 ↓
Add OCR adapter
 ↓
Add extraction
 ↓
Add normalization
 ↓
Add product analysis service
 ↓
Connect AI orchestrator
 ↓
Add compatibility
 ↓
Add safety validation
 ↓
Persist result
 ↓
Build UI
 ↓
Add complete test suite
```

Implement the pipeline one stage at a time.

---

# 153. Development Workflow for Voice

```text id="0wmixv"
Add microphone capture
 ↓
Add audio upload
 ↓
Connect STT
 ↓
Create transcript
 ↓
Reuse text task pipeline
 ↓
Validate response
 ↓
Connect TTS
 ↓
Add playback states
 ↓
Add failure handling
 ↓
Add voice tests
```

Do not develop voice as an independent reasoning system.

---

# 154. Release Preparation

Before release:

```text id="5cc3u9"
Freeze major feature scope
 ↓
Run full tests
 ↓
Run AI evaluation
 ↓
Run security review
 ↓
Run safety review
 ↓
Verify configuration
 ↓
Verify demo data
 ↓
Verify deployment
 ↓
Perform end-to-end manual test
 ↓
Review public repository
```

---

# 155. Final Development Checklist

```text id="d5bc92"
PROJECT
[ ] Requirements are clear
[ ] Source-of-truth documents are aligned

CODE
[ ] Frontend/backend boundaries are clean
[ ] Services are separated
[ ] AI is behind an adapter
[ ] External providers are isolated

DATA
[ ] Ownership is enforced
[ ] Schema is consistent
[ ] Migrations are controlled
[ ] Provenance is preserved

AI
[ ] Open-weight model is used for core intelligence
[ ] Prompt versions are tracked
[ ] Context is minimized
[ ] Output schemas are validated
[ ] AI failures are handled

SAFETY
[ ] Safety rules are enforced outside prompts
[ ] Escalations stop normal recommendation flow
[ ] No diagnosis/guarantees are introduced

SECURITY
[ ] Secrets are protected
[ ] Authorization is tested
[ ] Uploads are validated
[ ] Logs are privacy-safe
[ ] Prompt injection is handled

TESTING
[ ] Unit tests pass
[ ] Integration tests pass
[ ] Safety suite passes
[ ] Security suite passes
[ ] AI regression passes
[ ] E2E smoke test passes

DOCUMENTATION
[ ] README updated
[ ] AGENTS instructions updated
[ ] Relevant docs updated
[ ] Setup instructions verified
```

---

# 156. Final Development Principles

The following rules guide everyday implementation.

### Principle 1

Build from the validated user problem, not from technology novelty.

### Principle 2

Implement the smallest complete feature before expanding scope.

### Principle 3

Keep frontend, backend, AI, data, and external providers separated.

### Principle 4

Treat prompts, models, and knowledge as versioned software dependencies.

### Principle 5

Never bypass validation, safety, authorization, or privacy for convenience.

### Principle 6

Prefer deterministic logic whenever the problem does not require generative reasoning.

### Principle 7

Every significant bug should become a regression test.

### Principle 8

AI-generated code receives the same review standard as manually written code.

### Principle 9

A new feature is incomplete until its failure and security behavior are understood.

### Principle 10

Documentation must evolve with the implementation.

---

# 157. Final Development Model

The preferred SkinSense development loop is:

```text id="c7m2at"
                 USER PROBLEM
                      │
                      ▼
                 REQUIREMENT
                      │
                      ▼
                  USER FLOW
                      │
                      ▼
                ARCHITECTURE
                      │
                      ▼
                IMPLEMENTATION
                      │
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
        Tests       Safety      Security
          │           │            │
          └───────────┼────────────┘
                      ▼
                  CODE REVIEW
                      │
                      ▼
                 DOCUMENTATION
                      │
                      ▼
                    MERGE
                      │
                      ▼
                  DEMO / RELEASE
```

The central development rule is:

> **Do not let implementation drift away from the real user problem or the documented safety, privacy, and architecture boundaries.**

The central AI development rule is:

> **Treat the model as a powerful but fallible component inside a controlled software system, not as the system itself.**

The central contributor rule is:

> **Make changes small, testable, documented, and easy for the next developer to understand.**