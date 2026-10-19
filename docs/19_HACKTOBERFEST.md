# 19 — Hacktoberfest 2026 Submission

## 1. Purpose

This document defines how **SkinSense** should be positioned, prepared, documented, and submitted for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend**.

This is not a general marketing document.

It is the project's submission and challenge-alignment source of truth.

It defines:

- Challenge requirements
- SkinSense's eligibility alignment
- Real-friend problem story
- Open-source AI positioning
- Project originality
- Demo requirements
- DEV submission structure
- Code/repository requirements
- DevRelay agent-session strategy
- Partner-category strategy
- Judging strategy
- Public documentation
- Submission checklist
- Deadline handling
- Post-submission integrity
- Final challenge narrative

The current official challenge requires a new project built during the challenge period, with open-source AI at its core, solving a real problem for a friend or loved one. A valid submission must include a DEV post using the challenge template and `#hf26challenge`, a demo, a code link, and an explanation of why open innovation matters.

---

# 2. Challenge Identity

## Challenge

**Hacktoberfest Weekend Challenge: Build for a Friend**

## Theme

**Build for a Friend**

## Core prompt

Build something with **open-source AI at its core** that solves a **real problem for a friend or someone you love**.

---

# 3. Official Challenge Requirements

SkinSense must satisfy every required element.

```text id="p5qf9x"
Required:

✓ New project
✓ Built during the challenge window
✓ Open-source/open-weight AI at the core
✓ Real problem for a friend/loved one
✓ Demo
✓ Code/repository link
✓ Explanation of why open innovation matters
✓ DEV submission post
✓ Official submission template
✓ #hf26challenge
```

The official contest rules specifically require a published DEV submission using the submission template and unique challenge tag `#hf26challenge`, a new project built during the entry period with open-source AI at its core, a real friend/loved-one problem, a demo and code link, and an explanation of why open-source AI matters.

---

# 4. Challenge Dates

The official entry window is:

```text id="5td8gk"
Start:
October 2, 2026 at 2:00 AM UTC

End:
October 5, 2026 at 6:59 AM UTC
```

For India Standard Time:

```text id="kvw9s4"
Start:
October 2, 2026 at 7:30 AM IST

Deadline:
October 5, 2026 at 12:29 PM IST
```

The DEV challenge page lists October 5, 2026 at 6:59 AM UTC as the submission deadline and October 5, 2026 at 12:29 PM IST as the corresponding India deadline.

---

# 5. New-Project Requirement

SkinSense must be treated as a **new project** for this challenge.

The project must not be presented as:

- an old project repackaged for the challenge,
- an existing product with only cosmetic AI added,
- a pull request to an unrelated existing repository.

DEV explicitly states that this year's Hacktoberfest challenge is based on new projects, not pull requests to existing projects.

---

# 6. Build-Window Integrity

The repository history should clearly support the fact that SkinSense was built during the challenge window.

Important rule:

> Do not rewrite project history or artificially manufacture timestamps merely to make the project appear newer.

Development should remain genuine.

---

# 7. Post-Deadline Changes

If commits are made after the official submission deadline, they must be clearly noted in the project README according to the challenge guidance.

Late changes must not be presented as though they were part of the original challenge-window submission.

Preferred README section:

```text id="q0m7bj"
## Post-Submission Changes

Changes after the Hacktoberfest Weekend Challenge deadline:
- <date> — <change>
- <date> — <change>
```

---

# 8. Real Friend Requirement

The central challenge requirement is not:

> "Build a useful skincare app."

It is:

> **Build something meaningful for one real person.**

SkinSense therefore needs to preserve the real origin story.

The project began from a friend's actual skincare confusion.

---

# 9. The Person Behind SkinSense

The public submission does not need to reveal the friend's identity.

The person can be described as:

> **a friend who regularly uses skincare products but struggles to understand which products and ingredients actually make sense for their own skin and routine.**

The real-person aspect is genuine.

The public article should protect the person's privacy.

---

# 10. The Real Problem

The friend identified several recurring sources of confusion:

```text id="t17u8a"
How to determine skin type

Which brand/product to choose

Why different brands can have the same ingredient

How to structure a skincare routine

How to know whether skincare is actually working

What skincare chemicals/acids actually do

Whether lesser-known brands can work well

How to choose ingredients/products without relying entirely on trial and error
```

These are the basis of SkinSense.

The project must not invent additional personal problems simply to make the story more dramatic.

---

# 11. Root User Problem

The deeper problem is:

> **The friend has access to skincare information, but struggles to turn that information into personalized decisions.**

This distinction is critical.

SkinSense is not primarily an information-search product.

It is a:

> **personalized skincare education and decision-support companion.**

---

# 12. User Job

The central user job is:

> **"Help me understand my skin and the products I am considering well enough to make a better skincare decision without relying entirely on trial and error."**

This sentence should remain consistent across:

- README,
- DEV article,
- demo narration,
- project pitch,
- architecture documentation.

---

# 13. Product Promise

SkinSense helps a user:

```text id="c5sgzy"
Understand their skin context
        ↓
Build a simple routine
        ↓
Understand ingredients
        ↓
Inspect a product
        ↓
Compare it with their existing routine
        ↓
Understand uncertainty
        ↓
Make a better-informed decision
```

---

# 14. What SkinSense Does

Core capabilities:

### Personal Skin Profile

Captures user-reported skin context and preferences.

### Build My Routine

Creates a simple personalized AM/PM routine and explains why each step is included.

### Check This Product

Accepts a product image or ingredient information, extracts relevant information, explains ingredients, and evaluates contextual compatibility.

### Ingredient Explainer

Explains skincare ingredients and active ingredients in understandable language.

### Product-to-Routine Compatibility

Looks at a product in the context of the user's existing routine and stated profile.

### Voice Interaction

Allows natural spoken questions using speech-to-text, the same SkinSense AI pipeline, and text-to-speech.

---

# 15. What SkinSense Does Not Claim

The public submission must explicitly avoid presenting SkinSense as:

```text id="d8k3p6"
An AI dermatologist
A medical diagnosis tool
A treatment engine
A prescription system
A guarantee of product safety
A guarantee of product effectiveness
A product marketplace
A brand-ranking engine
```

This is important for both product accuracy and responsible AI communication.

---

# 16. Open-Source AI Requirement

