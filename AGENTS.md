# SkinSense - AGENTS.md

## Project Identity
SkinSense is a personalized AI-powered skincare decision companion built for Hacktoberfest 2026 DEV Challenge: "Build for a Friend". It helps users understand their skin, build personalized routines, and evaluate products before buying - with open-source AI at its core.

## Core Principles (Non-Negotiable)
- **Safety First**: Never generate medical diagnoses, treatment guarantees, or medical claims. Follow 12_SAFETY.md strictly.
- **Explain, Don't Just Recommend**: Every meaningful recommendation must include reasoning ("why").
- **Grounded in User Context**: Personalize using user's actual context; distinguish user facts from AI interpretation.
- **Transparency**: Communicate known info, inference, missing info, uncertainty. Never fabricate confidence.
- **Open AI Core**: AI must meaningfully power the product. Use open-weight models, keep model-agnostic.
- **Privacy-Aware**: Minimize data collection, use task-specific context, treat uploads/transcripts as sensitive.
- **Problem-Led**: Solve the real friend's validated problem, not add "cool AI features".

## Source-of-Truth Hierarchy
When documentation conflicts, follow this order:
1. User-validated facts
2. docs/02_USER_PROBLEM.md
3. docs/03_PRODUCT_REQUIREMENTS.md
4. docs/12_SAFETY.md
5. docs/06_SKINCARE_DOMAIN.md
6. docs/07_AI_ARCHITECTURE.md
7. docs/14_SYSTEM_ARCHITECTURE.md
8. Other implementation docs
9. Existing code
10. Developer assumptions

## Architecture
- **Frontend**: Next.js + TypeScript + Tailwind CSS (feature-oriented, composes features)
- **Backend**: FastAPI + Python (API boundary, validation, orchestration, safety)
- **AI**: Open-weight model via adapter (Ollama/LM Studio), structured outputs, validation separate from generation
- **DB**: SQLite (single file, easy demo; can migrate to Postgres later)
- **OCR**: Tesseract (local, no external API)
- **STT**: Browser Web Speech API or Whisper (local preferred)
- **TTS**: ElevenLabs (external API, optional - disable if no key)
- **Safety**: Deterministic validation + safety checks at API boundary

## Development Rules
- Prefer one complete feature end-to-end (frontend + backend + AI + validation + storage + tests) over vertical slices
- Validate inputs at API boundary; never trust AI output without schema validation
- Keep AI reasoning separate from safety enforcement (deterministic)
- Never expose raw chain-of-thought; show user-facing explanations
- Context to AI must be task-specific (minimize)
- Don't modify unrelated subsystems
- Use smallest relevant docs for each task (see docs/17_DEVELOPMENT.md)
- Add tests for new features
- Don't add comments unless explicitly asked

## Milestone 1 (Foundation) - Current
1. Project foundation (this structure) ✓
2. Backend foundation (FastAPI app, config, health, DB setup)
3. Frontend foundation (Next.js app, basic layout, routing)
4. Environment config (.env.example)
5. Basic API wiring between frontend/backend
