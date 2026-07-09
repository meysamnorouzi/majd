"use client";

import Link from "next/link";
import type { CustomerOrder } from "@/types";
import { findCourseByProductSlug, orderStatusLabels } from "@/lib/courses/purchased";
import { hasSpotPlayerLicense } from "@/lib/courses/format-utils";
import { LicenseCard } from "./LicenseCard";
import { SpotPlayerGuide } from "./SpotPlayerGuide";

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatPrice(total: string, currency: string) {
  const num = parseFloat(total);
  if (isNaN(num)) return total;
  return new Intl.NumberFormat("fa-IR").format(num) + (currency === "IRR" ? " تومان" : ` ${currency}`);
}

export function OrderDetail({ order }: { order: CustomerOrder }) {
  const hasSpotPlayer = order.items.some((item) => {
    const match = findCourseByProductSlug(item.product_slug);
    return match ? hasSpotPlayerLicense(match.format.slug) : false;
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/account/orders/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-navy-900"
        >
          → بازگشت به سفارش‌ها
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">
          سفارش <span dir="ltr">#{order.id}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">وضعیت</p>
          <p className="mt-1 font-semibold text-navy-900">
            {orderStatusLabels[order.status] ?? order.status}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">مبلغ</p>
          <p className="mt-1 font-semibold text-navy-900">
            {formatPrice(order.total, order.currency)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">تعداد اقلام</p>
          <p className="mt-1 font-semibold text-navy-900">{order.items.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-navy-900">اقلام سفارش</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {order.items.map((item, i) => {
            const match = findCourseByProductSlug(item.product_slug);
            return (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium text-navy-900">
                    {match?.course.title ?? item.name}
                  </p>
                  {match?.format && (
                    <p className="text-xs text-slate-500">{match.format.title}</p>
                  )}
                </div>
                {item.quantity > 1 && (
                  <span className="text-sm text-slate-400">× {item.quantity}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {hasSpotPlayer && (
        <>
          <LicenseCard
            license={order.spotplayer_license}
            notes={order.spotplayer_notes}
            status={order.license_status}
          />
          {order.spotplayer_license && <SpotPlayerGuide />}
        </>
      )}

      {!hasSpotPlayer && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            جزئیات دسترسی این سفارش از طریق ایمیل یا تماس پشتیبانی به شما اطلاع‌رسانی می‌شود.
          </p>
          <Link
            href="/contact/"
            className="mt-4 inline-block text-sm font-semibold text-gold-600 hover:text-gold-500"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      )}
    </div>
  );
}