Open AI is not a decorative component of SkinSense.

It is part of the core product behavior.

The open-weight model is intended to perform meaningful reasoning for:

```text id="z6g2tp"
Personalized routine reasoning
Ingredient explanation
Product interpretation
Compatibility reasoning
Contextual skincare Q&A
Voice-driven skincare interaction
```

This directly aligns with the challenge requirement that the open pieces should be what makes the project work.

---

# 17. Proposed Open AI Architecture

Conceptually:

```text id="7h4b2r"
User
 ↓
SkinSense Application
 ↓
Context Builder
 ↓
Knowledge Layer
 ↓
Open-Weight Model
 ↓
Structured Output
 ↓
Validation
 ↓
Safety
 ↓
User
```

The exact final model must be recorded in the final submission once selected and validated.

Potential model candidates can include an appropriate open-weight model such as Qwen-family or another model that meets the project's actual quality, license, hardware, multilingual, and structured-output requirements.

Do not claim a model was used until it is actually integrated.

---

# 18. Why Open AI Is Central

The core intelligence of SkinSense depends on the ability to reason over:

```text id="x0x4y3"
Who the user is
+
What the user reports
+
What they already use
+
What product they are considering
+
What ingredients are involved
+
What relevant knowledge exists
```

This requires contextual reasoning.

A static rules database alone cannot provide the central conversational/personalized experience.

The open-weight model is therefore part of the actual product engine.

---

# 19. Why Open Innovation Matters

This section is one of the most important parts of the submission.

The article must answer:

> Why did this need an open approach?

The answer should be concrete rather than generic.

---

# 20. Benefit 1 — Privacy Control

SkinSense can process sensitive personal context such as:

- skincare concerns,
- routines,
- product usage,
- voice,
- conversations.

A controlled/local open-model architecture can reduce unnecessary exposure of this context to a third-party proprietary reasoning API.

The claim should be:

> **Open models give us more control over where personal context is processed.**

Do not claim:

> "Open source means the product is automatically private."

That is not technically correct.

---

# 21. Benefit 2 — Model Choice

An open-weight architecture lets the project evaluate and replace models.

Conceptually:

```text id="5jy7wf"
SkinSense
   ↓
AI Model Adapter
   ↓
Model A

or

Model B

or

Model C
```

The application architecture is not permanently tied to a single proprietary model.

---

# 22. Benefit 3 — Customization

SkinSense has unusual requirements:

- skincare-specific context,
- structured outputs,
- cautious uncertainty,
- multilingual/Hinglish interaction,
- personalization,
- safety boundaries.

Open models give the project more control over:

- prompting,
- model selection,
- local runtime,
- future fine-tuning,
- model swapping,
- evaluation,
- task specialization.

Not every one of these capabilities must be implemented for the current submission.

They are architectural advantages.

---

# 23. Benefit 4 — Cost and Control

Local inference can reduce recurring per-request model costs when suitable hardware is available.

The correct claim is:

> **The open approach can give us more control over inference economics.**

Do not claim:

> "The project is always free."

Model hosting, hardware, deployment, storage, and supporting services can still have costs.

---

# 24. Benefit 5 — Experimentation

Because the model boundary is modular, the project can experiment with:

```text id="2s4m8b"
Different open models
Different prompts
Different context strategies
Different inference runtimes
Different evaluation methods
```

without rebuilding the entire product.

---

# 25. Open AI Must Be More Than a Checkbox

The project should not say:

> "We used an open model."

and stop there.

The submission should show:

```text id="m8x9k2"
What model?
Why this model?
Where does it run?
What tasks does it perform?
What context does it receive?
How is output validated?
Why is open better for this use case?
```

---

# 26. AI Safety Architecture

The open model is powerful but not treated as infallible.

The real architecture is:

```text id="ag8j3b"
Open Model
   ↓
Structured Output Validation
   ↓
Semantic Validation
   ↓
Safety Validation
   ↓
Final Response
```

This should be part of the article's technical explanation.

---

# 27. Model Is Not the Safety Layer

A strong submission should communicate:

> "We don't ask the model to be our only safety mechanism."

Instead:

```text id="e6i7w9"
Model reasoning
+
Deterministic validation
+
Safety policy
+
Application controls
```

This demonstrates engineering maturity.

---

# 28. Product Analysis Architecture

The product checker should demonstrate a clear technical pipeline:

```text id="4z2y1m"
Product image
 ↓
Image validation
 ↓
OCR
 ↓
Field extraction
 ↓
Ingredient normalization
 ↓
Knowledge retrieval
 ↓
Open AI reasoning
 ↓
User-context comparison
 ↓
Compatibility assessment
 ↓
Safety validation
```

This is much stronger than describing the feature as simply:

> "Upload a skincare product and AI tells you if it is good."

---

# 29. Voice Architecture

Voice is an interface layer around the same core intelligence.

```text id="q7n3r5"
Speech
 ↓
STT
 ↓
SkinSense AI
 ↓
Validation
 ↓
Safety
 ↓
TTS
 ↓
Speech
```

The system does not maintain separate skincare logic for voice.

---

# 30. ElevenLabs Role

ElevenLabs is a voice-output component.

The intended role is:

```text id="3hr52j"
Open AI
→ reasoning

ElevenLabs
→ voice synthesis
```

This distinction should remain clear in the submission.

---

# 31. Best Use of ElevenLabs Category

The current challenge includes a **Best Use of ElevenLabs** category.

Its stated examples include giving an open-source agent a voice, transcribing audio for a local model, or generating narration for a demo.

SkinSense should enter this category only if ElevenLabs is genuinely used in the final project.

A valid implementation path is:

```text id="8sp8bq"
User asks by voice
 ↓
STT
 ↓
Open-weight AI
 ↓
Validated response
 ↓
ElevenLabs TTS
 ↓
Spoken response
```

Do not add ElevenLabs only for the purpose of entering the category.

---

# 32. Partner Category Integrity

A project can enter a partner category only when it genuinely uses that partner technology.

The challenge explicitly allows a project to enter multiple categories when it genuinely uses the technologies involved.

Therefore:

```text id="f2t6n8"
Used meaningfully
→ category eligible

Mentioned but not meaningfully used
→ do not claim category
```

---

# 33. Current Likely Partner Category

Based on the planned system, the strongest potential partner category is:

