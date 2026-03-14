"use server";

import { APIError } from "better-call";
import { redirect } from "next/navigation";
import { BASE_ERROR_CODES } from "@better-auth/core/error";
import { USERNAME_ERROR_CODES } from "better-auth/plugins";
import { getAuth } from "@/auth";
import { applySetCookie } from "@/app/(auth)/_utils/auth-cookies";
import { getBaseUrl } from "@/app/(auth)/_utils/auth-urls";
import { googleEnabled } from "@/lib/app-config";
import { getValidationMessage, signUpSchema } from "@/lib/auth-form-schemas";

export type SignUpState = {
  error?: string;
  message?: string;
  existingEmail?: boolean;
  email?: string;
  username?: string;
  name?: string;
};

const getCallbackUrl = async () => `${await getBaseUrl()}/login?signup=1`;

export const signUp = async (_: SignUpState, formData: FormData): Promise<SignUpState> => {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: getValidationMessage(parsed.error),
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),
      username: String(formData.get("username") || "")
        .trim()
        .toLowerCase(),
    };
  }

  const { name, email, username, password } = parsed.data;

  try {
    const auth = await getAuth();
    const callbackURL = await getCallbackUrl();
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        username,
        password,
        callbackURL,
      },
      returnHeaders: true,
    });
    await applySetCookie(result.headers);
    redirect("/login?signup=1");
  } catch (error) {
    if (error instanceof APIError) {
      if (
        error.message ===
        BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
      ) {
        return {
          name,
          existingEmail: true,
          email,
          username,
          message:
            "This email already has an account. Would you like us to resend the verification email or reset your password?",
        };
      }

      if (error.message === USERNAME_ERROR_CODES.USERNAME_IS_ALREADY_TAKEN) {
        return {
          name,
          email,
          username,
          error: "That username is already taken. Try another one.",
        };
      }

      return {
        name,
        email,
        username,
        error: error.message || "Unable to sign up.",
      };
    }

    return { name, email, username, error: "Unable to sign up." };
  }
};

export const signUpWithGoogle = async () => {
  if (!googleEnabled) {
    throw new Error("Google sign-up is not configured.");
  }

  const auth = await getAuth();
  const baseUrl = await getBaseUrl();
  const result = (await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: `${baseUrl}/`,
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
    throw new Error("Google sign-up is not available.");
  }

  redirect(redirectUrl);
};
