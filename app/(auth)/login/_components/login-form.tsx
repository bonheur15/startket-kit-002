"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signInWithGoogle } from "../_actions";
import {
  requestPasswordReset,
  resendVerificationEmail,
} from "@/app/(auth)/_actions/recovery";

type Props = {
  googleEnabled: boolean;
  statusMessage?: string;
};

export default function LoginForm({ googleEnabled, statusMessage }: Props) {
  const [state, signInAction, signingIn] = useActionState(signIn, {});
  const [resendState, resendAction, resending] = useActionState(
    resendVerificationEmail,
    {},
  );
  const [resetState, resetAction, resetting] = useActionState(
    requestPasswordReset,
    {},
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="inline-flex w-fit rounded-full bg-[#f3ede2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5c1d]">
          Login
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
            Welcome back
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Sign in with your email or username. Google OAuth is optional and
            appears when configured.
          </p>
        </div>
        {statusMessage ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {statusMessage}
          </p>
        ) : null}
      </div>

      {googleEnabled ? (
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-slate-800 transition hover:border-black/[0.15] hover:bg-slate-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-white">
              G
            </span>
            Continue with Google
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/10 bg-[#f8f6f1] px-4 py-3 text-sm text-slate-600">
          Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable Google
          sign-in.
        </div>
      )}

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
        <span className="h-px flex-1 bg-black/[0.08]" />
        <span>or</span>
        <span className="h-px flex-1 bg-black/[0.08]" />
      </div>

      <form action={signInAction} className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="identifier"
          >
            Email or username
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            defaultValue={state?.identifier}
            placeholder="you@example.com or jdoe"
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
        </div>
        {state?.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={signingIn}
        >
          {signingIn ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {state?.needsVerification && state.recoveryEmail ? (
        <div className="space-y-3 rounded-[1.5rem] border border-black/[0.08] bg-[#f8f6f1] p-4 text-sm text-slate-700">
          <p>
            Your account needs email verification before it can sign in.
          </p>
          <div className="flex flex-col gap-2">
            <form action={resendAction}>
              <input type="hidden" name="email" value={state.recoveryEmail ?? ""} />
              <button
                type="submit"
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            </form>
            <form action={resetAction}>
              <input type="hidden" name="email" value={state.recoveryEmail ?? ""} />
              <button
                type="submit"
                className="h-11 w-full rounded-2xl bg-[#e7eef8] px-4 text-sm font-semibold text-slate-900 transition hover:bg-[#dce7f5] disabled:cursor-not-allowed"
                disabled={resetting}
              >
                {resetting ? "Sending..." : "Send password reset instead"}
              </button>
            </form>
          </div>
          {resendState?.message ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
              {resendState.message}
            </p>
          ) : null}
          {resendState?.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
              {resendState.error}
            </p>
          ) : null}
          {resetState?.message ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
              {resetState.message}
            </p>
          ) : null}
          {resetState?.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
              {resetState.error}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link
          href="/forgot-password"
          className="transition hover:text-slate-900"
        >
          Forgot password?
        </Link>
        <Link
          href="/register"
          className="font-medium transition hover:text-slate-900"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
