# SkinSense — Voice System

## 1. Purpose

This document defines the voice interaction system for SkinSense.

The purpose of voice interaction is to allow the user to communicate with SkinSense naturally without depending entirely on typing or traditional forms.

The voice system should support interactions such as:

> "Meri skin aaj bohot dry lag rahi hai."

> "Ye serum mere current routine ke saath theek rahega?"

> "Niacinamide kya karta hai?"

> "Mujhe simple skincare routine chahiye."

Voice is an **interface layer over the existing SkinSense intelligence**.

The voice system must not become a separate recommendation or reasoning engine.

---

# 2. Core Voice Principle

The central architecture is:

```text
User Speech
    ↓
Speech-to-Text
    ↓
Text Input
    ↓
Normal SkinSense AI Pipeline
    ↓
Validated Response
    ↓
ElevenLabs Text-to-Speech
    ↓
Spoken Response
```

The same AI reasoning used for typed questions should be used for voice questions wherever possible.

---

# 3. Voice System Responsibilities

The voice system is responsible for:

- capturing user speech,
- converting speech to text,
- handling supported languages,
- detecting basic voice interaction states,
- passing text into the normal SkinSense pipeline,
- converting validated responses to speech,
- managing playback,
- handling voice failures,
- and providing text fallback.

The voice system is not responsible for:

- skincare reasoning,
- product compatibility decisions,
- medical safety decisions,
- user authorization,
- database permissions,
- or independent recommendations.

---

# 4. Voice Architecture

```text
                     USER
                       │
                       ▼
                ┌──────────────┐
                │ Microphone   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Speech-to-   │
                │ Text         │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Input        │
                │ Processing   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ SkinSense    │
                │ AI Pipeline  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Validation   │
                │ + Safety     │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Response     │
                │ Text         │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ ElevenLabs   │
                │ TTS          │
                └──────┬───────┘
                       │
                       ▼
                  SPOKEN AUDIO
```

---

# 5. Voice Input

The user should be able to start voice input from supported parts of the application.

Potential entry points include:

- Ask SkinSense,
- product analysis follow-up,
- routine questions,
- ingredient questions,
- contextual questions.

The voice interaction should feel like an extension of the current task.

---

# 6. Voice Interaction States

The system should explicitly track the voice interaction state.

Conceptual states:

```text
IDLE
LISTENING
STOPPING
TRANSCRIBING
PROCESSING
RESPONSE_READY
SPEAKING
COMPLETED
ERROR
```

These states should be reflected appropriately in the UI.

---

# 7. Idle State

The system is waiting for the user.

Expected UI behavior:

- microphone control available,
- no recording indicator,
- no unnecessary animation.

Primary action:

> Start speaking

---

# 8. Listening State

When recording begins:

```text
IDLE
  ↓
LISTENING
```

The interface should clearly communicate:

> SkinSense is listening.

The user must have a clear way to stop recording.

The system should not silently record indefinitely.

---

# 9. Recording Cancellation

The user should be able to cancel a recording before processing it.

Flow:

```text
LISTENING
   ↓
Cancel
   ↓
IDLE
```

Cancelled audio should not be interpreted as a completed user request.

---

# 10. Stop Recording

When the user finishes speaking:

```text
LISTENING
   ↓
STOPPING
   ↓
TRANSCRIBING
```

The system should provide feedback that recording has ended and processing has started.

---

# 11. Speech-to-Text

The speech-to-text layer converts audio into text.

The project should prefer an **open-source speech recognition component** where practical.

A Whisper-compatible implementation may be used depending on deployment and hardware constraints.

The final implementation should be selected based on:

- language support,
- latency,
- local inference feasibility,
- hardware requirements,
- accuracy,
- and deployment constraints.

The exact implementation does not belong in this document until selected.

---

# 12. Speech-to-Text Responsibility Boundary

Speech-to-text should only answer:

> **"What did the user say?"**

It should not answer:

> **"What skincare advice should the user receive?"**

For example:

```text
Audio:
"Meri skin oily hai aur ye serum use karna hai"

STT:
"Meri skin oily hai aur ye serum use karna hai"
```

Interpretation happens later.

---

# 13. Transcription Quality

The system should account for possible STT errors such as:

- incorrect ingredient names,
- mixed languages,
- missing words,
- pronunciation differences,
- background noise,
- incomplete sentences.

The system should not assume transcription is always correct.

---

# 14. Ingredient Names in Speech

Ingredient names can be difficult for speech recognition.

For example:

- Niacinamide
- Salicylic acid
- Hyaluronic acid
- Azelaic acid

If an ingredient transcription is ambiguous and materially affects the answer, the system should clarify rather than silently changing it.

