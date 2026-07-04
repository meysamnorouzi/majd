import {
  fallbackPosts,
  fallbackProducts,
  services,
  teamMembers,
} from "@/data/site";
import { enrichService } from "@/data/services-detail";
import type { WpPost, WpProduct } from "@/types";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL ?? "https://vakilmajd.com";

function apiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      cache: "force-cache",
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
  return media?.source_url;
}

export async function getPosts(limit = 12): Promise<
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
  const data = await fetchJson<WpPost[]>(
    apiUrl(`/wp-json/wp/v2/posts?per_page=${limit}&_embed`),
  );

  if (data?.length) {
    return data.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered).slice(0, 200),
      content: p.content.rendered,
      date: p.date,
      image: getFeaturedImage(p),
    }));
  }

  return fallbackPosts;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchJson<WpPost[]>(
    apiUrl(`/wp-json/wp/v2/posts?slug=${slug}&_embed`),
  );

  if (data?.[0]) {
    const p = data[0];
    return {
      id: p.id,
      slug: p.slug,
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered),
      content: p.content.rendered,
      date: p.date,
      image: getFeaturedImage(p),
    };
  }

  const fallback = fallbackPosts.find((p) => p.slug === slug);
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
  if (data?.length) return data.map((p) => p.slug);
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

export function getServiceBySlug(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;
  return enrichService(service);
}

export function getTeam() {
  return teamMembers;
}

export function getTeamMemberBySlug(slug: string) {
  return teamMembers.find((m) => m.slug === slug) ?? null;
}
