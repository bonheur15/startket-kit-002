const fallbackBaseUrl = "http://localhost:3000";

export const appName = process.env.APP_NAME?.trim() || "PgBetterAuth Starter";

export const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  fallbackBaseUrl;

export const appOrigin = new URL(baseURL).origin;

export const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || appOrigin
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const googleProvider = googleEnabled
  ? {
      prompt: "select_account" as const,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  : undefined;

export const authEmailFrom =
  process.env.AUTH_EMAIL_FROM ||
  process.env.HUBMAIL_FROM ||
  `no-reply@${new URL(baseURL).hostname.replace(/:\d+$/, "")}`;

export const usernamePattern = /^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*$/;

export const reservedUsernames = new Set([
  "about",
  "admin",
  "api",
  "auth",
  "billing",
  "dashboard",
  "docs",
  "help",
  "home",
  "login",
  "logout",
  "me",
  "pricing",
  "register",
  "root",
  "settings",
  "signup",
  "support",
  "system",
  "uaway",
]);

export const usernameRequirements =
  "3-24 characters. Use letters, numbers, dots, underscores, or hyphens.";

export const passwordRequirements =
  "Use 8-72 characters with uppercase, lowercase, and a number.";
