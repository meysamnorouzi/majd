import {
  fallbackPosts,
  fallbackProducts,
} from "@/data/site";
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
import {
  applyFallbackBlogPosts,
  applyPostsListOptions,
  buildPostsQuery,
  hasPostsQueryFilters,
  postsFetchLimitWhenSearching,
  type FetchPostsOptions,
} from "@/lib/wordpress/posts-query";
import {
  getAllServiceSlugsFromWp,
  getServiceBySlugFromWp,
  getServicesFromWp,
} from "@/lib/wordpress/services";
import {
  getAllTeamSlugsFromWp,
  getTeamFromWp,
  getTeamMemberBySlugFromWp,
} from "@/lib/wordpress/team";
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
  options?: FetchPostsOptions,
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
  const searching = Boolean(options?.search?.trim());
  const fetchLimit = searching ? postsFetchLimitWhenSearching : limit;
  const data = await fetchJson<WpPost[]>(
    apiUrl(`/wp-json/wp/v2/posts?${buildPostsQuery(fetchLimit, options)}`),
  );

  if (data?.length) {
    const posts = data.map((p) => ({
      id: p.id,
      slug: normalizeWpSlug(p.slug),
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered).slice(0, 200),
      content: normalizeWpContentHtml(p.content.rendered),
      date: p.date,
      image: getFeaturedImage(p),
    }));

    return searching
      ? applyPostsListOptions(posts, options, limit)
      : posts;
  }

  if (hasPostsQueryFilters(options)) return [];

  return applyFallbackBlogPosts(fallbackPosts, options).slice(0, limit);
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

export async function getServices() {
  const { services: wpServices } = await getServicesFromWp();
  return wpServices;
}

export async function getAllServiceSlugs(): Promise<string[]> {
  return getAllServiceSlugsFromWp();
}

export async function getServiceBySlug(slug: string) {
  return getServiceBySlugFromWp(slug);
}

export async function getTeam() {
  const { team } = await getTeamFromWp();
  return team;
}

export async function getTeamMemberBySlug(slug: string) {
  return getTeamMemberBySlugFromWp(slug);
}

export async function getAllTeamSlugs(): Promise<string[]> {
  return getAllTeamSlugsFromWp();
}
