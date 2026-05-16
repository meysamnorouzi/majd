"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildCheckoutPayload,
  checkout,
  StoreApiError,
} from "@/lib/woocommerce/store-client";
import type { BillingAddress } from "@/types";
const initialBilling: BillingAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "تهران",
  postcode: "",
  country: "IR",
  email: "",
  phone: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-navy-900 transition focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export function CheckoutForm() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingAddress>(initialBilling);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof BillingAddress>(
    key: K,
    value: BillingAddress[K],
  ) {
    setBilling((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!billing.first_name.trim()) return "نام را وارد کنید.";
    if (!billing.last_name.trim()) return "نام خانوادگی را وارد کنید.";
    if (!billing.email.trim() || !billing.email.includes("@"))
      return "ایمیل معتبر وارد کنید.";
    if (!billing.phone.trim()) return "شماره تماس را وارد کنید.";
    if (!billing.address_1.trim()) return "آدرس را وارد کنید.";
    if (!billing.city.trim()) return "شهر را وارد کنید.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = buildCheckoutPayload(billing, note || undefined);
      const result = await checkout(payload);

      const redirectUrl = result.payment_result?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      router.push(
        `/checkout/success/?order_id=${result.order_id}&status=${encodeURIComponent(result.status)}`,
      );
    } catch (err) {
      setError(
        err instanceof StoreApiError
          ? err.message
          : "ثبت سفارش ناموفق بود. اتصال به فروشگاه را بررسی کنید.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            نام *
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={billing.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="last_name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            نام خانوادگی *
          </label>
          <input
            id="last_name"
            type="text"
            required
            value={billing.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            ایمیل *
          </label>
          <input
            id="email"
            type="email"
            required
            dir="ltr"
            value={billing.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
            تلفن همراه *
          </label>
          <input
            id="phone"
            type="tel"
            required
            dir="ltr"
            value={billing.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass}
            placeholder="09xxxxxxxxx"
          />
        </div>
      </div>

      <div>
        <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-navy-900">
          استان
        </label>
        <input
          id="state"
          type="text"
          value={billing.state}
          onChange={(e) => updateField("state", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-navy-900">
            شهر *
          </label>
          <input
            id="city"
            type="text"
            required
            value={billing.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="postcode" className="mb-1.5 block text-sm font-semibold text-navy-900">
            کد پستی
          </label>
          <input
            id="postcode"
            type="text"
            dir="ltr"
            value={billing.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="address_1" className="mb-1.5 block text-sm font-semibold text-navy-900">
          آدرس *
        </label>
        <input
          id="address_1"
          type="text"
          required
          value={billing.address_1}
          onChange={(e) => updateField("address_1", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="customer_note" className="mb-1.5 block text-sm font-semibold text-navy-900">
          یادداشت سفارش (اختیاری)
        </label>
        <textarea
          id="customer_note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
          placeholder="توضیحات تکمیلی برای ثبت‌نام دوره..."
        />
      </div>

      <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-4 text-sm text-navy-900">
        <p className="font-semibold">پرداخت امن</p>
        <p className="mt-1 text-slate-600">
          پس از تأیید سفارش، به درگاه بانکی هدایت می‌شوید. پرداخت از طریق
          ووکامرس و درگاه معتبر انجام می‌شود.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-lg font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "در حال انتقال به درگاه..." : "پرداخت و ثبت نهایی"}
      </button>
    </form>
  );
}
