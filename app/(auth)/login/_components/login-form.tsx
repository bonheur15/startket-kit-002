"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { signIn } from "../_actions";
import {
  requestPasswordReset,
  resendVerificationEmail,
} from "@/app/(auth)/_actions/recovery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

type Props = {
  googleEnabled: boolean;
  statusMessage?: string;
};

export default function LoginForm({ googleEnabled, statusMessage }: Props) {
  const [state, signInAction, signingIn] = useActionState(signIn, {});
  const [googleError, setGoogleError] = useState<string>();
  const [googlePending, startGoogleTransition] = useTransition();
  const [resendState, resendAction, resending] = useActionState(
    resendVerificationEmail,
    {},
  );
  const [resetState, resetAction, resetting] = useActionState(
    requestPasswordReset,
    {},
  );

  const handleGoogleSignIn = () => {
    setGoogleError(undefined);
    startGoogleTransition(async () => {
      try {
        const result = (await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        })) as { error?: { message?: string } | null } | undefined;

        if (result?.error?.message) {
          setGoogleError(result.error.message);
        }
      } catch {
        setGoogleError("Unable to start Google sign in.");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Email or username.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusMessage ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        ) : null}

        {googleEnabled ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googlePending}
            >
              {googlePending ? "Connecting..." : "Continue with Google"}
            </Button>
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
          </>
        ) : null}

        {googleError ? (
          <Alert variant="destructive">
            <AlertDescription>{googleError}</AlertDescription>
          </Alert>
        ) : null}

        <form action={signInAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or username</Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              defaultValue={state?.identifier}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state?.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" className="w-full" disabled={signingIn}>
            {signingIn ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {state?.needsVerification && state.recoveryEmail ? (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-foreground">Verify email first.</p>
            <div className="grid gap-2">
              <form action={resendAction}>
                <input
                  type="hidden"
                  name="email"
                  value={state.recoveryEmail ?? ""}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={resending}
                >
                  {resending ? "Sending..." : "Resend verification"}
                </Button>
              </form>
              <form action={resetAction}>
                <input
                  type="hidden"
                  name="email"
                  value={state.recoveryEmail ?? ""}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={resetting}
                >
                  {resetting ? "Sending..." : "Reset password"}
                </Button>
              </form>
            </div>
            {resendState?.message ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                <AlertDescription>{resendState.message}</AlertDescription>
              </Alert>
            ) : null}
            {resendState?.error ? (
              <Alert variant="destructive">
                <AlertDescription>{resendState.error}</AlertDescription>
              </Alert>
            ) : null}
            {resetState?.message ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                <AlertDescription>{resetState.message}</AlertDescription>
              </Alert>
            ) : null}
            {resetState?.error ? (
              <Alert variant="destructive">
                <AlertDescription>{resetState.error}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/forgot-password">Forgot password?</Link>
        </Button>
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/register">Create account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
