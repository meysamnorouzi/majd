import data from "@/data/legacy-redirects.json";

export interface LegacyRedirect {
  /** Old path, decoded, with leading + trailing slash */
  from: string;
  /** New path, decoded, with leading + trailing slash */
  to: string;
  /** Why the URL was retired (audit note, Persian) */
  reason: string;
}

export interface RestoredPage {
  /** Public path the page must answer on again (root level, decoded) */
  path: string;
  /** WordPress post slug that holds the content for this path */
  wpSlug: string;
  /** Fallback title when WordPress is unreachable at build time */
  title: string;
  /** Fallback meta description when WordPress is unreachable at build time */
  description: string;
  reason: string;
}

export const legacyRedirects: LegacyRedirect[] = data.redirects;
export const restoredPages: RestoredPage[] = data.restoredPages;

/** `/services/وکیل-x/` and `/services/%D9%88.../` both normalize to the same key. */
function normalizePath(path: string): string {
  let current = (path.split("?")[0] ?? "").split("#")[0] ?? "";
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }
  if (!current.startsWith("/")) current = `/${current}`;
  return current.endsWith("/") ? current : `${current}/`;
}

const redirectByPath = new Map(
  legacyRedirects.map((r) => [normalizePath(r.from), r.to]),
);

/** Target path for a retired URL, or null when the path is still live. */
export function findLegacyRedirect(path: string): string | null {
  return redirectByPath.get(normalizePath(path)) ?? null;
}

const redirectedServiceSlugs = new Set(
  legacyRedirects
    .map((r) => normalizePath(r.from))
    .filter((p) => p.startsWith("/services/"))
    .map((p) => p.slice("/services/".length).replace(/\/$/, "")),
);

/**
 * Retired service slugs must not be linked from the mega menu, the services
 * index, related-service rails or the sitemap — every one of them 301s away.
 */
export function isRetiredServiceSlug(slug: string): boolean {
  return redirectedServiceSlugs.has(normalizePath(slug).replace(/^\/|\/$/g, ""));
}

const restoredWpSlugs = new Set(restoredPages.map((page) => page.wpSlug));

/**
 * A restored page's WordPress post is served at its own root path — it must not
 * also be advertised as `/blogs/<slug>/`, which would split the ranking signal.
 */
export function isRestoredPageWpSlug(slug: string): boolean {
  return restoredWpSlugs.has(normalizePath(slug).replace(/^\/|\/$/g, ""));
}

export function findRestoredPage(slug: string): RestoredPage | null {
  const target = normalizePath(slug);
  return (
    restoredPages.find((page) => normalizePath(page.path) === target) ?? null
  );
}
