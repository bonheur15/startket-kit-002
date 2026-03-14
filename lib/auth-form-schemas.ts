import { z } from "zod";
import { passwordRequirements, usernamePattern } from "@/lib/app-config";

const requiredText = (message: string) =>
  z.string().trim().min(1, message);

export const nameSchema = requiredText("Full name is required.")
  .min(2, "Full name must be at least 2 characters.")
  .max(60, "Full name must be 60 characters or fewer.");

export const emailSchema = requiredText("Email is required.")
  .toLowerCase()
  .email("Enter a valid email address.");

export const usernameSchema = requiredText("Username is required.")
  .min(3, "Username must be at least 3 characters.")
  .max(24, "Username must be 24 characters or fewer.")
  .regex(
    usernamePattern,
    "Username can only contain letters, numbers, dots, underscores, and hyphens.",
  )
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, passwordRequirements)
  .max(72, "Password must be 72 characters or fewer.")
  .refine((value) => /[a-z]/.test(value), passwordRequirements)
  .refine((value) => /[A-Z]/.test(value), passwordRequirements)
  .refine((value) => /\d/.test(value), passwordRequirements);

export const signInSchema = z.object({
  identifier: requiredText("Email or username is required.").toLowerCase(),
  password: requiredText("Password is required."),
});

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z
  .object({
    token: requiredText("Reset token is missing."),
    password: passwordSchema,
    confirm: requiredText("Confirm your password."),
  })
  .superRefine(({ password, confirm }, ctx) => {
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm"],
        message: "Passwords do not match.",
      });
    }
  });

export const isEmailIdentifier = (value: string) => value.includes("@");

export const getValidationMessage = (error: z.ZodError) =>
  error.issues[0]?.message || "Check the highlighted fields and try again.";
