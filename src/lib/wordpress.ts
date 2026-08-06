import {
  fallbackPosts,
  fallbackProducts,
  services,
  teamMembers,
} from "@/data/site";
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
import type { BlogCategory, WpCategory, WpPost, WpProduct } from "@/types";

function apiUrl(path: string): string {
  return wpApiUrl(path);
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      cache: "force-cache",
      headers: wpServerHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

export function getFeaturedImage(post: WpPost): string | undefined {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  return url ? rewriteWpMediaUrl(url) : undefined;
}

export async function getCategories(): Promise<BlogCategory[]> {
  const data = await fetchJson<WpCategory[]>(
    apiUrl(
      "/wp-json/wp/v2/categories?per_page=100&hide_empty=true&orderby=name&order=asc",
    ),
  );
  if (!data?.length) return [];
  return buildCategoryTree(data);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const tree = await getCategories();
  return flattenCategories(tree).map((c) => c.slug);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<BlogCategory | null> {
  const tree = await getCategories();
  return findCategoryBySlug(tree, normalizeWpSlug(slug));
}

export async function getPosts(
  limit = 12,
  options?: { categoryId?: number },
): Promise<
  {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    image?: string;
  }[]
> {
  const categoryQuery = options?.categoryId
    ? `&categories=${options.categoryId}`
    : "";
  const data = await fetchJson<WpPost[]>(
    apiUrl(`/wp-json/wp/v2/posts?per_page=${limit}&_embed${categoryQuery}`),
  );

  if (data?.length) {
    return data.map((p) => ({
      id: p.id,
      slug: normalizeWpSlug(p.slug),
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered).slice(0, 200),
      content: normalizeWpContentHtml(p.content.rendered),
      date: p.date,
      image: getFeaturedImage(p),
    }));
  }

  return options?.categoryId ? [] : fallbackPosts;
}

export async function getPostBySlug(slug: string) {
  const normalized = normalizeWpSlug(slug);
  const data = await fetchJson<WpPost[]>(
    apiUrl(
      `/wp-json/wp/v2/posts?slug=${encodeURIComponent(normalized)}&_embed`,
    ),
  );

  if (data?.[0]) {
    const p = data[0];
    return {
      id: p.id,
      slug: normalizeWpSlug(p.slug),
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered),
      content: normalizeWpContentHtml(p.content.rendered),
      date: p.date,
      image: getFeaturedImage(p),
    };
  }

  const fallback = fallbackPosts.find(
    (p) => p.slug === normalized || p.slug === slug,
  );
  if (!fallback) return null;

  return {
    ...fallback,
    title: fallback.title,
    excerpt: fallback.excerpt,
    content: `<p>${fallback.excerpt}</p><p>برای مشاوره تخصصی با موسسه حقوقی مجد تماس بگیرید.</p>`,
  };
}

export async function getAllPostSlugs(): Promise<string[]> {
  const data = await fetchJson<{ slug: string }[]>(
    apiUrl("/wp-json/wp/v2/posts?per_page=100&_fields=slug"),
  );
  if (data?.length) return data.map((p) => normalizeWpSlug(p.slug));
  return fallbackPosts.map((p) => p.slug);
}

export async function getProducts(limit = 12) {
  const store = await fetchJson<WpProduct[]>(
    apiUrl(`/wp-json/wc/store/v1/products?per_page=${limit}`),
  );

  if (store?.length) {
    return store.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: stripHtml(p.short_description || p.description).slice(
        0,
        160,
      ),
      description: p.description,
      price: p.prices?.price ?? "0",
      currency: p.prices?.currency_symbol ?? "تومان",
      image: p.images?.[0]?.src,
    }));
  }

  return fallbackProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    short_description: p.short_description,
    description: p.description,
    price: p.price,
    currency: "تومان",
    image: p.image,
  }));
}

export async function getProductBySlug(slug: string) {
  const store = await fetchJson<WpProduct[]>(
    apiUrl(`/wp-json/wc/store/v1/products?slug=${slug}`),
  );

  if (store?.[0]) {
    const p = store[0];
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: stripHtml(p.short_description),
      description: p.description,
      price: p.prices?.price ?? "0",
      currency: p.prices?.currency_symbol ?? "تومان",
      image: p.images?.[0]?.src,
    };
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return fallback
    ? {
        id: fallback.id,
        slug: fallback.slug,
        name: fallback.name,
        short_description: fallback.short_description,
        description: fallback.short_description,
        price: fallback.price,
        currency: "تومان",
        image: fallback.image,
      }
    : null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const data = await fetchJson<{ slug: string }[]>(
    apiUrl("/wp-json/wc/store/v1/products?per_page=100"),
  );
  if (data?.length) return data.map((p) => p.slug);
  return fallbackProducts.map((p) => p.slug);
}

export function getServices() {
  return services;
}

export function getAllServiceSlugs(): string[] {
  const slugs: string[] = [];
  for (const service of services) {
    slugs.push(service.slug);
    for (const child of service.children ?? []) {
      slugs.push(child.slug);
    }
  }
  return slugs;
}

export function getServiceBySlug(slug: string) {
  const top = services.find((s) => s.slug === slug);
  if (top) return enrichService(top);

  for (const parent of services) {
    const child = parent.children?.find((c) => c.slug === slug);
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

export function getTeam() {
  return teamMembers;
}

export function getTeamMemberBySlug(slug: string) {
  return teamMembers.find((m) => m.slug === slug) ?? null;
}
