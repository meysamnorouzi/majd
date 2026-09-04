import type { Service } from "@/types";

export const SERVICE_CATEGORY_PREFIXES = [
  "family-lawyer",
  "property-lawyer",
  "criminal-defense-lawyer",
  "legal-consultation",
  "administrative-lawyer",
] as const;

export type ServiceCategoryPrefix =
  (typeof SERVICE_CATEGORY_PREFIXES)[number];

/** First pillar — used where a single «خدمات» href is still required. */
export const SERVICES_INDEX_PATH = "/family-lawyer/";

/** WordPress mega-root slugs (and merges) → public URL prefix */
export const WP_ROOT_TO_PREFIX: Record<string, ServiceCategoryPrefix> = {
  خانواده: "family-lawyer",
  "khanavade-fa": "family-lawyer",
  "خانواده-fa": "family-lawyer",
  ملکی: "property-lawyer",
  کیفری: "criminal-defense-lawyer",
  "مشاوره-حقوقی": "legal-consultation",
  مشاوره: "legal-consultation",
  moshavere: "legal-consultation",
  اداری: "administrative-lawyer",
  "وکیل-اداری": "administrative-lawyer",
  "دیوان-عدالت": "administrative-lawyer",
};

/** Fallback parent slugs in site.ts → public URL prefix */
export const FALLBACK_PARENT_TO_PREFIX: Record<string, ServiceCategoryPrefix> =
  {
    "vakalat-khanavade": "family-lawyer",
    "vakalat-melki": "property-lawyer",
    "vakalat-keyfari": "criminal-defense-lawyer",
    "moshavere-hoghooghi": "legal-consultation",
    "vosool-matalabat": "legal-consultation",
    "vakalat-hoghooghi": "administrative-lawyer",
  };

const PREFIX_SET = new Set<string>(SERVICE_CATEGORY_PREFIXES);

export function isServiceCategoryPrefix(
  value: string | undefined | null,
): value is ServiceCategoryPrefix {
  return Boolean(value && PREFIX_SET.has(value));
}

export function prefixForWpRootSlug(
  slug: string | undefined,
): ServiceCategoryPrefix | undefined {
  if (!slug) return undefined;
  return WP_ROOT_TO_PREFIX[slug];
}

export function prefixForFallbackParent(
  slug: string | undefined,
): ServiceCategoryPrefix | undefined {
  if (!slug) return undefined;
  return FALLBACK_PARENT_TO_PREFIX[slug];
}

export function hubPath(prefix: ServiceCategoryPrefix): string {
  return `/${prefix}/`;
}

/**
 * Category groupings in the mega tree (WP child cats / fallback parents).
 * They organize the menu but must not be linked as service posts — hubs are
 * the `/{prefix}/` pages.
 */
export function isServiceCategoryNode(service: Service): boolean {
  if (service.id.startsWith("cat-")) return true;
  if (WP_ROOT_TO_PREFIX[service.slug]) return true;
  if (FALLBACK_PARENT_TO_PREFIX[service.slug]) return true;
  return false;
}

/** Canonical public path for a service post. Hubs use `hubPath()`. */
export function servicePath(
  service: Pick<Service, "slug" | "categoryPrefix">,
  /** When WP omits category, keep the pillar the visitor already requested. */
  urlPrefix?: ServiceCategoryPrefix,
): string {
  const prefix = isServiceCategoryPrefix(service.categoryPrefix)
    ? service.categoryPrefix
    : urlPrefix;
  if (isServiceCategoryPrefix(prefix)) {
    if (FALLBACK_PARENT_TO_PREFIX[service.slug] === prefix) {
      return hubPath(prefix);
    }
    return `/${prefix}/${service.slug}/`;
  }
  return hubPath("legal-consultation");
}

export function servicePathFromParts(
  categoryPrefix: ServiceCategoryPrefix,
  slug: string,
): string {
  return `/${categoryPrefix}/${slug}/`;
}

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** Decode percent-encoding repeatedly so `/foo/` and `/%D8%foo/` compare equal. */
export function decodePathSegment(segment: string): string {
  let current = segment.trim();
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}