```text id="z8l6pu"
Best Use of ElevenLabs
```

because voice is an actual planned product feature.

The final submission should confirm the category only after ElevenLabs is working in the submitted build.

---

# 34. DevRelay Agent Session

The challenge page explicitly encourages builders to save and embed or link their agent session. It is optional, but intended to help judges understand the building process.

SkinSense should therefore preserve a meaningful **DevRelay agent session** showing the development process.

---

# 35. What the DevRelay Session Should Demonstrate

The session should show meaningful engineering work such as:

```text id="5w3k2v"
Repository setup
Architecture implementation
AI integration
Prompt development
Validation
Testing
Bug fixing
Feature refinement
Final verification
```

It should not be a meaningless transcript of repetitive code generation.

---

# 36. OpenCode + DevRelay Positioning

The development workflow can be described as:

```text id="x2k8b1"
Human product decisions
        ↓
Architecture / context docs
        ↓
OpenCode
        ↓
DevRelay development session
        ↓
Implementation
        ↓
Testing + review
```

The coding agent helped implement the system.

It did not invent the real friend problem.

---

# 37. Human vs AI Contribution

The submission should make the distinction clear.

### Human contribution

- identified the real friend problem,
- interviewed/asked the friend,
- defined product scope,
- designed architecture,
- defined safety boundaries,
- made product decisions,
- evaluated outputs,
- reviewed implementation.

### AI-assisted development

- code generation,
- refactoring,
- debugging assistance,
- implementation acceleration,
- documentation assistance.

This is consistent with the challenge's policy allowing AI use.

---

# 38. Challenge Judging Criteria

The official judging criteria are:

```text id="4e8f3k"
1. Writing Quality
2. Relevance to Prompt and Theme
3. Creativity
4. Technical Execution
5. Use of Partner Technology
```

Writing Quality carries the greatest weight.

This means the DEV article is not an afterthought.

It is part of the product submission.

---

# 39. Submission Writing Strategy

The article should answer six questions clearly:

```text id="a2z7gm"
Who was this built for?

What problem did they actually have?

What did you build?

How does it work?

Why is open AI important?

What did you learn / what did the person think?
```

---

# 40. Article Structure

The official submission template contains:

```text id="6q5x7a"
Front matter
What I Built
Demo
Code
How I Built It
Why Does Open Innovation Matter?
My Agent Session
Prize Categories
```

The official DEV template uses the tags:

```text
devchallenge
weekendchallenge
hf26challenge
```

and includes the above sections.

---

# 41. DEV Post Front Matter

Use the official template structure.

Conceptually:

```yaml id="n7d1q5"
---
title: <final title>
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---
```

Do not remove the required challenge tag.

---

# 42. Suggested Article Title

The title should communicate:

```text id="7e4b3r"
real friend
+
real problem
+
SkinSense
```

Potential direction:

> **I Built SkinSense for a Friend Who Was Tired of Guessing What Skincare Actually Fits**

The final title can be refined after the product is complete.

---

# 43. Article Opening

The opening should begin with the person and problem rather than technology.

Strong direction:

> My friend didn't have a skincare-information problem. They had a skincare-decision problem.

Then explain the actual confusion:

- skin type,
- products,
- ingredients,
- routine,
- whether something is working.

---

# 44. Avoid Generic AI Opening

Avoid starting with:

> "AI is transforming skincare."

or:

> "In today's rapidly changing world..."

These statements do not establish the challenge theme.

The first paragraph should immediately establish:

```text id="e2f6z8"
real person
real problem
real motivation
```

---

# 45. "What I Built" Section

Explain SkinSense in a user-oriented way.

Recommended structure:

```text id="r6t9m2"
SkinSense is a personalized skincare decision-support companion.

It helps the user:
- understand their skin context,
- build a simple routine,
- understand ingredients,
- check products,
- compare products with their existing routine,
- ask questions by voice.
```

Then explain why these capabilities directly map to the friend's confusion.

---

# 46. Demo Section

The demo section must contain either:

```text id="4j8p6s"
deployed application
```

or:

```text id="q0v1m3"
video demonstration
```

The official requirements allow a deployed link or video demo.

Prefer providing both when possible.

---

# 47. Demo Requirements

The demo should prove:

```text id="f7o8n1"
Profile
→ Routine
→ Product
→ Ingredients
→ Compatibility
→ Voice
```

The exact flow can be shorter if time requires it.

---

# 48. Demo Must Show Real Functionality

Avoid a presentation where:

```text id="6s0d9h"
UI is shown
but no real AI/backend processing happens
```

The core demonstrated workflow should genuinely execute.

---

# 49. Demo Recording Flow

Recommended final recording:

```text id="m4t5b9"
00:00 — Friend's problem

00:15 — SkinSense introduction

00:30 — Skin profile

01:00 — Build routine

01:40 — Check product

02:30 — Ingredient explanation

03:00 — Compatibility

03:30 — Voice interaction

04:00 — Open AI architecture

04:30 — Why open innovation matters

05:00 — Safety / limitations
```

The actual recording can be shorter.

The structure is more important than exact timing.

---

# 50. Demo Narrative

The demo should tell a single story.

Example:

```text id="q8m0n2"
"My friend is unsure what actually makes sense for their skin."

↓
"SkinSense first understands their context."

↓
"It builds a simple routine."

↓
"Now they are considering a product."

↓
"SkinSense reads the product and explains the ingredients."

↓
"It looks at the product alongside their current routine."

↓
"The user can ask the same question naturally by voice."

↓
"Under the hood, an open-weight model provides the reasoning."
```

---

# 51. Code Section

The Code section should provide the project's public repository.

It should contain:

- source code,
- README,
- setup instructions,
- architecture overview,
- model information,
- safety notes,
- license information for project code,
- relevant third-party credits.

---

# 52. Repository Quality

Before publication, verify:

```text id="b4d0t6"
README exists
Installation works
Environment example exists
No secrets
No private data
Source structure is understandable
Core code is present
Tests exist
AI integration is visible
Documentation exists
```

---

# 53. README Requirements

The README should explain:

```text id="7m5e2c"
What is SkinSense?
Who is it for?
What problem does it solve?
How does it work?
Tech stack
AI model
Architecture
How to run locally
Environment setup
How to test
Safety limitations
Open innovation rationale
Demo link
```

