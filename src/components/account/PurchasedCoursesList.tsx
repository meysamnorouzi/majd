"use client";

import Link from "next/link";
import type { PurchasedCourse } from "@/types";
import { hasSpotPlayerLicense } from "@/lib/courses/format-utils";
import { licenseStatusLabels } from "@/lib/courses/purchased";
import { formatIcon } from "@/components/courses/FormatIcons";

const statusDot: Record<PurchasedCourse["licenseStatus"], string> = {
  ready: "bg-emerald-500",
  license_pending: "bg-amber-500",
  payment_pending: "bg-slate-400",
};

export function PurchasedCourseCard({ item }: { item: PurchasedCourse }) {
  const title = item.course?.title ?? item.productName;
  const formatSlug = item.format?.slug;
  const Icon = formatSlug ? formatIcon(formatSlug) : null;
  const isSpotPlayer = hasSpotPlayerLicense(formatSlug);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isSpotPlayer ? "bg-sky-500 text-white" : "bg-navy-950 text-gold-400"
          }`}
        >
          {Icon ? <Icon className="h-6 w-6" /> : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-navy-900">{title}</h3>
              {item.format && (
                <p className="mt-0.5 text-xs text-slate-500">{item.format.title}</p>
              )}
              {item.course?.duration && (
                <p className="mt-1 text-xs text-slate-400">{item.course.duration}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${statusDot[item.licenseStatus]}`} />
              <span className="text-xs font-medium text-slate-500">
                {licenseStatusLabels[item.licenseStatus]}
              </span>
            </div>
          </div>

          {isSpotPlayer && item.spotplayerLicense && (
            <div className="mt-3 rounded-lg bg-navy-950 px-3 py-2">
              <p className="text-xs text-white/60">کد لایسنس</p>
              <code className="break-all font-mono text-sm font-bold text-gold-400" dir="ltr">
                {item.spotplayerLicense}
              </code>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/account/orders/?id=${item.orderId}`}
              className="text-xs font-semibold text-gold-600 hover:text-gold-500"
            >
              جزئیات سفارش ←
            </Link>
            <Link
              href={`/courses/view/${item.productSlug}/`}
              className="text-xs font-semibold text-slate-500 hover:text-navy-900"
            >
              صفحه دوره
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PurchasedCoursesList({ items }: { items: PurchasedCourse[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-navy-900">هنوز دوره‌ای خریداری نکرده‌اید</h3>
        <p className="mt-2 text-sm text-slate-500">
          پس از خرید دوره، دسترسی و کد لایسنس در این بخش نمایش داده می‌شود.
        </p>
        <Link
          href="/courses/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
        >
          مشاهده دوره‌های آموزشی
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <PurchasedCourseCard key={`${item.orderId}-${item.productSlug}-${i}`} item={item} />
      ))}
    </div>
  );
}
