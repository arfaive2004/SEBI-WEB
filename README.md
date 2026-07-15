# BrokerVerse

A brokerage compliance platform with a Next.js frontend and a FastAPI
backend, structured as two independent projects so each can be deployed to
Vercel separately.

```
brokerverse/
├── backend/    FastAPI + SQLAlchemy API (auth, KYC, funds, margin, watchdog)
└── frontend/   Next.js UI (dashboard, onboarding, compliance tools)
```

## Quick start (local)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit JWT_SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

Visit `http://localhost:3000` — you'll immediately see the BrokerVerse
dashboard with live demo numbers and demo clients, no account needed. Sign up
from the header to unlock KYC Onboarding, the Funds Checker, Margin Reports,
and Trade Watchdog, and add your own clients.

## Deploying to Vercel

Deploy `backend/` and `frontend/` as **two separate Vercel projects**:

1. **Backend** — import `backend/` as a project. Set `JWT_SECRET_KEY` (and
   optionally `CORS_ORIGINS`, `DATABASE_URL`) in its environment variables.
   See `backend/README.md` for details, including a note on database
   persistence on serverless.
2. **Frontend** — import `frontend/` as a project. Set `NEXT_PUBLIC_API_URL`
   to the backend project's deployed URL.

Full details are in each project's own README.
