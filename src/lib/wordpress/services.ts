import { services as fallbackServices } from "@/data/site";
import { isRetiredServiceSlug } from "@/data/legacy-redirects";
import { enrichService } from "@/data/services-detail";
import {
  FALLBACK_PARENT_TO_PREFIX,
  getPillarLeavesFromTree,
  getRelatedServices,
  isServiceCategoryNode,
  prefixForWpRootSlug,
  type ServiceCategoryPrefix,
} from "@/lib/service-paths";
import {
  buildCategoryTree,
  findCategoryBySlug,
  flattenCategories,
  normalizeWpSlug,
} from "@/lib/wordpress/categories";
import { pickFeaturedImageUrl } from "@/lib/media/featured-image";
import {
  normalizeWpContentHtml,
  wpApiUrl,
  wpServerHeaders,
} from "@/lib/wordpress/config";
import { wpFetch } from "@/lib/wordpress/fetch";
import type { BlogCategory, Service, WpPost } from "@/types";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

function getFeaturedImage(post: WpPost): string | undefined {
  return pickFeaturedImageUrl(post._embedded?.["wp:featuredmedia"]?.[0]);
}

/** Mega menu roots — پنج پیلار اصلی */
export const SERVICE_MEGA_ROOTS = [
  {
    slug: "خانواده",
    prefix: "family-lawyer" as const,
    label: "وکیل خانواده",
    mergeSlugs: ["khanavade-fa", "خانواده-fa"],
  },
  {
    slug: "ملکی",
    prefix: "property-lawyer" as const,
    label: "وکیل ملکی",
    mergeSlugs: [] as string[],
  },
  {
    slug: "کیفری",
    prefix: "criminal-defense-lawyer" as const,
    label: "وکیل کیفری",
    mergeSlugs: [] as string[],
  },
  {
    slug: "مشاوره-حقوقی",
    prefix: "legal-consultation" as const,
    label: "مشاوره حقوقی",
    mergeSlugs: ["مشاوره", "moshavere"],
  },
  {
    slug: "اداری",
    prefix: "administrative-lawyer" as const,
    label: "وکیل اداری",
    mergeSlugs: ["وکیل-اداری", "دیوان-عدالت"],
  },
] as const;

/** Static fallback parent slugs in site.ts */
const FALLBACK_PARENT_SLUG: Record<
  (typeof SERVICE_MEGA_ROOTS)[number]["slug"],
  string
> = {
  خانواده: "vakalat-khanavade",
  ملکی: "vakalat-melki",
  کیفری: "vakalat-keyfari",
  "مشاوره-حقوقی": "moshavere-hoghooghi",
  اداری: "vakalat-hoghooghi",
};

/** Public ranking slugs that still use the static fallback tree when WP has no post. */
const FALLBACK_SLUG_ALIASES: Record<string, string> = {
  "وکیل-خلع-ید": "khale-yad",
  "وکیل-متخصص-سرقفلی": "malek-mostajer",
};

export interface MegaMenuItem {
  slug: string;
  label: string;
}

export interface ServiceMenuData {
  megaMenu: MegaMenuItem[];
  /** Root category slug → tree for mega menu (Service-shaped) */
  megaTrees: Service[];
  /** Flat list of all service posts */
  posts: Service[];
}

type ServiceContentMeta = Partial<
  Pick<
    Service,
    | "icon"
    | "longDescription"
    | "whyNeed"
    | "highlights"
    | "features"
    | "processSteps"
    | "cases"
    | "faqs"
  >
> & { description?: string };

const SERVICE_META_RE = /<!--\s*majd:service\s*([\s\S]*?)\s*-->/i;

export function parseServiceContentMeta(html: string): {
  meta: ServiceContentMeta;
  bodyHtml: string;
} {
  const match = html.match(SERVICE_META_RE);
  if (!match) {
    return { meta: {}, bodyHtml: normalizeWpContentHtml(html) };
  }

  let meta: ServiceContentMeta = {};
  try {
    meta = JSON.parse(match[1]) as ServiceContentMeta;
  } catch {
    meta = {};
  }

  const bodyHtml = normalizeWpContentHtml(html.replace(SERVICE_META_RE, "").trim());
  return { meta, bodyHtml };
}

function slugMatches(candidate: string, target: string): boolean {
  const a = normalizeWpSlug(candidate);
  const b = normalizeWpSlug(target);
  return a === b;
}

