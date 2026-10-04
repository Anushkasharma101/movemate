# Implemented frontend integration

`frontend/src/main.jsx` now starts `src/integrated/App.jsx`. Original prototype portal components remain as reference; the active routes use API-backed components.

| Screen | Active component | APIs |
|---|---|---|
| Login/register/recovery | Login.jsx | auth/register, login, forgot-password, reset-password |
| Session and route access | Auth.jsx, authState.js | auth/me, logout |
| Booking wizard and editable AI plan | Booking.jsx | moves POST/PATCH, ai-plan, plan PUT, submit |
| Customer history / coordinator jobs | Portals.jsx Dashboard | moves, coordinator/jobs |
| Move brief, quote, progress, approvals, delivery, review | Move.jsx | move detail, quote/accept, quote/request-changes, updates, checklist, start, change-requests, ready-for-confirmation, confirm-delivery, review, cancel |
| Messages and incidents | Move.jsx | messages, incidents, uploads |
| Coordinator application/status | Portals.jsx Application | application GET/PUT/submit, uploads |
| Profile/notifications | Portals.jsx | auth/me PATCH, notifications, notifications/read |
| Admin overview/requests | Admin.jsx | admin/overview, admin/moves |
| Admin assignment and quotes | Admin.jsx AdminMove | availability, assignment, quotes |
| Admin verification | Admin.jsx Applications | coordinator-applications, approval status, private downloads |
| Vehicles/workers | Admin.jsx Providers | resource GET/POST/PATCH |
| Claims and permissions/audit view | Admin.jsx | incidents GET/PATCH, audit-logs |

The shared client is services/backendApi.js. Token and profile state live in AuthProvider, with per-tab session restoration. Backend role/ownership enforcement remains authoritative. Forbidden routes render Access denied; expired/revoked sessions return to login. Coordinator approval changes require a fresh login.

All data comes from APIs in the active portals. Empty/loading/error/conflict states are visible. AI failures preserve an editable manual plan. No fake OTP verification or encrypted-vault claim is used in the active forms. Photo/document downloads fetch authenticated blobs rather than exposing public URLs. Status and message views poll every 15 seconds while visible.

Added screens/states include password recovery, new-customer empty dashboard, submitted/pending request, coordinator review states, move history, schedule list, profile/messages, completed move and access denied.

Remaining external setup: Atlas/replica-set URI, Backboard key, SMTP for emails and persistent private upload storage for deployment. No SMS/payment/insurance provider is simulated.