Example:

> "Did you mean salicylic acid?"

---

# 15. Mixed-Language Speech

The user may naturally mix languages:

> "Meri skin oily hai but winter mein bohot dry ho jati hai."

The voice system should preserve the semantic meaning of such speech.

The downstream AI should receive the best available transcription without forcing unnecessary translation.

---

# 16. Language Preservation

The output language should generally follow the user's active language or explicit preference.

Examples:

```text
English input
→ English response

Hindi input
→ Hindi response

Hinglish input
→ Natural Hinglish response
```

Marathi and other supported languages may be added based on the speech/model capabilities.

---

# 17. Voice Intent

After speech-to-text, the text follows the same intent/context processing as typed input.

Potential intent categories include:

```text
SKIN_PROFILE
ROUTINE
PRODUCT_CHECK
INGREDIENT_INFO
PRODUCT_COMPATIBILITY
PROGRESS
GENERAL_SKINCARE_QUESTION
SAFETY_RELATED
UNKNOWN
```

These are conceptual categories and may evolve with implementation.

---

# 18. Voice Is Not a Separate Conversation Engine

Do not build:

```text
Text Q&A system
+
Voice Q&A system
```

as two separate reasoning implementations.

Instead:

```text
Text ───────────┐
                ├──→ Shared SkinSense AI Pipeline
Voice → STT ────┘
```

This keeps behavior consistent.

---

# 19. Context Preservation

Voice requests should preserve relevant context.

Example:

User:

> "Check this serum."

System analyzes it.

User:

> "Can I use it at night?"

The system should understand that:

> "it"

refers to the recently active serum when the context is unambiguous.

---

# 20. Ambiguous Voice References

If multiple possible references exist:

```text
Product A
Product B
Product C
```

and the user says:

> "Can I use it at night?"

the system should not guess.

It should ask:

> "Which product are you referring to?"

---

# 21. Voice and Current Product Context

If a user is currently viewing a product analysis screen and asks a voice question, the current product may be included as context.

Example:

```text
Product Analysis Screen
        +
Voice Question
        ↓
Contextual AI Request
```

This reduces unnecessary repetition.

---

# 22. Voice and User Profile

When the question needs personalization, relevant profile context should be supplied.

Example:

> "Ye serum mere liye theek hai?"

The AI may need:

- user's skin context,
- concerns,
- current routine,
- relevant sensitivity information,
- product information.

The complete profile should not automatically be included for every voice request.

---

# 23. Voice and Product Analysis

Voice may operate as a follow-up interface after product analysis.

Example:

```text
User uploads product
        ↓
Product analyzed
        ↓
User asks by voice:
"Isme niacinamide kyu hai?"
        ↓
Ingredient explanation
```

The system should reuse the active product context.

---

# 24. Voice and Routine

The user may ask:

> "Aaj meri routine kya hai?"

The system should retrieve the user's current saved routine.

Another example:

> "Why did you add this serum?"

The AI should explain the currently relevant routine step.

---

# 25. Voice and Ingredient Explorer

The user may ask:

> "What does glycerin do?"

or:

> "What does this ingredient do?"

When a product is active, "this ingredient" may refer to the currently selected ingredient.

If ambiguous, ask.

---

# 26. Voice and Progress

The user may add an observation:

> "Aaj skin thodi less oily lag rahi hai."

This can be converted into a journal observation if the product explicitly supports that action.

A conversational statement should not automatically become permanent profile information.

---

# 27. Voice Memory Rule

A voice statement should not automatically change the user's long-term profile merely because it was spoken.

For example:

> "Aaj skin dry lag rahi hai."

should generally be treated as a current observation unless the user explicitly indicates it is a persistent pattern or confirms a profile change.

---

# 28. Validated Response Before TTS

ElevenLabs should receive only **validated user-facing response text**.

Flow:

```text
AI Generated Output
       ↓
Schema Validation
       ↓
Semantic Validation
       ↓
Safety Validation
       ↓
Voice Formatting
       ↓
ElevenLabs
```

Raw model output must not be sent directly to voice synthesis.

---

# 29. ElevenLabs Responsibility

ElevenLabs is responsible for:

- converting approved text into spoken audio,
- providing natural voice output,
- playback-ready audio generation.

It is not responsible for:

- determining skincare suitability,
- generating medical guidance,
- interpreting ingredients,
- changing AI conclusions,
- or overriding safety rules.

---

# 30. ElevenLabs Voice Text

Voice-specific formatting may simplify the validated text while preserving its meaning.

Example:

Text response:

> "This product contains niacinamide. Based on your current routine, it may provide overlapping functionality..."

