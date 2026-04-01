# Disaster Management App

A Next.js + Prisma based disaster response platform with role-based dashboards, emergency scenario simulation, AI-assisted analysis, and Twilio-powered notifications.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM + SQLite (default)
- Tailwind CSS
- Twilio (SMS/voice notifications)
- Groq API (AI analysis/tactical endpoints)

## Prerequisites

Install the following before setup:

- Node.js 20+
- npm 10+
- Git

Check versions:

```bash
node -v
npm -v
git --version
```

## 1. Clone And Install

```bash
git clone <your-repository-url>
cd DisasterManagementApp-main
npm install
```

## 2. Environment Variables

Create a `.env` file in the project root:

```dotenv
# Prisma / SQLite
DATABASE_URL="file:./dev.db"

# Twilio (required for /api/notify/sms and /api/notify/call)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"
TWILIO_TARGET_NUMBER="+91xxxxxxxxxx"

# Groq (required for /api/ai/analyze and /api/ai/tactical)
GROQ_API_KEY="your_groq_api_key"
```

Notes:

- Keep `.env` out of source control.
- If Twilio values are missing, notification routes will fail.
- If `GROQ_API_KEY` is missing, AI routes will return an error.

## 3. Database Setup (Prisma)

Generate Prisma client and initialize the local SQLite database schema:

```bash
npx prisma generate
npx prisma db push
```

Optional Prisma Studio:

```bash
npx prisma studio
```

## 4. Run The App

Development mode:

```bash
npm run dev
```

Open:

- http://localhost:3000

Production build:

```bash
npm run build
npm run start
```

## 5. Useful Routes

- `/` - landing page
- `/dashboard/government`
- `/dashboard/ngo`
- `/dashboard/volunteer`
- `/dashboard/victim`
- `/emergency`
- `/scenarios`
- `/scenarios/simulation`

API endpoints:

- `POST /api/needs`
- `GET /api/needs/[id]`
- `POST /api/notify/sms`
- `POST /api/notify/call`
- `POST /api/ai/analyze`
- `POST /api/ai/tactical`

## 6. Linting

```bash
npm run lint
```

## Troubleshooting

- Prisma client errors: run `npx prisma generate` again.
- Database schema mismatch: run `npx prisma db push`.
- Port 3000 busy: run with `npm run dev -- -p 3001`.
- Twilio auth errors: verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`.
- AI endpoint errors: verify `GROQ_API_KEY`.

