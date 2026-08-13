/** Central blog URL helpers — keep paths consistent across nav, cards, SEO, and sitemap. */

export const BLOG_LIST_PATH = "/blogs/";

export function blogPostPath(slug: string): string {
  return `/blogs/${slug}/`;
}

export function blogCategoryPath(categorySlug: string): string {
  return `/blogs/?category=${encodeURIComponent(categorySlug)}`;
}

export function isBlogPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return normalized === "/blogs" || normalized.startsWith("/blogs/");
}

export function blogPostSlugFromPathname(pathname: string): string {
  const base = "/blogs";
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith(base)) return "";
  const rest = normalized.slice(base.length).replace(/^\//, "");
  if (!rest || rest === "view") return "";
  return decodeURIComponent(rest.split("/")[0] ?? "");
}