Voice response may be:

> "This product contains niacinamide. Since you already use a similar product, adding it may be unnecessary."

The meaning must remain consistent.

---

# 31. Voice Response Compression

Spoken responses should generally be shorter than detailed visual responses.

Voice is harder to scan than text.

Therefore:

```text
Text:
Detailed structured answer

Voice:
Concise summary
```

Important information must remain available on screen.

---

# 32. Voice Response Safety

Voice formatting must never remove an important safety limitation.

If the text says:

> "I can't determine the cause of this reaction."

the spoken response must preserve that limitation.

Voice shortening must not turn:

> "may"

into:

> "will."

---

# 33. Voice Tone

The voice experience should feel:

- calm,
- friendly,
- conversational,
- non-judgmental,
- informative.

Avoid:

- exaggerated excitement,
- sales language,
- fear,
- artificial medical authority.

---

# 34. Voice Personalization

Users may eventually select voice preferences where supported.

Possible preferences:

- voice enabled/disabled,
- language,
- voice selection,
- response verbosity.

These settings affect presentation, not skincare reasoning.

---

# 35. Voice Output Playback

The UI should support:

- play,
- pause,
- stop,
- replay where appropriate.

Text should remain visible while audio is playing.

---

# 36. Voice Interruption

If the user starts a new request while the previous response is speaking:

```text
SPEAKING
   ↓
New Interaction
   ↓
Stop / Interrupt Previous Audio
   ↓
Listen
```

The exact behavior may depend on implementation capabilities.

The user should not hear two responses simultaneously.

---

# 37. Repeated Playback

The user should be able to replay a response where practical without creating a new AI request.

Replay should reuse the existing validated response/audio when safe to do so.

---

# 38. Voice Loading

During speech synthesis:

```text
Validated response
        ↓
Generating voice
        ↓
Audio ready
```

The UI should show that voice is being prepared.

The text response should not be hidden while waiting for audio.

---

# 39. Text Fallback

If voice output fails:

```text
AI Response
     ↓
ElevenLabs failure
     ↓
Show text normally
```

The user should still receive the answer.

---

# 40. Speech Recognition Failure

If STT fails:

```text
Audio
 ↓
STT failure
 ↓
Explain
 ↓
Try Again
 OR
Type Instead
```

The system should not fabricate transcription.

---

# 41. No Speech Detected

If the user records silence:

> "I didn't catch anything. Try speaking again."

Provide:

> Try Again

---

# 42. Unclear Speech

If the transcription is too uncertain for a meaningful response:

> "I couldn't quite understand the question."

Provide the option to:

- speak again,
- edit the transcript,
- type the question.

---

# 43. Transcript Editing

Where practical, the UI may show the transcribed text before submitting it for AI processing.

Example:

```text
You said:
"Meri skin oli hai..."

[Edit]
[Ask]
```

This is useful when ingredient names or skincare terms are incorrectly transcribed.

---

# 44. Auto-Submission vs Confirmation

The implementation may choose between:

### Automatic processing

Speech ends → transcript immediately sent.

### Confirm-before-send

Speech ends → transcript shown → user confirms.

The choice should be based on usability testing.

For important or ambiguous requests, showing the transcript can improve user control.

---

# 45. Voice Permission Flow

If microphone access has not been granted:

```text
Tap microphone
     ↓
Explain why microphone access is needed
     ↓
Request permission
```

If permission is denied:

```text
Permission denied
     ↓
Use text input
```

The app must remain usable without microphone access.

---

# 46. Camera and Voice Separation

Product image capture and voice interaction are separate permissions.

Do not request microphone access merely because the user wants to upload a product image.

Request permissions only when necessary.

---

# 47. Voice Privacy

Voice data should be treated as potentially sensitive.

The system should define:

- whether audio is stored,
- whether only transcripts are retained,
- how long audio is retained,
- whether audio leaves the device,
- what third-party services receive,
- and how users can delete stored data.

Exact policy belongs in:

`15_SECURITY_PRIVACY.md`

---

# 48. ElevenLabs Data Boundary

When ElevenLabs is used, only the text necessary for speech synthesis should be sent.

Do not send:

- complete user profiles,
- unrelated conversations,
- private journal history,
- irrelevant product data.

ElevenLabs should receive the **approved response text**, not the internal AI context.

---

# 49. Open AI and Voice

The core reasoning remains open-source/open-weight.

```text
Voice
 ↓
STT
 ↓
Open AI
 ↓
Validated Answer
 ↓
ElevenLabs
```

This separation is important to the Hacktoberfest project story.

---

# 50. Offline Voice Strategy

