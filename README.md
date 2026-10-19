# club-portal-backend

club portal api: member auth, a members chat room and event-day q&a.

## features

- register, login, email verify, forgot and reset password
- `GET /me` behind bearer jwt
- `POST /chat` for the members room
- `POST /ask` for event-day answers with sources
- `GET /health` without a database

## stack

express 5 · typescript (tsx) · prisma · neon postgres · amazon ses

## run locally

```bash
npm ci
cp .env.example .env
npx prisma generate && npx prisma db push
npm run dev
```

## env

copy `.env.example` to `.env`: `DATABASE_URL`, `JWT_SECRET`, `APP_URL`, `MAIL_FROM`, `AWS_REGION`. the server exits if a required one is missing. production `.env` is written by github actions from repo secrets.
