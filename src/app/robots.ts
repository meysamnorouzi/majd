import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Crawl rules for static export.
 * Private / commerce routes are disallowed until those surfaces are live.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account/",
        "/cart/",
        "/checkout/",
        "/shop/",
        "/courses/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url.replace(/\/$/, ""),
  };
}
