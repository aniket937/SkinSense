# 18 — Deployment & Demo

## 1. Purpose

This document defines how **SkinSense** should be prepared, deployed, verified, demonstrated, and maintained for the Hacktoberfest 2026 **Build for a Friend** challenge.

It covers:

- Local development deployment
- Demo deployment
- Production-oriented architecture
- Frontend deployment
- Backend deployment
- AI model deployment
- Database deployment
- File/image handling
- Voice infrastructure
- External providers
- Environment configuration
- Secrets
- Health checks
- Monitoring
- Demo data
- Demo workflow
- Demo recording
- Failure recovery
- Public repository readiness
- Deployment verification
- Challenge submission readiness

This document focuses on **deployment and demonstration behavior**.

Detailed security controls remain defined in `15_SECURITY_PRIVACY.md`.

---

# 2. Deployment Philosophy

SkinSense should be deployed using the **simplest architecture that reliably demonstrates the complete product**.

The goal is not to create a large cloud infrastructure stack.

The goal is:

```text id="dj7k8m"
Reliable Product
+
Real User Problem
+
Open AI Core
+
Working Demo
```

The deployment should therefore prioritize:

1. reliability,
2. safety,
3. privacy,
4. reproducibility,
5. reasonable performance,
6. simplicity.

---

# 3. Deployment Environments

SkinSense should conceptually support:

```text id="g2j4n8"
Local Development
       ↓
Demo / Staging
       ↓
Public Release
```

Not every environment requires identical infrastructure.

---

# 4. Local Development Environment

The local environment is intended for:

- coding,
- testing,
- AI experimentation,
- OCR testing,
- voice testing,
- database development.

Conceptual architecture:

```text id="4p19zi"
Developer Machine
│
├── Next.js Frontend
│
├── FastAPI Backend
│
├── Database
│
├── Open-Weight AI Runtime
│
├── OCR
│
├── STT
│
└── TTS Provider
```

Some components can be mocked during development.

---

# 5. Local Development Modes

Useful development modes include:

```text id="oj5t5r"
FULL
MOCK_AI
MOCK_EXTERNAL
MINIMAL
```

### FULL

Runs the intended real pipeline.

### MOCK_AI

Uses deterministic AI responses.

Useful for:

- frontend development,
- API development,
- testing.

### MOCK_EXTERNAL

Mocks external providers such as:

- OCR,
- STT,
- TTS.

### MINIMAL

Runs only the smallest set of components necessary to develop a particular feature.

---

# 6. Demo Environment

The demo environment should represent the actual product rather than a collection of mocked screenshots.

Preferred:

```text id="w6ct4m"
Frontend
    ↓
Backend
    ↓
Real application services
    ↓
Open-Weight AI
    ↓
Real validation/safety
    ↓
Demo database
```

Mocks may be used only for dependencies that are genuinely unavailable or unreliable, and such usage should be documented.

---

# 7. Public Demo Architecture

A practical public deployment can follow:

```text id="ag8b79"
                    Internet
                       │
                       ▼
                ┌───────────────┐
                │   Frontend    │
                │    Next.js    │
                └───────┬───────┘
                        │
                       HTTPS
                        │
                ┌───────▼───────┐
                │    FastAPI    │
                │   Backend     │
                └───┬────┬───┬──┘
                    │    │   │
             ┌──────┘    │   └─────────┐
             │           │             │
             ▼           ▼             ▼
        Database      AI Runtime    Providers
                                    │
                               ┌────┼────┐
                               ▼    ▼    ▼
                              OCR  STT  TTS
```

The exact hosting providers are implementation decisions.

---

# 8. Deployment Principle: Keep the AI Server-Side

The browser should not directly connect to the model runtime.

Preferred:

```text id="5m7x9z"
Browser
   ↓
Frontend
   ↓
FastAPI
   ↓
AI Service
   ↓
Open-Weight Model
```

Avoid:

```text id="n2k4f8"
Browser
   ↓
Public Model Endpoint
```

unless a deliberate architecture explicitly requires it.

---

# 9. Open-Weight AI Deployment

Open-weight AI is a core part of SkinSense.

The deployment must make its role clear.

Conceptual:

```text id="kxv84d"
AI Orchestrator
      ↓
Model Adapter
      ↓
Open-Weight Model
      ↓
Inference Runtime
```

The selected model may run:

- directly inside the backend environment,
- as a separate internal inference process,
- on a dedicated GPU machine,
- through another controlled endpoint running the open model.

The exact runtime should depend on:

- model size,
- hardware,
- memory,
- latency,
- deployment budget,
- reliability.

---

# 10. Model Selection for Demo

The final demo model should be selected only after validating:

```text id="sbr2u8"
License
Model quality
Structured output
Reasoning quality
Multilingual/Hinglish support
Memory requirements
Inference speed
Hardware compatibility
Safety evaluation
```

