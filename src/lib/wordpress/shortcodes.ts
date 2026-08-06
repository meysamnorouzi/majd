import { normalizeWpSlug } from "@/lib/wordpress/categories";

export type WpContentPart =
  | { type: "html"; html: string }
  | { type: "blog"; slug: string };

const SHORTCODE_RE =
  /(?:<p(?:\s[^>]*)?>\s*)?\[majd_blog\s+([^\]]*)\](?:\s*<\/p>)?/gi;

function decodeAttrValue(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

/** Parse `key="value"` pairs from a shortcode attribute string. */
export function parseShortcodeAttrs(raw: string): Record<string, string> {
  const decoded = decodeAttrValue(raw)
    .replace(/&quot;/g, '"')
    .replace(/&#8221;/g, '"');
  const attrs: Record<string, string> = {};

  for (const match of decoded.matchAll(
    /(\w+)\s*=\s*["']([^"']*)["']/g,
  )) {
    attrs[match[1].toLowerCase()] = decodeAttrValue(match[2]);
  }

  for (const match of decoded.matchAll(/(\w+)\s*=\s*([^\s"'\]]+)/g)) {
    const key = match[1].toLowerCase();
    if (!attrs[key]) attrs[key] = decodeAttrValue(match[2]);
  }

  return attrs;
}

/**
 * Resolve a blog slug from a shortcode URL, link, or slug attribute.
 * Supports `/blog/post/{slug}/` and bare permalink path segments.
 */
export function slugFromBlogRef(ref: string): string | null {
  const trimmed = ref.trim();
  if (!trimmed) return null;

  if (!/^https?:\/\//i.test(trimmed) && !trimmed.includes("/")) {
    return normalizeWpSlug(trimmed);
  }

  try {
    const url = new URL(trimmed, "https://vakilmajd.com");
    const path = normalizeWpSlug(url.pathname);

    const blogPost = path.match(/\/blog\/post\/([^/]+)\/?/i);
    if (blogPost?.[1]) return normalizeWpSlug(blogPost[1]);

    const parts = path.split("/").filter(Boolean);
    if (parts.length) return normalizeWpSlug(parts[parts.length - 1]);
  } catch {
    return normalizeWpSlug(trimmed);
  }

  return null;
}

export function blogSlugFromShortcodeAttrs(
  attrs: Record<string, string>,
): string | null {
  if (attrs.slug) return normalizeWpSlug(attrs.slug);
  const ref = attrs.url || attrs.link || attrs.href || "";
  return slugFromBlogRef(ref);
}

/** Split WP HTML into rich-text chunks and `[majd_blog]` embeds. */
export function splitWpContent(html: string): WpContentPart[] {
  if (!html) return [];

  const parts: WpContentPart[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(SHORTCODE_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      const chunk = html.slice(lastIndex, index);
      if (chunk.trim()) parts.push({ type: "html", html: chunk });
    }

    const attrs = parseShortcodeAttrs(match[1] ?? "");
    const slug = blogSlugFromShortcodeAttrs(attrs);
    if (slug) {
      parts.push({ type: "blog", slug });
    } else if (match[0].trim()) {
      parts.push({ type: "html", html: match[0] });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < html.length) {
    const chunk = html.slice(lastIndex);
    if (chunk.trim()) parts.push({ type: "html", html: chunk });
  }

  if (!parts.length && html.trim()) {
    parts.push({ type: "html", html });
  }

  return parts;
}

export function contentHasBlogShortcode(html: string): boolean {
  SHORTCODE_RE.lastIndex = 0;
  return SHORTCODE_RE.test(html);
}
