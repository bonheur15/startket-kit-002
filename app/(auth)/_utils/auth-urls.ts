import { headers } from "next/headers";
import { baseURL } from "@/lib/app-config";

const getOriginFromHeaders = (headerStore: Pick<Headers, "get">) => {
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");

  if (!host) {
    return undefined;
  }

  const forwardedProto = headerStore.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0]?.trim() ||
    (host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("[::1]")
      ? "http"
      : new URL(baseURL).protocol.replace(":", ""));

  return `${proto}://${host}`;
};

export const getBaseUrl = async () => {
  try {
    const headerStore = await headers();
    const origin = getOriginFromHeaders(headerStore);

    if (origin) {
      return origin;
    }
  } catch {
    // `headers()` is unavailable outside a request scope.
  }

  return new URL(baseURL).origin;
};

export const getAppOrigin = async () => new URL(await getBaseUrl()).origin;