The deployment document must be updated with the actual selected model before release.

Do not leave model selection ambiguous in the final public documentation.

---

# 11. Local AI Deployment

If the selected model runs locally:

```text id="8k5pzl"
User Request
   ↓
FastAPI
   ↓
Local AI Runtime
   ↓
Open-Weight Model
```

Advantages:

- reduced external data exposure,
- full model control,
- no dependence on a hosted AI API,
- easier model experimentation.

Disadvantages may include:

- GPU requirements,
- memory requirements,
- slower CPU fallback,
- local resource constraints.

---

# 12. Remote Open-Weight AI Deployment

A remote open-weight deployment may still satisfy the project's open-AI architecture when the hosted runtime uses an open-weight model and remains under an appropriate controlled boundary.

Architecture:

```text id="ynh6qm"
FastAPI
   ↓
Model Adapter
   ↓
Remote Open-Weight Inference
```

The application must:

- minimize transmitted context,
- protect credentials,
- verify provider behavior,
- record the actual model used.

---

# 13. Demo AI Reliability

AI inference is one of the most important demo dependencies.

Before a public demonstration:

```text id="u6r8g1"
Start model
 ↓
Health check
 ↓
Run simple generation
 ↓
Run structured output test
 ↓
Run safety test
 ↓
Run representative product test
 ↓
Run routine test
```

Do not discover model/runtime problems during recording.

---

# 14. AI Warm-Up

If the inference runtime has significant model-loading latency, perform model warm-up before the demo.

Example:

```text id="60xg5d"
Model startup
    ↓
Load weights
    ↓
Initialize runtime
    ↓
Warm-up request
    ↓
Ready
```

The application should still display an appropriate loading state for normal users.

---

# 15. AI Availability

The demo environment should expose a health signal indicating whether the AI subsystem is ready.

Conceptual states:

```text id="0c7x0w"
READY
STARTING
DEGRADED
UNAVAILABLE
```

The frontend can then avoid presenting an apparently broken feature as operational.

---

# 16. Frontend Deployment

The frontend contains:

- presentation,
- user interaction,
- client state,
- API communication.

The frontend should be deployable independently from the backend.

Conceptually:

```text id="5w9z3v"
Next.js Build
     ↓
Static / Server Runtime
     ↓
Public URL
     ↓
FastAPI API
```

The frontend must know only the approved public API endpoint.

---

# 17. Frontend Environment Variables

Only public configuration should reach the browser.

Example:

```text id="0s4qga"
NEXT_PUBLIC_API_URL
```

Server-only secrets must never use a publicly exposed frontend environment variable.

Never place:

```text id="x3txv4"
ELEVENLABS_API_KEY
MODEL_API_KEY
DATABASE_URL
AUTH_SECRET
```

in public frontend configuration.

---

# 18. Backend Deployment

The FastAPI backend is responsible for:

- authentication,
- authorization,
- API validation,
- application services,
- AI orchestration,
- product analysis,
- personalization,
- persistence,
- external integrations.

It should be deployed in an environment capable of handling the selected model architecture.

---

# 19. Backend Runtime

The backend runtime should provide:

- Python environment,
- required dependencies,
- environment configuration,
- network access to required services,
- storage access where required.

The application should have a clear startup command.

The exact server process and worker configuration are deployment-specific.

---

# 20. Database Deployment

The database stores:

- accounts,
- profiles,
- routines,
- products,
- product analyses,
- ingredient knowledge,
- conversations,
- progress records,
- AI metadata.

For a demo, the database may be:

```text id="3y0kq3"
Local
or
Managed hosted database
```

depending on reliability and ease of deployment.

The exact technology should remain aligned with the implementation actually used.

---

# 21. Database Environment Separation

Do not connect:

```text id="9g4x6k"
local development
→ real demo database
```

or:

```text id="4n3j5g"
automated tests
→ public demo database
```

Use separate database environments or isolated schemas where appropriate.

---

# 22. Database Initialization

A fresh environment should support:

```text id="qg5v8m"
Create schema
 ↓
Run migrations
 ↓
Seed optional demo data
 ↓
Run health check
```

The process should be documented and repeatable.

---

# 23. Demo Database

The demo database should contain only data necessary to showcase the product.

Example:

```text id="v86r3m"
Demo User
Demo Skin Profile
Demo Routine
Demo Products
Demo Analysis History
Optional Demo Journal
```

Do not expose the real friend's private account.

---

# 24. Demo Data Principles

Demo data should be:

- realistic enough to demonstrate the system,
- safe to publish,
- non-identifying,
- reproducible,
- easy to reset.

Where possible, use synthetic data modeled after the problem characteristics rather than copying private personal information.

---

# 25. Friend-Inspired Demo Without Privacy Leakage

SkinSense is built around a real person's problem.

The public demo should demonstrate the **problem**, not expose the person's private information.

Preferred:

