"use server";

import { APIError } from "better-call";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { applySetCookie } from "@/app/(auth)/_utils/auth-cookies";
import { getBaseUrl } from "@/app/(auth)/_utils/auth-urls";

export type SignUpState = {
  error?: string;
};

const getCallbackUrl = () => `${getBaseUrl()}/login?signup=1`;

export const signUp = async (_: SignUpState, formData: FormData) => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  let result: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
  try {
    result = await auth.api.signUpEmail({
      body: { name, email, password, callbackURL: getCallbackUrl() },
      returnHeaders: true,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message || "Unable to sign up." };
    }
    return { error: "Unable to sign up." };
  }

  await applySetCookie(result.headers);
  redirect("/login?signup=1");
};

export const signUpWithGoogle = async () => {
  const result = await auth.api.signInSocial({
    body: { provider: "google", disableRedirect: true },
  });

  if (!result?.url) {
    throw new Error("Google sign-up is not available.");
  }

  redirect(result.url);
};