function findCategoriesBySlugs(
  tree: BlogCategory[],
  slugs: string[],
): BlogCategory[] {
  const found: BlogCategory[] = [];
  for (const slug of slugs) {
    const cat = findCategoryBySlug(tree, slug);
    if (cat && !found.some((c) => c.id === cat.id)) {
      found.push(cat);
    }
  }
  return found;
}

function collectCategoryIds(categories: BlogCategory[]): number[] {
  const ids = new Set<number>();
  for (const cat of categories) {
    ids.add(cat.id);
    for (const child of flattenCategories([cat])) {
      ids.add(child.id);
    }
  }
  return [...ids];
}

function mapPostToService(
  post: WpPost,
  categories: BlogCategory[],
  parent?: BlogCategory,
  categoryPrefix?: ServiceCategoryPrefix,
): Service {
  const { meta, bodyHtml } = parseServiceContentMeta(post.content.rendered);
  const slug = normalizeWpSlug(post.slug);
  const prefix =
    categoryPrefix ??
    prefixForWpRootSlug(parent?.slug) ??
    undefined;
  const base: Service = {
    id: String(post.id),
    slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    description:
      meta.description?.trim() ||
      stripHtml(post.excerpt.rendered) ||
      stripHtml(bodyHtml).slice(0, 280),
    icon: meta.icon || "scale",
    image: getFeaturedImage(post),
    parentSlug: parent?.slug,
    parentTitle: parent?.name,
    categoryPrefix: prefix,
    longDescription: meta.longDescription,
    whyNeed: meta.whyNeed,
    highlights: meta.highlights,
    features: meta.features,
    processSteps: meta.processSteps,
    cases: meta.cases,
    faqs: meta.faqs,
    contentHtml: bodyHtml || undefined,
  };

  return enrichService(base);
}

function mapPostToMenuItem(
  post: WpPost,
  parent?: BlogCategory,
  categoryPrefix?: ServiceCategoryPrefix,
): Service {
  return mapPostToService(post, [], parent, categoryPrefix);
}

function postInCategory(post: WpPost, categoryId: number): boolean {
  return post.categories?.includes(categoryId) ?? false;
}

function buildRootMegaTree(
  rootCategories: BlogCategory[],
  allPosts: WpPost[],
  canonicalSlug: string,
  categoryPrefix: ServiceCategoryPrefix,
): Service {
  const primary = rootCategories[0];
  const childCategories = new Map<number, BlogCategory>();

  for (const root of rootCategories) {
    for (const child of root.children) {
      childCategories.set(child.id, child);
    }
  }

  const childCatList = [...childCategories.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "fa"),
  );

  const childIds = new Set(childCatList.map((c) => c.id));

  const layer2: Service[] = childCatList.map((cat) => {
    const posts = allPosts
      .filter((p) => postInCategory(p, cat.id))
      .map((p) => mapPostToMenuItem(p, cat, categoryPrefix))
      .filter((s) => !isRetiredServiceSlug(s.slug));

    return {
      id: `cat-${cat.id}`,
      slug: cat.slug,
      title: cat.name,
      excerpt: cat.description,
      description: cat.description,
      icon: "scale",
      categoryPrefix,
      children: posts,
    };
  });

  const directPosts = allPosts
    .filter((p) => {
      const inRoot = rootCategories.some((r) => postInCategory(p, r.id));
      const inChild = [...childIds].some((id) => postInCategory(p, id));
      return inRoot && !inChild;
    })
    .map((p) => mapPostToMenuItem(p, primary, categoryPrefix))
    .filter((s) => !isRetiredServiceSlug(s.slug));

  return {
    id: `cat-${primary.id}`,
    slug: canonicalSlug,
    title: primary.name,
    excerpt: primary.description,
    description: primary.description,
    icon: "scale",
    categoryPrefix,
    children: [...layer2, ...directPosts],
  };
}

