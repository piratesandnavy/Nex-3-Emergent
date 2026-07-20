# Free Toolkit API

This directory contains the Node.js email API used by the audit form. Run it in the project's existing backend environment and point `REACT_APP_BACKEND_URL` at that API origin. No hosting or deployment configuration is included.

## Required environment variables

Copy `.env.example` and configure the SMTP values. Use an SMTP app password or provider credential rather than a personal account password.

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=NEX3 <noreply@nex3.xyz>
NOTIFICATION_EMAIL=nex3.info@gmail.com
CLIENT_ORIGIN=https://nex3.xyz
```

`LEADS_FILE` defaults to `./data/leads.json`. Mount persistent storage at that path in production. The `LeadStore` interface is intentionally isolated so it can later be replaced with a database-backed implementation.

## Run

```bash
npm ci
npm run start:server
```

Check `GET /health`, then submit `POST /api/free-tools` with `{ "email": "user@example.com" }`.