```text id="1e8kqi"
Real problem
+
Synthetic/consented profile
+
Synthetic/consented data
```

Avoid:

```text id="o7h2qf"
real private profile
+
private conversations
+
private voice recordings
```

---

# 26. Authentication for Demo

The demo may use either:

```text id="u0vnls"
normal authentication
```

or:

```text id="v1q8xe"
dedicated demo account
```

A demo account should have:

- non-sensitive data,
- predictable starting state,
- easy reset,
- no access to other users.

---

# 27. Demo Account Reset

A reset mechanism should be available.

Conceptual:

```text id="p3ct7y"
Reset Demo
 ↓
Delete demo-owned state
 ↓
Seed known profile
 ↓
Seed known products
 ↓
Generate starting routine
```

This prevents demo behavior from changing unpredictably after repeated runs.

---

# 28. Demo Seed Data

Recommended demo profile characteristics should reflect the actual user problem without revealing the real friend.

Example:

```text id="s9h3o1"
Reported skin context
Existing simple routine
A few known products
A new product to evaluate
Several ingredient questions
```

The data should be sufficient to demonstrate the complete product loop.

---

# 29. Product Image Demo

Keep at least one known-good product image for demonstration.

It should have:

- readable label,
- readable ingredient list,
- acceptable image quality,
- predictable OCR behavior.

Also maintain a fallback manual ingredient list.

---

# 30. Product Demo Sequence

Recommended flow:

```text id="m1h9q5"
Upload known image
 ↓
OCR
 ↓
Show extracted text
 ↓
Normalize ingredients
 ↓
Analyze product
 ↓
Compare with current routine
 ↓
Show compatibility
 ↓
Explain important ingredients
```

This demonstrates the complete intelligence pipeline.

---

# 31. Product OCR Fallback

If OCR becomes unreliable during the demo:

```text id="tr5w41"
Use manual ingredient input
```

The demo should still show meaningful product intelligence rather than stop completely.

However, the use of a fallback should be honestly described if it is not the primary production path.

---

# 32. Voice Demo

Voice should demonstrate that the same SkinSense intelligence works through natural speech.

Example:

```text id="0y6xqe"
User:
"Ye serum mere current routine ke saath theek rahega?"
```

Pipeline:

```text id="b0z0ue"
Voice
 ↓
STT
 ↓
Intent
 ↓
User Context
 ↓
Product Context
 ↓
Open AI
 ↓
Safety Validation
 ↓
Response
 ↓
ElevenLabs TTS
```

---

# 33. Voice Demo Preparation

Before recording:

```text id="4g0h2z"
Microphone permission
Audio input
STT availability
AI availability
TTS availability
Browser playback
```

must all be verified.

---

# 34. Voice Fallback

If voice fails:

```text id="f8c3z1"
Voice unavailable
 ↓
Text input remains available
```

The product should never require voice for core functionality.

---

# 35. ElevenLabs Deployment

ElevenLabs should be configured only on the backend.

Conceptual:

```text id="e53e8n"
FastAPI
 ↓
TTS Adapter
 ↓
ElevenLabs
```

The API key must remain server-side.

If the provider is unavailable:

```text id="xq9h14"
Return text response
```

rather than failing the entire request.

---

# 36. Speech-to-Text Deployment

The selected STT implementation should be available through a stable adapter.

Candidate:

```text id="s9j6ot"
Whisper / faster-whisper
```

The final deployment choice should be based on:

- hardware,
- latency,
- language performance,
- resource consumption.

---

# 37. OCR Deployment

OCR should be deployed in a way consistent with the product's privacy model.

Possible architecture:

```text id="05snc5"
Local OCR
```

or:

```text id="k0j8t2"
Controlled OCR service
```

The final deployment documentation should state which is actually used.

---

# 38. File Storage

Uploaded product images may require temporary or persistent storage.

The system should distinguish:

```text id="r9w0cg"
Temporary processing file
```

from:

```text id="1m72kf"
User-retained product asset
```

Do not retain raw images unnecessarily.

---

# 39. Temporary Storage Lifecycle

Preferred:

```text id="z8c8e4"
Upload
 ↓
Temporary storage
 ↓
OCR / processing
 ↓
Analysis
 ↓
Persist only required result
 ↓
Delete temporary asset
```

The exact lifecycle may differ if users intentionally save the image.

---

# 40. Public Asset Safety

Do not make private product images publicly accessible merely because public object storage is convenient.

Private user assets should use controlled access.

---

# 41. Static Assets

Public assets can include:

- application icons,
- illustrations,
- non-sensitive product UI assets,
- documentation images.

They should not contain:

- API keys,
- private user images,
- private recordings,
- private conversations.

---

# 42. Domain Configuration

Before public deployment, configure:

```text id="0fq7tx"
Frontend domain
Backend API domain
Allowed CORS origin
Authentication callback URLs where applicable
Provider callback URLs where applicable
```

