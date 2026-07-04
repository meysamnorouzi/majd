"use client";

import Link from "next/link";
import type { CourseFormat } from "@/types";
import type { StoreProductView } from "@/lib/woocommerce/store-products-client";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatStorePrice } from "@/lib/woocommerce/format-price";
import { getAccent } from "./accentStyles";

export function CoursePurchaseCardWp({
  format,
  product,
}: {
  format: CourseFormat;
  product: StoreProductView;
}) {
  const accent = getAccent(format);
  const displayPrice =
    product.price && product.price !== "0"
      ? formatStorePrice(product.price, product.currency)
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
        {product.majd.duration || "—"}
        {product.majd.level ? ` · سطح ${product.majd.level}` : ""}
      </p>
      <div className="mt-6 space-y-3">
        <AddToCartButton productSlug={product.slug} productId={product.id} />
        <Link
          href={`/courses/${format.slug}/`}
          className="block w-full rounded-lg border-2 border-navy-900 py-3 text-center text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
        >
          سایر دوره‌های {format.badge}
        </Link>
        <a
          href="#consultation"
          className="block text-center text-sm text-gold-600 hover:text-gold-700"
        >
          نیاز به مشاوره دارید؟
        </a>
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
