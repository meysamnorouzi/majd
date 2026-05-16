"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/cart/OrderSummary";

export function CheckoutPageContent() {
  const router = useRouter();
  const { items, isLoading } = useCart();

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace("/cart/");
    }
  }, [isLoading, items.length, router]);

  return (
    <section className="py-16">
      <Container>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-600">
            سبد خرید خالی است.{" "}
            <Link href="/courses/" className="font-semibold text-gold-600">
              مشاهده دوره‌ها
            </Link>
          </p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-6 text-lg font-bold text-navy-900">
                اطلاعات صورتحساب
              </h2>
              <CheckoutForm />
            </div>
            <OrderSummary showCheckoutButton={false} />
          </div>
        )}
      </Container>
    </section>
  );
}
