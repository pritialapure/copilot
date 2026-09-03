# CareerPilot AI

An AI-powered internship CRM that parses your resume, discovers and scores internship opportunities (including ones pulled automatically from your college placement emails), tailors your resume per job, and tracks every application through a kanban board.

## Live Links

- **App:** https://copilot-inky-tau.vercel.app/
- **API:**  https://copilot-1-c5c4.onrender.com

**Demo login:**
```
demo@careerpilot.ai / Password@123
```

## Features

- Resume upload & parsing (skills, projects, experience, education)
- Internship discovery — curated catalog + live feed + Gmail-based AI automation (n8n)
- Resume-to-internship matching and skill-gap analysis
- AI-tailored resumes with a professional PDF export, per job description
- Application tracker (kanban) with notifications
- Analytics dashboard

## Tech Stack

**Frontend:** React, Vite, TailwindCSS, React Query, Zustand
**Backend:** Node.js, Express, MongoDB (with in-memory fallback), JWT auth
**AI:** Ollama (backend), Gemini (via n8n email automation)

## Getting Started

```bash
# Backend
cd server
npm install
npm run dev        # http://localhost:5000/api

# Frontend
cd client
npm install
npm run dev         # http://localhost:5173
```

Leave `MONGODB_URI` empty in `server/.env` to run with zero setup — a demo account is auto-seeded in memory.

## Environment Variables

`server/.env`:
```
MONGODB_URI=
JWT_SECRET=
OLLAMA_BASE_URL=http://localhost:11434
INGEST_API_KEY=          # secret for the n8n webhook at /api/ingest/internships
```

`client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