---

# 54. Repository Architecture Section

A simple diagram should be included.

Example:

```text id="0w5kfp"
Next.js
    ↓
FastAPI
    ↓
Application Services
    ↓
AI Orchestrator
    ↓
Open-Weight Model
    ↓
Validation + Safety
    ↓
Database
```

Then separately show:

```text id="9m4s2c"
Product Image
→ OCR
→ Ingredient Extraction
→ AI Analysis

Voice
→ STT
→ Shared AI
→ TTS
```

---

# 55. Model Transparency

The repository should state the final model actually used.

Include:

```text id="t4j9q0"
Model:
<actual model>

Runtime:
<actual runtime>

Inference:
<local / remote open-weight deployment>

License:
<actual model license>
```

Do not leave placeholder text in the final public submission.

---

# 56. Model License Verification

Before publishing:

```text id="f8z2y7"
[ ] Model license reviewed
[ ] Runtime license reviewed
[ ] Relevant dependencies reviewed
[ ] Attribution requirements understood
[ ] Repository complies with applicable terms
```

The project should not assume that every downloadable model has unrestricted licensing.

---

# 57. "How I Built It" Section

The technical article should explain the construction in layers.

Recommended structure:

```text id="o8k1y5"
Frontend
Backend
AI
Product Analysis
Voice
Data
Validation
Safety
```

This section should describe actual implementation rather than a hypothetical architecture.

---

# 58. Frontend Explanation

Describe:

```text id="e5h8u4"
Next.js
TypeScript
Tailwind CSS
Feature-oriented UI
Responsive design
```

Explain the major screens:

- onboarding,
- profile,
- dashboard,
- routine,
- product checker,
- ingredient explorer,
- voice,
- settings.

Only mention technologies that actually remain in the final implementation.

---

# 59. Backend Explanation

Describe:

```text id="k6n4m9"
FastAPI
API validation
Application services
Authentication
Authorization
Data persistence
AI orchestration
Provider adapters
```

The article should show that the model is inside a controlled application architecture rather than directly exposed to the browser.

---

# 60. AI Explanation

Describe:

```text id="5w9y6b"
Open-weight model
Context builder
Knowledge retrieval
Prompt system
Structured outputs
Validation
Safety
```

The strongest explanation is:

> The model does not receive an arbitrary database dump. SkinSense builds task-specific context and sends only relevant information.

---

# 61. AI Context Example

Show a simplified example:

```json id="d2b8x4"
{
  "skin_context": {
    "reported_skin_type": "...",
    "concerns": ["..."]
  },
  "routine_context": {
    "products": ["..."]
  },
  "product_context": {
    "ingredients": ["..."]
  }
}
```

This demonstrates personalization without exposing private implementation details.

---

# 62. Structured Output

Explain that the model is asked to produce structured results.

Conceptual:

```json id="p2y6w7"
{
  "summary": "...",
  "assessment": "...",
  "key_points": [],
  "limitations": [],
  "safety_state": "..."
}
```

Then explain:

```text id="b7k0j3"
AI output
 ↓
Schema validation
 ↓
Semantic validation
 ↓
Safety validation
```

---

# 63. Product Analysis Explanation

Show that product analysis is not:

```text id="x5k7v1"
image
→ LLM
→ answer
```

Instead:

```text id="m1j2f9"
image
→ OCR
→ extraction
→ normalization
→ product context
→ user context
→ AI
→ validation
```

This demonstrates stronger engineering.

---

# 64. Voice Explanation

Explain:

```text id="u4c0s7"
Whisper/faster-whisper candidate
→ transcript
→ same SkinSense AI pipeline
→ safety
→ ElevenLabs TTS
```

The exact STT implementation should be updated to whichever one is actually deployed.

---

# 65. Safety Explanation

The article should mention:

- no diagnosis,
- no treatment/prescription claims,
- no guaranteed product safety,
- uncertainty when information is missing,
- safety escalation for serious symptoms,
- deterministic safety checks around model output.

This shows that the AI is intentionally constrained.

---

# 66. Privacy Explanation

The article should explain:

```text id="0r2q9f"
User profile
+
routine
+
product history
+
voice
+
conversations
```

may be sensitive.

The architecture minimizes unnecessary sharing with external services and supports controlled/local inference where practical.

Do not make absolute privacy claims unless the deployed system actually guarantees them.

---

# 67. "Why Does Open Innovation Matter?" Section

This section should be significantly more detailed than a generic:

> "Open source is cool."

Recommended structure:

```text id="5z6n2k"
Privacy
Model Control
Customization
Experimentation
Cost / Infrastructure Control
Long-Term Independence
```

---

# 68. Strong Open Innovation Narrative

Recommended reasoning:

> I didn't choose an open model simply because the challenge asked for one. SkinSense deals with personal skincare context, voice, routines, and conversations, so controlling where that reasoning happens matters. Using an open-weight model gives me the option to run inference locally, evaluate different models, customize behavior, and keep the application architecture independent from a single proprietary AI provider.

This should be adapted to the actual deployed implementation.

---

# 69. Closed-vs-Open Comparison

A useful table can be included:

| Concern | Closed API-only approach | SkinSense open approach |
|---|---|---|
| Model choice | Provider-controlled | Project-controlled |
| Model swapping | Usually provider-dependent | Adapter-based |
| Local inference | Usually unavailable | Possible |
| Context control | Provider boundary | More controllable |
| Customization | API/prompt dependent | Broader model/runtime control |
| Cost model | Request-based provider cost | Can shift toward infrastructure cost |
| Architecture independence | Lower | Higher |

This comparison must not imply that open models are always better.

The correct claim is:

> **For this product, the open approach provides more architectural control in the areas that matter.**

---

# 70. Why Not Just Use a Closed LLM API?

The article should answer this directly.

Possible answer:

> A closed API could have produced a prototype faster, but SkinSense is specifically about personal context and long-term model control. Using an open-weight model means the reasoning layer can potentially move closer to the user's data, can be swapped as models improve, and can be evaluated independently of a single vendor.

Avoid claiming that a closed API would be incapable of building the product.

The point is that the open architecture gives different and useful control.

---

# 71. Agent Session Section

The `My Agent Session` section should contain the saved DevRelay session.

Use the appropriate DEV-supported embedding/link format once the actual session exists.