Where practical, speech recognition should support local inference.

Potential architecture:

```text
Local Audio
 ↓
Local STT
 ↓
Local Open AI
 ↓
Local Response
```

ElevenLabs voice output may still require external connectivity depending on its deployment model.

Therefore, the project should not claim complete offline voice operation unless it is actually implemented and tested.

---

# 51. Fully Offline Fallback

A future fully local voice mode may use:

```text
Local STT
+
Local Open Model
+
Local TTS
```

This is a possible future architecture, not an MVP requirement.

---

# 52. Voice and Connectivity

The system should distinguish:

### Network unavailable

If the selected STT/AI/TTS component requires network access:

> show an appropriate unavailable state.

### Local inference available

Continue using local components where possible.

### Partial connectivity

For example:

```text
Local AI works
ElevenLabs unavailable
```

The response should remain available as text.

---

# 53. Voice Error Hierarchy

Voice errors should be handled in layers:

```text
Microphone
   ↓
Speech recognition
   ↓
AI processing
   ↓
Validation
   ↓
TTS
```

A failure in one layer should not unnecessarily break downstream functionality.

Example:

```text
TTS failure
≠
AI failure
```

---

# 54. Voice Request Idempotency

Repeated taps or retries should not unintentionally create duplicate actions.

For example, a voice-triggered journal save must not create duplicate entries because the user tapped retry twice.

Application-level idempotency should be used where voice actions modify data.

---

# 55. Voice and Data-Modifying Actions

If voice interaction eventually triggers a persistent action:

> "Save this product as one I'm considering."

the application should confirm or safely interpret the intent before modifying persistent user data.

The model should not be treated as an authorization mechanism.

---

# 56. Voice Command vs Conversation

SkinSense should distinguish between:

### Conversational question

> "What does niacinamide do?"

and:

### Action request

> "Save this serum to my considered products."

Action requests require application-level validation.

---

# 57. Voice Commands

Possible future commands include:

- save product,
- update routine,
- add journal entry,
- remove an item,
- update preference.

These should only be enabled when explicitly supported by product requirements.

The MVP may keep voice primarily conversational.

---

# 58. Voice Context Expiration

Active conversational context should not remain indefinitely.

For example, if the user discusses Product A and later opens Product B, the active context should change accordingly.

The system should avoid accidentally applying Product A context to Product B questions.

---

# 59. Voice and Navigation

Voice input should not unexpectedly navigate the application unless an explicit action-command capability has been implemented.

A normal statement such as:

> "What is salicylic acid?"

should produce information rather than changing screens unnecessarily.

---

# 60. Voice Accessibility

Voice should complement, not replace, the visual interface.

Every major voice function should have an equivalent text interaction.

The product must remain usable with:

- microphone denied,
- voice disabled,
- TTS unavailable,
- hearing limitations,
- noisy environments.

---

# 61. Voice UI Feedback

Every voice state change should provide visual feedback.

Examples:

```text
Listening
Processing
Speaking
```

Do not rely on audio-only indicators.

---

# 62. Voice Response Length

Recommended conceptual behavior:

### Simple question

Short spoken response.

### Product analysis

Short spoken summary + detailed on-screen result.

### Routine

Spoken overview + full routine on screen.

### Safety-related response

Do not compress away important boundaries.

---

# 63. Voice Formatting Rules

Before sending validated text to ElevenLabs:

- shorten unnecessary headings,
- remove markdown,
- remove table formatting,
- preserve important terms,
- preserve safety statements,
- preserve uncertainty.

The voice formatter must not introduce new facts.

---

# 64. Pronunciation Considerations

Ingredient and brand names may be unfamiliar to speech synthesis.

Where supported, pronunciation configuration may be used.

However, pronunciation optimization must not alter the actual written ingredient identity shown to the user.

---

# 65. Voice Language Consistency

If the user speaks Hinglish, the system may answer naturally in Hinglish.

If the user switches to English, the system should be able to follow the current language context.

The system should not produce unnatural language switching unless appropriate to the user's input.

---

# 66. Voice Safety

The same safety constraints apply to voice and text.

```text
Voice Input
 ↓
Same Safety Rules
 ↓
Same Validated Meaning
 ↓
Voice Output
```

There must not be a weaker safety policy for voice interactions.

---

# 67. Voice Prompt Boundary

Voice-specific prompts should only transform or interpret voice-related information.

They must not weaken:

- global AI instructions,
- skincare domain rules,
- product analysis rules,
- personalization rules,
- safety constraints.

Detailed prompt behavior belongs in:

`08_AI_PROMPTS.md`

---

# 68. Voice Observability

The system may log non-sensitive metadata such as:

