import { normalizeWpSlug } from "@/lib/wordpress/categories";
import { pickFeaturedImageUrl } from "@/lib/media/featured-image";
import {
  normalizeWpContentHtml,
  wpApiUrl,
} from "@/lib/wordpress/config";
import {
  applyPostsListOptions,
  buildPostsQuery,
  postsFetchLimitWhenSearching,
  type FetchPostsOptions,
} from "@/lib/wordpress/posts-query";
import type { WpPost } from "@/types";

export type { BlogPostSortOption, FetchPostsOptions } from "@/lib/wordpress/posts-query";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
}

export function stripHtml(html: string): string {
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

function mapPost(p: WpPost): BlogPost {
  return {
    id: p.id,
    slug: normalizeWpSlug(p.slug),
    title: stripHtml(p.title.rendered),
    excerpt: stripHtml(p.excerpt.rendered).slice(0, 200),
    content: normalizeWpContentHtml(p.content.rendered),
    date: p.date,
    image: getFeaturedImage(p),
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("WordPress request failed");
  }
  return (await res.json()) as T;
}

export async function fetchPostsClient(
  limit = 24,
  options?: FetchPostsOptions,
): Promise<BlogPost[]> {
  const searching = Boolean(options?.search?.trim());
  const fetchLimit = searching ? postsFetchLimitWhenSearching : limit;
  const data = await fetchJson<WpPost[]>(
    wpApiUrl(`/wp-json/wp/v2/posts?${buildPostsQuery(fetchLimit, options)}`),
  );

  if (!data?.length) return [];

  const posts = data.map(mapPost);
  return searching ? applyPostsListOptions(posts, options, limit) : posts;
}

export {
  fetchCategoriesClient,
  findCategoryBySlug,
  flattenCategories,
  normalizeWpSlug,
} from "@/lib/wordpress/categories";
export {
  fetchServicesClient,
  fetchServiceBySlugClient,
  megaTreesToMenuItems,
} from "@/lib/wordpress/services";
export type { MegaMenuItem, ServiceMenuData } from "@/lib/wordpress/services";
export {
  fetchTeamClient,
  fetchTeamMemberBySlugClient,
  toLawyerOptions,
} from "@/lib/wordpress/team";
export { fetchLandingByPrefixClient } from "@/lib/wordpress/landings";
export type { BlogCategory } from "@/types";

export async function fetchPostBySlugClient(
  slug: string,
): Promise<BlogPost | null> {
  const normalized = normalizeWpSlug(slug);
  const data = await fetchJson<WpPost[]>(
    wpApiUrl(
      `/wp-json/wp/v2/posts?slug=${encodeURIComponent(normalized)}&_embed`,
    ),
  );

  if (data?.[0]) return mapPost(data[0]);
  return null;
}

export interface ShopProduct {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  image?: string;
}

export async function fetchShopProductsClient(
  limit = 24,
): Promise<ShopProduct[]> {
  const { fetchStoreProductsClient } = await import(
    "@/lib/woocommerce/store-products-client"
  );
  const products = await fetchStoreProductsClient({ perPage: limit });
  return products
    .filter((p) => !p.majd.is_course)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: p.short_description,
      description: p.description,
      price: p.price,
      currency: p.currency,
      image: p.image,
    }));
}

export async function fetchShopProductBySlugClient(
  slug: string,
): Promise<ShopProduct | null> {
  const { fetchStoreProductBySlugClient } = await import(
    "@/lib/woocommerce/store-products-client"
  );
  const product = await fetchStoreProductBySlugClient(slug);
  if (!product || product.majd.is_course) return null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.short_description,
    description: product.description,
    price: product.price,
    currency: product.currency,
    image: product.image,
  };
}

export async function fetchShopProductBySlugClientIncludingCourse(
  slug: string,
): Promise<ShopProduct | null> {
  const { fetchStoreProductBySlugClient } = await import(
    "@/lib/woocommerce/store-products-client"
  );
  const product = await fetchStoreProductBySlugClient(slug);
  if (!product) return null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.short_description,
    description: product.description,
    price: product.price,
    currency: product.currency,
    image: product.image,
  };
}