The official challenge page says the DevRelay session is optional but encouraged.

---

# 72. What the Agent Session Should Prove

The session should demonstrate that the project was genuinely built.

Useful evidence includes:

```text id="56q1v8"
Architecture decisions
Feature implementation
Prompt design
Debugging
Testing
Refinement
```

It should reveal the development process rather than simply dumping every intermediate command.

---

# 73. Privacy in Agent Session

Before publishing the session, verify that it contains no:

- API keys,
- passwords,
- private user data,
- private conversations,
- private voice transcripts,
- confidential system information,
- local credentials.

The session is a public artifact.

---

# 74. Prize Categories Section

The final DEV post should list only categories actually entered.

Possible structure:

```text id="k0r9y3"
## Prize Categories

- Best Use of ElevenLabs
```

Only include the category if the final project genuinely uses ElevenLabs in a meaningful way.

If no partner category is applicable, remove the section or state that the project is not entering a partner category.

---

# 75. Do Not Chase Irrelevant Partner Categories

Do not add technologies solely to make the article longer or enter additional prizes.

The project should remain product-driven.

Bad strategy:

```text id="8r3s4v"
Add random partner technology
→ create superficial feature
→ claim category
```

Preferred:

```text id="z5u7a2"
Real product requirement
→ partner technology genuinely solves it
→ category entry
```

---

# 76. Featured Categories

The current challenge page lists featured categories including:

- Render
- TabPFN
- Tinker
- Arduino
- DigitalOcean
- Gemma

and partner categories including:

- Backboard
- ElevenLabs
- Entire
- GitHub Copilot
- Mastra
- MongoDB Atlas
- Sentry Agent Tracing
- SerpApi
- Temporal
- Tiger Data.

SkinSense should use only categories supported by the actual final implementation.

---

# 77. Potential ElevenLabs Category Evidence

If entering **Best Use of ElevenLabs**, show:

```text id="8j4m6q"
User voice input
+
STT
+
Open-weight model
+
Validated response
+
ElevenLabs TTS
```

This gives the category judge a concrete feature to evaluate.

---

# 78. Submission Post Team Rule

If SkinSense is submitted as a team project:

- choose one person to publish,
- publish only one submission for the team,
- list teammate DEV handles in the post.

DEV states that teams can contain up to four people and asks teams to publish one submission and credit teammates by DEV username.

If SkinSense is an individual submission, do not add unnecessary team credits.

---

# 79. English Requirement

For prize eligibility, the challenge page says submissions need to be in English; non-English submissions can receive a completion badge but are not eligible for prizes under the current judging limitation.

Therefore:

> The final DEV submission should be written in clear English.

Technical diagrams can use concise labels.

---

# 80. Writing Quality Strategy

Because writing quality is weighted most heavily, the article must be treated as a primary deliverable.

The writing should be:

- personal,
- specific,
- technically credible,
- easy to follow,
- honest about limitations,
- focused on the friend's problem.

---

# 81. Avoid Overly Technical Opening

Do not open with:

```text id="e6m3z7"
Next.js + FastAPI + Qwen + OCR + STT + TTS...
```

Technology should come after the problem.

---

# 82. Avoid Excessive Marketing Language

Avoid phrases such as:

```text id="8v2j9k"
revolutionary
game-changing
world's first
perfect skincare
AI dermatologist
100% accurate
guaranteed safe
```

These weaken credibility.

---

# 83. Use Concrete Examples

A good article should show what the friend actually wondered.

Examples:

> "How do I even know my skin type?"

> "If two products have the same ingredient, why are they different?"

> "How do I know whether this product is actually helping?"

> "What does this acid actually do?"

These examples make the problem tangible.

---

# 84. User Feedback

The challenge gives bonus value to actually handing the project to the person and sharing what they said.

Therefore, when available and appropriately consented, the final article can include:

```text id="q2g8x4"
I gave SkinSense to the friend I built it for.

Their reaction:
"<actual quote or accurate paraphrase>"
```

Do not fabricate user feedback.

Do not invent a quote.

---

# 85. If User Feedback Is Negative

Negative feedback should not be hidden.

A statement such as:

> "They liked the product checker but found the routine too detailed."

can actually strengthen the story because it demonstrates real user testing.

Only report genuine feedback.

---

# 86. If User Has Not Tried It Yet

Do not pretend they did.

Use:

```text id="8k3g0c"
"The product was built around their feedback, and the current version is ready for them to try."
```

instead of inventing a reaction.

---

# 87. Real-World Impact

The article should explain the practical benefit in terms of reduced uncertainty.

Potential framing:

```text id="4m8z1q"
Before:
Search separately
→ compare brands
→ read ingredient lists
→ guess compatibility
→ trial and error

With SkinSense:
Profile
→ contextual explanation
→ product analysis
→ routine comparison
→ informed decision
```

The goal is not to promise perfect skincare outcomes.

---

# 88. Responsible AI Positioning

A strong closing message is:

> SkinSense is not trying to replace a dermatologist. It is trying to make everyday skincare decisions easier to understand before the user changes their routine or buys another product.

This reinforces the actual product boundaries.

---

# 89. Technical Credibility Checklist

The article should mention enough technical detail to prove that the system is real.

At minimum:

```text id="c4w6g8"
Frontend architecture
Backend architecture
Open-weight model
Model/runtime
Context building
Product OCR
Ingredient normalization
Structured output
Validation
Safety
Voice
Database/data layer
```

Do not turn the article into a giant code dump.

---

# 90. Visuals in DEV Article

Useful visuals include:

```text id="z7x0r2"
Architecture diagram
Product checker screenshot
Routine screen
Ingredient explanation
Voice interaction
AI pipeline
```

Visuals should support the story rather than replace it.

---

# 91. Architecture Diagram

The submission should preferably include one clear architecture graphic:

```text id="s4j5x6"
User
 ↓
Next.js
 ↓
FastAPI
 ↓
Application Services
 ↓
Personalization + Knowledge
 ↓
Open-Weight AI
 ↓
Validation + Safety
 ↓
Response
```

Additional branches:

```text id="r3f8m6"
Product → OCR → Analysis

Voice → STT → AI → TTS
```

---

# 92. Code Quality Before Submission

Run the full quality process:

