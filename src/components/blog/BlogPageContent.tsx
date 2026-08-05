"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import {
  BlogFeaturedPost,
  BlogInlineBanner,
} from "@/components/blog/BlogPromoBanner";
import {
  fetchCategoriesClient,
  fetchPostsClient,
  findCategoryBySlug,
  normalizeWpSlug,
  type BlogPost,
} from "@/lib/wordpress/client";
import {
  FadeIn,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/reveal";
import { teamMembers } from "@/data/site";
import type { LawyerOption } from "@/components/contact/ContactForm";

const lawyerOptions: LawyerOption[] = teamMembers.map((m) => ({
  slug: m.slug,
  name: m.name,
}));

function BlogLayoutShell({
  children,
  activeCategorySlug,
}: {
  children: ReactNode;
  activeCategorySlug?: string | null;
}) {
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main column — in RTL this sits on the right */}
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-8">
            {children}
          </div>
          {/* Sidebar — in RTL this sits on the left */}
          <div className="order-1 lg:order-2 lg:col-span-4">
            <Reveal variant="left" delay={0.08}>
              <BlogSidebar
                lawyerOptions={lawyerOptions}
                activeCategorySlug={activeCategorySlug}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PostsBody({
  categoryId,
  categoryName,
}: {
  categoryId?: number;
  categoryName?: string;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const data = await fetchPostsClient(
          24,
          categoryId ? { categoryId } : undefined,
        );
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
  }, [categoryId]);

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);
  const midIndex = Math.floor(gridPosts.length / 2);
  const splitAt = midIndex - (midIndex % 2);
  const firstHalf = gridPosts.slice(0, splitAt || midIndex);
  const secondHalf = gridPosts.slice(splitAt || midIndex);

  const heading = categoryName
    ? `مقالات ${categoryName}`
    : "آخرین مقالات";
  const subheading = categoryName
    ? `تحلیل‌ها و راهنماهای مرتبط با ${categoryName}`
    : "تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <p className="py-12 text-center text-red-600">{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-lg font-semibold text-navy-900">
          مقاله‌ای در این دسته‌بندی یافت نشد
        </p>
        <p className="mt-2 text-sm text-slate-600">
          از سایدبار دسته‌بندی دیگری را انتخاب کنید یا همه مقالات را ببینید.
        </p>
      </div>
    );
  }

  return (
    <>
      {featuredPost && !categoryId && (
        <FadeIn>
          <BlogFeaturedPost post={featuredPost} />
        </FadeIn>
      )}

      <FadeIn className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">{heading}</h2>
          <p className="mt-1 text-sm text-slate-600">{subheading}</p>
        </div>
        <span className="hidden text-sm text-slate-500 sm:block">
          {posts.length.toLocaleString("fa-IR")} مقاله
        </span>
      </FadeIn>

      {categoryId ? (
        <Stagger
          className="grid grid-cols-2 gap-4 sm:gap-8"
          stagger={0.08}
          immediate
        >
          {posts.map((post) => (
            <StaggerItem key={post.id} variant="up" className="min-w-0">
              <PostCard {...post} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <>
          <Stagger
            className="grid grid-cols-2 gap-4 sm:gap-8"
            stagger={0.08}
            immediate
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
            immediate
          >
            {secondHalf.map((post) => (
              <StaggerItem key={post.id} variant="up" className="min-w-0">
                <PostCard {...post} />
              </StaggerItem>
            ))}
          </Stagger>
        </>
      )}
    </>
  );
}

function BlogPageContentInner({
  categoryId: categoryIdProp,
  categoryName: categoryNameProp,
}: {
  categoryId?: number;
  categoryName?: string;
}) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [resolved, setResolved] = useState<{
    id?: number;
    name?: string;
    slug?: string | null;
  }>({
    id: categoryIdProp,
    name: categoryNameProp,
    slug: categorySlug,
  });
  const [resolving, setResolving] = useState(
    !categoryIdProp && !!categorySlug,
  );

  useEffect(() => {
    if (categoryIdProp) {
      setResolved({
        id: categoryIdProp,
        name: categoryNameProp,
        slug: categorySlug,
      });
      setResolving(false);
      return;
    }

    if (!categorySlug) {
      setResolved({ slug: null });
      setResolving(false);
      return;
    }

    let cancelled = false;
    setResolving(true);
    (async () => {
      const tree = await fetchCategoriesClient();
      if (cancelled) return;
      const match = findCategoryBySlug(tree, normalizeWpSlug(categorySlug));
      setResolved(
        match
          ? { id: match.id, name: match.name, slug: match.slug }
          : { id: -1, name: categorySlug, slug: categorySlug },
      );
      setResolving(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryIdProp, categoryNameProp, categorySlug]);

  return (
    <BlogLayoutShell activeCategorySlug={resolved.slug}>
      {resolving ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        </div>
      ) : (
        <PostsBody
          categoryId={
            resolved.id !== undefined && resolved.id > 0
              ? resolved.id
              : undefined
          }
          categoryName={resolved.name}
        />
      )}
    </BlogLayoutShell>
  );
}

export function BlogPageContent({
  categoryId,
  categoryName,
}: {
  categoryId?: number;
  categoryName?: string;
} = {}) {
  return (
    <Suspense
      fallback={
        <BlogLayoutShell>
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        </BlogLayoutShell>
      }
    >
      <BlogPageContentInner
        categoryId={categoryId}
        categoryName={categoryName}
      />
    </Suspense>
  );
}
