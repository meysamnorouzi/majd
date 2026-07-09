"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatStorePrice } from "@/lib/woocommerce/format-price";
import type { StoreCartItem } from "@/types";

export function CartLineItem({ item }: { item: StoreCartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const image = item.images?.[0]?.src;
  const currency = item.prices?.currency_symbol ?? "تومان";

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:gap-4">
      <div className="flex gap-4">
        {image ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
            <Image
              src={image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-2xl font-bold text-gold-400">
            م
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-navy-900">{item.name}</h3>
          <p className="mt-1 text-lg font-bold text-gold-600">
            {formatStorePrice(item.prices.price, currency)}
          </p>
        </div>
        <div className="text-left sm:hidden">
          <p className="font-bold text-navy-900">
            {formatStorePrice(item.totals.line_total, currency)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:mt-4 sm:flex-1">
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => updateQuantity(item.key, item.quantity - 1)}
            className="px-3 py-1.5 text-lg text-slate-600 hover:bg-slate-50"
            aria-label="کاهش تعداد"
          >
            −
          </button>
          <span className="min-w-8 px-2 text-center font-semibold">
            {item.quantity.toLocaleString("fa-IR")}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.key, item.quantity + 1)}
            className="px-3 py-1.5 text-lg text-slate-600 hover:bg-slate-50"
            aria-label="افزایش تعداد"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.key)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          حذف
        </button>
        <div className="hidden text-left sm:ms-auto sm:block">
          <p className="font-bold text-navy-900">
            {formatStorePrice(item.totals.line_total, currency)}
          </p>
        </div>
      </div>
    </article>
  );
}