```text id="4k1d9w"
Lint
 ↓
Type check
 ↓
Unit tests
 ↓
Integration tests
 ↓
AI evaluation
 ↓
Safety regression
 ↓
Security tests
 ↓
Production build
 ↓
E2E smoke test
```

This aligns with the testing strategy in `16_TESTING.md`.

---

# 93. Public Repository Security Review

Before publishing:

```text id="y7z3c0"
[ ] No API keys
[ ] No passwords
[ ] No database credentials
[ ] No private tokens
[ ] No real friend profile
[ ] No private voice recordings
[ ] No private conversations
[ ] No private images
[ ] No local secrets
```

---

# 94. Public Repository License

The repository should have a clear license for the project's own code if intended for open-source distribution.

Third-party model and dependency licenses should remain separately respected.

Do not claim that all project components share the same license when they do not.

---

# 95. Third-Party Credits

The README and DEV article should credit significant third-party components where appropriate.

Examples:

```text id="b6j8w2"
Open-weight model
OCR library/service
Whisper/faster-whisper
ElevenLabs
Next.js
FastAPI
```

Use actual dependencies from the final implementation.

---

# 96. Asset Attribution

Check:

- icons,
- illustrations,
- product images,
- fonts,
- datasets,
- model weights,
- third-party code.

Do not use assets with unclear rights in a public submission.

---

# 97. Originality

The project should clearly demonstrate meaningful original work.

The challenge encourages borrowing and improving on prior open-source work, but non-generic, non-trivial prior work must be credited.

Therefore:

```text id="t8w7r9"
Inspired by existing work
→ okay

Direct reuse of substantial code
→ credit and comply with license

Republishing someone else's project
→ not acceptable
```

---

# 98. Attribution Strategy

If existing open-source components materially influenced the project:

```text id="9k3m4v"
Name the component
+
Link/reference appropriately
+
Explain what SkinSense changed or added
```

Do not imply that third-party work was created by the SkinSense team.

---

# 99. Challenge Relevance

The final article should connect every major feature back to the challenge.

Example:

```text id="2r5z7k"
Build for a Friend
→ real friend problem

Open AI
→ central reasoning

Creativity
→ skincare decision-support approach

Technical Execution
→ OCR + personalization + AI + voice

Partner technology
→ ElevenLabs voice
```

---

# 100. Creativity Positioning

The creative idea is not:

> "AI skincare."

The stronger idea is:

> **A personal decision layer that helps one real person understand whether skincare information actually applies to their own context.**

This is more specific and better aligned with the user's real problem.

---

# 101. Technical Differentiation

The submission can highlight the combination of:

```text id="a8q4y3"
Personal context
+
Existing routine awareness
+
Ingredient interpretation
+
Product-image analysis
+
Compatibility reasoning
+
Open-weight AI
+
Voice
+
Safety validation
```

The value is in how these pieces work together.

---

# 102. Product Differentiation

SkinSense should not be positioned as another:

- ingredient dictionary,
- product review website,
- shopping assistant,
- generic chatbot.

The differentiator is:

> **contextual decision support around the user's existing skincare routine.**

---

# 103. Submission Story Arc

The complete article should follow:

```text id="m8z6y1"
REAL PERSON
    ↓
REAL CONFUSION
    ↓
ROOT PROBLEM
    ↓
SKINSENSE
    ↓
HOW IT WORKS
    ↓
OPEN AI
    ↓
WHY OPEN MATTERS
    ↓
DEMO
    ↓
SAFETY / LIMITATIONS
    ↓
WHAT I LEARNED
```

This should be the primary narrative.

---

# 104. Suggested "What I Learned" Section

The final article can conclude with lessons such as:

```text id="v4z5q7"
1. A real user problem is more useful than a generic feature idea.
2. AI needs application-level constraints.
3. Personalization requires explicit context modeling.
4. Open models create architectural choices, not automatic guarantees.
5. Uncertainty is a product feature when the system genuinely does not know.
```

Only claim lessons actually observed during development.

---

# 105. Avoid Overclaiming Accuracy

Do not publish:

> "SkinSense gives scientifically accurate personalized skincare advice in every case."

Prefer:

> "SkinSense combines structured product information, curated knowledge, user context, and open-model reasoning while explicitly surfacing uncertainty."

---

# 106. Avoid Medical Claims

Do not write:

> "SkinSense detects skin diseases."

or:

> "SkinSense diagnoses acne."

or:

> "SkinSense prescribes a treatment routine."

These are outside project scope.

---

# 107. Safety Disclaimer in Article

A short statement should be included:

> SkinSense is a skincare education and decision-support tool, not a medical diagnosis or treatment system. It does not replace professional medical advice, and it is designed to surface uncertainty rather than invent certainty.

This matches the system's safety architecture.

---

# 108. Submission Checklist — Product

```text id="1g4m7r"
[ ] SkinSense works
[ ] Friend problem is accurately represented
[ ] Core user journey is functional
[ ] AI is central
[ ] Product analysis works
[ ] Ingredient explanation works
[ ] Voice works or gracefully degrades
[ ] Safety boundaries work
```

---

# 109. Submission Checklist — Open AI

```text id="8f2w6k"
[ ] Open-weight model actually integrated
[ ] Model is central to product behavior
[ ] Model name is documented
[ ] Model license reviewed
[ ] Runtime documented
[ ] Inference architecture documented
[ ] Open innovation rationale written
[ ] Model output validation works
```

---

# 110. Submission Checklist — Friend Theme

```text id="3r8x1k"
[ ] One real friend is the inspiration
[ ] Actual problem was identified
[ ] Product maps to their problem
[ ] Story does not invent pain points
[ ] Friend privacy is protected
[ ] Real feedback is only included if genuine
```

---

# 111. Submission Checklist — DEV Post

```text id="u1m7p9"
[ ] DEV post created
[ ] Official submission template used
[ ] #devchallenge included
[ ] #weekendchallenge included
[ ] #hf26challenge included
[ ] What I Built section
[ ] Demo section
[ ] Code section
[ ] How I Built It section
[ ] Why Does Open Innovation Matter? section
[ ] Agent Session section if available
[ ] Prize Categories section if applicable
```

The required tags and template structure come from the official challenge page/template.

---

# 112. Submission Checklist — Demo

