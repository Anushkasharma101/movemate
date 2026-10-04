# API reference

58 endpoints. Base URL: `http://localhost:5000/api`. JSON request bodies except uploads. Protected endpoints require `Authorization: Bearer <token>`. All registration/login bodies use email; phone is not OTP-verified.

List endpoints support `limit` (max 100) and `offset`. IDs are returned MongoDB IDs, not display labels. Dates in assignment are UTC ISO strings. Amounts are INR numeric values.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |
| GET | `/api/auth/me` | Authenticated, with ownership/role checks |
| PATCH | `/api/auth/me` | Authenticated, with ownership/role checks |
| POST | `/api/auth/logout` | Authenticated, with ownership/role checks |
| GET | `/api/coordinator/application` | Coordinator application owner |
| PUT | `/api/coordinator/application` | Coordinator application owner |
| POST | `/api/coordinator/application/submit` | Coordinator application owner |
| POST | `/api/moves` | Customer / admin |
| GET | `/api/moves` | Authenticated, with ownership/role checks |
| GET | `/api/moves/:id` | Authenticated, with ownership/role checks |
| PATCH | `/api/moves/:id` | Authenticated, with ownership/role checks |
| POST | `/api/moves/:id/ai-plan` | Customer / admin |
| PUT | `/api/moves/:id/plan` | Customer / admin |
| POST | `/api/moves/:id/submit` | Customer / admin |
| GET | `/api/admin/overview` | Admin |
| GET | `/api/admin/coordinator-applications` | Admin |
| GET | `/api/admin/coordinator-applications/:id` | Admin |
| PATCH | `/api/admin/coordinator-applications/:id/status` | Admin |
| GET | `/api/admin/moves` | Admin |
| GET | `/api/admin/resources/availability` | Admin |
| PUT | `/api/admin/moves/:id/assignment` | Admin |
| POST | `/api/admin/moves/:id/quotes` | Admin |
| POST | `/api/moves/:id/quote/accept` | Customer / admin |
| POST | `/api/moves/:id/quote/request-changes` | Customer / admin |
| GET | `/api/coordinator/jobs` | Approved assigned coordinator / admin |
| GET | `/api/coordinator/jobs/:id` | Approved assigned coordinator / admin |
| POST | `/api/coordinator/jobs/:id/start` | Approved assigned coordinator / admin |
| PATCH | `/api/coordinator/jobs/:id/checklist` | Approved assigned coordinator / admin |
| POST | `/api/coordinator/jobs/:id/updates` | Approved assigned coordinator / admin |
| POST | `/api/coordinator/jobs/:id/change-requests` | Approved assigned coordinator / admin |
| GET | `/api/moves/:id/change-requests` | Authenticated, with ownership/role checks |
| POST | `/api/moves/:id/change-requests/:changeId/decision` | Authenticated, with ownership/role checks |
| POST | `/api/coordinator/jobs/:id/ready-for-confirmation` | Approved assigned coordinator / admin |
| POST | `/api/moves/:id/confirm-delivery` | Customer / admin |
| POST | `/api/moves/:id/review` | Customer / admin |
| POST | `/api/moves/:id/cancel` | Customer / admin |
| POST | `/api/moves/:id/messages` | Authenticated, with ownership/role checks |
| POST | `/api/moves/:id/incidents` | Authenticated, with ownership/role checks |
| GET | `/api/admin/incidents` | Admin |
| PATCH | `/api/admin/incidents/:id` | Admin |
| GET | `/api/admin/audit-logs` | Admin |
| GET | `/api/notifications` | Authenticated, with ownership/role checks |
| PATCH | `/api/notifications/:id/read` | Authenticated, with ownership/role checks |
| POST | `/api/uploads` | Authenticated, with ownership/role checks |
| GET | `/api/uploads/:id` | Authenticated, with ownership/role checks |
| GET | `/api/admin/vehicles` | Admin |
| POST | `/api/admin/vehicles` | Admin |
| PATCH | `/api/admin/vehicles/:id` | Admin |
| GET | `/api/admin/workers` | Admin |
| POST | `/api/admin/workers` | Admin |
| PATCH | `/api/admin/workers/:id` | Admin |
| GET | `/api/moves/:id/updates` | Authenticated, with ownership/role checks |
| GET | `/api/moves/:id/messages` | Authenticated, with ownership/role checks |
| GET | `/api/moves/:id/incidents` | Authenticated, with ownership/role checks |

## Example JSON bodies

### `/api/auth/register`

```json
{
  "name": "Customer",
  "email": "customer@example.com",
  "phone": "9876543210",
  "password": "ChooseYourOwnStrongPassword",
  "role": "customer",
  "acceptTerms": true
}
```

### `/api/auth/login`

```json
{
  "email": "customer@example.com",
  "password": "ChooseYourOwnStrongPassword"
}
```

### `/api/auth/forgot-password`

```json
{
  "email": "customer@example.com"
}
```

### `/api/auth/reset-password`

```json
{
  "token": "{{resetToken}}",
  "password": "NewStrongPasswordChosenByYou"
}
```

### `/api/auth/me`

```json
{
  "name": "Customer"
}
```

### `/api/coordinator/application`

```json
{
  "workProfile": {
    "city": "Pune",
    "serviceAreas": [
      "Pune"
    ],
    "languages": [
      "Hindi",
      "English"
    ],
    "experienceYears": 2,
    "providerType": "individual"
  },
  "identityFile": "{{identityFileId}}",
  "reference": {
    "name": "Reference",
    "phone": "9876543210",
    "permission": true
  },
  "consents": {
    "verification": true,
    "conduct": true,
    "policyVersion": "1.0"
  }
}
```

