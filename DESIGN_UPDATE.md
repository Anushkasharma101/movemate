# MoveMate design update

The active screens remain in frontend/src/integrated. portal-design.css is imported after integrated.css and contains the new portal styling.

## Install into your existing working project

1. Stop the frontend development server.
2. Back up your current frontend folder.
3. Copy the updated frontend/src and frontend/public folders into your existing frontend, replacing the matching files. Copy frontend/e2e if you want the updated UI checks.
4. Keep your existing backend, backend/.env, private-uploads and MongoDB database. Keep frontend/.env too.
5. In frontend, run npm install and npm run dev.
6. Hard refresh your browser with Ctrl+Shift+R.

This download excludes credentials, private uploaded documents, node_modules and built output. Environment templates are included for a fresh installation. Do not replace your configured .env files with the templates.

## Design

Customer: light sidebar, mint move summary, actual request counts, quiet-hours summary and move cards.
Coordinator: dark teal sidebar, assigned-job summary, checklist, updates, approvals and progress timeline.
Admin: summary cards, recent requests table, applications, assignment, itemized quotes, providers, incidents and access views.
Shared: cream backgrounds, white cards, teal actions, peach coordinator accents, status colors, icons, consistent form fields, responsive navigation and tables.
Booking: numbered step rail and existing editable plan and access controls.

Counts, participants, dates and status displays come from existing APIs. No sample bookings, avatars or evidence photos are injected into live screens. Mockup-only GPS, payments, editable roles and automatic verification have not been added.

Multi-city copy replaces the homepage Pune-only default. Coordinator and provider city fields start blank and must be supplied. Availability/coverage is still verified per request by admin; this visual change does not add automatic geography matching. A generic home-and-moving-truck illustration has replaced the city-specific homepage artwork.

The original backend routes, validation, permissions and booking transitions are unchanged.

## Validation

- Production frontend build passed.
- Integrated frontend lint passed.
- Nine backend test groups passed.
- Full isolated customer/coordinator/admin browser workflow passed after the final design changes, including mobile overflow checking.
- Backend source, auth guards, API helper and hooks compared byte-for-byte with the uploaded project and remain unchanged.
- Live Backboard and SMTP calls were not made. Browser testing uses an isolated test database and verifies the missing-AI-key state.
- Screenshots from the demo browser run are in design-previews.
