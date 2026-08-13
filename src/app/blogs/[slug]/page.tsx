import type { Metadata } from "next";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import { BLOG_LIST_PATH, blogPostPath } from "@/lib/blog-paths";
import { getAllPostSlugs, getPostBySlug } from "@/lib/wordpress";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "مقاله یافت نشد",
      description: "مقاله مورد نظر یافت نشد",
      path: blogPostPath(slug),
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.excerpt.slice(0, 160),
    path: blogPostPath(post.slug),
    image: post.image,
    type: "article",
    keywords: [post.title, "مقاله حقوقی", "موسسه حقوقی مجد"],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <>
      {post ? (
        <JsonLd
          data={[
            articleJsonLd(post),
            breadcrumbJsonLd([
              { name: "خانه", path: "/" },
              { name: "مقالات", path: BLOG_LIST_PATH },
              {
                name: post.title,
                path: blogPostPath(post.slug),
              },
            ]),
          ]}
        />
      ) : null}
      <BlogPostContent />
    </>
  );
}
