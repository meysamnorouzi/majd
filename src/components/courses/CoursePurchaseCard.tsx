"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseFormat, CourseItem } from "@/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getStoreProductBySlug } from "@/lib/woocommerce/products";
import { formatStorePrice, formatDisplayPrice } from "@/lib/woocommerce/format-price";
import { getAccent } from "./accentStyles";

export function CoursePurchaseCard({
  format,
  course,
}: {
  format: CourseFormat;
  course: CourseItem;
}) {
  const accent = getAccent(format);
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [currency, setCurrency] = useState("تومان");

  useEffect(() => {
    let cancelled = false;
    getStoreProductBySlug(course.productSlug).then((product) => {
      if (!cancelled && product) {
        setLivePrice(product.price);
        setCurrency(product.currency);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [course.productSlug]);

  const displayPrice = livePrice
    ? formatStorePrice(livePrice, currency)
    : course.price
      ? `${formatDisplayPrice(course.price)} تومان`
      : "تماس بگیرید";

  return (
    <aside className="sticky top-28 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${accent.badge}`}
      >
        {format.badge}
      </span>
      <p className="mt-4 text-3xl font-bold text-gold-600">{displayPrice}</p>
      <p className="mt-2 text-sm text-slate-500">
        {course.duration} · سطح {course.level}
      </p>
      <div className="mt-6 space-y-3">
        <AddToCartButton productSlug={course.productSlug} />
        <Link
          href={`/courses/${format.slug}/`}
          className="block w-full rounded-lg border-2 border-navy-900 py-3 text-center text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
        >
          سایر دوره‌های {format.badge}
        </Link>
        <Link
          href="/contact/"
          className="block text-center text-sm text-gold-600 hover:text-gold-700"
        >
          نیاز به مشاوره دارید؟
        </Link>
      </div>
      <ul className="mt-6 space-y-2 border-t border-slate-100 pt-6 text-sm text-slate-600">
        <li className="flex gap-2">
          <span className="text-gold-500">✓</span>
          پرداخت امن از درگاه بانکی
        </li>
        <li className="flex gap-2">
          <span className="text-gold-500">✓</span>
          گواهی پایان دوره
        </li>
        <li className="flex gap-2">
          <span className="text-gold-500">✓</span>
          پشتیبانی آموزشی
        </li>
      </ul>
    </aside>
  );
}