Do not leave localhost URLs inside production configuration.

---

# 43. CORS Configuration

Production CORS should allow only the approved frontend origin(s).

Conceptually:

```text id="n9l4cu"
https://skinsense.example
        ↓
FastAPI
```

Avoid unrestricted origins in production.

---

# 44. HTTPS Requirements

Public deployment must use HTTPS.

Required for:

- login,
- profile,
- product uploads,
- conversations,
- voice,
- AI responses.

---

# 45. Deployment Secrets

Production secrets should exist outside source control.

Examples:

```text id="g8h4v2"
DATABASE_URL
AUTH_SECRET
ELEVENLABS_API_KEY
STORAGE_SECRET
MODEL credentials if applicable
```

Use environment or secret-management mechanisms provided by the hosting platform.

---

# 46. Secret Rotation Before Public Demo

Before making the project public:

```text id="x0l0o4"
Check source
 ↓
Check Git history where practical
 ↓
Check .env files
 ↓
Rotate accidental secrets
 ↓
Re-run secret scan
```

Public repository history should not contain active credentials.

---

# 47. Startup Sequence

The deployed application should follow a predictable startup process:

```text id="3y0l93"
Load configuration
 ↓
Validate required configuration
 ↓
Initialize application
 ↓
Initialize database connection
 ↓
Initialize required providers
 ↓
Initialize AI runtime
 ↓
Run health checks
 ↓
Ready
```

Optional provider failures should be distinguished from critical failures.

---

# 48. Application Readiness

The application should expose a readiness concept.

Example:

```text id="98ylq7"
API:
READY

Database:
READY

AI:
READY

OCR:
READY

STT:
READY

TTS:
READY
```

Optional components can be marked degraded rather than taking the entire application offline.

---

# 49. Health Endpoint

Provide a lightweight endpoint such as:

```text id="n9kc7p"
GET /health
```

It should verify application health without exposing:

- secrets,
- database credentials,
- internal paths,
- sensitive user data.

---

# 50. Dependency Health

Where practical, distinguish:

```text id="gr1r7t"
Application health
Database health
AI health
OCR health
STT health
TTS health
```

This helps identify which feature is actually unavailable.

---

# 51. Logging in Demo Environment

Logs should support debugging while respecting privacy.

Useful:

```text id="v5p2r4"
request_id
endpoint
task_type
status
latency
provider status
error code
```

Avoid:

```text id="m0ghm5"
full profile
full voice recording
full private conversation
API credentials
```

---

# 52. Monitoring

For a challenge demo, lightweight monitoring is sufficient.

Monitor:

- application uptime,
- API errors,
- AI availability,
- provider failures,
- latency,
- database availability.

Do not build a complex observability stack unless necessary.

---

# 53. Error Tracking

The deployment should capture application errors with enough metadata to diagnose failures.

However, error tracking tools must be configured to avoid collecting sensitive payloads unnecessarily.

---

# 54. AI Monitoring

Track:

```text id="71iw9p"
AI request count
AI success rate
AI failure rate
average latency
validation failure rate
safety escalation rate
```

Do not use raw conversation data as a monitoring shortcut.

---

# 55. OCR Monitoring

Track:

```text id="9f6y1w"
OCR success
OCR failure
low-confidence extraction
manual correction
processing latency
```

This can reveal whether the product checker is reliable enough for the demo.

---

# 56. Voice Monitoring

Track:

```text id="2o8z6d"
STT success
STT failure
TTS success
TTS failure
voice round-trip latency
cancellation rate
```

Do not store audio merely to generate aggregate metrics.

---

# 57. Performance Monitoring

Important deployment metrics:

```text id="w3f4s0"
Frontend load time
API response time
Routine generation time
Product analysis time
OCR time
STT time
TTS time
AI inference time
```

AI inference should be separately measurable.

---

# 58. Cold Start Risk

Serverless or scale-to-zero infrastructure may introduce cold-start latency.

If the AI model is large, model initialization may dominate startup time.

Therefore, the selected hosting model should consider:

```text id="46f5u3"
GPU availability
Memory limits
startup time
model loading time
request timeout
cost
```

Do not assume a standard lightweight web-hosting environment can run a large local model efficiently.

---

# 59. GPU Deployment

If the selected model requires GPU acceleration, deployment must provide compatible hardware.

Verify:

- GPU availability,
- memory capacity,
- runtime compatibility,
- model loading,
- inference latency.

The production architecture should not claim GPU inference unless the deployment actually provides it.

---

# 60. CPU Fallback

Where supported, CPU inference may be a fallback.

However, CPU performance should be tested.

If CPU inference is too slow for a good user experience, the UI should communicate processing rather than appearing frozen.

---

# 61. Model Memory Management

For large models, manage:

- model loading,
- concurrency,
- memory pressure,
- request queueing.

Avoid loading multiple copies of the same model unnecessarily.

