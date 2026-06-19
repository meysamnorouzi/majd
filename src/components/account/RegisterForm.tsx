"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AccountApiError } from "@/lib/woocommerce/account-client";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
      });
      router.push("/account/");
    } catch (err) {
      setError(
        err instanceof AccountApiError
          ? err.message
          : "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-navy-900/5">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-gold-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">ساخت حساب کاربری</h1>
          <p className="mt-2 text-sm text-slate-500">
            پس از خرید دوره، لایسنس اسپات پلیر در پنل شما نمایش داده می‌شود
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="mb-1.5 block text-sm font-semibold text-navy-900">
                نام
              </label>
              <input
                id="first_name"
                required
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-1.5 block text-sm font-semibold text-navy-900">
                نام خانوادگی
              </label>
              <input
                id="last_name"
                required
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg_email" className="mb-1.5 block text-sm font-semibold text-navy-900">
              ایمیل
            </label>
            <input
              id="reg_email"
              type="email"
              required
              dir="ltr"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
              تلفن (اختیاری)
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reg_password" className="mb-1.5 block text-sm font-semibold text-navy-900">
              رمز عبور
            </label>
            <input
              id="reg_password"
              type="password"
              required
              minLength={8}
              dir="ltr"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-navy-900">
              تکرار رمز عبور
            </label>
            <input
              id="confirm"
              type="password"
              required
              dir="ltr"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              className={inputClass}
            />
          </div>

          <Button type="submit" className="w-full justify-center" onClick={undefined}>
            {submitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/account/login/" className="font-semibold text-gold-600 hover:text-gold-500">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
