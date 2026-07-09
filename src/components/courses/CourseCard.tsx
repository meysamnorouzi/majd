"use client";

import Link from "next/link";
import type { CourseFormat, CourseItem } from "@/types";
import { getCourseDetailPath } from "@/data/courses";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function CourseCard({
  format,
  course,
  isDark = false,
}: {
  format: CourseFormat;
  course: CourseItem;
  isDark?: boolean;
}) {
  const href = getCourseDetailPath(
    format.slug,
    course.slug,
    course.productSlug,
  );

  return (
    <article
      className={`card-shine rounded-xl border p-5 transition hover:shadow-lg ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10"
          : "border-slate-100 bg-cream/50 hover:bg-white"
      }`}
    >
      <Link href={href} className="block">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4
            className={`font-bold transition hover:text-gold-500 ${
              isDark ? "text-white" : "text-navy-900"
            }`}
          >
            {course.title}
          </h4>
          {course.price && (
            <span className="text-sm font-bold text-gold-500">
              {course.price} تومان
            </span>
          )}
        </div>
        <p
          className={`mt-1 text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}
        >
          {course.duration} · سطح {course.level}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {course.highlights.map((h) => (
            <span
              key={h}
              className={`rounded-md px-2 py-0.5 text-xs ${
                isDark
                  ? "bg-white/10 text-white/70"
                  : "bg-navy-900/5 text-slate-600"
              }`}
            >
              {h}
            </span>
          ))}
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={href}
          className={`inline-flex items-center rounded-lg border px-4 py-2 text-xs font-semibold transition ${
            isDark
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"
          }`}
        >
          مشاهده جزئیات
        </Link>
        <div className="w-full sm:min-w-0 sm:flex-1">
          <AddToCartButton
            productSlug={course.productSlug}
            label="خرید دوره"
            size="sm"
            className="!w-auto !px-4 !py-2"
          />
        </div>
      </div>
    </article>
  );
}
