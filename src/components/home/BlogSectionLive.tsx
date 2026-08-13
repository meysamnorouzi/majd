"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { fetchPostsClient, type BlogPost } from "@/lib/wordpress/client";
import { BLOG_LIST_PATH } from "@/lib/blog-paths";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
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
          title="آخرین مقالات"
          description="تحلیل‌های تخصصی و راهنمای حقوقی از وکلای موسسه مجد"
        />
        <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id} variant="up">
              <PostCard {...post} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center" delay={0.1}>
          <Link
            href={BLOG_LIST_PATH}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            همه مقالات
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
