"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { getPillar } from "@/data/pillars";
import {
  fetchCategoriesClient,
  fetchPostsClient,
  findCategoryBySlug,
  type BlogPost,
} from "@/lib/wordpress/client";
import type { ServiceCategoryPrefix } from "@/lib/service-paths";

export function PillarRelatedPosts({
  prefix,
}: {
  prefix: ServiceCategoryPrefix;
}) {
  const pillar = getPillar(prefix);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pillar) return;
    let cancelled = false;

    (async () => {
      let categories;
      try {
        categories = await fetchCategoriesClient();
      } catch {
        if (!cancelled) setError("بارگذاری مقالات انجام نشد.");
        return;
      }
      if (cancelled) return;

      const asArticles = (items: BlogPost[]) => items.slice(0, 6);

      try {
        for (const slug of pillar.blogCategorySlugs) {
          const category = findCategoryBySlug(categories, slug);
          if (!category) continue;
          const matched = asArticles(
            await fetchPostsClient(12, { categoryId: category.id }),
          );
          if (cancelled) return;
          if (matched.length) {
            setPosts(matched);
            return;
          }
        }

        const latest = asArticles(await fetchPostsClient(12));
        if (!cancelled) setPosts(latest);
      } catch {
        if (!cancelled) setError("بارگذاری مقالات انجام نشد.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pillar, prefix]);

  if (!pillar) return null;

  if (error) {
    return (
      <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
        <Container>
          <p className="text-center text-slate-600">{error}</p>
        </Container>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
      <Container>
        <SectionTitle
          eyebrow="مقالات حقوقی"
          title={`مقالات ${pillar.title}`}
          description="تحلیل‌ها و راهنماهای مرتبط با این دسته"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
