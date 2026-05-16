"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/components/cart/CartProvider";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";

export function CartPageContent() {
  const { items, isLoading, error, refreshCart } = useCart();

  return (
    <section className="py-16">
      <Container>
        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>{error}</p>
            <p className="mt-1 text-amber-700">
              اتصال به فروشگاه ووکامرس برقرار نیست. تنظیمات CORS وردپرس را
              بررسی کنید یا{" "}
              <button
                type="button"
                onClick={() => refreshCart()}
                className="font-semibold underline"
              >
                دوباره تلاش کنید
              </button>
              .
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} />
              ))}
              <Link
                href="/courses/"
                className="inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                ← افزودن دوره دیگر
              </Link>
            </div>
            <OrderSummary />
          </div>
        )}
      </Container>
    </section>
  );
}