function normalizeServicePath(pathname: string): string {
  const normalized = normalizePathname(pathname);
  const segments = normalized.split("/").filter(Boolean).map(decodePathSegment);
  if (!segments.length) return "/";
  return `/${segments.join("/")}/`;
}

/** Compare prefix + slug instead of raw strings (avoids Persian encoding loops). */
export function servicePathMatchesLocation(
  pathname: string,
  service: Pick<Service, "slug" | "categoryPrefix">,
): boolean {
  const expected = normalizeServicePath(servicePath(service, categoryPrefixFromPathname(pathname)));
  const actual = normalizeServicePath(pathname);
  return actual === expected;
}

export function isServiceNavPath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  if (normalized === "/services" || normalized.startsWith("/services/")) {
    return true;
  }
  return SERVICE_CATEGORY_PREFIXES.some(
    (prefix) =>
      normalized === `/${prefix}` || normalized.startsWith(`/${prefix}/`),
  );
}

export function isCategorizedServicePath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return SERVICE_CATEGORY_PREFIXES.some((prefix) =>
    normalized.startsWith(`/${prefix}/`),
  );
}

/**
 * Read the service slug off a public pathname.
 * Handles `/{category}/{slug}/`, legacy `/services/{slug}/`, and SPA shells.
 */
export function serviceSlugFromPathname(pathname: string): string {
  const normalized = normalizePathname(pathname);

  for (const prefix of SERVICE_CATEGORY_PREFIXES) {
    const base = `/${prefix}`;
    if (normalized === base) return "";
    if (!normalized.startsWith(`${base}/`)) continue;
    const rest = normalized.slice(base.length + 1);
    const first = rest.split("/")[0] ?? "";
    if (!first || first === "view") return "";
    try {
      return decodeURIComponent(first);
    } catch {
      return first;
    }
  }

  const servicesBase = "/services";
  if (normalized.startsWith(`${servicesBase}/`)) {
    const rest = normalized.slice(servicesBase.length + 1);
    const first = rest.split("/")[0] ?? "";
    if (!first || first === "detail") return "";
    try {
      return decodeURIComponent(first);
    } catch {
      return first;
    }
  }

  return "";
}

export function categoryPrefixFromPathname(
  pathname: string,
): ServiceCategoryPrefix | undefined {
  const normalized = normalizePathname(pathname);
  const first = normalized.replace(/^\//, "").split("/")[0] ?? "";
  return isServiceCategoryPrefix(first) ? first : undefined;
}

export function getRelatedServices(
  services: Service[],
  current: Pick<Service, "slug" | "categoryPrefix">,
  limit = 6,
): Service[] {
  const others = services.filter(
    (s) =>
      s.slug !== current.slug &&
      !s.children?.length &&
      !isServiceCategoryNode(s),
  );
  const sameCategory = others.filter(
    (s) =>
      current.categoryPrefix && s.categoryPrefix === current.categoryPrefix,
  );
  const rest = others.filter(
    (s) => s.categoryPrefix !== current.categoryPrefix,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getRoutableServices(services: Service[]): Service[] {
  return services.filter((s) => !isServiceCategoryNode(s) && !s.children?.length);
}

/** Leaf services shown as cards on a pillar hub. */
export function getPillarChildServices(
  services: Service[],
  prefix: ServiceCategoryPrefix,
): Service[] {
  return getRoutableServices(services).filter(
    (service) => service.categoryPrefix === prefix,
  );
}

/** Leaves under a mega-menu pillar tree (child categories + direct posts). */
export function getPillarLeavesFromTree(tree: Service | undefined): Service[] {
  if (!tree) return [];
  const leaves: Service[] = [];
  const walk = (node: Service) => {
    if (node.children?.length) {
      for (const child of node.children) walk(child);
      return;
    }
    if (!isServiceCategoryNode(node)) leaves.push(node);
  };
  for (const child of tree.children ?? []) walk(child);
  return leaves;
}
