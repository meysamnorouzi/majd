"use client";

import { useEffect } from "react";

export type ToastVariant = "success" | "error";

export function Toast({
  message,
  variant = "success",
  onClose,
  duration = 5000,
}: {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose, message]);

  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-500/10"
      : "border-red-200 bg-red-50 text-red-900 shadow-red-500/10";

  const icon =
    variant === "success" ? (
      <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4"
    >
      <div
        className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-5 py-4 shadow-xl backdrop-blur-sm animate-fade-up ${styles}`}
      >
        {icon}
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 opacity-60 transition hover:opacity-100"
          aria-label="بستن"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
