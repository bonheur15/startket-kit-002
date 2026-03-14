"use server";

import { APIError } from "better-call";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getValidationMessage,
  passwordResetSchema,
} from "@/lib/auth-form-schemas";

export type ResetState = {
  error?: string;
};

export const resetPassword = async (_: ResetState, formData: FormData): Promise<ResetState> => {
  const parsed = passwordResetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { error: getValidationMessage(parsed.error) };
  }

  const { token, password } = parsed.data;

  try {
    await auth.api.resetPassword({
      body: { newPassword: password, token },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message || "Unable to reset password." };
    }
    return { error: "Unable to reset password." };
  }

  redirect("/login?reset=1");
};
