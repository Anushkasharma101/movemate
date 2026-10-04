# MoveMate — integrated application

React/Vite frontend + Express/MongoDB backend. The active application is `frontend/src/integrated/App.jsx`, loaded by `src/main.jsx`. The original landing-page hero, service cards, images and mint/teal theme are retained. Customer, coordinator and admin operational screens now use API-backed components in `src/integrated`; original prototype components remain as design references and are not the active portal implementation.

## 1. Backend (PowerShell)

Use Node.js 22.12+ (or current supported Node 24). Use MongoDB Atlas or a local MongoDB replica set; standalone MongoDB cannot run reservation transactions.

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set MONGODB_URI, JWT_SECRET (32+ random characters), ADMIN_EMAIL, ADMIN_PASSWORD (12+ characters), CLIENT_ORIGIN=http://localhost:5173. Add BACKBOARD_API_KEY for live Qwen. Set RESET_URL=http://localhost:5173/reset-password and SMTP variables if you want reset emails.

```powershell
npm run seed
npm run dev
```

## 2. Frontend (a separate terminal)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173. Keep the browser origin consistent with CLIENT_ORIGIN; 127.0.0.1 and localhost are different origins. Frontend `.env` needs VITE_API_URL=http://localhost:5000/api. Restart Vite after changing environment variables.

## 3. First use

- Register a customer with email/password. New accounts see an empty dashboard.
- Register a coordinator, submit the work profile, demo identity document and reference consent. No jobs are available until admin approval.
- Login as seeded admin. Review the application; record actual identity/reference checks, add vehicles/workers and assign resources to a submitted move.
- Customer creates a draft, supplies access delegates and inventory, reviews a manual or Qwen plan and submits. Admin sends an itemized quote. Customer accepts. Coordinator starts the job, checks tasks and records progress. Extra costs need approval. Customer confirms delivery and can leave a review or report an incident.
- Status and messages refresh every 15 seconds on visible move screens. Use manual page refresh for other lists.

## Permissions

Login uses the server role, never a client role selector. Customer and coordinator routes are isolated; admin can open all portals. Pending/rejected/suspended coordinators see application status. The server independently checks role, approval and move ownership. Session restoration uses an eight-hour token stored in sessionStorage (per browser tab). Logout invalidates server tokens. No passwords or Backboard key are stored in the frontend. Expired/revoked sessions return to login.

## Qwen and service limits

POST /api/moves/:id/ai-plan uses hosted Qwen through Backboard; no key returns a clear error and the editable manual plan remains available. Live Qwen needs your credit/key. Local schema tests mock the provider, while browser tests explicitly verify the unconfigured-provider state. Hosted AI is not offline.

Phone OTP, payments, insurance, automated background checking and browser push are not implemented. Mobile numbers are not falsely marked verified. Password reset needs configured SMTP. Admin permissions are fixed, not user-editable. Identity uploads are private files, not an encrypted vault. Use demo documents until production storage, privacy retention and verification requirements are addressed.

## Checks

```powershell
cd backend
npm test
# Separate terminal:
cd frontend
npm run build
npm run lint:integrated
npx playwright install chromium
npm run test:e2e
```

Install dependencies in both folders before browser tests. E2E runs its own temporary database/API/Vite servers on ports 5050 and 5173; stop your dev frontend first. It uses only demo data and a test-only admin password. Screenshots go to frontend/test-results, which are ignored. Browser tests verify coordinator onboarding, cross-role access, booking, API error handling, team assignment, quote acceptance, cost approvals, delivery, reviews, messages, incidents and profile persistence.

Deployment: backend/README.md. API payloads: backend/API.md and Postman collection. Frontend implementation map: backend/FRONTEND_INTEGRATION.md.

## Frontend deployment

For a Render Static Site: root directory frontend, build `npm ci && npm run build`, publish directory dist. Set VITE_API_URL to your backend's HTTPS /api URL before building. Add a rewrite from `/*` to `/index.html` so role routes work on refresh. Set backend CLIENT_ORIGIN to the exact frontend HTTPS origin. Backboard and SMTP keys belong only in backend environment variables.
