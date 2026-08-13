import { enhanceWpContentHtml } from "@/lib/wordpress/content-html";

export const WP_URL =
  process.env.NEXT_PUBLIC_WP_URL ?? "https://admin.vakilmajd.com";

const WP_ORIGIN = WP_URL.replace(/\/$/, "");

/** Public frontend origin whose /wp-content media must be served from WP. */
const SITE_MEDIA_HOSTS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vakilmajd.com",
  "https://vakilmajd.com",
  "http://vakilmajd.com",
  "https://www.vakilmajd.com",
  "http://www.vakilmajd.com",
]
  .map((u) => u.replace(/\/$/, ""))
  .filter((u, i, arr) => arr.indexOf(u) === i);

/**
 * Point WordPress media URLs at the WP host (admin), not the public site.
 * Only rewrites `/wp-content/` paths so page links stay on the site domain.
 */
export function rewriteWpMediaUrl(url: string): string {
  let out = url;
  for (const origin of SITE_MEDIA_HOSTS) {
    if (origin === WP_ORIGIN) continue;
    out = out.split(`${origin}/wp-content/`).join(`${WP_ORIGIN}/wp-content/`);
  }
  return out;
}

/**
 * Fix Word/WordPress RTL export quirks (reversed "5." → ".5", LTR-wrapped periods),
 * rewrite media URLs to the WP host, and wrap inline contact callout blocks.
 */
export function normalizeWpContentHtml(html: string): string {
  let out = rewriteWpMediaUrl(html);

  // Lone "." forced LTR breaks Persian sentence endings — unwrap to plain text
  out = out.replace(
    /<span\b[^>]*\bdir=["']LTR["'][^>]*>\s*([.…]+)\s*<\/span>/gi,
    "$1",
  );

  // Keep "5. " / "12) " labels as digit-then-dot inside an LTR isolate
  out = out.replace(
    /<span\b([^>]*\bdir=["']LTR["'][^>]*)>(\s*\d+[.)]\s*)<\/span>/gi,
    '<span$1 class="wp-ltr-num">$2</span>',
  );

  // Persian digits often split from their period: ۱</span><span dir="LTR">. </span>
  out = out.replace(
    /([\u06F0-\u06F9\u0660-\u0669]+)\s*<\/span>\s*(?:<\/b>\s*)?<span\b[^>]*\bdir=["']LTR["'][^>]*>\s*([.)])\s*<\/span>/gi,
    "$1$2</span>",
  );

  return enhanceWpContentHtml(out);
}
export function rewriteWpMediaInHtml(html: string): string {
  return normalizeWpContentHtml(html);
}

export function wpApiUrl(path: string): string {
  return `${WP_ORIGIN}${path}`;
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
