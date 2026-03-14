"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, signUpWithGoogle } from "../_actions";
import {
  requestPasswordReset,
  resendVerificationEmail,
} from "@/app/(auth)/_actions/recovery";
import {
  passwordRequirements,
  usernameRequirements,
} from "@/lib/app-config";

type Props = {
  googleEnabled: boolean;
};

export default function RegisterForm({ googleEnabled }: Props) {
  const [state, signUpAction, signingUp] = useActionState(signUp, {});
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
          Register
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
            Create your account
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Start with name, username, email, and password. Google sign-up is
            available when its credentials are configured.
          </p>
        </div>
      </div>

      {googleEnabled ? (
        <form action={signUpWithGoogle}>
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
          sign-up.
        </div>
      )}

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
        <span className="h-px flex-1 bg-black/[0.08]" />
        <span>or</span>
        <span className="h-px flex-1 bg-black/[0.08]" />
      </div>

      <form action={signUpAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={state?.name}
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            defaultValue={state?.username}
            placeholder="jane.doe"
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
          <p className="text-xs leading-5 text-slate-500">
            {usernameRequirements}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state?.email}
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
            autoComplete="new-password"
            required
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
          <p className="text-xs leading-5 text-slate-500">
            {passwordRequirements}
          </p>
        </div>
        {state?.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {state.error}
          </p>
        ) : null}
        {state?.message ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={signingUp}
        >
          {signingUp ? "Creating account..." : "Create account"}
        </button>
      </form>

      {state?.existingEmail ? (
        <div className="space-y-3 rounded-[1.5rem] border border-black/[0.08] bg-[#f8f6f1] p-4 text-sm text-slate-700">
          <p>
            This email already has an account. Do you want us to resend the
            verification email or reset your password?
          </p>
          <div className="flex flex-col gap-2">
            <form action={resendAction}>
              <input type="hidden" name="email" value={state.email ?? ""} />
              <button
                type="submit"
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            </form>
            <form action={resetAction}>
              <input type="hidden" name="email" value={state.email ?? ""} />
              <button
                type="submit"
                className="h-11 w-full rounded-2xl bg-[#e7eef8] px-4 text-sm font-semibold text-slate-900 transition hover:bg-[#dce7f5] disabled:cursor-not-allowed"
                disabled={resetting}
              >
                {resetting ? "Sending..." : "Reset password"}
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

      <div className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-slate-900 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