- voice request type,
- processing duration,
- STT success/failure,
- TTS success/failure,
- model latency.

Avoid storing raw audio or full sensitive transcripts unless explicitly required and appropriately protected.

---

# 69. Voice Performance

Voice interaction has multiple latency stages:

```text
Recording
+
STT
+
AI
+
Validation
+
TTS
```

The UX should therefore:

- show processing state,
- avoid unexplained pauses,
- provide text as soon as the validated answer is ready,
- generate voice output without blocking useful visual information.

---

# 70. Voice Caching

If appropriate, previously generated validated responses/audio may be reused.

Caching must respect:

- user privacy,
- context validity,
- response freshness,
- and data-deletion requirements.

Do not reuse personalized voice output across users.

---

# 71. Voice and Personalization

A spoken response must reflect the same user-specific context as the text response.

Example:

```text
User profile
+
Current product
+
Question
↓
Personalized AI answer
↓
Text
+
Voice
```

Text and voice should represent the same semantic answer.

---

# 72. Voice Consistency

If the UI says:

> "Consider carefully"

the spoken response should not say:

> "This is totally fine."

This is a critical consistency requirement.

---

# 73. Voice Result Integrity

The TTS layer must not modify the meaning of validated content.

If formatting or shortening is required, the transformation should preserve:

- assessment,
- uncertainty,
- safety note,
- next action.

---

# 74. Voice Testing

Voice testing should cover:

### Input

- clear English,
- Hindi,
- Hinglish,
- mixed-language speech,
- ingredient names,
- noisy environments,
- pauses,
- incomplete speech.

### Processing

- correct transcription,
- intent preservation,
- context preservation,
- ambiguity handling.

### Output

- correct response,
- correct language,
- semantic consistency,
- natural voice playback.

### Failure

- microphone denied,
- STT failure,
- AI failure,
- TTS failure,
- network failure.

Detailed testing belongs in:

`16_TESTING.md`

---

# 75. Voice Acceptance Criteria

The voice system is acceptable when:

- a user can start and stop recording clearly,
- speech can be converted to usable text,
- the text enters the normal SkinSense reasoning pipeline,
- relevant context is preserved,
- ambiguity is handled safely,
- validated output is passed to ElevenLabs,
- spoken output preserves meaning,
- text fallback always remains available,
- voice failure does not destroy the underlying response,
- and safety behavior is consistent with text interactions.

---

# 76. Voice MVP

The MVP voice experience should prioritize:

```text
Speak
 ↓
STT
 ↓
SkinSense AI
 ↓
Validated Text Response
 ↓
ElevenLabs Voice
```

The MVP does not require complex voice commands, continuous listening, wake words, or autonomous voice agents.

---

# 77. Voice Non-Goals

Do not build in the MVP:

- always-on microphone listening,
- background recording,
- wake-word assistant,
- autonomous phone calls,
- autonomous purchasing,
- autonomous routine modifications,
- voice-based diagnosis,
- voice-only interface,
- independent voice reasoning model.

---

# 78. Definition of Done

The voice system is considered complete for the MVP when:

- voice input can be captured,
- speech can be transcribed,
- the transcription enters the shared AI pipeline,
- contextual questions work,
- validated responses can be spoken through ElevenLabs,
- text remains available,
- errors are recoverable,
- user context is preserved appropriately,
- safety rules remain identical to text interactions,
- and voice does not introduce a second independent reasoning system.

---

# 79. Source-of-Truth Boundaries

Use this document for:

- voice architecture,
- voice states,
- speech-to-text behavior,
- voice context,
- ElevenLabs responsibility,
- voice output,
- playback,
- interruptions,
- failures,
- fallbacks,
- voice privacy principles,
- voice acceptance criteria.

Use:

- `07_AI_ARCHITECTURE.md` → core AI pipeline
- `08_AI_PROMPTS.md` → voice-related prompting
- `09_PRODUCT_ANALYSIS.md` → product context
- `10_PERSONALIZATION.md` → user context
- `12_SAFETY.md` → safety
- `13_DATA_MODEL.md` → voice/journal persistence
- `14_SYSTEM_ARCHITECTURE.md` → technical implementation
- `15_SECURITY_PRIVACY.md` → privacy/security
- `16_TESTING.md` → voice testing

---

# 80. Final Voice Principle

Voice exists to make SkinSense easier to use.

The correct architecture is:

```text
Talk naturally
     ↓
Understand accurately
     ↓
Reason using open AI
     ↓
Validate safely
     ↓
Respond clearly
     ↓
Speak naturally
```

**The voice should make the intelligence more accessible, not replace the intelligence.**