# BrokerVerse — Frontend (Next.js)

The BrokerVerse UI: a dashboard, KYC onboarding form, funds checker, margin
report table, and trade-surveillance page, all talking to the BrokerVerse
backend API.

## Behavior

- **No login required** to view the dashboard — it always shows live demo
  metrics and demo top clients from the backend.
- **Sign in / Sign up** to unlock the compliance tools (Onboarding, Funds
  Checker, Margin Report, Trade Watchdog). Any client you onboard is tied to
  your account and immediately reflected in the dashboard metrics, top
  clients list, and KYC-expiry notifications.

## Local development

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Make sure the backend is running (see `../backend/README.md`) at the URL you
put in `NEXT_PUBLIC_API_URL`.

## Deploying to Vercel

1. Push this `frontend/` folder as its own Vercel project.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to your deployed
   backend's URL (e.g. `https://brokerverse-backend.vercel.app`).
3. Deploy — `vercel.json` and `next.config.ts` are already set up for it.

## Notes

- The visual theme (deep purple, "Space Grotesk" + "Inter", 3D card hover
  effects) is unchanged from the original design.
- Bank statement CSVs for the Funds Checker should have columns like
  `date,description,credit,debit` (or `amount,type`).
