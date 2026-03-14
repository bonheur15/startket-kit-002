"use server";

import { BASE_ERROR_CODES } from "@better-auth/core/error";
import { APIError } from "better-call";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { applySetCookie } from "@/app/(auth)/_utils/auth-cookies";
import { getBaseUrl } from "@/app/(auth)/_utils/auth-urls";
import { googleEnabled } from "@/lib/app-config";
import {
  getValidationMessage,
  isEmailIdentifier,
  signInSchema,
} from "@/lib/auth-form-schemas";
import { lookupRecoveryEmail } from "@/app/(auth)/_actions/recovery";

export type SignInState = {
  error?: string;
  message?: string;
  identifier?: string;
  recoveryEmail?: string;
  needsVerification?: boolean;
};

const getCallbackUrl = () => `${getBaseUrl()}/login?verified=1`;

export const signIn = async (_: SignInState, formData: FormData): Promise<SignInState> => {
  const parsed = signInSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: getValidationMessage(parsed.error),
      identifier: String(formData.get("identifier") || "")
        .trim()
        .toLowerCase(),
    };
  }

  const { identifier, password } = parsed.data;

  try {
    const result = isEmailIdentifier(identifier)
      ? await auth.api.signInEmail({
          body: { email: identifier, password, callbackURL: getCallbackUrl() },
          returnHeaders: true,
        })
      : await auth.api.signInUsername({
          body: {
            username: identifier,
            password,
            callbackURL: getCallbackUrl(),
          },
          returnHeaders: true,
        });

    await applySetCookie(result.headers);
    redirect("/");
  } catch (error) {
    if (error instanceof APIError) {
      if (error.message === BASE_ERROR_CODES.EMAIL_NOT_VERIFIED) {
        const recoveryEmail = await lookupRecoveryEmail(identifier);

        return {
          identifier,
          recoveryEmail,
          needsVerification: Boolean(recoveryEmail),
          error:
            "Verify your email before signing in. We can resend the verification link.",
        };
      }

      return { identifier, error: error.message || "Unable to sign in." };
    }

    return { identifier, error: "Unable to sign in." };
  }
};

export const signInWithGoogle = async () => {
  if (!googleEnabled) {
    throw new Error("Google sign-in is not configured.");
  }

  const result = (await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: `${getBaseUrl()}/`,
      disableRedirect: true,
    },
    returnHeaders: true,
  })) as {
    headers?: Headers;
    url?: string;
    response?: { url?: string };
  };

  await applySetCookie(result.headers);

  const redirectUrl = result.response?.url || result.url;

  if (!redirectUrl) {
    throw new Error("Google sign-in is not available.");
  }

  redirect(redirectUrl);
};
