# MoveMate backend

Express + MongoDB APIs for customer, coordinator and admin. Includes tests, API collection and an optional frontend helper. The active React screens are connected in frontend/src/integrated. The original prototype components remain as design references. See the root README and FRONTEND_INTEGRATION.md.

## Setup (PowerShell)

Use Node.js 22+ and MongoDB Atlas or a local MongoDB replica set. Transactions are required: a standalone MongoDB instance is insufficient.

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set MONGODB_URI, JWT_SECRET (32+ random characters), CLIENT_ORIGIN, ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters). Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Never commit .env.

```powershell
npm run seed
npm run dev
```

Seed creates the first admin only when its email does not exist; it never overwrites accounts. Login via POST /api/auth/login. Health: GET http://localhost:5000/api/health. Frontend runs separately in frontend with npm install and npm run dev.

## Qwen

Set BACKBOARD_API_KEY. BACKBOARD_MODEL defaults to qwen/qwen3-30b-a3b-instruct-2507 via openrouter. POST /api/moves/:id/ai-plan generates a draft; PUT /plan saves the customer-reviewed plan. Inventory quantities are preserved. No identity documents, contact names or full addresses are explicitly sent. Customers may enter personal information in special instructions/access notes; hosted AI is not offline/local.

Missing key = 503, invalid/provider response = 502; no fake AI fallback. A manual plan can be saved. AI cannot assign providers, confirm availability, set prices, approve charges or decide liability.

## Permissions and workflow

Customer: own moves, no coordinator/admin APIs. Coordinator: application/private identity file while pending, assigned jobs after approval only. Admin: operational customer/coordinator APIs plus all admin APIs; no impersonation needed. Approval changes and logout revoke tokens; log in again. Tokens expire in eight hours. Admin access to identity files is audited.

Draft -> submitted -> quoted -> confirmed -> packing -> loading -> in_transit -> unloading -> awaiting_confirmation -> completed. Before submission, save a confirmed plan and access delegates. Admin assignment precedes quoting; quote acceptance precedes starting. Quotes are versioned; stale acceptance fails. Additional costs require a separate decision; no payment is automatically charged. Pending changes block delivery handover. Completion/cancellation releases reservations.

A MongoDB transaction scheduler lock serializes competing assignments. Half-open reservation intervals [start,end) allow adjacent bookings. Vehicle checks consider supplied weights/volumes only; admin must verify missing dimensions, area coverage and crew suitability. Abandoned quotes retain holds until cancellation or reassignment; follow up manually.

## Uploads/deployment

Private authenticated uploads, 5 MB limit. PNG/JPEG evidence; identity also accepts PDF. Signatures are checked. Files use OS permissions; this is not an encrypted identity vault. Before accepting real documents use encrypted persistent storage, malware scanning, retention/deletion policies and real verification. Remove the prototype's encrypted-vault claim.

Render Node service: root backend, build npm ci --omit=dev, start npm start. Set Atlas URI and all environment variables. UPLOAD_DIR needs a persistent disk (or replace with private object storage), since ephemeral disks lose files on redeploy. Configure the exact client origin and verified reverse-proxy trust settings.

Password reset requires SMTP; without configuration returns 503. No SMS OTP, payment gateway, insurance, background-check service or continuous GPS is implemented. Notifications are in-app, not browser push. Roles are fixed, not an editable permissions engine. Liability terms require separate review before live services.

## Tests

npm test starts an isolated local MongoDB replica set; first run downloads a MongoDB binary. Covers role/ownership, documents, approval, drafts, scheduling conflicts, quote versions, changes, progress, completion and logout. AI tests use mocked responses. Live Qwen and SMTP require your credentials.

See API.md, FRONTEND_INTEGRATION.md and MoveMate.postman_collection.json.
