"use client";

import Link from "next/link";
import type { CourseFormatSlug } from "@/types";
import { getCourseFormat } from "@/data/courses";
import { getAccent } from "@/components/courses/accentStyles";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { StoreProductView } from "@/lib/woocommerce/store-products-client";
import { formatStorePrice } from "@/lib/woocommerce/format-price";

export function WpCourseCard({
  product,
  isDark = false,
}: {
  product: StoreProductView;
  isDark?: boolean;
}) {
  const formatSlug = (product.majd.format_slug ||
    "session-inperson") as CourseFormatSlug;
  const format = getCourseFormat(formatSlug);
  const accent = format
    ? getAccent(format)
    : {
        badge: "bg-gold-500/20 text-gold-400 border-gold-500/30",
        icon: "bg-gold-500 text-navy-950",
      };
  const href = `/courses/view/${product.slug}/`;
  const priceLabel =
    product.price && product.price !== "0"
      ? formatStorePrice(product.price, product.currency)
      : null;

  return (
    <article
      className={`card-shine rounded-xl border p-5 transition hover:shadow-lg ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10"
          : "border-slate-100 bg-cream/50 hover:bg-white"
      }`}
    >
      <Link href={href} className="block">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {format && (
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${accent.badge}`}
            >
              {format.badge}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4
            className={`font-bold transition hover:text-gold-500 ${
              isDark ? "text-white" : "text-navy-900"
            }`}
          >
            {product.name}
          </h4>
          {priceLabel && (
            <span className="text-sm font-bold text-gold-500">{priceLabel}</span>
          )}
        </div>
        <p
          className={`mt-1 text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}
        >
          {product.majd.duration || "—"}
          {product.majd.level ? ` · سطح ${product.majd.level}` : ""}
        </p>
        {product.majd.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.majd.highlights.slice(0, 3).map((h) => (
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
        )}
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
            productSlug={product.slug}
            productId={product.id}
            label="خرید دوره"
            size="sm"
            className="!w-auto !px-4 !py-2"
          />
        </div>
      </div>
    </article>
  );
}
