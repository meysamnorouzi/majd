import type { Metadata } from "next";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { createPageMetadata } from "@/lib/seo";

/**
 * SPA shell for blog post URLs not pre-rendered at build time.
 * Apache / Cloudflare rewrite `/blogs/<slug>/` → `/blogs/view/index.html`
 * when no static folder exists — same pattern as services detail shell.
 */
export async function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export const metadata: Metadata = createPageMetadata({
  title: "مقاله",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
  path: "/blogs/view/",
  noIndex: true,
});

export default function BlogPostShellPage() {
  return <BlogPostContent />;
}
