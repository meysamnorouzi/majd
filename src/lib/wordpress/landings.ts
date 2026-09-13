import { pickFeaturedImageUrl } from "@/lib/media/featured-image";
import {
  getPillarLanding,
  type PillarLanding,
} from "@/data/pillar-landings";
import { getPillar, landingFromPillar } from "@/data/pillars";
import {
  normalizeWpContentHtml,
  wpApiUrl,
  wpServerHeaders,
} from "@/lib/wordpress/config";
import { wpFetch } from "@/lib/wordpress/fetch";
import { parseLandingHtml } from "@/lib/wordpress/parse-landing-html";
import { normalizeWpSlug } from "@/lib/wordpress/categories";
import type { ServiceCategoryPrefix } from "@/lib/service-paths";
import type { WpPost } from "@/types";

export interface WpLandingMeta {
  keywords?: string[];
  heroDescription?: string;
}

export interface WpLandingPost extends WpPost {
  majd_landing?: WpLandingMeta;
}

export const LANDING_REST_PATHS = [
  "/wp-json/wp/v2/landings",
  "/wp-json/wp/v2/pages",
] as const;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

function fallbackLanding(prefix: ServiceCategoryPrefix): PillarLanding {
  const pillar = getPillar(prefix);
  if (!pillar) {
    throw new Error(`Unknown pillar prefix: ${prefix}`);
  }
  return getPillarLanding(prefix) ?? landingFromPillar(pillar);
}

function mapWpLanding(
  post: WpLandingPost,
  prefix: ServiceCategoryPrefix,
): PillarLanding {
  const fallback = fallbackLanding(prefix);
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const keywords = post.majd_landing?.keywords?.filter(Boolean) ?? [];
  const heroDescription =
    post.majd_landing?.heroDescription?.trim() ||
    excerpt ||
    fallback.heroDescription;
  const image = pickFeaturedImageUrl(post._embedded?.["wp:featuredmedia"]?.[0]);

  const parsed = parseLandingHtml(normalizeWpContentHtml(post.content.rendered), {
    heroTitle: title || fallback.heroTitle,
    heroDescription,
    seoTitle: title || fallback.seoTitle,
    seoDescription: excerpt || fallback.seoDescription,
    keywords: keywords.length ? keywords : fallback.keywords,
    servicesHeading: fallback.servicesHeading,
    cta: fallback.cta,
  });

  const landing = parsed ?? fallback;
  return {
    ...landing,
    heroTitle: title || landing.heroTitle,
    heroDescription,
    seoTitle: title || landing.seoTitle,
    seoDescription: excerpt || landing.seoDescription,
    keywords: keywords.length ? keywords : landing.keywords,
    image: image || landing.image,
  };
}

async function fetchLandingJson(
  slug: string,
  init?: RequestInit,
): Promise<WpLandingPost | null> {
  const encoded = encodeURIComponent(slug);
  for (const path of LANDING_REST_PATHS) {
    const res = await wpFetch(
      wpApiUrl(`${path}?slug=${encoded}&_embed`),
      init,
    );
    if (!res?.ok) continue;
    try {
      const data = (await res.json()) as WpLandingPost[];
      if (data?.[0]?.content?.rendered?.trim()) return data[0];
    } catch {
      continue;
    }
  }
  return null;
}

export async function getLandingByPrefix(
  prefix: ServiceCategoryPrefix,
): Promise<PillarLanding> {
  const post = await fetchLandingJson(prefix, {
    cache: "force-cache",
    headers: wpServerHeaders(),
  });
  if (post) return mapWpLanding(post, prefix);
  return fallbackLanding(prefix);
}

export async function fetchLandingByPrefixClient(
  prefix: ServiceCategoryPrefix,
): Promise<PillarLanding> {
  const post = await fetchLandingJson(prefix, { cache: "no-store" });
  if (post) return mapWpLanding(post, prefix);
  return fallbackLanding(prefix);
}
