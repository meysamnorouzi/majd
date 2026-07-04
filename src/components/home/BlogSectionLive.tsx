"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { fetchPostsClient, type BlogPost } from "@/lib/wordpress/client";
import Link from "next/link";

export function BlogSectionLive() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPostsClient(6).then((data) => {
      if (!cancelled) setPosts(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="مقالات حقوقی"
          title="آخرین مطالب بلاگ"
          description="تحلیل‌های تخصصی و راهنمای حقوقی از وکلای موسسه مجد"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            همه مقالات
          </Link>
        </div>
      </Container>
    </section>
  );
}