### `/api/moves`

```json
{
  "details": {
    "pickupAddress": "Baner, Pune",
    "destAddress": "Kharadi, Pune",
    "pickupFloor": "3",
    "destFloor": "1",
    "pickupLift": "No",
    "destLift": "Yes",
    "moveDate": "2030-10-04",
    "homeSize": "1 BHK",
    "accessPersonPickup": "Friend at pickup",
    "accessPersonDelivery": "Friend at delivery",
    "accessNotes": "Gate pass arranged"
  },
  "inventory": [
    {
      "id": 1,
      "name": "Monitor",
      "type": "tv",
      "qty": 1,
      "fragile": true,
      "notes": "Protect screen"
    }
  ],
  "specialInstructions": "Do not pack laptop",
  "unavailableHours": "11 AM-1 PM",
  "accessAuthorized": true
}
```

### `/api/moves/:id`

```json
{
  "specialInstructions": "Do not pack laptop"
}
```

### `/api/moves/:id/plan`

```json
{
  "inventory": [
    {
      "id": 1,
      "name": "Monitor",
      "type": "tv",
      "qty": 1,
      "fragile": true,
      "notes": "Protect screen"
    }
  ],
  "handlingInstructions": [
    "Protect screen"
  ],
  "accessRestrictions": [
    "Third floor stairs"
  ],
  "unavailableHours": "11 AM-1 PM",
  "missingQuestions": [],
  "checklist": [
    {
      "task": "Pack monitor",
      "completed": false
    }
  ]
}
```

### `/api/admin/coordinator-applications/:id/status`

```json
{
  "status": "approved",
  "reviewNotes": "Identity and reference checks completed manually",
  "identityChecked": true,
  "referenceChecked": true
}
```

### `/api/admin/moves/:id/assignment`

```json
{
  "coordinator": "{{coordinatorId}}",
  "vehicle": "{{vehicleId}}",
  "workers": [
    "{{workerId}}"
  ],
  "start": "2030-10-04T02:30:00.000Z",
  "end": "2030-10-04T12:30:00.000Z"
}
```

### `/api/admin/moves/:id/quotes`

```json
{
  "items": [
    {
      "label": "Transport",
      "amount": 2000
    },
    {
      "label": "Labour",
      "amount": 500
    }
  ]
}
```

### `/api/moves/:id/quote/accept`

```json
{
  "quoteId": "{{quoteId}}"
}
```

### `/api/moves/:id/quote/request-changes`

```json
{
  "reason": "Please clarify packing material costs"
}
```

### `/api/admin/vehicles`

```json
{
  "label": "Demo van",
  "registration": "DEMO01",
  "type": "Van",
  "capacityKg": 1000,
  "capacityM3": 12,
  "driverName": "Driver",
  "driverPhone": "9876543210",
  "city": "Pune",
  "rate": 1000
}
```

### `/api/admin/vehicles/:id`

```json
{
  "active": false
}
```

### `/api/admin/workers`

```json
{
  "name": "Worker",
  "phone": "9876543210",
  "city": "Pune",
  "skills": [
    "packing"
  ],
  "rate": 500
}
```

### `/api/admin/workers/:id`

```json
{
  "active": false
}
```

### `/api/coordinator/jobs/:id/checklist`

```json
{
  "index": 0,
  "completed": true
}
```

### `/api/coordinator/jobs/:id/updates`

```json
{
  "status": "loading",
  "note": "Packing finished, loading started",
  "files": []
}
```

### `/api/coordinator/jobs/:id/change-requests`

```json
{
  "reason": "Additional protective material",
  "amount": 300,
  "files": []
}
```

### `/api/moves/:id/change-requests/:changeId/decision`

```json
{
  "decision": "approved"
}
```

### `/api/moves/:id/confirm-delivery`

```json
{
  "received": true,
  "notes": "Received",
  "discrepancies": []
}
```

### `/api/moves/:id/review`

```json
{
  "rating": 5,
  "feedback": "Good coordination"
}
```

### `/api/moves/:id/cancel`

```json
{
  "reason": "Plans changed"
}
```

### `/api/moves/:id/messages`

```json
{
  "text": "Gate pass is ready"
}
```

### `/api/moves/:id/incidents`

```json
{
  "category": "damage",
  "description": "Monitor has a scratch",
  "files": []
}
```

### `/api/admin/incidents/:id`

```json
{
  "status": "under_review",
  "resolution": "Gathering pickup and delivery evidence"
}
```

## Responses and decisions

- Authentication: `{user, token}`; login also returns dashboard path.
- Move operations: `{move}`; lists `{moves}`; assignment includes capacityNote.
- AI: `{aiDraft:{plan,model,generatedAt}}`. Plan remains unconfirmed until PUT /plan.
- Plan inventory must exactly match the saved inventory. Update the draft first when changing items.
- Quotes: `{quote}`; accept using current quoteId. Additional approvals do not execute payments.
- Uploads: multipart file,purpose and moveId for evidence; returns `{upload:{_id,name,mime,size,purpose}}`. GET /uploads/:id returns private binary data.
- Application approval requires identityChecked:true and referenceChecked:true plus actual manual checks. Approval revokes old coordinator token; re-login.
- Errors: `{error:{message,details?}}`, 400 validation, 401 login/session, 403 permission, 404 missing, 409 workflow conflict, 502 invalid/provider AI, 503 unconfigured service.
- Password reset does not expose reset tokens in API responses.
- Register does not permit admin. Backend roles cannot be changed through /auth/me.
