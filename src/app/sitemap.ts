import type { MetadataRoute } from "next";
import {
  getAllPostSlugs,
  getAllServiceSlugs,
  getTeam,
} from "@/lib/wordpress";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  options: Omit<SitemapEntry, "url"> = {},
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
    ...options,
  };
}

/**
 * Build-time sitemap for static export.
 * Only includes publicly available marketing + content routes
 * (hidden shop/courses/account surfaces are omitted).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, serviceSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllServiceSlugs(),
  ]);
  const team = await getTeam();

  const staticRoutes: SitemapEntry[] = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/about/", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/contact/", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/services/", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/team/", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/blog/", { changeFrequency: "daily", priority: 0.9 }),
  ];

  const serviceRoutes = serviceSlugs.map((slug) =>
    entry(`/services/${slug}/`, {
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const teamRoutes = team.map((member) =>
    entry(`/team/${member.slug}/`, {
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const postRoutes = postSlugs.map((slug) =>
    entry(`/blog/post/${slug}/`, {
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...teamRoutes,
    ...postRoutes,
  ];
}
