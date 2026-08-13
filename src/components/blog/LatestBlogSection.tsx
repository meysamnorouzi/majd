"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { fetchPostsClient, type BlogPost } from "@/lib/wordpress/client";
import { BLOG_LIST_PATH } from "@/lib/blog-paths";

export function LatestBlogSection({
  eyebrow = "مقالات حقوقی",
  title = "آخرین مقالات",
  description = "تحلیل‌ها و راهنماهای حقوقی مرتبط",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPostsClient(3).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <Container>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        </Container>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
      <Container>
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={BLOG_LIST_PATH}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            همه مقالات
          </Link>
        </div>
      </Container>
    </section>
  );
}
