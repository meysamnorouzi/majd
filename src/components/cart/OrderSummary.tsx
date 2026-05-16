"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatStorePrice } from "@/lib/woocommerce/format-price";
import { Button } from "@/components/ui/Button";

export function OrderSummary({
  showCheckoutButton = true,
  checkoutHref = "/checkout/",
}: {
  showCheckoutButton?: boolean;
  checkoutHref?: string;
}) {
  const { cart, items, itemCount } = useCart();
  const totals = cart?.totals;
  const currency = totals?.currency_symbol ?? "تومان";

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
      <h2 className="text-lg font-bold text-navy-900">خلاصه سفارش</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>تعداد اقلام</dt>
          <dd className="font-semibold text-navy-900">
            {itemCount.toLocaleString("fa-IR")}
          </dd>
        </div>
        {totals && (
          <>
            {parseInt(totals.total_discount, 10) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>تخفیف</dt>
                <dd>
                  −{formatStorePrice(totals.total_discount, currency)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
              <dt className="font-bold text-navy-900">جمع کل</dt>
              <dd className="text-xl font-bold text-gold-600">
                {formatStorePrice(totals.total_price, currency)}
              </dd>
            </div>
          </>
        )}
      </dl>
      {showCheckoutButton && items.length > 0 && (
        <div className="mt-6">
          <Button href={checkoutHref} className="w-full justify-center">
            ادامه تسویه حساب
          </Button>
        </div>
      )}
      <Link
        href="/courses/"
        className="mt-4 block text-center text-sm font-semibold text-gold-600 hover:text-gold-700"
      >
        ادامه خرید دوره‌ها
      </Link>
    </aside>
  );
}
