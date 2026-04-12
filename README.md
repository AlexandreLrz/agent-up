# AgentUp — AI Call Centre Training

A Next.js web app that helps call centre agents improve through short daily AI-powered training sessions, with both text chat and live voice call modes.

## Features

- **Daily Training** — 3 practice scenarios per day, AI plays the customer, up to 5 turns each
- **Chat & Call modes** — Text chat (Claude) or live voice call (Deepgram Voice Agent)
- **Instant AI Scoring** — 0–100 score across Empathy, Accuracy, Resolution & Professionalism
- **My Cases** — Browse all cases, filter by topic/channel/difficulty, create custom ones
- **Dashboard** — Score over time, by topic, by channel, streak & session history
- **6 default cases** — Billing, Technical, Retention, De-escalation, Account Access

## Tech Stack

- **Next.js 14** (App Router) with a **custom Node.js server** (`server.ts`)
- **TypeScript**
- **Tailwind CSS**
- **Deepgram Voice Agent API** — live voice call mode (WebSocket proxy)
- **OpenAI GPT-4o-mini** — LLM backend for Deepgram voice agent
- **Claude (claude-sonnet-4-20250514)** — chat mode & scoring
- **Recharts** — dashboard charts
- **localStorage** — persistence (no database or auth needed)

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo>
cd agentup
npm install
```

### 2. Set up environment variables

Create a `.env` file at the root:

```
DEEPGRAM_API_KEY=...
OPENAI_API_KEY=...
```

- Deepgram key: [console.deepgram.com](https://console.deepgram.com)
- OpenAI key: [platform.openai.com](https://platform.openai.com) (used by Deepgram Voice Agent as LLM backend)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app uses a custom Node.js WebSocket server (`server.ts`) instead of the default Next.js dev server. `npm run dev` runs `tsx server.ts` which boots both Next.js and the WebSocket proxy together.

## Deployment

Vercel is **not supported** — the custom WebSocket server requires a persistent Node.js process.

Recommended: **Railway**

1. Push your repo to GitHub
2. Create a new project on [railway.app](https://railway.app) and connect your repo
3. Add environment variables in your service's **Variables** tab:
   - `DEEPGRAM_API_KEY`
   - `OPENAI_API_KEY`
4. Railway will auto-deploy on every push to `main`

Other supported platforms: **Render**, **Fly.io**, any VPS (with PM2 + Nginx).

## Project Structure

```
agentup/
├── server.ts                    # Custom Node.js server — Next.js + WebSocket proxy to Deepgram
├── voiceProxy.ts                # WebSocket proxy logic (browser ↔ Deepgram Voice Agent)
├── buildDeepgramSettings.ts     # Deepgram agent config builder (scenario, difficulty, LLM)
├── app/
│   ├── page.tsx                 # Daily Training (home)
│   ├── cases/page.tsx           # My Cases
│   ├── dashboard/page.tsx       # My Dashboard
│   ├── api/
│   │   ├── chat/route.ts        # AI customer chat endpoint (Claude)
│   │   └── score/route.ts       # AI scoring endpoint (Claude)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Nav.tsx
│   ├── training/
│   │   ├── CasePicker.tsx       # Case intro screen
│   │   └── ChatWindow/
│   │       ├── ChatWindow.tsx   # Chat + Call interface
│   │       ├── CallWindow.tsx   # Voice call UI
│   │       ├── ChatInput.tsx
│   │       ├── ChatMessages.tsx
│   │       ├── ScorePanel.tsx   # Score breakdown
│   │       ├── SessionProgress.tsx
│   │       ├── SessionSummary.tsx
│   │       └── StatusPill.tsx
│   └── ui/
│       ├── DifficultyBadge.tsx
│       └── TopicBadge.tsx
├── hooks/
│   ├── useDeepgramCall.tsx      # Voice call hook (WebSocket + audio)
│   └── useTrainingSession.tsx   # Training session state machine
└── lib/
    ├── types.ts                 # TypeScript types
    ├── cases.ts                 # Default cases data
    └── storage.ts               # localStorage helpers & stats
```

## AI Behaviour

- **Chat mode** (`/api/chat`): Claude plays the customer, stays in character, adjusts tone to difficulty (Beginner = polite, Advanced = adversarial).
- **Call mode** (`/api/voice-proxy`): A WebSocket proxy connects the browser to Deepgram's Voice Agent API. The server sends scenario context and difficulty on connection, Deepgram handles STT, LLM (GPT-4o-mini), and TTS. The AI customer speaks first using the case's opening message.
- **Score API** (`/api/score`): Claude evaluates the full transcript and returns a JSON breakdown across 4 criteria + written feedback.

## Scoring Criteria

| Criterion | Weight |
|---|---|
| Empathy & Tone | 25% |
| Accuracy of Information | 25% |
| Resolution / Next Step | 25% |
| Professionalism & Clarity | 25% |

## Case Channels

| Channel | Mode |
|---|---|
| Chat | Text chat only (Claude) |
| Call | Live voice call (Deepgram) |
| Both | Text chat (Claude) |