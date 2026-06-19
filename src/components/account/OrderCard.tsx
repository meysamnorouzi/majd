"use client";

import Link from "next/link";
import type { CustomerOrder } from "@/types";
import { orderStatusLabels } from "@/lib/courses/purchased";

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderCard({ order }: { order: CustomerOrder }) {
  const statusLabel = orderStatusLabels[order.status] ?? order.status;
  const statusColor = statusColors[order.status] ?? "bg-slate-100 text-slate-600";

  return (
    <Link
      href={`/account/orders/?id=${order.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-gold-400/40 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">سفارش</p>
          <p className="font-bold text-navy-900" dir="ltr">
            #{order.id}
          </p>
          <p className="mt-1 text-sm text-slate-500">{formatDate(order.date)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <ul className="space-y-1">
          {order.items.map((item, i) => (
            <li key={i} className="text-sm text-slate-600">
              {item.name}
              {item.quantity > 1 && (
                <span className="text-slate-400"> × {item.quantity}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-bold text-navy-900">
          {formatPrice(order.total, order.currency)}
        </p>
      </div>
    </Link>
  );
}
