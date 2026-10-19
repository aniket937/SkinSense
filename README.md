# SkinSense

A personalized AI-powered skincare decision companion built for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend**.

## What is SkinSense?

SkinSense helps users understand their skin, build personalized routines, and evaluate skincare products before buying - with open-source/open-weight AI at its core. It's designed to reduce uncertainty and trial-and-error by connecting the user's actual context with structured skincare knowledge.

## Core Features (MVP)

- **Understand My Skin** - Guided onboarding to build a personal skincare profile
- **Build My Routine** - Personalized morning/evening routine with explanations ("why" for each step)
- **Check This Product** - Analyze products via image or ingredient list to assess fit with your routine
- **Ingredient Explainer** - Plain-language explanations of skincare ingredients
- **Product-to-Routine Compatibility** - Understand overlaps and considerations
- **Voice Interaction** - Ask questions naturally via speech (optional)

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: SQLite
- **AI**: Open-weight models (Qwen3) via Ollama/LM Studio
- **OCR**: Tesseract
- **Voice**: Browser Web Speech API (STT) + ElevenLabs (TTS, optional)

## Getting Started

### Prerequisites

1. **Node.js** (v18+)
2. **Python** (3.10+)
3. **Ollama** ([ollama.com/download](https://ollama.com/download)) - for local AI
4. **Tesseract OCR** ([tesseract-ocr.github.io](https://tesseract-ocr.github.io/tessdoc/Installation.html)) - for product image analysis

### Setup

#### 1. Clone and Configure

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

#### 2. Start Ollama and Pull Model

```bash
ollama pull qwen3:8b
```

#### 3. Backend

Linux / macOS:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Windows PowerShell (use the `py` launcher if `python`/`python3` is unavailable):

```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload
```

Backend runs at: http://localhost:8000 (API docs at http://localhost:8000/docs)

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## Architecture

SkinSense follows a safety-first architecture with deterministic validation separate from AI reasoning. All AI outputs are validated against schemas, and safety rules are enforced at the API boundary.

## Development

See [docs/17_DEVELOPMENT.md](docs/17_DEVELOPMENT.md) for detailed development guidelines. Also see [AGENTS.md](AGENTS.md) for agent-specific instructions.

Run tests:

```bash
cd backend && pytest tests -q
pytest ai/tests -q
```

## Safety & Boundaries

SkinSense is a **skincare education and decision-support companion** - not a medical diagnosis tool or dermatologist replacement. See [docs/12_SAFETY.md](docs/12_SAFETY.md) for full safety guidelines.

## Hacktoberfest 2026

This project is built for the Hacktoberfest 2026 DEV Weekend Challenge: "Build for a Friend", solving a real friend's skincare decision-making challenges with open-source AI at its core.

---

Built with ❤️ using open-source tools
