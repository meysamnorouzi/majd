import type { Metadata } from "next";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import { getAllPostSlugs, getPostBySlug } from "@/lib/wordpress";

/**
 * Pre-render known posts for SEO metadata + JSON-LD.
 * Keep the empty catch-all shell so Cloudflare SPA fallback
 * (`/blog/post/*` → `/blog/post/index.html`) still works for
 * posts published after the last static build.
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return [
    { slug: [] as string[] },
    ...slugs.map((slug) => ({ slug: [slug] })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts?.[0];

  if (!slug) {
    return createPageMetadata({
      title: "مقاله",
      description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
      path: "/blog/post/",
    });
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return createPageMetadata({
      title: "مقاله یافت نشد",
      description: "مقاله مورد نظر یافت نشد",
      path: `/blog/post/${slug}/`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt.slice(0, 160),
    path: `/blog/post/${post.slug}/`,
    image: post.image,
    type: "article",
    keywords: [post.title, "مقاله حقوقی", "موسسه حقوقی مجد"],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug: parts } = await params;
  const slug = parts?.[0];
  const post = slug ? await getPostBySlug(slug) : null;

  return (
    <>
      {post ? (
        <JsonLd
          data={[
            articleJsonLd(post),
            breadcrumbJsonLd([
              { name: "خانه", path: "/" },
              { name: "مقالات", path: "/blog/" },
              {
                name: post.title,
                path: `/blog/post/${post.slug}/`,
              },
            ]),
          ]}
        />
      ) : null}
      <BlogPostContent />
    </>
  );
}
