"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchCategoriesClient,
  type BlogCategory,
} from "@/lib/wordpress/client";
import { blogCategoryPath } from "@/lib/blog-paths";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/reveal";

function categoryLabel(name: string) {
  return name.startsWith("مقالات") ? name : `مقالات ${name}`;
}

function CategoryCard({ category }: { category: BlogCategory }) {
  const href = blogCategoryPath(category.slug);
  const childCount = category.children.length;
  const totalCount =
    category.count +
    category.children.reduce((sum, child) => sum + child.count, 0);

  return (
    <Link
      href={href}
      className="card-shine group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition hover:border-gold-400/30 hover:shadow-xl"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>

      <h2 className="text-lg font-bold text-navy-900 transition group-hover:text-gold-600 sm:text-xl">
        {categoryLabel(category.name)}
      </h2>

      {category.description ? (
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {category.description.replace(/<[^>]+>/g, "").trim()}
        </p>
      ) : (
        <p className="mt-2 flex-1 text-sm text-slate-600">
          تحلیل‌ها و راهنماهای حقوقی در زمینه {category.name}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-gold-600">
          مشاهده مقالات ←
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {totalCount > 0 && (
            <span>{totalCount.toLocaleString("fa-IR")} مقاله</span>
          )}
          {childCount > 0 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {childCount.toLocaleString("fa-IR")} زیردسته
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function BlogCategoryGrid() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesClient().then((tree) => {
      if (!cancelled) {
        setCategories(tree);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-lg font-semibold text-navy-900">
          دسته‌بندی‌ای یافت نشد
        </p>
        <p className="mt-2 text-sm text-slate-600">
          به‌زودی مقالات جدید منتشر می‌شوند.
        </p>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-navy-900">دسته‌بندی مقالات</h2>
        <p className="mt-1 text-sm text-slate-600">
          موضوع حقوقی موردنظر خود را انتخاب کنید
        </p>
      </div>

      <Stagger
        className="grid gap-6 sm:grid-cols-2"
        stagger={0.08}
        immediate
      >
        {categories.map((category) => (
          <StaggerItem key={category.slug} variant="up" className="min-w-0">
            <CategoryCard category={category} />
          </StaggerItem>
        ))}
      </Stagger>
    </FadeIn>
  );
}