export function buildServiceMenuData(
  categoryTree: BlogCategory[],
  posts: WpPost[],
): ServiceMenuData {
  const megaMenu: MegaMenuItem[] = [];
  const megaTrees: Service[] = [];
  const fallback = getFallbackMenuData();

  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    const matched = findCategoriesBySlugs(categoryTree, slugs);
    megaMenu.push({ slug: root.slug, label: root.label });

    if (matched.length) {
      megaTrees.push(
        buildRootMegaTree(matched, posts, root.slug, root.prefix),
      );
      continue;
    }

    const fallbackTree = fallback.megaTrees.find((tree) =>
      slugMatches(tree.slug, root.slug),
    );
    if (fallbackTree) megaTrees.push(fallbackTree);
  }

  const serviceCategoryIds = new Set<number>();
  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    const matched = findCategoriesBySlugs(categoryTree, slugs);
    for (const id of collectCategoryIds(matched)) {
      serviceCategoryIds.add(id);
    }
  }

  const servicePosts = posts
    .filter((p) => p.categories?.some((id) => serviceCategoryIds.has(id)))
    .map((p) => {
      const parentCat = findParentCategoryForPost(p, categoryTree);
      const prefix = findCategoryPrefixForPost(p, categoryTree);
      return mapPostToService(
        p,
        flattenCategories(categoryTree),
        parentCat,
        prefix,
      );
    })
    .filter((s) => !isRetiredServiceSlug(s.slug));

  const presentPrefixes = new Set(
    servicePosts
      .map((s) => s.categoryPrefix)
      .filter((prefix): prefix is ServiceCategoryPrefix => Boolean(prefix)),
  );
  for (const root of SERVICE_MEGA_ROOTS) {
    if (presentPrefixes.has(root.prefix)) continue;
    servicePosts.push(
      ...fallback.posts.filter(
        (s) =>
          s.categoryPrefix === root.prefix &&
          !isServiceCategoryNode(s) &&
          !s.children?.length,
      ),
    );
  }

  return { megaMenu, megaTrees, posts: servicePosts };
}

function findMegaRootForPost(
  post: WpPost,
  tree: BlogCategory[],
): (typeof SERVICE_MEGA_ROOTS)[number] | undefined {
  const ids = post.categories ?? [];

  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    const roots = findCategoriesBySlugs(tree, slugs);
    const rootIds = new Set(roots.map((r) => r.id));
    const descendantIds = new Set<number>();
    for (const r of roots) {
      for (const id of collectCategoryIds([r])) descendantIds.add(id);
    }

    if (ids.some((id) => descendantIds.has(id) || rootIds.has(id))) {
      return root;
    }
  }

  return undefined;
}

function findCategoryPrefixForPost(
  post: WpPost,
  tree: BlogCategory[],
): ServiceCategoryPrefix | undefined {
  return findMegaRootForPost(post, tree)?.prefix;
}

function findParentCategoryForPost(
  post: WpPost,
  tree: BlogCategory[],
): BlogCategory | undefined {
  const flat = flattenCategories(tree);
  const ids = post.categories ?? [];

  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    const roots = findCategoriesBySlugs(tree, slugs);
    const rootIds = new Set(roots.map((r) => r.id));
    const childIds = new Set<number>();
    for (const r of roots) {
      for (const c of r.children) childIds.add(c.id);
    }

    for (const id of ids) {
      if (childIds.has(id)) {
        return flat.find((c) => c.id === id);
      }
    }

    for (const id of ids) {
      if (rootIds.has(id)) {
        return flat.find((c) => c.id === id);
      }
    }
  }

  return flat.find((c) => ids.includes(c.id));
}

