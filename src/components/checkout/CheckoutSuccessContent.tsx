"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  const isPaid = status === "processing" || status === "completed";

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-navy-900">
        سفارش شما ثبت شد
      </h2>
      <p className="mt-3 text-slate-600">
        {isPaid
          ? "پرداخت با موفقیت انجام شد. پس از تأیید، لایسنس اسپات پلیر در پنل کاربری شما نمایش داده می‌شود."
          : "سفارش شما دریافت شد. پس از تأیید پرداخت، دسترسی دوره فعال می‌شود."}
      </p>
      {orderId && (
        <p className="mt-4 text-sm text-slate-500">
          شماره سفارش:{" "}
          <span className="font-bold text-navy-900" dir="ltr">
            #{orderId}
          </span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/account/">ورود به حساب کاربری</Button>
        <Button href="/account/register/" variant="outline">
          ساخت حساب
        </Button>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        اگر حساب کاربری ندارید، با همان ایمیلی که در خرید وارد کردید ثبت‌نام کنید.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Button href="/courses/" variant="ghost" size="sm">
          مشاهده دوره‌ها
        </Button>
        <Button href="/contact/" variant="ghost" size="sm">
          تماس با پشتیبانی
        </Button>
      </div>
    </div>
  );
}
