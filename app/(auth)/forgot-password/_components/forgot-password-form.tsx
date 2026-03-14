"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestReset } from "../_actions";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestReset, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="inline-flex w-fit rounded-full bg-[#f3ede2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5c1d]">
          Recovery
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
            Reset your password
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Enter your email and we’ll send a secure reset link.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
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
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
          />
        </div>
        {state?.message ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {state.message}
          </p>
        ) : null}
        {state?.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={pending}
        >
          {pending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-slate-900 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
