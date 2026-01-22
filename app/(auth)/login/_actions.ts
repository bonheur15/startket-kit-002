"use server";

import { APIError } from "better-call";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { applySetCookie } from "@/app/(auth)/_utils/auth-cookies";
import { getBaseUrl } from "@/app/(auth)/_utils/auth-urls";

export type SignInState = {
  error?: string;
  message?: string;
};

const getCallbackUrl = () => `${getBaseUrl()}/login?verified=1`;

export const signIn = async (_: SignInState, formData: FormData) => {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let result: Awaited<ReturnType<typeof auth.api.signInEmail>>;
  try {
    result = await auth.api.signInEmail({
      body: { email, password, callbackURL: getCallbackUrl() },
      returnHeaders: true,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message || "Unable to sign in." };
    }
    return { error: "Unable to sign in." };
  }

  await applySetCookie(result.headers);
  redirect("/");
};

export const signInWithGoogle = async () => {
  const result = await auth.api.signInSocial({
    body: { provider: "google", disableRedirect: true },
  });

  if (!result?.url) {
    throw new Error("Google sign-in is not available.");
  }

  redirect(result.url);
};

export const resendVerification = async (
  _: SignInState,
  formData: FormData,
) => {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    return { error: "Email is required to resend verification." };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: { email, callbackURL: getCallbackUrl() },
    });
    return { message: "Verification email sent. Check your inbox." };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message || "Unable to resend verification." };
    }
    return { error: "Unable to resend verification." };
  }
};
