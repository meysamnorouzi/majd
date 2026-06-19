"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchOrder, fetchOrders } from "@/lib/woocommerce/account-client";
import type { CustomerOrder } from "@/types";
import { OrderCard } from "@/components/account/OrderCard";
import { OrderDetail } from "@/components/account/OrderDetail";

function OrdersContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [detail, setDetail] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        if (orderId) {
          const order = await fetchOrder(Number(orderId));
          if (!cancelled) setDetail(order);
        } else {
          const data = await fetchOrders();
          if (!cancelled) setOrders(data);
        }
      } catch {
        if (!cancelled) setError("بارگذاری سفارش‌ها انجام نشد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <p className="py-12 text-center text-sm text-red-600">{error}</p>;
  }

  if (orderId && detail) {
    return <OrderDetail order={detail} />;
  }

  if (orderId && !detail) {
    return <p className="py-12 text-center text-sm text-slate-500">سفارش یافت نشد.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">سفارش‌های من</h1>
        <p className="mt-1 text-slate-500">تاریخچه خریدهای شما</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">هنوز سفارشی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrdersPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
