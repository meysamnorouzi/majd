import { PILLARS, getPillar, landingFromPillar } from "@/data/pillars";
import {
  getPillarLanding,
  type PillarLanding,
} from "@/data/pillar-landings";
import {
  getPillarLeavesFromTree,
  isServiceCategoryPrefix,
} from "@/lib/service-paths";
import {
  normalizeWpContentHtml,
  wpApiUrl,
  wpServerHeaders,
} from "@/lib/wordpress/config";
import { wpFetch } from "@/lib/wordpress/fetch";
import { parseLandingHtml } from "@/lib/wordpress/parse-landing-html";
import {
  fetchServicesClient,
  getServicesFromWp,
  megaTreesToMenuItems,
} from "@/lib/wordpress/services";
import { plainText } from "@/lib/plain-text";
import {
  familySublandingCopy,
  familySublandingService,
  plainContentLength,
} from "@/data/family-sublandings";
import type { Service } from "@/types";

export interface ServiceLandingCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** Hero text from the WordPress «توضیحات هیرو» box. */
  description?: string;
  icon: string;
  image?: string;
  content?: string;
  hubSlug?: string;
  hubTitle?: string;
  /** Resolved call button number: this landing, otherwise its hub. */
  ctaPhone?: string;
  /** Detail-page H1 when the card title stays short. */
  headline?: string;
  keywords?: string[];
}

export interface ServiceHub {
  id: number;
  slug: string;
  title: string;
  menuLabel: string;
  excerpt: string;
  icon: string;
  image?: string;
  heroDescription: string;
  keywords: string[];
  content?: string;
  /** Call button number for this hub and for landings without their own. */
  ctaPhone?: string;
  landings: ServiceLandingCard[];
}

const WP_CLIENT_TIMEOUT_MS = 8000;

function clientInit(cache: RequestCache = "no-store"): RequestInit {
  return { cache, signal: AbortSignal.timeout(WP_CLIENT_TIMEOUT_MS) };
}

function cleanImage(url: string | undefined): string | undefined {
  const trimmed = url?.trim();
  return trimmed || undefined;
}

function cleanPhone(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function uniqueLandings(landings: ServiceLandingCard[]): ServiceLandingCard[] {
  const seen = new Set<string>();
  return landings.filter((landing) => {
    if (seen.has(landing.slug)) return false;
    seen.add(landing.slug);
    return true;
  });
}

function withCardExcerpt(landing: ServiceLandingCard): ServiceLandingCard {
  const copy = familySublandingCopy(landing.slug);
  if (!copy) return landing;
  if (!copy.seedExcerpts.includes(landing.excerpt)) return landing;
  return { ...landing, excerpt: copy.cardExcerpt };
}

function normalizeHub(raw: ServiceHub): ServiceHub {
  return {
    ...raw,
    image: cleanImage(raw.image),
    excerpt: plainText(raw.excerpt),
    heroDescription: plainText(raw.heroDescription || raw.excerpt),
    keywords: raw.keywords?.filter(Boolean) ?? [],
    ctaPhone: cleanPhone(raw.ctaPhone),
    landings: uniqueLandings(raw.landings ?? []).map((landing) => {
      const card = {
        ...landing,
        excerpt: plainText(landing.excerpt),
        description: plainText(landing.description || landing.excerpt),
        image: cleanImage(landing.image),
        icon: landing.icon || "scale",
        ctaPhone: cleanPhone(landing.ctaPhone),
        headline: landing.headline?.trim() || undefined,
        keywords: landing.keywords?.map((keyword) => keyword.trim()).filter(Boolean),
      };
      return raw.slug === "family-lawyer" ? withCardExcerpt(card) : card;
    }),
  };
}

async function readHubs(
  init?: RequestInit,
): Promise<ServiceHub[] | null> {
  const res = await wpFetch(wpApiUrl("/wp-json/majd/v1/service-hubs"), init);
  if (!res) return null;
  if (res.status === 404) return null;
  if (!res.ok) return null;
  try {
    const data = (await res.json()) as ServiceHub[];
    if (!Array.isArray(data)) return null;
    return data.map(normalizeHub);
  } catch {
    return null;
  }
}

export async function getServiceHubsFromWp(): Promise<ServiceHub[] | null> {
  return readHubs({
    cache: "force-cache",
    headers: wpServerHeaders(),
  });
}

export async function getServiceHubFromWp(
  slug: string,
): Promise<ServiceHub | null> {
  const res = await wpFetch(
    wpApiUrl(`/wp-json/majd/v1/service-hubs/${encodeURIComponent(slug)}`),
    { cache: "force-cache", headers: wpServerHeaders() },
  );
  if (!res?.ok) return null;
  try {
    return normalizeHub((await res.json()) as ServiceHub);
  } catch {
    return null;
  }
}

let menuPromise: Promise<ServiceHub[]> | null = null;

/** Hubs for the header. Uses the services API, then the old post menu if that API is not installed yet. */
export async function fetchServiceMenuClient(): Promise<ServiceHub[]> {
  if (menuPromise) return menuPromise;
  const pending = (async () => {
    const api = await readHubs(clientInit());
    if (api) return api;
    try {
      const menu = await Promise.race([
        fetchServicesClient(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), WP_CLIENT_TIMEOUT_MS);
        }),
      ]);
      return legacyHubsFromPosts(menu.megaMenu, menu.megaTrees);
    } catch {
      return pillarFallbackHubs();
    }
  })().catch((error) => {
    if (menuPromise === pending) menuPromise = null;
    throw error;
  });
  menuPromise = pending;
  return pending;
}