---

# 62. Request Timeouts

Configure reasonable timeouts for:

- API requests,
- AI inference,
- OCR,
- STT,
- TTS,
- database queries.

The exact values should be determined from actual measured behavior.

---

# 63. Deployment Retry Behavior

Transient failures may be retried where safe.

Do not automatically retry:

- invalid user input,
- authorization errors,
- safety escalations,
- malformed AI output indefinitely.

Repeated retries should not create duplicates.

---

# 64. Graceful Degradation

The public demo should support reduced-functionality operation.

Examples:

### AI unavailable

Show controlled error and retain saved content.

### TTS unavailable

Show text response.

### STT unavailable

Allow typed input.

### OCR unavailable

Allow manual ingredient input.

This makes the demonstration resilient.

---

# 65. Demo Reliability Hierarchy

During the demo, prioritize:

```text id="5q4n8k"
1. Core product flow
2. AI reasoning
3. Safety
4. Product analysis
5. Voice
6. Optional enhancements
```

If an enhancement fails, continue with the core product.

---

# 66. Demo Story

The demonstration should tell a simple story.

Recommended narrative:

```text id="zh1w5e"
Real friend problem
       ↓
Skincare decisions are confusing
       ↓
SkinSense understands user context
       ↓
Builds a personalized routine
       ↓
User considers a new product
       ↓
SkinSense analyzes it
       ↓
Explains ingredients
       ↓
Checks context against current routine
       ↓
User asks naturally by voice
       ↓
Open AI provides personalized reasoning
```

The demo should show the problem and the solution, not a tour of every technical feature.

---

# 67. Demo Opening

Start with the user's problem.

Example framing:

> "My friend wasn't struggling to find skincare information. The problem was knowing what information actually mattered for their own skin and whether a product made sense for their routine."

Then transition into the product.

---

# 68. Demo User

The demo user should be representative of the real problem.

Example:

```text id="k02rj7"
Reported skin context
Existing routine
Known concerns
A product they are considering
Questions about ingredients
```

The exact values should be synthetic or appropriately consented.

---

# 69. Demo Step 1 — Understand Skin

Show:

```text id="4e7u67"
Profile questions
 ↓
User answers
 ↓
Structured profile
```

Emphasize that the system starts from user-reported context instead of immediately recommending products.

---

# 70. Demo Step 2 — Build Routine

Show:

```text id="a8n2v1"
Build My Routine
 ↓
Personalized AM/PM routine
 ↓
Why each step is included
```

Highlight:

- simplicity,
- personalization,
- existing products,
- reasoning.

---

# 71. Demo Step 3 — Check Product

Show the product checker.

```text id="6m5h9c"
Upload Product
 ↓
Extract Information
 ↓
Analyze Ingredients
 ↓
Compare with Routine
```

This is one of the strongest demonstrations of the system's AI value.

---

# 72. Demo Step 4 — Explain Ingredients

Select an ingredient that the user may not understand.

Show:

```text id="z1l7bh"
What is it?
Why is it used?
What does it generally do?
What should the user know?
What is still uncertain?
```

Keep language simple.

---

# 73. Demo Step 5 — Compatibility

Show a contextual assessment.

For example:

```text id="q0db3z"
Assessment:
Consider Carefully

Why:
- relevant ingredient overlap
- current routine context
- limited information
```

The exact assessment must come from the implemented system.

Do not manually type a result that the application does not produce.

---

# 74. Demo Step 6 — Voice

Ask a natural question:

> "Ye serum mere current routine ke saath theek rahega?"

Then show:

```text id="k5d0sa"
Voice
 ↓
Transcript
 ↓
AI reasoning
 ↓
Safety validation
 ↓
Spoken answer
```

This demonstrates that voice is an interface to the same intelligence rather than a separate feature.

---

# 75. Demo Step 7 — Open AI

Explicitly demonstrate where open AI matters.

The explanation should make clear that the core intelligence uses an **open-source/open-weight model** for:

- contextual reasoning,
- routine generation,
- ingredient explanation,
- product interpretation,
- compatibility reasoning,
- conversational interaction.

This is important to the challenge submission.

---

# 76. Why Open AI Matters in the Demo

The demonstration should communicate practical benefits.

### Privacy

Local/controlled inference can reduce unnecessary exposure of sensitive personal context.

### Model control

The project can choose and replace open models rather than being locked to one proprietary reasoning system.

### Customization

Prompts, schemas, safety layers, and evaluation can be designed around the actual user's problem.

### Cost/control

Local inference can reduce dependence on per-request proprietary model pricing where hardware permits.

### Transparency of architecture

The project can explain exactly which open model forms the core intelligence.

Do not claim open AI is automatically safer or more accurate.

---

# 77. ElevenLabs Positioning

ElevenLabs should be presented as:

> the voice output layer that makes the interaction natural.

