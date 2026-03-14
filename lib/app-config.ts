const fallbackBaseUrl = "http://localhost:3000";

const isLocalDevHost = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const normalizeTrustedOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
};

const getGoogleClientId = () =>
  process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID;

const getGoogleClientSecret = () =>
  process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET;

export const appName = process.env.APP_NAME?.trim() || "PgBetterAuth Starter";

export const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  fallbackBaseUrl;

export const appOrigin = new URL(baseURL).origin;

const configuredTrustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS || appOrigin
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localDevOrigins = isLocalDevHost(new URL(baseURL).hostname)
  ? ["http://localhost:3000", "http://127.0.0.1:3000"]
  : [];

export const getTrustedOrigins = (origin?: string) =>
  Array.from(
    new Set(
      [origin, appOrigin, ...configuredTrustedOrigins, ...localDevOrigins]
        .filter(Boolean)
        .map((value) => normalizeTrustedOrigin(value!)),
    ),
  );

export const trustedOrigins = getTrustedOrigins();

export const isGoogleEnabled = () =>
  Boolean(getGoogleClientId() && getGoogleClientSecret());

export const googleEnabled = isGoogleEnabled();

export const googleProvider = googleEnabled
  ? {
      prompt: "select_account" as const,
      clientId: getGoogleClientId()!,
      clientSecret: getGoogleClientSecret()!,
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
