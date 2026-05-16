import type { WpProduct } from "@/types";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL ?? "https://vakilmajd.com";

function apiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}

export interface StoreProduct {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  image?: string;
}

export async function getStoreProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  try {
    const res = await fetch(
      apiUrl(`/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`),
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WpProduct[];
    const p = data[0];
    if (!p) return null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: p.short_description,
      description: p.description,
      price: p.prices?.price ?? "0",
      currency: p.prices?.currency_symbol ?? "تومان",
      image: p.images?.[0]?.src,
    };
  } catch {
    return null;
  }
}
