"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getStaticLoginCredentials } from "@/lib/auth/static-login";
import { AccountApiError } from "@/lib/woocommerce/account-client";
import { Button } from "@/components/ui/Button";

const staticCreds = getStaticLoginCredentials();

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account/";

  const [email, setEmail] = useState(staticCreds?.email ?? "");
  const [password, setPassword] = useState(staticCreds?.password ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof AccountApiError
          ? err.message
          : "ورود انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-navy-900/5">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-gold-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">ورود به حساب کاربری</h1>
          <p className="mt-2 text-sm text-slate-500">
            برای مشاهده دوره‌ها و کد لایسنس اسپات پلیر وارد شوید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy-900">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          <Button type="submit" className="w-full justify-center" onClick={undefined}>
            {submitting ? "در حال ورود..." : "ورود"}
          </Button>
        </form>

        {staticCreds && (
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
            ورود آزمایشی:{" "}
            <span dir="ltr" className="font-mono text-slate-700">
              {staticCreds.email}
            </span>
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          حساب کاربری ندارید؟{" "}
          <Link href="/account/register/" className="font-semibold text-gold-600 hover:text-gold-500">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
