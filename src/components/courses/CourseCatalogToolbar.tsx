"use client";

import type { CourseCatalogFilters, CourseSortOption } from "@/lib/courses/catalog";

const SORT_OPTIONS: { value: CourseSortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "title-asc", label: "نام (الف–ی)" },
  { value: "title-desc", label: "نام (ی–الف)" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

interface CourseCatalogToolbarProps {
  filters: CourseCatalogFilters;
  resultCount: number;
  totalCount: number;
  onChange: (filters: CourseCatalogFilters) => void;
  onOpenFilters?: () => void;
  showMobileFilterButton?: boolean;
}

export function CourseCatalogToolbar({
  filters,
  resultCount,
  totalCount,
  onChange,
  onOpenFilters,
  showMobileFilterButton = true,
}: CourseCatalogToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="course-search" className="sr-only">
            جستجوی دوره
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
            id="course-search"
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="جستجو در نام، توضیحات و موضوعات دوره..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pe-4 ps-11 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showMobileFilterButton && onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy-900 transition hover:border-gold-500/40 lg:hidden"
            >
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
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
              فیلتر
            </button>
          )}

          <div className="min-w-0 w-full sm:w-auto sm:min-w-[8rem]">
            <label htmlFor="course-sort" className="sr-only">
              مرتب‌سازی
            </label>
            <select
              id="course-sort"
              value={filters.sort}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sort: e.target.value as CourseSortOption,
                })
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
      </div>

      <p className="text-sm text-slate-600">
        {resultCount.toLocaleString("fa-IR")} دوره از{" "}
        {totalCount.toLocaleString("fa-IR")} مورد
      </p>
    </div>
  );
}
