"use server";

import { BASE_ERROR_CODES } from "@better-auth/core/error";
import { APIError } from "better-call";
import { eq } from "drizzle-orm";
import { getAuth } from "@/auth";
import { getBaseUrl } from "@/app/(auth)/_utils/auth-urls";
import { db } from "@/db";
import { user } from "@/db/schema";
import {
  getValidationMessage,
  isEmailIdentifier,
  passwordResetRequestSchema,
} from "@/lib/auth-form-schemas";

export type RecoveryState = {
  error?: string;
  message?: string;
  email?: string;
  verified?: boolean;
};

export const lookupRecoveryEmail = async (identifier: string) => {
  const normalized = identifier.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (isEmailIdentifier(normalized)) {
    return normalized;
  }

  const [match] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.username, normalized))
    .limit(1);

  return match?.email;
};

export const resendVerificationEmail = async (
  _: RecoveryState,
  formData: FormData,
): Promise<RecoveryState> => {
  const parsed = passwordResetRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const { email } = parsed.data;

  try {
    const auth = await getAuth();
    const baseUrl = await getBaseUrl();
    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: `${baseUrl}/login?verified=1`,
      },
    });

    return {
      email,
      message: "Verification email sent. Check your inbox.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.message === BASE_ERROR_CODES.EMAIL_ALREADY_VERIFIED) {
        return {
          email,
          verified: true,
          message:
            "This email is already verified. You can sign in or reset the password instead.",
        };
      }

      return {
        email,
        error: error.message || "Unable to resend verification email.",
      };
    }

    return { email, error: "Unable to resend verification email." };
  }
};

export const requestPasswordReset = async (
  _: RecoveryState,
  formData: FormData,
): Promise<RecoveryState> => {
  const parsed = passwordResetRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const { email } = parsed.data;

  try {
    const auth = await getAuth();
    const baseUrl = await getBaseUrl();
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

    return {
      email,
      message: "Password reset link sent. Check your email.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        email,
        error: error.message || "Unable to send the password reset link.",
      };
    }

    return { email, error: "Unable to send the password reset link." };
  }
};