Do not present ElevenLabs as the core AI intelligence.

The core reasoning remains in the open AI architecture.

---

# 78. Demo Safety Moment

A particularly strong demonstration can show uncertainty or a safety boundary.

Example:

```text id="6w4j38"
User asks for a medical diagnosis.
```

SkinSense should clearly explain its limitation rather than pretending to diagnose.

This demonstrates that safety is built into the application architecture.

---

# 79. Do Not Demo Unsafe Tricks

Never create a demo scenario designed to produce:

- fake diagnosis,
- fake medical certainty,
- dangerous product combinations,
- fabricated product facts.

The demo should demonstrate responsible AI behavior.

---

# 80. Demo Timing

The complete primary demo should be designed to fit into a short, coherent session.

Suggested structure:

```text id="5v1xg1"
Problem
→ 20%
Product flow
→ 45%
AI/open model explanation
→ 20%
Safety / voice
→ 15%
```

The exact duration depends on the final submission format.

---

# 81. Screen Recording Guidance

When recording:

- keep the browser uncluttered,
- use readable zoom,
- hide private tabs,
- hide API keys/terminals containing secrets,
- use a stable demo account,
- avoid showing internal errors unnecessarily,
- keep cursor movement intentional.

---

# 82. Demo Browser Preparation

Before recording:

```text id="a4nq8l"
Close unrelated tabs
Disable distracting notifications
Open demo URL
Verify microphone
Verify login
Verify AI ready
Verify demo data
Check browser console
```

---

# 83. Demo Failure Recovery

Keep a recovery path for every major feature.

Example:

### Product OCR fails

Use manual ingredient entry.

### Voice fails

Use typed question.

### TTS fails

Read text response from the UI.

### AI model is slow

Explain that local inference is initializing and continue after readiness.

### Demo state becomes corrupted

Reset demo data.

---

# 84. Demo Backup

Before recording, maintain a backup path.

Possible backup:

```text id="g8d4j3"
Known-good product input
+
Known-good profile
+
Known-good expected flow
```

The backup should still use the actual application, not a prerecorded fake screen pretending to be live.

---

# 85. Demo vs Fake UI

Do not create fake UI states that are disconnected from real backend functionality merely to make the demo appear complete.

The demonstrated core path should genuinely execute.

Mock data is acceptable when explicitly part of the architecture and clearly represented as such.

---

# 86. Demo Environment Configuration

The demo environment should use:

```text id="c8n0r4"
demo-specific credentials
demo database
approved provider keys
approved model
approved frontend origin
```

Do not reuse developer secrets unnecessarily.

---

# 87. Production-Like Configuration

Even if this is primarily a challenge demo, production-oriented settings should include:

- HTTPS,
- secure cookies/tokens where applicable,
- restricted CORS,
- no debug stack traces,
- controlled secrets,
- proper logging,
- resource limits,
- safe error handling.

---

# 88. Deployment Checklist — Backend

```text id="q8tm2w"
[ ] Python/runtime configured
[ ] Dependencies installed
[ ] Environment variables configured
[ ] Database connected
[ ] Migrations applied
[ ] AI runtime available
[ ] OCR available
[ ] STT available
[ ] TTS available
[ ] Health endpoint works
[ ] API authentication works
[ ] CORS configured
[ ] Debug mode disabled
[ ] Logs verified
```

---

# 89. Deployment Checklist — Frontend

```text id="l0u6gd"
[ ] Production build succeeds
[ ] API URL configured
[ ] Authentication flow works
[ ] Responsive UI verified
[ ] Product upload works
[ ] Voice interaction works
[ ] Error states work
[ ] No secret exposed
[ ] No localhost URLs
[ ] Console free of critical errors
```

---

# 90. Deployment Checklist — AI

```text id="8d8m6m"
[ ] Correct open-weight model selected
[ ] Model license reviewed
[ ] Model loads successfully
[ ] Structured output works
[ ] Context builder works
[ ] Knowledge retrieval works
[ ] Output validation works
[ ] Safety validation works
[ ] Golden cases pass
[ ] Safety regression passes
[ ] Latency is acceptable
```

---

# 91. Deployment Checklist — Product Analysis

```text id="v2q8mz"
[ ] Image upload works
[ ] File validation works
[ ] OCR works
[ ] OCR confidence represented
[ ] Ingredient normalization works
[ ] Product data is traceable
[ ] Compatibility works
[ ] Uncertainty is visible
[ ] Failed OCR can recover
[ ] Analysis result persists correctly
```

---

# 92. Deployment Checklist — Voice

```text id="h2g4r9"
[ ] Microphone permission works
[ ] Audio capture works
[ ] STT works
[ ] Transcript displayed
[ ] Intent routing works
[ ] AI reasoning works
[ ] Safety validation runs
[ ] TTS works
[ ] Playback works
[ ] Text fallback works
```

---

# 93. Deployment Checklist — Security

