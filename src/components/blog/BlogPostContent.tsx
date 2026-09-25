"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { WpRichContent } from "@/components/content/WpRichContent";
import { fetchPostBySlugClient, type BlogPost } from "@/lib/wordpress/client";
import { BLOG_LIST_PATH, blogPostSlugFromPathname } from "@/lib/blog-paths";
import { useLawyerOptions } from "@/hooks/useTeamMembers";

export function BlogPostContent() {
  const pathname = usePathname();
  const slug = blogPostSlugFromPathname(pathname);
  const lawyerOptions = useLawyerOptions();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError("");

    (async () => {
      try {
        const data = await fetchPostBySlugClient(slug);
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
          setPost(null);
        } else {
          setPost(data);
          document.title = `${data.title} | موسسه حقوقی مجد`;
        }
      } catch {
        if (!cancelled) setError("بارگذاری مقاله انجام نشد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="py-24 text-center text-slate-600">{error}</p>
      </Container>
    );
  }

  if (notFound || !post) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">مقاله یافت نشد</h1>
          <Link href={BLOG_LIST_PATH} className="mt-6 inline-block text-gold-600">
            بازگشت به مقالات
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageHero
        title={post.title}
        breadcrumb={[
          { label: "مقالات", href: BLOG_LIST_PATH },
          { label: post.title },
        ]}
      />
      <article className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <time className="text-sm text-gold-600">
                {new Date(post.date).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.image && (
                <div className="relative my-8 aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="768px"
                    priority
                  />
                </div>
              )}
              <WpRichContent
                html={post.content}
                defaultContactMessage={`پس از مطالعه مقاله «${post.title}»`}
                showTrailingContact
              />
            </div>

            <div className="lg:col-span-4">
              <BlogSidebar
                lawyerOptions={lawyerOptions}
                contentHtml={post.content}
              />
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
