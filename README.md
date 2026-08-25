# Club portal API

Public repo: https://github.com/sreecharan-desu/club-portal-backend

Express + TypeScript. One process. Neon for members. Amazon SES for mail. No MailDev. No extra frameworks.

```text
src/
  config.ts              required env. crash if missing
  app.ts                 cors, json, mount routes
  server.ts              listen 0.0.0.0
  db.ts                  one Prisma client
  mail.ts                SES SendEmail only
  prisma.config.ts       Prisma 6 paths from repo root
  middleware/auth.ts     Bearer JWT
  routes/health.ts       GET /health — no database
  routes/auth.ts         register, login, verify, forgot, reset
  routes/me.ts           GET /me
  routes/chat.ts         POST /chat — members room
  routes/ask.ts          POST /ask — event-day answer + sources
```

```bash
npm ci
npx prisma generate
npx prisma db push
npm run dev
```

`.env` is not in git. Live `.env` is written by GitHub Actions from repo secrets.
