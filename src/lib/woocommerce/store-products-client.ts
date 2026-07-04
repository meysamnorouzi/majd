import { wpApiUrl } from "@/lib/wordpress/config";
import { normalizeFormatSlug } from "@/lib/courses/format-utils";
import type { CourseFormatSlug } from "@/types";
import type { WpProduct } from "@/types";

export const COURSE_CATEGORY_SLUGS: CourseFormatSlug[] = [
  "online-webinar",
  "online-offline",
  "hybrid-full",
  "session-hybrid",
  "session-inperson",
];

export interface MajdProductMeta {
  duration: string;
  level: string;
  syllabus: string[];
  highlights: string[];
  format_slug: CourseFormatSlug | "";
  is_course: boolean;
}

export interface StoreProductView {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: string;
  currency: string;
  image?: string;
  majd: MajdProductMeta;
}

interface WpStoreProduct extends WpProduct {
  extensions?: {
    majd?: Partial<MajdProductMeta>;
  };
}

const emptyMajd = (): MajdProductMeta => ({
  duration: "",
  level: "",
  syllabus: [],
  highlights: [],
  format_slug: "",
  is_course: false,
});

function parseMajd(product: WpStoreProduct): MajdProductMeta {
  const ext = product.extensions?.majd;
  if (!ext) return emptyMajd();

  return {
    duration: ext.duration ?? "",
    level: ext.level ?? "",
    syllabus: Array.isArray(ext.syllabus) ? ext.syllabus : [],
    highlights: Array.isArray(ext.highlights) ? ext.highlights : [],
    format_slug: normalizeFormatSlug(ext.format_slug as string),
    is_course: Boolean(ext.is_course),
  };
}

function mapProduct(p: WpStoreProduct): StoreProductView {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    short_description: stripHtml(p.short_description || p.description).slice(
      0,
      200,
    ),
    description: p.description,
    price: p.prices?.price ?? "0",
    currency: p.prices?.currency_symbol ?? "تومان",
    image: p.images?.[0]?.src,
    majd: parseMajd(p),
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

async function fetchProducts(
  query: Record<string, string>,
): Promise<StoreProductView[]> {
  const params = new URLSearchParams(query);
  try {
    const res = await fetch(
      wpApiUrl(`/wp-json/wc/store/v1/products?${params.toString()}`),
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as WpStoreProduct[];
    return data.map(mapProduct);
  } catch {
    return [];
  }
}

export async function fetchStoreProductsClient(options?: {
  perPage?: number;
  category?: string;
  search?: string;
  orderBy?: "title" | "price" | "date" | "popularity";
  order?: "asc" | "desc";
}): Promise<StoreProductView[]> {
  const perPage = String(options?.perPage ?? 100);
  const query: Record<string, string> = { per_page: perPage };

  if (options?.category) {
    query.category = options.category;
  }
  if (options?.search?.trim()) {
    query.search = options.search.trim();
  }
  if (options?.orderBy) {
    query.orderby = options.orderBy;
  }
  if (options?.order) {
    query.order = options.order;
  }

  return fetchProducts(query);
}

export type FetchCourseProductsOptions = {
  formatSlug?: CourseFormatSlug;
  search?: string;
  perPage?: number;
  orderBy?: "title" | "price" | "date" | "popularity";
  order?: "asc" | "desc";
};

export async function fetchCourseProductsClient(
  options?: CourseFormatSlug | FetchCourseProductsOptions,
): Promise<StoreProductView[]> {
  const opts: FetchCourseProductsOptions =
    typeof options === "string" ? { formatSlug: options } : (options ?? {});

  if (opts.formatSlug) {
    const products = await fetchStoreProductsClient({
      category: opts.formatSlug,
      perPage: opts.perPage ?? 100,
      search: opts.search,
      orderBy: opts.orderBy,
      order: opts.order,
    });
    return products.filter((p) => p.majd.is_course);
  }

  const all = await fetchStoreProductsClient({
    perPage: opts.perPage ?? 100,
    search: opts.search,
    orderBy: opts.orderBy,
    order: opts.order,
  });
  return all.filter((p) => p.majd.is_course);
}

export async function fetchStoreProductBySlugClient(
  slug: string,
): Promise<StoreProductView | null> {
  const products = await fetchProducts({
    slug,
    per_page: "1",
  });
  return products[0] ?? null;
}

export function isCourseCategory(slug: string): slug is CourseFormatSlug {
  return (
    COURSE_CATEGORY_SLUGS.includes(slug as CourseFormatSlug) ||
    normalizeFormatSlug(slug) !== ""
  );
}
