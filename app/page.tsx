import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { signOutAction } from "@/app/_actions";
import { appName } from "@/lib/app-config";

const starterHighlights = [
  {
    title: "Authentication",
    copy: "Email + password, username sign-in, Google OAuth, verification, and password reset are all wired into Better Auth.",
  },
  {
    title: "Database",
    copy: "PostgreSQL and Drizzle ORM share one schema file, including the Better Auth tables and username fields.",
  },
  {
    title: "Starter UX",
    copy: "The auth routes, homepage, env example, and README are shaped for shipping a new product fast.",
  },
];

const authFlows = [
  "Register with name, username, email, and password",
  "Sign in with either email or username",
  "Optional Google sign-in when OAuth credentials are configured",
  "Email verification with resend support",
  "Password reset with token validation and session revocation",
];

const setupSteps = [
  "Copy `.env.example` to `.env` and set your Postgres URL plus Better Auth secrets.",
  "Run `bun run db:push` to create the auth tables and username columns.",
  "Start the app with `bun dev`, then configure Google OAuth and email delivery when needed.",
];

const envSnippet = `APP_NAME=PgBetterAuth Starter
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
BETTER_AUTH_SECRET=replace-with-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

const getSession = async () =>
  auth.api.getSession({
    headers: new Headers(await headers()),
  });

export default async function Home() {
  const session = await getSession();
  const username = (session?.user as { username?: string } | undefined)?.username;

  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-8 text-white shadow-2xl shadow-[#111827]/20 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.34),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.28),_transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/[0.15] bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-white/90">
                {appName}
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Pg + Better Auth + Next.js + Drizzle starterkit.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  A product-ready auth baseline with username sign-in, Google
                  OAuth, password recovery, Postgres, Drizzle, and a clean App
                  Router structure.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-[#111827] transition hover:bg-slate-100"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.18] bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.14]"
                >
                  Open login
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/[0.12] bg-white/[0.08] p-5 backdrop-blur">
              {session ? (
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#99f6e4]">
                    Current session
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{session.user.name}</h2>
                    <p className="text-sm text-slate-300">{session.user.email}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                      {username ? (
                        <span className="rounded-full border border-white/[0.14] px-3 py-1.5">
                          @{username}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/[0.14] px-3 py-1.5">
                        {session.user.emailVerified
                          ? "Email verified"
                          : "Email not verified"}
                      </span>
                    </div>
                  </div>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-[#111827] transition hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#99f6e4]">
                    Included flows
                  </p>
                  <ul className="space-y-3 text-sm leading-6 text-slate-200">
                    {authFlows.map((flow) => (
                      <li
                        key={flow}
                        className="rounded-2xl border border-white/[0.08] bg-black/[0.12] px-4 py-3"
                      >
                        {flow}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {starterHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-black/[0.08] bg-white/[0.88] p-6 shadow-xl shadow-[#d6cfc3]/40 backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c5c1d]">
                  {item.title}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0f172a]">
                  {item.title === "Starter UX" ? "Actually usable from day one." : item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-black/[0.08] bg-[#f8f4ec] p-6 shadow-xl shadow-[#d6cfc3]/40">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c5c1d]">
              Quick setup
            </p>
            <div className="mt-5 space-y-4">
              {setupSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-[1.4rem] border border-black/[0.06] bg-white/[0.72] p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/[0.88] p-6 shadow-xl shadow-[#d6cfc3]/40 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c5c1d]">
              Auth checklist
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {authFlows.map((flow) => (
                <li
                  key={flow}
                  className="rounded-[1.25rem] border border-black/[0.06] bg-[#faf7f2] px-4 py-3"
                >
                  {flow}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-black/[0.08] bg-[#111827] p-6 text-white shadow-2xl shadow-[#111827]/20">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#99f6e4]">
              Starter env
            </p>
            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-white/[0.1] bg-black/[0.22]">
              <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200">
                <code>{envSnippet}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The README now documents Google OAuth, email/password + username
              auth, registration, verification, password reset, and Drizzle
              setup.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
