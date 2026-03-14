"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { signUp } from "../_actions";
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
import {
  passwordRequirements,
  usernameRequirements,
} from "@/lib/app-config";

type Props = {
  googleEnabled: boolean;
};

export default function RegisterForm({ googleEnabled }: Props) {
  const [state, signUpAction, signingUp] = useActionState(signUp, {});
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

  const handleGoogleSignUp = () => {
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
        setGoogleError("Unable to start Google sign up.");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Username, email, password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {googleEnabled ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
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

        <form action={signUpAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              defaultValue={state?.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              defaultValue={state?.username}
              placeholder="jane.doe"
            />
            <p className="text-xs text-muted-foreground">
              {usernameRequirements}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state?.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-muted-foreground">
              {passwordRequirements}
            </p>
          </div>
          {state?.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          {state?.message ? (
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" className="w-full" disabled={signingUp}>
            {signingUp ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {state?.existingEmail ? (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-foreground">
              Account already exists for this email.
            </p>
            <div className="grid gap-2">
              <form action={resendAction}>
                <input type="hidden" name="email" value={state.email ?? ""} />
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
                <input type="hidden" name="email" value={state.email ?? ""} />
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
              <Alert>
                <AlertDescription>{resendState.message}</AlertDescription>
              </Alert>
            ) : null}
            {resendState?.error ? (
              <Alert variant="destructive">
                <AlertDescription>{resendState.error}</AlertDescription>
              </Alert>
            ) : null}
            {resetState?.message ? (
              <Alert>
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
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>Already have an account?</span>
        <Button asChild variant="link" className="h-auto p-0 pl-2">
          <Link href="/login">Sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
