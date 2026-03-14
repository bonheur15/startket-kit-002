"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "../_actions";
import { passwordRequirements } from "@/lib/app-config";

type Props = {
  token: string;
  error?: string;
};

export default function ResetPasswordForm({ token, error }: Props) {
  const [state, formAction, pending] = useActionState(resetPassword, {});

  if (error) {
    return (
      <div className="space-y-4">
        <div className="inline-flex w-fit rounded-full bg-[#f3ede2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5c1d]">
          Recovery
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
            Reset link is invalid
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Request a fresh password reset email to continue.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <div className="inline-flex w-fit rounded-full bg-[#f3ede2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5c1d]">
          New password
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
            Choose a new password
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Use a strong password you have not used elsewhere.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="password"
          >
            New password
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
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="confirm"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
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
          disabled={pending}
        >
          {pending ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