```text id="2f1e8w"
[ ] HTTPS enabled
[ ] Secrets not committed
[ ] Secret scan completed
[ ] Authorization verified
[ ] Cross-user access test passes
[ ] File upload restrictions enabled
[ ] CORS restricted
[ ] Debug disabled
[ ] Sensitive logging reviewed
[ ] External provider payloads minimized
```

---

# 94. Deployment Checklist — Privacy

```text id="z4w2x6"
[ ] Demo data is safe
[ ] No private friend data exposed
[ ] Voice retention behavior verified
[ ] Temporary image cleanup verified
[ ] AI context minimized
[ ] External provider boundaries reviewed
[ ] User deletion path tested
[ ] Public privacy wording matches actual behavior
```

---

# 95. Deployment Verification

After deployment, perform:

```text id="m9h4s5"
Frontend URL
 ↓
Login
 ↓
Profile
 ↓
Routine
 ↓
Product analysis
 ↓
Ingredient explanation
 ↓
Text question
 ↓
Voice
 ↓
Safety test
 ↓
Data deletion/reset
```

This is the deployment acceptance test.

---

# 96. Smoke Test After Every Deployment

Whenever a new demo build is deployed:

```text id="q7v9r2"
1. Open site
2. Sign in
3. Open profile
4. Load routine
5. Generate or refresh routine
6. Run product analysis
7. Ask ingredient question
8. Ask text question
9. Try voice
10. Verify no critical errors
```

Do not assume that a successful build means the deployed system works.

---

# 97. Rollback Strategy

If a deployment introduces a critical problem:

```text id="r5t3b9"
Detect problem
 ↓
Stop further rollout
 ↓
Return to previous known-good build
 ↓
Verify smoke test
 ↓
Investigate
 ↓
Fix
 ↓
Re-test
 ↓
Redeploy
```

The project should always have a known-good version.

---

# 98. Deployment Versioning

Every public build should be traceable to:

```text id="x7d0s5f"
Git commit
+
model version
+
prompt version
+
knowledge version
+
configuration version
```

This helps identify which version produced a given behavior.

---

# 99. AI Deployment Traceability

For an analysis shown in the demo, it should be possible to identify:

```text id="t6x4m0"
Model
Prompt version
Knowledge version
Analysis timestamp
```

This is especially useful when evaluating changes shortly before submission.

---

# 100. Final Demo Freeze

Before final recording/submission:

```text id="x2b1r9"
Freeze major feature changes
 ↓
Run full regression
 ↓
Deploy known-good build
 ↓
Run smoke test
 ↓
Prepare demo data
 ↓
Record demo
 ↓
Avoid unnecessary last-minute code changes
```

Do not change the AI model immediately before recording without rerunning the full evaluation suite.

---

# 101. Demo Script

A suggested script:

```text id="h8s4f7"
"SkinSense was built for a real friend who found skincare decisions confusing."

"The problem wasn't finding information.
The problem was knowing what information mattered for their own skin."

"First, SkinSense builds a personal skin context."

"Then it creates a simple routine and explains why each step exists."

"Now let's check a product they are considering."

"The system reads the label, extracts ingredients, explains them,
and compares the product with the user's existing routine."

"It doesn't pretend to know everything.
When information is missing, it shows uncertainty."

"And the same intelligence can be accessed naturally through voice."

"Under the hood, the core reasoning uses an open-weight AI model,
while validation and safety remain outside the model."

"That open architecture gives us control over the model,
privacy boundaries, customization, and future model replacement."
```

The final script should be adapted to the exact implemented behavior.

---

# 102. Hacktoberfest Demo Focus

The demonstration should make these points obvious:

### Real person

A real friend problem inspired the product.

### Real product

The system actually works.

### Open AI

The core reasoning uses open-source/open-weight AI.

### Why open matters

Explain practical architectural benefits.

### Engineering quality

Show:

- structured outputs,
- safety validation,
- personalization,
- modular architecture,
- product analysis,
- voice.

### Impact

Show how the system reduces uncertainty in skincare decisions.

---

# 103. Avoid Feature Dumping

Do not spend equal time on every implemented feature.

The strongest narrative is:

```text id="4g1c2k"
Problem
 ↓
Personal context
 ↓
Routine
 ↓
Product decision
 ↓
Ingredient understanding
 ↓
Voice
 ↓
Open AI + safety
```

Optional features should remain secondary.

---

# 104. Public Repository Readiness

Before publishing the repository, verify:

```text id="6h2q1l"
No secrets
No private credentials
No private friend data
No personal recordings
No hidden production URLs
No accidental local files
No temporary artifacts
No unlicensed assets
```

---

# 105. README Deployment Information

The final `README.md` should explain:

```text id="4w9x2f"
What SkinSense is
Who it was built for
How to run locally
How to configure AI
How to run tests
Architecture overview
Demo URL if available
Open AI model used
Why open innovation matters
Safety limitations
```

