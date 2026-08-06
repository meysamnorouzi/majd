import { fallbackPosts, fallbackProducts } from "@/data/site";
import {
  normalizeWpContentHtml,
  rewriteWpMediaUrl,
  wpApiUrl,
} from "@/lib/wordpress/config";
import { normalizeWpSlug } from "@/lib/wordpress/categories";
import type { WpPost } from "@/types";

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
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  return url ? rewriteWpMediaUrl(url) : undefined;
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

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPostsClient(
  limit = 24,
  options?: { categoryId?: number },
): Promise<BlogPost[]> {
  const categoryQuery = options?.categoryId
    ? `&categories=${options.categoryId}`
    : "";
  const data = await fetchJson<WpPost[]>(
    wpApiUrl(`/wp-json/wp/v2/posts?per_page=${limit}&_embed${categoryQuery}`),
  );

  if (data?.length) {
    return data.map(mapPost);
  }

  if (options?.categoryId) return [];

  return fallbackPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content || `<p>${p.excerpt}</p>`,
    date: p.date,
    image: p.image,
  }));
}

export {
  fetchCategoriesClient,
  findCategoryBySlug,
  flattenCategories,
  normalizeWpSlug,
} from "@/lib/wordpress/categories";
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

  if (data?.[0]) {
    return mapPost(data[0]);
  }

  const fallback = fallbackPosts.find(
    (p) => p.slug === normalized || p.slug === slug,
  );
  if (!fallback) return null;

  return {
    id: fallback.id,
    slug: fallback.slug,
    title: fallback.title,
    excerpt: fallback.excerpt,
    content: `<p>${fallback.excerpt}</p><p>برای مشاوره تخصصی با موسسه حقوقی مجد تماس بگیرید.</p>`,
    date: fallback.date,
    image: fallback.image,
  };
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
  if (!product) {
    const fallback = fallbackProducts.find((p) => p.slug === slug);
    if (!fallback) return null;
    return {
      id: fallback.id,
      slug: fallback.slug,
      name: fallback.name,
      short_description: fallback.short_description,
      description: fallback.description,
      price: fallback.price,
      currency: "تومان",
      image: fallback.image,
    };
  }

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
