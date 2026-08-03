"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import {
  BlogFeaturedPost,
  BlogInlineBanner,
} from "@/components/blog/BlogPromoBanner";
import { fetchPostsClient, type BlogPost } from "@/lib/wordpress/client";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { teamMembers } from "@/data/site";
import type { LawyerOption } from "@/components/contact/ContactForm";

const lawyerOptions: LawyerOption[] = teamMembers.map((m) => ({
  slug: m.slug,
  name: m.name,
}));

export function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPostsClient(24);
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) setError("بارگذاری مقالات انجام نشد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);
  const midIndex = Math.floor(gridPosts.length / 2);
  // Keep even split so each half fills complete 2-column rows
  const splitAt = midIndex - (midIndex % 2);
  const firstHalf = gridPosts.slice(0, splitAt || midIndex);
  const secondHalf = gridPosts.slice(splitAt || midIndex);

  return (
    <section className="py-16 lg:py-20">
      <Container>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              {featuredPost && (
                <Reveal variant="up">
                  <BlogFeaturedPost post={featuredPost} />
                </Reveal>
              )}

              <Reveal className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy-900">
                    آخرین مقالات
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص
                  </p>
                </div>
                <span className="hidden text-sm text-slate-500 sm:block">
                  {posts.length.toLocaleString("fa-IR")} مقاله
                </span>
              </Reveal>

              <Stagger
                className="grid grid-cols-2 gap-4 sm:gap-8"
                stagger={0.08}
              >
                {firstHalf.map((post) => (
                  <StaggerItem key={post.id} variant="up" className="min-w-0">
                    <PostCard {...post} />
                  </StaggerItem>
                ))}
              </Stagger>

              {gridPosts.length > 2 && (
                <Reveal>
                  <BlogInlineBanner />
                </Reveal>
              )}

              <Stagger
                className="grid grid-cols-2 gap-4 sm:gap-8"
                stagger={0.08}
              >
                {secondHalf.map((post) => (
                  <StaggerItem key={post.id} variant="up" className="min-w-0">
                    <PostCard {...post} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <Reveal className="lg:col-span-4" variant="left" delay={0.1}>
              <BlogSidebar lawyerOptions={lawyerOptions} />
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
}
