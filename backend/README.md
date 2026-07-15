# BrokerVerse — Backend (FastAPI)

This is the API that powers BrokerVerse: authentication, KYC onboarding,
funds checks, margin reports, and trade-surveillance PDF generation.

## What's real vs. mocked

- **Auth, database, business rules, CSV parsing, PDF generation** are all
  fully functional.
- **Document verification** (`/api/kyc/onboard`) does not run real OCR or
  face-matching (no third-party KYC vendor is configured). It runs a
  deterministic, explainable mock check instead, so the full onboarding →
  dashboard → notifications flow works end-to-end for demos. Swap
  `_mock_verify` in `app/routers/kyc.py` for a real vendor call when you're
  ready.

## Local development

```bash
python -m venv venv
source venv/bin/activate         # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then edit JWT_SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

The API will be at `http://127.0.0.1:8000`, with interactive docs at
`http://127.0.0.1:8000/docs`.

## Deploying to Vercel

1. Push this `backend/` folder as its own Vercel project (or a separate repo).
2. In the Vercel project settings, set environment variables:
   - `JWT_SECRET_KEY` — a long random string (required)
   - `CORS_ORIGINS` — your frontend's URL, e.g. `https://brokerverse.vercel.app`
     (or `*` while testing)
   - `DATABASE_URL` — optional, see below
3. Deploy. Vercel will detect `api/index.py` as the Python entrypoint and use
   `vercel.json`'s rewrite rule to route all requests to it.

### About the database

By default this app uses **SQLite**. That's great for local development, but
on Vercel's serverless Python runtime the filesystem is ephemeral — anything
written to `/tmp` can disappear on a cold start, so signups/clients aren't
guaranteed to persist between requests in production.

For a real deployment, provision a free Postgres database (e.g.
[Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel
Postgres) and set `DATABASE_URL` to its connection string — no code changes
needed, SQLAlchemy handles both.

## API overview

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | – | Create an account |
| POST | `/api/auth/login` | – | Get a JWT access token |
| GET | `/api/auth/me` | required | Current user |
| GET | `/api/dashboard/metrics` | optional | Demo metrics, plus your own if logged in |
| GET | `/api/dashboard/top-clients` | optional | Top 5 clients by profit |
| GET | `/api/kyc/expiring` | optional | Clients with KYC expiring within 30 days |
| POST | `/api/kyc/onboard` | required | Onboard a new client (multipart form) |
| POST | `/api/clients/notify` | – | Mark a client as notified |
| POST | `/api/compliance/check-funds` | required | Upload a bank statement CSV |
| GET | `/api/reports/generate-margin-report` | required | CSV margin report |
| GET | `/api/surveillance/run-check` | required | PDF suspicious-activity report |

Global demo data (`is_demo=True` rows, `owner_id=NULL`) is seeded once on
first run and is visible to every visitor. Once a user signs up and adds
clients, their own data is layered on top of the demo baseline whenever
they're logged in.