The README should remain consistent with this document.

---

# 106. Public Demo Privacy

The public demo should not reveal:

- private environment variables,
- internal API endpoints unnecessarily,
- database credentials,
- private model configuration,
- private user information,
- sensitive debug output.

---

# 107. Public Demo Safety

The deployed demo should preserve all safety controls.

Do not create a "demo mode" that disables:

- authorization,
- safety validation,
- uncertainty,
- input validation.

A demo should demonstrate the actual product architecture.

---

# 108. Submission Artifact Preparation

The final challenge submission should have:

```text id="1n5e8g"
Project code
Demo
README
Architecture explanation
Open AI explanation
Real-user problem
Impact
Build details
```

The exact Hacktoberfest submission requirements are defined in:

`19_HACKTOBERFEST.md`

---

# 109. Final Demo Acceptance Criteria

The project is ready for demonstration when:

```text id="3p2t5c"
[ ] Public/demo URL works
[ ] Frontend loads
[ ] Authentication works
[ ] Profile works
[ ] Routine generation works
[ ] Product checker works
[ ] Ingredient explanation works
[ ] Compatibility works
[ ] Text Q&A works
[ ] Voice works or gracefully degrades
[ ] Open-weight model is genuinely active
[ ] Safety validation works
[ ] No critical security issues
[ ] Demo data is safe
[ ] No secrets exposed
[ ] Core user journey can be completed without manual database intervention
```

---

# 110. Final Demo Recovery Checklist

Keep the following ready before recording:

```text id="v0j6ns"
Known-good browser
Known-good demo account
Known-good product image
Manual ingredient fallback
Typed question fallback
Text-only fallback for TTS
Demo reset procedure
Previous known-good deployment
```

The goal is resilience without faking behavior.

---

# 111. Final Deployment Architecture

The final system should conceptually operate as:

```text id="z5h8q2"
                         PUBLIC USER
                              │
                              ▼
                     ┌────────────────┐
                     │ Next.js Web App│
                     └───────┬────────┘
                             │
                           HTTPS
                             │
                     ┌───────▼────────┐
                     │   FastAPI API   │
                     └───────┬────────┘
                             │
          ┌──────────────────┼───────────────────┐
          │                  │                   │
          ▼                  ▼                   ▼
     Application          Data Layer       Integrations
      Services                │                   │
          │                   │          ┌────────┼────────┐
          ▼                   ▼          ▼        ▼        ▼
   AI Orchestrator        Database     OCR      STT      TTS
          │
    ┌─────┴──────┐
    │            │
    ▼            ▼
Context       Knowledge
    │            │
    └─────┬──────┘
          ▼
    Open-Weight AI
          │
          ▼
  Structured Output
          │
          ▼
   Semantic Validation
          │
          ▼
    Safety Validation
          │
          ▼
      User Response
```

---

# 112. Final Deployment Principles

### Principle 1

Deploy the simplest architecture that reliably demonstrates the real product.

### Principle 2

The deployed demo must use the actual core AI architecture.

### Principle 3

Open-weight AI must perform meaningful reasoning, not merely appear in the tech stack.

### Principle 4

Safety and validation remain active in every environment, including demos.

### Principle 5

The demo must never expose private friend data merely to prove that the product was inspired by a real person.

### Principle 6

External services remain replaceable through adapters.

### Principle 7

Optional voice services must not become a single point of failure for the core product.

### Principle 8

Every public deployment must have a rollback path.

### Principle 9

Every significant deployment should be smoke-tested from the user's perspective.

### Principle 10

The final demo should tell one coherent story: **a real person had a real decision problem, and SkinSense uses open AI to help them make that decision with more context and less blind trial-and-error.**

---

# 113. Final Deployment Summary

The deployment journey is:

```text id="j6s6y2"
LOCAL DEVELOPMENT
       ↓
Automated Tests
       ↓
AI / Safety / Security Validation
       ↓
Demo Environment
       ↓
Database + Open AI + Providers
       ↓
Smoke Test
       ↓
Demo Data Preparation
       ↓
Final Recording
       ↓
Public Submission
```

The final demo journey is:

```text id="e5x7w6"
Real Friend Problem
        ↓
Understand Skin
        ↓
Build Routine
        ↓
Check Product
        ↓
Explain Ingredients
        ↓
Assess Product Fit
        ↓
Ask Naturally by Voice
        ↓
Open-Weight AI Reasoning
        ↓
Validation + Safety
        ↓
Better-Informed Decision
```

The deployment principle can be summarized as:

> **A successful deployment is not merely a live URL. It is a reproducible, secure, privacy-aware environment in which the complete SkinSense user journey works reliably using the intended open AI architecture.**

The demo principle can be summarized as:

> **Show the real problem, show the working solution, show where open AI provides the intelligence, and show that the system knows when it does not know.**