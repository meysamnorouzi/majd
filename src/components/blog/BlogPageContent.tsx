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
  const firstHalf = gridPosts.slice(0, midIndex);
  const secondHalf = gridPosts.slice(midIndex);

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
            <div className="lg:col-span-8">
              {featuredPost && <BlogFeaturedPost post={featuredPost} />}

              <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
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
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                {firstHalf.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>

              {gridPosts.length > 2 && <BlogInlineBanner />}

              <div className="grid gap-8 sm:grid-cols-2">
                {secondHalf.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <BlogSidebar lawyerOptions={lawyerOptions} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
