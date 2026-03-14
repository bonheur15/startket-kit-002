import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { HubMail } from "hubmail";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  appName,
  authEmailFrom,
  baseURL,
  getTrustedOrigins,
  googleProvider,
  reservedUsernames,
  usernamePattern,
} from "@/lib/app-config";

const hubmail = process.env.HUBMAIL_KEY ? new HubMail() : null;
const authSecret =
  process.env.BETTER_AUTH_SECRET || "replace-this-starter-secret";

const inferOriginFromHost = (host: string, proto?: string | null) => {
  const normalizedProto =
    proto === "http" || proto === "https"
      ? proto
      : host.startsWith("localhost") ||
          host.startsWith("127.0.0.1") ||
          host.startsWith("[::1]")
        ? "http"
        : new URL(baseURL).protocol.replace(":", "");

  return `${normalizedProto}://${host}`;
};

const getOriginFromHeaders = (headerStore: Pick<Headers, "get">) => {
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");

  if (!host) {
    return undefined;
  }

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const proto = forwardedProto?.split(",")[0]?.trim();

  return inferOriginFromHost(host, proto);
};

const resolveAuthOrigin = async (request?: Request) => {
  try {
    if (request?.url) {
      return new URL(request.url).origin;
    }
  } catch {
    // Fall back to request headers when URL parsing is not usable.
  }

  if (request) {
    const headerOrigin = getOriginFromHeaders(request.headers);

    if (headerOrigin) {
      return headerOrigin;
    }
  }

  try {
    const headerStore = await headers();
    const headerOrigin = getOriginFromHeaders(headerStore);

    if (headerOrigin) {
      return headerOrigin;
    }
  } catch {
    // `headers()` is unavailable outside a request scope.
  }

  return new URL(baseURL).origin;
};

const sendAuthEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  if (!hubmail) {
    console.info(
      `[auth-email] ${subject}\nTo: ${to}\nText preview:\n${text}\n`,
    );
    return;
  }

  await hubmail.send({
    from: authEmailFrom,
    to: [to],
    subject,
    text,
    html,
  });
};

const createAuth = (origin: string) =>
  betterAuth({
    appName,
    baseURL: origin,
    secret: authSecret,
    trustedOrigins: getTrustedOrigins(origin),
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    socialProviders: googleProvider ? { google: googleProvider } : {},
    plugins: [
      nextCookies(),
      username({
        minUsernameLength: 3,
        maxUsernameLength: 24,
        usernameValidator: (value) => {
          const normalized = value.trim().toLowerCase();
          return (
            usernamePattern.test(normalized) &&
            !reservedUsernames.has(normalized)
          );
        },
        usernameNormalization: (value) => value.trim().toLowerCase(),
      }),
    ],
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      sendVerificationEmail: async ({ user, url }) => {
        const subject = `${appName} email verification`;
        const text = `Hello ${user.name || "there"},\n\nVerify your email to continue:\n${url}\n\nIf you did not request this, you can ignore this message.`;
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Verify your email</h2>
            <p>Hello ${user.name || "there"},</p>
            <p>Verify your email to continue:</p>
            <p><a href="${url}">Verify email</a></p>
            <p>If you did not request this, you can ignore this message.</p>
          </div>
        `;
        await sendAuthEmail({ to: user.email, subject, text, html });
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        const subject = `${appName} password reset`;
        const text = `Hello ${user.name || "there"},\n\nReset your password:\n${url}\n\nIf you did not request this, you can ignore this message.`;
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Reset your password</h2>
            <p>Hello ${user.name || "there"},</p>
            <p>Reset your password using the link below:</p>
            <p><a href="${url}">Reset password</a></p>
            <p>If you did not request this, you can ignore this message.</p>
          </div>
        `;
        await sendAuthEmail({ to: user.email, subject, text, html });
      },
    },
  });

export const auth = createAuth(new URL(baseURL).origin);

export const getAuth = async (request?: Request) =>
  createAuth(await resolveAuthOrigin(request));