export async function fetchServiceHubClient(
  slug: string,
): Promise<ServiceHub | null> {
  const res = await wpFetch(
    wpApiUrl(`/wp-json/majd/v1/service-hubs/${encodeURIComponent(slug)}`),
    clientInit(),
  );
  if (!res) throw new Error("Service hub request failed");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Service hub request failed");
  return normalizeHub((await res.json()) as ServiceHub);
}

export function landingToService(
  hub: Pick<ServiceHub, "slug" | "menuLabel" | "title">,
  landing: ServiceLandingCard,
): Service {
  const prefix = isServiceCategoryPrefix(hub.slug) ? hub.slug : undefined;
  const copy =
    hub.slug === "family-lawyer" ? familySublandingCopy(landing.slug) : undefined;
  const hasBody = landing.content != null;
  const useCopy = Boolean(copy && hasBody && plainContentLength(landing.content) < 400);
  const pageTitle = useCopy
    ? copy?.headline
    : hasBody
      ? landing.headline?.trim()
      : undefined;
  return {
    id: String(landing.id),
    slug: landing.slug,
    title: landing.title,
    pageTitle: pageTitle || undefined,
    excerpt: plainText(landing.excerpt),
    description: plainText(
      (useCopy ? copy?.hero : undefined) ||
        landing.description ||
        landing.excerpt,
    ),
    icon: landing.icon || "scale",
    image: landing.image,
    hubSlug: hub.slug,
    categoryPrefix: prefix,
    parentSlug: hub.slug,
    parentTitle: hub.menuLabel || hub.title,
    contentHtml: useCopy ? copy?.html : landing.content,
    ctaPhone: cleanPhone(landing.ctaPhone),
    keywords: (useCopy ? copy?.keywords : landing.keywords)?.filter(Boolean),
  };
}

export async function fetchServiceLandingClient(
  hubSlug: string,
  slug: string,
): Promise<Service | null> {
  const res = await wpFetch(
    wpApiUrl(
      `/wp-json/majd/v1/service-landings/${encodeURIComponent(hubSlug)}/${encodeURIComponent(slug)}`,
    ),
    clientInit(),
  );
  if (!res || res.status === 404 || !res.ok) {
    return hubSlug === "family-lawyer" ? familySublandingService(slug) : null;
  }
  const landing = (await res.json()) as ServiceLandingCard;
  return landingToService(
    {
      slug: landing.hubSlug || hubSlug,
      menuLabel: landing.hubTitle || "",
      title: landing.hubTitle || "",
    },
    { ...landing, image: cleanImage(landing.image) },
  );
}

/** True when `/majd/v1/service-hubs` is installed. `null` means the route is missing. */
export async function serviceHubApiInstalled(): Promise<boolean> {
  const res = await wpFetch(wpApiUrl("/wp-json/majd/v1/service-hubs"), clientInit());
  return Boolean(res && res.status !== 404 && res.ok);
}

function pillarFallbackHubs(): ServiceHub[] {
  return PILLARS.map((pillar, index) => ({
    id: index + 1,
    slug: pillar.prefix,
    title: pillar.title,
    menuLabel: pillar.menuLabel,
    excerpt: pillar.excerpt,
    icon: pillar.icon,
    image: pillar.image,
    heroDescription: pillar.excerpt,
    keywords: [...pillar.keywords],
    landings: [],
  }));
}

function legacyHubsFromPosts(
  megaMenu: { slug: string; label: string }[],
  megaTrees: Service[],
): ServiceHub[] {
  return megaTreesToMenuItems(megaMenu, megaTrees).map(({ service, label }, index) => {
    const slug = service.categoryPrefix || service.slug;
    return {
      id: index + 1,
      slug,
      title: label,
      menuLabel: label,
      excerpt: service.excerpt,
      icon: service.icon || "scale",
      image: service.image,
      heroDescription: service.excerpt,
      keywords: [],
      landings: getPillarLeavesFromTree(service).map((leaf, leafIndex) => ({
        id: Number(leaf.id) || leafIndex + 1,
        slug: leaf.slug,
        title: leaf.title,
        excerpt: leaf.excerpt,
        icon: leaf.icon || "scale",
        image: leaf.image,
      })),
    };
  });
}

