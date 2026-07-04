"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { fetchPostBySlugClient, type BlogPost } from "@/lib/wordpress/client";

function slugFromPathname(pathname: string): string {
  const base = "/blog/post";
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith(base)) return "";
  const rest = normalized.slice(base.length).replace(/^\//, "");
  return decodeURIComponent(rest);
}

export function BlogPostContent() {
  const pathname = usePathname();
  const slug = slugFromPathname(pathname);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    (async () => {
      const data = await fetchPostBySlugClient(slug);
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        setPost(null);
      } else {
        setPost(data);
        document.title = `${data.title} | موسسه حقوقی مجد`;
      }
      setLoading(false);
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

  if (notFound || !post) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">مقاله یافت نشد</h1>
          <Link href="/blog/" className="mt-6 inline-block text-gold-600">
            بازگشت به بلاگ
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
          { label: "بلاگ", href: "/blog/" },
          { label: post.title },
        ]}
      />
      <article className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
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
            <div
              className="prose-wp"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-12 rounded-2xl border border-gold-400/30 bg-navy-900 p-6 sm:p-8">
              <ContactForm
                variant="dark"
                title="نیاز به مشاوره تخصصی دارید؟"
                description="وکلای موسسه مجد آماده پاسخگویی به سوالات حقوقی شما هستند."
                defaultSubject="مشاوره حقوقی"
                defaultMessage={`پس از مطالعه مقاله «${post.title}»`}
              />
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
