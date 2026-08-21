# CareerPilot AI

CareerPilot AI is an agentic internship CRM that helps candidates manage the internship search from resume upload through application tracking and outcome analytics.

## Features

- Resume parsing with profile and skill extraction
- Resume-driven internship discovery
- Match scoring with matched and missing skills
- Prioritized skill-gap study plans
- Job-tailored resume versions and PDF export
- Application tracking with a six-stage kanban board
- Milestone notifications and follow-up reminders
- Analytics and recommendations
- Workflow graph showing the eight pipeline agents
- Offline-first operation with deterministic AI fallbacks

## Tech Stack

- **Client:** React, Vite, Tailwind CSS, React Router, TanStack React Query, Zustand
- **Server:** Node.js, Express, MongoDB/Mongoose, JWT, Multer
- **Optional AI:** Ollama for local text generation and embeddings
- **Optional infrastructure:** Redis/BullMQ and MongoDB

## Project Structure

```text
client/   React frontend
server/   Express API and background jobs
spec.md   Complete project specification
```

## Quick Start

### 1. Install dependencies

Open two terminals from the project root:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Start the backend

```bash
cd server
npm run dev
```

The API runs at `http://localhost:5000/api`.

### 3. Start the frontend

```bash
cd client
npm run dev
```

The web app runs at `http://localhost:5173`.

## Default Demo Account

When `MONGODB_URI` is not set, the server uses an auto-seeded in-memory store:

- Email: `demo@careerpilot.ai`
- Password: `Password@123`

Data in memory mode is reset when the server restarts.

## Environment Configuration

Create `server/.env` when configuration beyond the defaults is needed:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3.1:8b
OLLAMA_EMBED_MODEL=nomic-embed-text
UPSTASH_REDIS_URL=
SEED_SAMPLE_DATA=false
NODE_ENV=development
```

The application works without MongoDB, Ollama, or Redis. Ollama failures use deterministic local fallbacks, and an unset `MONGODB_URI` selects in-memory storage.

For a MongoDB setup, set `MONGODB_URI` and optionally run the demo seed script:

```bash
cd server
node scripts/seedDemoData.js
```

The MongoDB demo account uses `demo@careerpilot.ai` with password `Demo@12345`.

## API Overview

All routes are mounted under `/api`. Authentication routes are public; other routes require a Bearer JWT.

- `/auth` - register, login, and current-user information
- `/profile` - resume upload, profile preferences, and resume history
- `/internships` - discovery and synchronization
- `/matches` - match generation and match results
- `/skill-gaps` - prioritized learning plans
- `/application-materials` - tailored resumes and PDF downloads
- `/applications` - application tracker operations
- `/notifications` - notifications and read state
- `/analytics` - application and matching metrics

Health check: `GET /api/health`

## Development Commands

Server:

```bash
npm run dev
npm start
npm run lint
```

Client:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Resume Pipeline

Uploading a new PDF resume replaces the current profile. The previous resume and its results are archived, existing matches and tailored resume versions are cleared, and internship discovery is re-synchronized for the new profile. Invalid or empty resumes are rejected without changing existing data.

See [spec.md](spec.md) for the complete functional specification and acceptance criteria.