function landingDefaults(hub: ServiceHub): PillarLanding {
  if (isServiceCategoryPrefix(hub.slug)) {
    const pillar = getPillar(hub.slug);
    const stored = getPillarLanding(hub.slug);
    if (stored) return stored;
    if (pillar) return landingFromPillar(pillar);
  }
  const title = hub.menuLabel || hub.title;
  return {
    heroTitle: hub.title,
    heroDescription: hub.heroDescription || hub.excerpt,
    seoTitle: hub.title,
    seoDescription: hub.excerpt,
    keywords: hub.keywords,
    image: hub.image,
    servicesHeading: `خدمات تخصصی ${title}`,
    servicesIntro: hub.excerpt ? [hub.excerpt] : [],
    cardCopy: [],
    sections: [],
    faqsHeading: `سوالات متداول درباره ${title}`,
    faqs: [],
    cta: {
      heading: `همین حالا با ${title} مشورت کنید`,
      paragraphs: [
        `برای بررسی پرونده ${title} می‌توانید با موسسه حقوقی مجد وکیل الرعایا تماس بگیرید.`,
      ],
      callTitle: `تماس با ${title}`,
      callDescription: `برای بررسی پرونده ${title} همین حالا تماس بگیرید.`,
      formTitle: `درخواست مشاوره ${title}`,
      formDescription: `موضوع پرونده ${title} را بنویسید؛ کارشناسان موسسه با شما تماس می‌گیرند.`,
    },
  };
}

export function landingFromServiceHub(hub: ServiceHub): PillarLanding {
  const defaults = landingDefaults(hub);
  const parsed = hub.content?.trim()
    ? parseLandingHtml(normalizeWpContentHtml(hub.content), {
        heroTitle: hub.title || defaults.heroTitle,
        heroDescription:
          hub.heroDescription || hub.excerpt || defaults.heroDescription,
        seoTitle: hub.title || defaults.seoTitle,
        seoDescription: hub.excerpt || defaults.seoDescription,
        keywords: hub.keywords.length ? hub.keywords : defaults.keywords,
        servicesHeading: defaults.servicesHeading,
        cta: defaults.cta,
      })
    : null;
  const landing = parsed ?? defaults;
  return {
    ...landing,
    heroTitle: hub.title || landing.heroTitle,
    heroDescription:
      hub.heroDescription || hub.excerpt || landing.heroDescription,
    seoTitle: hub.title || landing.seoTitle,
    seoDescription: hub.excerpt || landing.seoDescription,
    keywords: hub.keywords.length ? hub.keywords : landing.keywords,
    image: hub.image || landing.image,
    cta: {
      ...landing.cta,
      phone: cleanPhone(hub.ctaPhone),
    },
  };
}

export async function getAllServiceLandingRoutesFromWp(): Promise<
  { category: string; slug: string }[]
> {
  const hubs = await getServiceHubsFromWp();
  if (hubs) {
    return hubs.flatMap((hub) =>
      hub.landings.map((landing) => ({
        category: hub.slug,
        slug: landing.slug,
      })),
    );
  }
  const { megaTrees } = await getServicesFromWp();
  const params: { category: string; slug: string }[] = [];
  for (const tree of megaTrees) {
    if (!tree.categoryPrefix) continue;
    for (const leaf of getPillarLeavesFromTree(tree)) {
      params.push({ category: tree.categoryPrefix, slug: leaf.slug });
    }
  }
  return params;
}

export async function getServiceLandingAsService(
  hubSlug: string,
  slug: string,
): Promise<Service | null> {
  const hub = await getServiceHubFromWp(hubSlug);
  const landing = hub?.landings.find((item) => item.slug === slug);
  if (!hub || !landing) return null;
  const res = await wpFetch(
    wpApiUrl(
      `/wp-json/majd/v1/service-landings/${encodeURIComponent(hubSlug)}/${encodeURIComponent(slug)}`,
    ),
    { cache: "force-cache", headers: wpServerHeaders() },
  );
  if (res?.ok) {
    try {
      const full = (await res.json()) as ServiceLandingCard;
      return landingToService(hub, {
        ...full,
        image: cleanImage(full.image) ?? landing.image,
      });
    } catch {
      return landingToService(hub, landing);
    }
  }
  return landingToService(hub, landing);
}

export function hubCardImage(hub: ServiceHub): string | undefined {
  if (hub.image) return hub.image;
  if (!isServiceCategoryPrefix(hub.slug)) return undefined;
  return getPillar(hub.slug)?.image;
}
