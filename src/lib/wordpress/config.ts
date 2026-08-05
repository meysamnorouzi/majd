export const WP_URL =
  process.env.NEXT_PUBLIC_WP_URL ?? "https://admin.vakilmajd.com";

export function wpApiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}

/**
 * Server-only headers for WordPress REST (no Origin in Node fetch).
 * Must match the whitelist plugin `X-Api-Key` secret on the WP host.
 */
export function wpServerHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const apiKey = process.env.WP_API_KEY;
  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }
  return headers;
}
