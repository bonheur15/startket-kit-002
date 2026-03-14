import Link from "next/link";
import type { ReactNode } from "react";
import { appName } from "@/lib/app-config";

const featureCards = [
  {
    title: "Email + username",
    copy: "Sign in with either email or username, with verification and recovery built in.",
  },
  {
    title: "Google OAuth",
    copy: "Drop in client credentials and Google sign-in becomes available without more wiring.",
  },
  {
    title: "Password reset",
    copy: "Reset links, session revocation, and validation are already hooked up.",
  },
  {
    title: "Postgres + Drizzle",
    copy: "A single schema file powers Better Auth tables and your starter database setup.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5efe6] px-4 py-4 text-[#0f172a] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#111827] p-8 text-white shadow-2xl shadow-[#111827]/20 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.34),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.24),_transparent_35%)]" />
          <div className="relative flex h-full flex-col gap-8">
            <div className="space-y-5">
              <Link
                href="/"
                className="inline-flex w-fit items-center rounded-full border border-white/[0.15] bg-white/10 px-4 py-2 text-sm font-medium tracking-[0.16em] text-white/90 uppercase backdrop-blur"
              >
                {appName}
              </Link>
              <div className="max-w-xl space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#99f6e4]">
                  Auth starter
                </p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Start with a complete auth stack instead of a blank shell.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  PostgreSQL, Better Auth, Next.js, and Drizzle are already
                  wired together with register, login, password reset, Google
                  OAuth, and email verification flows.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {card.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              <span className="rounded-full border border-white/[0.15] px-3 py-1.5">
                App Router
              </span>
              <span className="rounded-full border border-white/[0.15] px-3 py-1.5">
                Better Auth
              </span>
              <span className="rounded-full border border-white/[0.15] px-3 py-1.5">
                Drizzle ORM
              </span>
              <span className="rounded-full border border-white/[0.15] px-3 py-1.5">
                Google OAuth
              </span>
              <span className="rounded-full border border-white/[0.15] px-3 py-1.5">
                Password Reset
              </span>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-black/[0.08] bg-white/[0.88] p-6 shadow-2xl shadow-[#d6cfc3]/50 backdrop-blur sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