```text id="e6k2h4"
[ ] Demo URL works
OR
[ ] Video works

[ ] Profile shown
[ ] Routine shown
[ ] Product analysis shown
[ ] Ingredient explanation shown
[ ] Compatibility shown
[ ] Voice shown if implemented
[ ] Open AI role explained
[ ] No private information visible
```

---

# 113. Submission Checklist — Repository

```text id="j8c3p5"
[ ] Repository public
[ ] README complete
[ ] Setup works
[ ] .env.example included
[ ] No secrets
[ ] No private friend data
[ ] License included
[ ] Third-party credits included
[ ] Model information included
[ ] Tests included
[ ] Architecture documented
```

---

# 114. Submission Checklist — Agent Session

```text id="5g7t0p"
[ ] DevRelay session saved
[ ] Session is publicly shareable
[ ] No secrets
[ ] No private user information
[ ] Shows meaningful development
[ ] Link/embed tested
```

---

# 115. Final Submission Sequence

The actual publishing sequence should be:

```text id="a4j8r6"
1. Freeze core implementation
2. Run full tests
3. Deploy final build
4. Run smoke test
5. Verify demo
6. Verify repository
7. Remove/rotate secrets if necessary
8. Verify model/license details
9. Save DevRelay session
10. Write DEV article
11. Add required tags
12. Add demo link
13. Add code link
14. Add agent session
15. Add applicable prize categories
16. Review article
17. Submit before deadline
```

---

# 116. Final Article Review

Before publishing, read the DEV article as a judge would.

Ask:

```text id="0p5w3t"
Can I understand the friend problem in 30 seconds?

Can I see what was built?

Can I access the demo?

Can I find the code?

Can I tell that open AI is genuinely central?

Can I understand why open matters?

Can I see technical execution?

Can I understand what is creative here?

Does the article feel honest?
```

If any answer is "no", improve the article before submission.

---

# 117. Judge Perspective

The judge should be able to understand:

```text id="n6q4s8"
REAL FRIEND
"Someone actually had this problem."

↓

REAL PRODUCT
"The builder made something specifically for them."

↓

OPEN AI
"The open model is central."

↓

ENGINEERING
"This is more than a prompt wrapped in a UI."

↓

RESPONSIBLE AI
"They have safety and uncertainty boundaries."

↓

CREATIVITY
"This solves the problem in a thoughtful way."
```

---

# 118. Writing Quality Strategy

Because DEV weights writing quality most heavily, the final article should:

- start with a real story,
- use specific examples,
- explain technical decisions in plain English,
- avoid jargon without explanation,
- include visuals,
- show the product,
- explain why open AI matters,
- acknowledge limitations.



---

# 119. Technical Execution Strategy

To maximize technical credibility, show the actual architecture.

Strong technical evidence includes:

```text id="j1p6z8"
Open-weight model
+
AI adapter
+
Context builder
+
Knowledge layer
+
Structured schema
+
Validation
+
Safety
+
OCR
+
Voice
+
Persistence
```

Do not describe components that are not implemented.

---

# 120. Creativity Strategy

The product's creative point should be:

> Instead of giving another generic skincare chatbot, SkinSense starts with one person's real decision problems and builds a context-aware layer around their own skin information, routine, products, and questions.

This ties creativity directly to the friend requirement.

---

# 121. Relevance Strategy

Every major section should reinforce:

```text id="l2r5j9"
This was built for a friend.

This solves their actual confusion.

Open AI makes the core reasoning possible.

The system gives them more context for decisions.
```

Avoid drifting into unrelated skincare education.

---

# 122. Partner Technology Strategy

If using ElevenLabs, make the integration visible in both:

- the demo,
- the article.

Do not simply put "ElevenLabs" in a technology list.

Show how it participates in the user experience.

---

# 123. Submission Integrity

Never:

- fake usage,
- fake user feedback,
- fake agent sessions,
- fake AI model usage,
- fake deployment,
- fake screenshots,
- fake test results,
- fake partner integration.

The challenge submission should remain verifiable.

---

# 124. If a Feature Is Incomplete

Do not hide it.

Use language such as:

```text id="q8m2s4"
"Experimental"
"Planned"
"Not included in the current demo"
```

Only claim completed functionality.

---

# 125. If Local Inference Is Not Yet Deployed

Do not say:

> "Everything runs locally."

Instead say:

> "The architecture is designed to support local open-weight inference; the current demo uses <actual deployment method>."

Accuracy is more valuable than a stronger-sounding claim.

---

# 126. If ElevenLabs Is Used Only for Demo Narration

The project can still potentially discuss the usage accurately, but the category claim must match the challenge's actual category requirements.

Do not represent narration as the core voice interaction if it is not.

The final article should distinguish:

```text id="w9s3j2"
product voice feature
vs
demo narration
```

---

# 127. If Voice Becomes a Core Feature

Then the strongest story is:

```text id="g6k2r4"
Voice question
→ STT
→ Open-weight reasoning
→ Safety
→ ElevenLabs TTS
```

This demonstrates collaboration between open AI and partner technology without confusing their roles.

---

# 128. Final Submission Architecture

The public submission should be able to communicate this diagram:

```text id="v1n4q7"
                  FRIEND'S PROBLEM
                         │
                         ▼
              PERSONALIZED SKIN CONTEXT
                         │
                         ▼
                  ┌──────────────┐
                  │   SkinSense  │
                  └──────┬───────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
 Build Routine      Check Product      Ask by Voice
       │                 │                  │
       │                 ▼                  ▼
       │              OCR/STT          Transcript
       │                 │                  │
       └───────────┬─────┴──────────┬───────┘
                   │                │
                   ▼                ▼
              User Context     Knowledge
                   │                │
                   └───────┬────────┘
                           ▼
                    OPEN-WEIGHT AI
                           │
                           ▼
                Structured Reasoning
                           │
                           ▼
                 Validation + Safety
                           │
                           ▼
                   Better Decision
```

---

# 129. Final Challenge Narrative

The most important sentence in the submission should communicate:

> **I did not start by asking what AI app I could build. I started by asking what my friend was genuinely struggling with, then built SkinSense around that problem using an open AI architecture.**

This is the core of the Build for a Friend theme.

---

# 130. Final Product Narrative

The product should be described as:

