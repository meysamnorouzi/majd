"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchOrders } from "@/lib/woocommerce/account-client";
import {
  getSpotPlayerCourses,
  ordersToPurchasedCourses,
} from "@/lib/courses/purchased";
import type { CustomerOrder, PurchasedCourse } from "@/types";
import { PurchasedCoursesList } from "./PurchasedCoursesList";

export function DashboardOverview() {
  const { displayName } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [purchased, setPurchased] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchOrders();
        if (!cancelled) {
          setOrders(data);
          setPurchased(ordersToPurchasedCourses(data));
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
  }, []);

  const spotCourses = getSpotPlayerCourses(purchased);
  const readyLicenses = spotCourses.filter((c) => c.licenseStatus === "ready").length;
  const pendingLicenses = spotCourses.filter(
    (c) => c.licenseStatus === "license_pending",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          سلام، {displayName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-slate-500">به پنل کاربری موسسه حقوقی مجد خوش آمدید</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">کل سفارش‌ها</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">لایسنس آماده</p>
          <p className="mt-1 text-3xl font-bold text-emerald-800">{readyLicenses}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">در انتظار لایسنس</p>
          <p className="mt-1 text-3xl font-bold text-amber-800">{pendingLicenses}</p>
        </div>
      </div>

      {spotCourses.some((c) => c.licenseStatus === "ready" && c.spotplayerLicense) && (
        <div className="rounded-2xl border border-gold-400/30 bg-gradient-to-l from-gold-500/10 to-white p-6">
          <h2 className="font-bold text-navy-900">لایسنس‌های فعال</h2>
          <p className="mt-1 text-sm text-slate-600">
            کدهای اسپات پلیر شما آماده استفاده هستند
          </p>
          <div className="mt-4 space-y-3">
            {spotCourses
              .filter((c) => c.spotplayerLicense)
              .map((c, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy-950 px-4 py-3"
                >
                  <span className="text-sm text-white/80">
                    {c.course?.title ?? c.productName}
                  </span>
                  <code className="font-mono text-sm font-bold text-gold-400" dir="ltr">
                    {c.spotplayerLicense}
                  </code>
                </div>
              ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">دوره‌های من</h2>
          <Link
            href="/account/orders/"
            className="text-sm font-semibold text-gold-600 hover:text-gold-500"
          >
            همه سفارش‌ها
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : (
          <PurchasedCoursesList items={purchased} />
        )}
      </div>
    </div>
  );
}