async function fetchJson<T>(
  url: string,
  options?: { headers?: HeadersInit; cache?: RequestCache },
): Promise<T | null> {
  const res = await wpFetch(url, {
    cache: options?.cache ?? "no-store",
    headers: options?.headers,
  });
  if (!res?.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchAllServicePosts(
  categoryIds: number[],
  headers?: HeadersInit,
  cache: RequestCache = "no-store",
): Promise<WpPost[]> {
  if (!categoryIds.length) return [];

  const posts: WpPost[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 20) {
    const url = wpApiUrl(
      `/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed&categories=${categoryIds.join(",")}`,
    );
    const res = await wpFetch(url, { cache, headers });
    if (!res?.ok) break;

    const batch = (await res.json()) as WpPost[];
    posts.push(...batch);
    totalPages = Number(res.headers.get("X-WP-TotalPages") || "1");
    page += 1;
    if (!batch.length) break;
  }

  return posts;
}

async function loadServiceData(
  headers?: HeadersInit,
  cache: RequestCache = "no-store",
): Promise<ServiceMenuData | null> {
  const categoriesFlat = await fetchJson<
    import("@/types").WpCategory[]
  >(
    wpApiUrl(
      "/wp-json/wp/v2/categories?per_page=100&hide_empty=false&orderby=name&order=asc",
    ),
    { headers, cache },
  );

  if (!categoriesFlat?.length) return null;

  const tree = buildCategoryTree(categoriesFlat);
  const categoryIds: number[] = [];

  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    categoryIds.push(...collectCategoryIds(findCategoriesBySlugs(tree, slugs)));
  }

  const uniqueIds = [...new Set(categoryIds)];
  if (!uniqueIds.length) return null;

  const posts = await fetchAllServicePosts(uniqueIds, headers, cache);
  return buildServiceMenuData(tree, posts);
}

function annotateFallbackTree(
  service: Service,
  inheritedPrefix?: ServiceCategoryPrefix,
): Service {
  const prefix =
    inheritedPrefix ?? FALLBACK_PARENT_TO_PREFIX[service.slug];
  const enriched = enrichService({
    ...service,
    categoryPrefix: prefix,
  });
  return {
    ...enriched,
    categoryPrefix: prefix,
    children: service.children?.map((child) =>
      annotateFallbackTree(
        {
          ...child,
          parentSlug: service.slug,
          parentTitle: service.title,
        },
        prefix,
      ),
    ),
  };
}

function flattenFallbackServices(
  service: Service,
  inheritedPrefix?: ServiceCategoryPrefix,
): Service[] {
  const annotated = annotateFallbackTree(service, inheritedPrefix);
  return [
    annotated,
    ...(annotated.children?.flatMap((child) =>
      flattenFallbackServices(child, annotated.categoryPrefix),
    ) ?? []),
  ];
}

function getFallbackMenuData(): ServiceMenuData {
  const megaMenu = SERVICE_MEGA_ROOTS.map((r) => ({
    slug: r.slug,
    label: r.label,
  }));
  const megaTrees = SERVICE_MEGA_ROOTS.map((root) => {
    const parentSlug = FALLBACK_PARENT_SLUG[root.slug];
    const parent = fallbackServices.find((s) => s.slug === parentSlug);
    const annotated = parent
      ? annotateFallbackTree(parent, root.prefix)
      : undefined;
    let children = annotated?.children ?? [];

    if (root.prefix === "legal-consultation") {
      const collections = fallbackServices.find(
        (s) => s.slug === "vosool-matalabat",
      );
      if (collections?.children?.length) {
        children = [
          ...children,
          ...collections.children.map((child) =>
            annotateFallbackTree(
              {
                ...child,
                parentSlug: collections.slug,
                parentTitle: collections.title,
              },
              root.prefix,
            ),
          ),
        ];
      }
    }

    return {
      id: root.slug,
      slug: root.slug,
      title: root.label,
      excerpt: annotated?.excerpt ?? "",
      description: annotated?.description ?? "",
      icon: annotated?.icon ?? "scale",
      image: annotated?.image,
      categoryPrefix: root.prefix,
      children,
    };
  });

  const posts = fallbackServices.flatMap((service) =>
    flattenFallbackServices(service),
  );

  return {
    megaMenu,
    megaTrees,
    posts,
  };
}

export function megaTreesToMenuItems(
  megaMenu: MegaMenuItem[],
  megaTrees: Service[],
): { service: Service; label: string }[] {
  return megaMenu
    .map(({ slug, label }) => {
      const service = megaTrees.find((s) => slugMatches(s.slug, slug));
      return service ? { service, label } : null;
    })
    .filter((item): item is { service: Service; label: string } =>
      Boolean(item),
    );
}

let servicesClientPromise: Promise<ServiceMenuData> | null = null;

export async function fetchServicesClient(): Promise<ServiceMenuData> {
  servicesClientPromise ??= loadServiceData().then(
    (data) => data ?? getFallbackMenuData(),
  );
  return servicesClientPromise;
}

export async function fetchServiceBySlugClient(
  slug: string,
): Promise<Service | null> {
  const normalized = normalizeWpSlug(slug);
  const post = await fetchJson<WpPost[]>(
    wpApiUrl(
      `/wp-json/wp/v2/posts?slug=${encodeURIComponent(normalized)}&_embed`,
    ),
  );

  if (post?.[0]) {
    const categoriesFlat = await fetchJson<import("@/types").WpCategory[]>(
      wpApiUrl("/wp-json/wp/v2/categories?per_page=100"),
    );
    const tree = categoriesFlat?.length
      ? buildCategoryTree(categoriesFlat)
      : [];
    const parent = findParentCategoryForPost(post[0], tree);
    const prefix = findCategoryPrefixForPost(post[0], tree);
    return mapPostToService(post[0], flattenCategories(tree), parent, prefix);
  }

  const menu = await fetchServicesClient();
  const found = menu.posts.find((s) => slugMatches(s.slug, normalized));
  if (found) return found;

  return resolveFallbackService(slug);
}

export async function getServicesFromWp(): Promise<{
  services: Service[];
  megaMenu: MegaMenuItem[];
  megaTrees: Service[];
  fromWordPress: boolean;
}> {
  const data = await loadServiceData(wpServerHeaders(), "force-cache");
  if (data) {
    return { ...data, services: data.posts, fromWordPress: true };
  }
  const fallback = getFallbackMenuData();
  return {
    services: fallback.posts,
    megaMenu: fallback.megaMenu,
    megaTrees: fallback.megaTrees,
    fromWordPress: false,
  };
}

export async function getServiceBySlugFromWp(
  slug: string,
): Promise<Service | null> {
  const normalized = normalizeWpSlug(slug);
  const post = await fetchJson<WpPost[]>(
    wpApiUrl(
      `/wp-json/wp/v2/posts?slug=${encodeURIComponent(normalized)}&_embed`,
    ),
    { headers: wpServerHeaders(), cache: "force-cache" },
  );

  if (post?.[0]) {
    const categoriesFlat = await fetchJson<import("@/types").WpCategory[]>(
      wpApiUrl("/wp-json/wp/v2/categories?per_page=100"),
      { headers: wpServerHeaders(), cache: "force-cache" },
    );
    const tree = categoriesFlat?.length
      ? buildCategoryTree(categoriesFlat)
      : [];
    const parent = findParentCategoryForPost(post[0], tree);
    const prefix = findCategoryPrefixForPost(post[0], tree);
    return mapPostToService(
      post[0],
      flattenCategories(tree),
      parent,
      prefix,
    );
  }

  const { services } = await getServicesFromWp();
  const found = services.find(
    (s) => s.slug === normalized || s.slug === slug,
  );
  if (found) return found;

  return resolveFallbackService(slug);
}

function resolveFallbackService(slug: string): Service | null {
  const normalized = normalizeWpSlug(slug);
  const aliased = FALLBACK_SLUG_ALIASES[normalized] ?? normalized;
  for (const parent of fallbackServices) {
    const parentPrefix = FALLBACK_PARENT_TO_PREFIX[parent.slug];
    if (parent.slug === aliased) {
      return annotateFallbackTree(parent, parentPrefix);
    }
    const child = parent.children?.find((c) => c.slug === aliased);
    if (child) {
      return annotateFallbackTree(
        {
          ...child,
          icon: child.icon || parent.icon,
          image: child.image || parent.image,
          parentSlug: parent.slug,
          parentTitle: parent.title,
        },
        parentPrefix,
      );
    }
  }
  return null;
}

export async function getAllServiceSlugsFromWp(): Promise<string[]> {
  const { services } = await getServicesFromWp();
  return [
    ...new Set(
      services.filter((s) => !isServiceCategoryNode(s)).map((s) => s.slug),
    ),
  ];
}

export async function getAllServiceRouteParamsFromWp(): Promise<
  { category: ServiceCategoryPrefix; slug: string }[]
> {
  const { megaTrees } = await getServicesFromWp();
  const params: { category: ServiceCategoryPrefix; slug: string }[] = [];
  for (const tree of megaTrees) {
    if (!tree.categoryPrefix) continue;
    for (const leaf of getPillarLeavesFromTree(tree)) {
      params.push({ category: tree.categoryPrefix, slug: leaf.slug });
    }
  }
  return params;
}

/**
 * Leaf service posts under the five pillar prefixes.
 */
export async function getUncategorizedServiceSlugsFromWp(): Promise<string[]> {
  return [];
}

export function getHomeServices(services: Service[], limit = 6): Service[] {
  return services.filter((s) => !s.children?.length && !isServiceCategoryNode(s)).slice(0, limit);
}

export function getTopLevelServices(services: Service[]): Service[] {
  return getRelatedServices(services, { slug: "" }, 6);
}

/**
 * Category IDs behind the mega menu roots and their children — i.e. every
 * category that makes a WordPress post a *service* rather than an article.
 * Returns an empty array when WordPress is unreachable, so callers can fall
 * back to unfiltered behaviour instead of publishing an empty list.
 */
export async function getServiceCategoryIdsFromWp(): Promise<number[]> {
  const categoriesFlat = await fetchJson<import("@/types").WpCategory[]>(
    wpApiUrl(
      "/wp-json/wp/v2/categories?per_page=100&hide_empty=false&orderby=name&order=asc",
    ),
    { headers: wpServerHeaders(), cache: "force-cache" },
  );
  if (!categoriesFlat?.length) return [];

  const tree = buildCategoryTree(categoriesFlat);
  const ids: number[] = [];
  for (const root of SERVICE_MEGA_ROOTS) {
    const matched = findCategoriesBySlugs(tree, [root.slug, ...root.mergeSlugs]);
    ids.push(...collectCategoryIds(matched));
  }
  return [...new Set(ids)];
}

