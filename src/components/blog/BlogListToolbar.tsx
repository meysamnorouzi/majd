"use client";

import type { BlogPostSortOption } from "@/lib/wordpress/posts-query";

const SORT_OPTIONS: { value: BlogPostSortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "title-asc", label: "عنوان (الف–ی)" },
  { value: "title-desc", label: "عنوان (ی–الف)" },
];

interface BlogListToolbarProps {
  search: string;
  sort: BlogPostSortOption;
  resultCount: number;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: BlogPostSortOption) => void;
}

export function BlogListToolbar({
  search,
  sort,
  resultCount,
  onSearchChange,
  onSortChange,
}: BlogListToolbarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="blog-search" className="sr-only">
            جستجوی مقاله
          </label>
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-slate-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
          <input
            id="blog-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عنوان مقالات..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pe-4 ps-11 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>

        <div className="min-w-0 w-full sm:w-auto sm:min-w-[8rem]">
          <label htmlFor="blog-sort" className="sr-only">
            مرتب‌سازی
          </label>
          <select
            id="blog-sort"
            value={sort}
            onChange={(e) =>
              onSortChange(e.target.value as BlogPostSortOption)
            }
            className="form-select w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        {resultCount.toLocaleString("fa-IR")} مقاله
      </p>
    </div>
  );
}
