import { services as fallbackServices } from "@/data/site";
import { enrichService } from "@/data/services-detail";
import {
  buildCategoryTree,
  findCategoryBySlug,
  flattenCategories,
  normalizeWpSlug,
} from "@/lib/wordpress/categories";
import {
  normalizeWpContentHtml,
  rewriteWpMediaUrl,
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
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  return url ? rewriteWpMediaUrl(url) : undefined;
}

/** Mega menu roots — خانواده-fa merges into خانواده */
export const SERVICE_MEGA_ROOTS = [
  {
    slug: "ملکی",
    label: "وکیل ملکی",
    mergeSlugs: [] as string[],
  },
  {
    slug: "خانواده",
    label: "وکیل خانواده",
    mergeSlugs: ["khanavade-fa", "خانواده-fa"],
  },
  {
    slug: "کیفری",
    label: "وکیل کیفری",
    mergeSlugs: [] as string[],
  },
] as const;

/** Static fallback parent slugs in site.ts */
const FALLBACK_PARENT_SLUG: Record<
  (typeof SERVICE_MEGA_ROOTS)[number]["slug"],
  string
> = {
  ملکی: "vakalat-melki",
  خانواده: "vakalat-khanavade",
  کیفری: "vakalat-keyfari",
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
): Service {
  const { meta, bodyHtml } = parseServiceContentMeta(post.content.rendered);
  const slug = normalizeWpSlug(post.slug);
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

function mapPostToMenuItem(post: WpPost, parent?: BlogCategory): Service {
  return mapPostToService(post, [], parent);
}

function postInCategory(post: WpPost, categoryId: number): boolean {
  return post.categories?.includes(categoryId) ?? false;
}

function buildRootMegaTree(
  rootCategories: BlogCategory[],
  allPosts: WpPost[],
  canonicalSlug: string,
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
      .map((p) => mapPostToMenuItem(p, cat));

    return {
      id: `cat-${cat.id}`,
      slug: cat.slug,
      title: cat.name,
      excerpt: cat.description,
      description: cat.description,
      icon: "scale",
      children: posts,
    };
  });

  const directPosts = allPosts
    .filter((p) => {
      const inRoot = rootCategories.some((r) => postInCategory(p, r.id));
      const inChild = [...childIds].some((id) => postInCategory(p, id));
      return inRoot && !inChild;
    })
    .map((p) => mapPostToMenuItem(p, primary));

  return {
    id: `cat-${primary.id}`,
    slug: canonicalSlug,
    title: primary.name,
    excerpt: primary.description,
    description: primary.description,
    icon: "scale",
    children: [...layer2, ...directPosts],
  };
}

export function buildServiceMenuData(
  categoryTree: BlogCategory[],
  posts: WpPost[],
): ServiceMenuData {
  const megaMenu: MegaMenuItem[] = [];
  const megaTrees: Service[] = [];

  for (const root of SERVICE_MEGA_ROOTS) {
    const slugs = [root.slug, ...root.mergeSlugs];
    const matched = findCategoriesBySlugs(categoryTree, slugs);
    if (!matched.length) continue;

    megaMenu.push({ slug: root.slug, label: root.label });
    megaTrees.push(buildRootMegaTree(matched, posts, root.slug));
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
      return mapPostToService(p, flattenCategories(categoryTree), parentCat);
    });

  return { megaMenu, megaTrees, posts: servicePosts };
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

function getFallbackMenuData(): ServiceMenuData {
  const enriched = fallbackServices.map((s) => enrichService(s));
  const megaMenu = SERVICE_MEGA_ROOTS.map((r) => ({
    slug: r.slug,
    label: r.label,
  }));
  const megaTrees = SERVICE_MEGA_ROOTS.map((root) => {
    const parentSlug = FALLBACK_PARENT_SLUG[root.slug];
    const parent = enriched.find((s) => s.slug === parentSlug);

    return {
      id: root.slug,
      slug: root.slug,
      title: root.label,
      excerpt: parent?.excerpt ?? "",
      description: parent?.description ?? "",
      icon: parent?.icon ?? "scale",
      image: parent?.image,
      children: parent?.children?.map((item) => enrichService(item)) ?? [],
    };
  });

  return {
    megaMenu,
    megaTrees,
    posts: enriched.flatMap(function flatten(s): Service[] {
      return [s, ...(s.children?.flatMap(flatten) ?? [])];
    }),
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

export async function fetchServicesClient(): Promise<ServiceMenuData> {
  const data = await loadServiceData();
  return data ?? getFallbackMenuData();
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
    return mapPostToService(post[0], flattenCategories(tree), parent);
  }

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
    return mapPostToService(
      post[0],
      flattenCategories(tree),
      parent,
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
  for (const parent of fallbackServices) {
    if (parent.slug === normalized) return enrichService(parent);
    const child = parent.children?.find((c) => c.slug === normalized);
    if (child) {
      return enrichService({
        ...child,
        icon: child.icon || parent.icon,
        image: child.image || parent.image,
        parentSlug: parent.slug,
        parentTitle: parent.title,
      });
    }
  }
  return null;
}

export async function getAllServiceSlugsFromWp(): Promise<string[]> {
  const { services } = await getServicesFromWp();
  return services.map((s) => s.slug);
}

export function getHomeServices(services: Service[], limit = 6): Service[] {
  return services.slice(0, limit);
}

export function getTopLevelServices(services: Service[]): Service[] {
  const top = services.filter((s) =>
    SERVICE_MEGA_ROOTS.some(
      (r) =>
        slugMatches(s.slug, r.slug) ||
        r.mergeSlugs.some((m) => slugMatches(s.slug, m)),
    ),
  );
  if (top.length) return top;
  return services.filter((s) => !s.parentSlug).slice(0, 6);
}
