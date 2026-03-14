# Pg + Better Auth + Next.js + Drizzle Starterkit

Starterkit for apps that need auth on day one without rebuilding the same foundation every time.

## Stack

- Next.js 16 App Router
- Better Auth
- PostgreSQL
- Drizzle ORM
- Tailwind CSS v4

## Included auth flows

- Register with name, username, email, and password
- Sign in with email or username
- Google OAuth when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Email verification with resend support
- Forgot password and reset password
- Session cookies and sign out

## Quick start

```bash
bun install
cp .env.example .env
```

Fill in `.env`, then create the tables and start the app:

```bash
bun run db:push
bun dev
```

Open `http://localhost:3000`.

## Environment variables

```env
APP_NAME=PgBetterAuth Starter
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
BETTER_AUTH_SECRET=replace-with-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
HUBMAIL_KEY=
AUTH_EMAIL_FROM=no-reply@example.com
```

Notes:

- `BETTER_AUTH_SECRET` should be a long random secret.
- `NEXT_PUBLIC_APP_URL` is used by the client auth helper.
- If `HUBMAIL_KEY` is missing, verification and reset links are logged to the server console instead of being emailed.
- `AUTH_EMAIL_FROM` is only needed when you want real email delivery.

## Google OAuth setup

1. Create a Google OAuth client in Google Cloud.
2. Add this redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.
4. Restart the app.

If those variables are not set, the starter hides the Google button and keeps email/password auth working normally.

## Auth behavior

### Register

- Collects `name`, `username`, `email`, and `password`
- Requires email verification before password sign-in
- If the email already exists, the UI offers resend verification and password reset

### Login

- Accepts either email or username
- Returns a helpful recovery panel when the account exists but email is not verified

### Password reset

- `/forgot-password` requests the reset email
- `/reset-password?token=...` handles the new password
- Password reset revokes existing sessions through Better Auth config

### Email delivery

- Development without email provider: auth links are printed in the server logs
- Production with HubMail: set `HUBMAIL_KEY` and `AUTH_EMAIL_FROM`

## Database

The Better Auth tables live in [`db/schema.ts`](/home/bonheur/Desktop/Projects/uaway/db/schema.ts).

This starter includes:

- `user`
- `session`
- `account`
- `verification`
- username fields on `user`

Push the schema with:

```bash
bun run db:push
```

## Project structure

```text
app/
  api/auth/[...all]/      Better Auth route handler
  (auth)/                 Login, register, forgot password, reset password
db/
  index.ts                Drizzle connection
  schema.ts               Auth tables and shared schema
lib/
  app-config.ts           App/auth config flags
  auth-form-schemas.ts    Validation for auth forms
auth.ts                   Better Auth server config
```

## Scripts

```bash
bun dev
bun run build
bun start
bun run lint
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
```

## What changed in this starter

- Rebranded from the old Heptadev naming
- Added username-based auth on top of Better Auth email/password
- Hardened register, login, password reset, and recovery UX
- Added Google OAuth gating so local dev still works without Google credentials
- Fixed Drizzle config to point at the real schema file
