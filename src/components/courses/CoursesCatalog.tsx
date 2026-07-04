"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CourseFormatSlug } from "@/types";
import { WpCourseCard } from "@/components/courses/WpCourseCard";
import {
  CourseCatalogActiveChips,
  CourseCatalogFiltersPanel,
} from "@/components/courses/CourseCatalogFilters";
import { CourseCatalogToolbar } from "@/components/courses/CourseCatalogToolbar";
import {
  applyCourseCatalog,
  defaultCourseCatalogFilters,
  extractUniqueLevels,
} from "@/lib/courses/catalog";
import {
  fetchCourseProductsClient,
  type StoreProductView,
} from "@/lib/woocommerce/store-products-client";

interface CoursesCatalogProps {
  lockedFormatSlug?: CourseFormatSlug;
  sectionId?: string;
  heading?: string;
  description?: string;
  className?: string;
}

export function CoursesCatalog({
  lockedFormatSlug,
  sectionId = "courses-catalog",
  heading = "فهرست دوره‌ها",
  description = "با جستجو و فیلتر، دوره مناسب خود را پیدا کنید.",
  className = "",
}: CoursesCatalogProps) {
  const [courses, setCourses] = useState<StoreProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() =>
    defaultCourseCatalogFilters(lockedFormatSlug),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters(defaultCourseCatalogFilters(lockedFormatSlug));
  }, [lockedFormatSlug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchCourseProductsClient(
      lockedFormatSlug ? { formatSlug: lockedFormatSlug } : undefined,
    ).then((data) => {
      if (!cancelled) {
        setCourses(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [lockedFormatSlug]);

  const availableLevels = useMemo(
    () => extractUniqueLevels(courses),
    [courses],
  );

  const filteredCourses = useMemo(
    () => applyCourseCatalog(courses, filters, lockedFormatSlug),
    [courses, filters, lockedFormatSlug],
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultCourseCatalogFilters(lockedFormatSlug));
  }, [lockedFormatSlug]);

  return (
    <section
      id={sectionId}
      className={`scroll-mt-24 bg-cream/40 py-16 ${className}`}
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        {(heading || description) && (
          <div className="mb-8">
            {heading && (
              <h2 className="text-2xl font-bold text-navy-900">{heading}</h2>
            )}
            {description && (
              <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
            )}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <CourseCatalogFiltersPanel
            filters={filters}
            availableLevels={availableLevels}
            lockedFormat={lockedFormatSlug}
            onChange={setFilters}
            onReset={resetFilters}
            className="hidden h-fit lg:sticky lg:top-28 lg:block"
          />

          <div className="min-w-0">
            <CourseCatalogToolbar
              filters={filters}
              resultCount={filteredCourses.length}
              totalCount={courses.length}
              onChange={setFilters}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            <div className="mt-4">
              <CourseCatalogActiveChips
                filters={filters}
                lockedFormat={lockedFormatSlug}
                onChange={setFilters}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-lg font-bold text-navy-900">
                  دوره‌ای یافت نشد
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 text-sm font-semibold text-gold-600 hover:text-gold-700"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {filteredCourses.map((course) => (
                  <WpCourseCard key={course.id} product={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="بستن فیلترها"
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-navy-900">فیلتر دوره‌ها</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="بستن"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CourseCatalogFiltersPanel
                filters={filters}
                availableLevels={availableLevels}
                lockedFormat={lockedFormatSlug}
                onChange={setFilters}
                onReset={resetFilters}
                className="border-0 p-0 shadow-none"
              />
            </div>
            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-gold-500 py-3 text-sm font-semibold text-navy-950"
              >
                مشاهده {filteredCourses.length.toLocaleString("fa-IR")} دوره
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
