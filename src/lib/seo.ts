import type { Metadata } from "next";
import { assets, siteConfig } from "@/data/site";
import { blogPostPath } from "@/lib/blog-paths";
import { servicePath } from "@/lib/service-paths";
import type { Service, ServiceFAQ, TeamMember } from "@/types";

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  keywords?: string | string[];
};

/** Absolute site URL with trailing slash for pages (matches `trailingSlash: true`). */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;

  const clean = path.startsWith("/") ? path : `/${path}`;
  if (/\.[a-z0-9]+$/i.test(clean)) return `${base}${clean}`;
  return `${base}${clean.endsWith("/") ? clean : `${clean}/`}`;
}

export function absoluteAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
} as const;

export const noIndexRobots = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
} as const;

/** Shared page metadata: canonical, Open Graph, Twitter, robots. */
export function createPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  keywords,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteAssetUrl(image ?? assets.logo);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: "fa_IR",
      type,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? noIndexRobots : indexableRobots,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absoluteUrl("/"),
    logo: absoluteAssetUrl(assets.logo),
    image: absoluteAssetUrl(assets.logo),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phonesTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressCountry: "IR",
    },
    areaServed: {
      "@type": "Country",
      name: "Iran",
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    openingHours: "Mo-We 09:00-18:00, Th 09:00-13:00",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "fa-IR",
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: absoluteUrl(item.path) }
        : {}),
    })),
  };
}

/** `path` overrides the canonical URL for restored root-level service pages. */
export function serviceJsonLd(service: Service, path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.excerpt || service.description,
    url: absoluteUrl(path ?? servicePath(service)),
    provider: { "@id": `${absoluteUrl("/")}#organization` },
    areaServed: {
      "@type": "Country",
      name: "Iran",
    },
    ...(service.image
      ? { image: absoluteAssetUrl(service.image) }
      : {}),
  };
}

export function faqJsonLd(faqs: ServiceFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function personJsonLd(member: TeamMember) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    url: absoluteUrl(`/team/${member.slug}/`),
    image: absoluteAssetUrl(member.image),
    worksFor: { "@id": `${absoluteUrl("/")}#organization` },
    knowsAbout: member.areasOfPractice,
    ...(member.email ? { email: member.email } : {}),
    ...(member.phone ? { telephone: member.phone } : {}),
    ...(member.social
      ? {
          sameAs: Object.values(member.social).filter(Boolean),
        }
      : {}),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image?: string;
  content?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(blogPostPath(post.slug)),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "fa-IR",
    image: post.image
      ? absoluteAssetUrl(post.image)
      : absoluteAssetUrl(assets.logo),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteAssetUrl(assets.logo),
      },
    },
    mainEntityOfPage: absoluteUrl(blogPostPath(post.slug)),
  };
}

export const defaultKeywords = [
  "موسسه حقوقی مجد",
  "وکیل تهران",
  "وکیل پایه یک",
  "مشاوره حقوقی",
  "وکالت کیفری",
  "وکالت حقوقی",
  "وکیل خانواده",
  "دعاوی ملکی",
  "vakilmajid",
  "vakilmajd",
];