> **SkinSense is a personalized skincare decision-support companion built for a real friend who found it difficult to determine what made sense for their own skin, routine, and product choices. It combines user context, product and ingredient understanding, an open-weight AI reasoning layer, validation, safety controls, and voice interaction to help turn confusing skincare information into a more understandable decision process.**

---

# 131. Final Open Innovation Narrative

The open-AI story should be described as:

> **The open approach matters because SkinSense deals with personal context and benefits from control over the reasoning layer. Using an open-weight model gives the project room to run inference locally where practical, choose and swap models, customize behavior, evaluate the system independently, and reduce dependence on a single proprietary AI provider.**

Only retain claims that match the final deployment.

---

# 132. Final Safety Narrative

The submission should communicate:

> **SkinSense is designed to support understanding, not diagnosis. When information is uncertain, it should say so. When a situation may require professional attention, normal recommendation flow should stop.**

This demonstrates responsible engineering.

---

# 133. Final Technical Narrative

The technical story should communicate:

```text id="f8b3p1"
The frontend collects context.

FastAPI orchestrates the application.

The personalization layer builds task-specific context.

The knowledge layer grounds the model.

The open-weight model performs reasoning.

Structured validation checks the output.

The safety layer controls what reaches the user.

OCR handles product text extraction.

Voice uses the same reasoning pipeline.

The data layer preserves user context and provenance.
```

---

# 134. Final Submission Quality Bar

The SkinSense submission should satisfy:

```text id="3m5n7x"
REAL
────────
Real friend
Real problem
Real motivation

OPEN
────────
Open AI at the core
Open innovation rationale
Model transparency

TECHNICAL
────────
Working architecture
Working AI
Working product analysis
Working validation
Working safety

CREATIVE
────────
Decision-support approach
Personal context
Existing-routine awareness

DEMOABLE
────────
Clear flow
Stable demo
Public code
Useful visuals

HONEST
────────
No fake claims
No fake feedback
No fake AI
No fake results
```

---

# 135. Final Submission Checklist

## Product

```text
[ ] Real friend problem accurately represented
[ ] Core user journey works
[ ] Skin profile works
[ ] Routine works
[ ] Product checker works
[ ] Ingredient explanation works
[ ] Compatibility works
[ ] Voice works or gracefully degrades
```

## Open AI

```text
[ ] Open-weight model is central
[ ] Actual model is documented
[ ] Actual runtime is documented
[ ] Model license reviewed
[ ] Open innovation explanation is strong
[ ] AI output is validated
[ ] AI safety boundaries are active
```

## Friend Theme

```text
[ ] One real person
[ ] One real problem
[ ] Concrete friend feedback
[ ] No invented story
[ ] Privacy protected
```

## Demo

```text
[ ] Demo URL or video
[ ] Demo starts reliably
[ ] Core user journey demonstrated
[ ] Open AI role visible
[ ] Voice visible if implemented
[ ] No private information visible
```

## Repository

```text
[ ] Public repository
[ ] README
[ ] Setup instructions
[ ] Architecture
[ ] Tests
[ ] Model information
[ ] License information
[ ] No secrets
[ ] No private user data
```

## DEV Article

```text
[ ] Official template
[ ] #devchallenge
[ ] #weekendchallenge
[ ] #hf26challenge
[ ] What I Built
[ ] Demo
[ ] Code
[ ] How I Built It
[ ] Why Does Open Innovation Matter?
[ ] Agent Session if available
[ ] Prize Categories if applicable
```

## Final Review

```text
[ ] English submission
[ ] Writing quality reviewed
[ ] Technical claims verified
[ ] Open-AI claims verified
[ ] User feedback verified
[ ] Partner claims verified
[ ] Screenshots verified
[ ] Demo verified
[ ] Deadline verified
```

---

# 136. Deadline Discipline

The official deadline is:

> **October 5, 2026 at 6:59 AM UTC / 12:29 PM IST.**

The submission should be completed before the deadline rather than relying on the final minutes.

Recommended internal target:

```text id="j7k2m8"
Final code freeze
→ before submission day

Demo verification
→ before article publication

DEV article review
→ before submission

Final submission
→ with buffer before official deadline
```

---

# 137. Final Post-Publication Verification

After publishing:

```text id="t6n9x3"
Open DEV article
 ↓
Check formatting
 ↓
Check demo links
 ↓
Check repository link
 ↓
Check agent-session link/embed
 ↓
Check tags
 ↓
Check images
 ↓
Check prize categories
```

A published article should be verified from the public view.

---

# 138. Final Project-to-Challenge Mapping

| Challenge Requirement | SkinSense Implementation |
|---|---|
| Build for a Friend | Built around a real friend's skincare decision problems |
| Real problem | Skin type, product choice, ingredients, routine confusion, trial-and-error |
| Open AI | Open-weight model at the core of reasoning |
| Core AI usage | Routine generation, product interpretation, ingredient explanation, compatibility, Q&A |
| Demo | Web application and/or video |
| Code | Public repository |
| Open innovation explanation | Privacy control, model choice, customization, local inference potential |
| Agent process | DevRelay session |
| Partner technology | ElevenLabs voice, only if genuinely implemented |

---

# 139. Final Positioning Statement

The strongest single positioning for the submission is:

> **SkinSense is an open-AI skincare decision companion built for one real friend who was tired of guessing what actually fits their skin and routine.**

Not:

> "An AI dermatologist."

Not:

> "An AI skincare recommendation engine."

Not:

> "A skincare shopping assistant."

The project is fundamentally about **understanding and decision support**.

---

# 140. Final Closing Message

The final DEV article should end with a concise reflection similar to:

> Building for a friend changed the way I approached AI. Instead of starting with a model and searching for a problem, I started with a person and a problem. That led to a much more focused product: a system that helps someone understand their own skincare decisions rather than simply generating more skincare information. Open AI made the architecture more controllable, more replaceable, and more interesting to build — but the reason SkinSense exists in the first place is much simpler: a real person was confused, and I wanted to build something that could actually help.

The final wording should reflect the actual experience of building and handing over the product.

---

# 141. Final Hacktoberfest Principle

The complete SkinSense submission should follow one rule:

> **Tell the truth about the person, the problem, the technology, the AI, the limitations, and the result.**

The project does not need to be enormous.

It needs to be:

```text
real,
specific,
useful,
technically credible,
open at its core,
and clearly built for someone who actually needed it.
```