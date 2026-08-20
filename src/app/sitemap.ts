import type { MetadataRoute } from "next";
import {
  getAllServiceSlugs,
  getBlogPostSlugs,
  getTeam,
} from "@/lib/wordpress";
import { absoluteUrl } from "@/lib/seo";
import { BLOG_LIST_PATH, blogPostPath } from "@/lib/blog-paths";
import {
  findLegacyRedirect,
  isRestoredPageWpSlug,
  restoredPages,
} from "@/data/legacy-redirects";

export const dynamic = "force-static";

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Never advertise a URL the host 301s away (src/data/legacy-redirects.json). */
function isRedirected(path: string): boolean {
  return findLegacyRedirect(path) !== null;
}

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
    getBlogPostSlugs(),
    getAllServiceSlugs(),
  ]);
  const team = await getTeam();

  const staticRoutes: SitemapEntry[] = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/about/", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/contact/", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/services/", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/team/", { changeFrequency: "monthly", priority: 0.8 }),
    entry(BLOG_LIST_PATH, { changeFrequency: "daily", priority: 0.9 }),
  ];

  const serviceRoutes = serviceSlugs
    .filter((slug) => !isRedirected(`/services/${slug}/`))
    .map((slug) =>
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

  const postRoutes = postSlugs
    .filter(
      (slug) =>
        !isRedirected(blogPostPath(slug)) && !isRestoredPageWpSlug(slug),
    )
    .map((slug) =>
      entry(blogPostPath(slug), {
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    );

  // Legacy URLs restored at the root (see src/data/legacy-redirects.json)
  const restoredRoutes = restoredPages.map((page) =>
    entry(page.path, { changeFrequency: "monthly", priority: 0.8 }),
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...restoredRoutes,
    ...teamRoutes,
    ...postRoutes,
  ];
}
