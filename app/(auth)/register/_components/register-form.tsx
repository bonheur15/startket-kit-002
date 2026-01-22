"use client";

import { useActionState } from "react";
import { signUp, signUpWithGoogle } from "../_actions";

export default function RegisterForm() {
  const [state, signUpAction, signingUp] = useActionState(signUp, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-zinc-500">
          Start with email and password or continue with Google.
        </p>
      </div>

      <form action={signUpWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />
        <span>or</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <form action={signUpAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-700"
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
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
          />
        </div>
        {state?.error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-500"
          disabled={signingUp}
        >
          {signingUp ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-zinc-700 hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
}
