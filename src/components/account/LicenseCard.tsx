"use client";

import { useState } from "react";
import type { LicenseStatus } from "@/types";
import { licenseStatusLabels } from "@/lib/courses/purchased";

const statusStyles: Record<LicenseStatus, string> = {
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  license_pending: "bg-amber-100 text-amber-800 border-amber-200",
  payment_pending: "bg-slate-100 text-slate-600 border-slate-200",
};

export function LicenseCard({
  license,
  notes,
  status,
  courseTitle,
}: {
  license: string | null;
  notes: string | null;
  status: LicenseStatus;
  courseTitle?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!license) return;
    try {
      await navigator.clipboard.writeText(license);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-gold-400/40 bg-white shadow-lg shadow-gold-500/5">
      <div className="border-b border-gold-400/20 bg-gradient-to-l from-gold-500/10 to-transparent px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-navy-900">کد لایسنس اسپات پلیر</h3>
              {courseTitle && (
                <p className="text-sm text-slate-500">{courseTitle}</p>
              )}
            </div>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
          >
            {licenseStatusLabels[status]}
          </span>
        </div>
      </div>

      <div className="p-6">
        {license ? (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-4">
              <code
                className="flex-1 font-mono text-lg font-bold tracking-wider text-gold-400"
                dir="ltr"
              >
                {license}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
              >
                {copied ? "کپی شد!" : "کپی"}
              </button>
            </div>
            {notes && (
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                {notes}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-amber-50 p-5 text-center">
            <p className="text-sm leading-relaxed text-amber-800">
              {status === "payment_pending"
                ? "پس از تأیید پرداخت، لایسنس اسپات پلیر برای شما صادر و در این بخش نمایش داده می‌شود."
                : "لایسنس شما در حال آماده‌سازی است. معمولاً ظرف ۲۴ ساعت کاری فعال می‌شود. در صورت تأخیر با پشتیبانی تماس بگیرید."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
