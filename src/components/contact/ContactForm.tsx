"use client";

import { useCallback, useState } from "react";
import {
  ContactApiError,
  submitContactForm,
} from "@/lib/wordpress/contact-client";
import { Toast, type ToastVariant } from "@/components/ui/Toast";

const SUBJECT_OPTIONS = [
  "مشاوره حقوقی",
  "وکالت",
  "حقوق خانواده",
  "حقوق ملکی",
  "حقوق کیفری",
  "دوره آموزشی",
  "سایر",
] as const;

export interface ContactFormProps {
  id?: string;
  title?: string;
  description?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  variant?: "default" | "compact" | "dark";
  className?: string;
}

function resolveSubject(defaultSubject?: string): string {
  if (!defaultSubject) return "";
  if (SUBJECT_OPTIONS.includes(defaultSubject as (typeof SUBJECT_OPTIONS)[number])) {
    return defaultSubject;
  }
  return "سایر";
}

export function ContactForm({
  id,
  title = "فرم تماس",
  description = "پیام خود را ارسال کنید؛ در اسرع وقت با شما تماس می‌گیریم.",
  defaultSubject,
  defaultMessage = "",
  variant = "default",
  className = "",
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);
  const [formKey, setFormKey] = useState(0);

  const isDark = variant === "dark";
  const isCompact = variant === "compact" || variant === "dark";
  const resolvedSubject = resolveSubject(defaultSubject);
  const subjectNote =
    defaultSubject && resolvedSubject === "سایر" ? defaultSubject : undefined;

  const inputClass = isDark
    ? "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 disabled:opacity-60"
    : "w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:opacity-60";

  const labelClass = isDark
    ? "mb-1 block text-sm font-medium text-white"
    : "mb-1 block text-sm font-medium text-navy-900";

  const dismissToast = useCallback(() => setToast(null), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = (data.get("subject") as string).trim();
    const subjectDetail = (data.get("subject_detail") as string)?.trim();
    const fullSubject = subjectDetail
      ? `${subject} — ${subjectDetail}`
      : subject;

    try {
      const result = await submitContactForm({
        name: (data.get("name") as string).trim(),
        phone: (data.get("phone") as string).trim(),
        subject: fullSubject,
        message: (data.get("message") as string).trim(),
        company: (data.get("company") as string) || undefined,
      });

      setToast({ message: result.message, variant: "success" });
      setFormKey((k) => k + 1);
    } catch (err) {
      setToast({
        message:
          err instanceof ContactApiError
            ? err.message
            : "ارسال پیام انجام نشد. اتصال به سرور را بررسی کنید.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const wrapperClass = isDark
    ? className
    : `rounded-2xl bg-white p-8 shadow-lg ${isCompact ? "p-6" : ""} ${className}`;

  return (
    <>
      <div id={id} className={wrapperClass}>
        {title && (
          <h2
            className={`font-bold ${isDark ? "text-lg text-gold-400" : isCompact ? "text-lg text-navy-900" : "text-xl text-navy-900"}`}
          >
            {title}
          </h2>
        )}
        {description ? (
          <p
            className={`mt-2 text-sm ${isDark ? "text-white/75" : "text-slate-600"}`}
          >
            {description}
          </p>
        ) : null}

        <form
          key={formKey}
          onSubmit={handleSubmit}
          className={`relative space-y-5 ${title || description ? "mt-6" : ""}`}
        >
          <div
            className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
            aria-hidden
          >
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor={`name-${id ?? "contact"}`} className={labelClass}>
              نام و نام خانوادگی *
            </label>
            <input
              id={`name-${id ?? "contact"}`}
              name="name"
              required
              disabled={loading}
              className={inputClass}
              placeholder="نام شما"
            />
          </div>

          <div>
            <label htmlFor={`phone-${id ?? "contact"}`} className={labelClass}>
              شماره تماس *
            </label>
            <input
              id={`phone-${id ?? "contact"}`}
              name="phone"
              type="tel"
              required
              disabled={loading}
              dir="ltr"
              className={inputClass}
              placeholder="09121234567"
            />
          </div>

          <div>
            <label htmlFor={`subject-${id ?? "contact"}`} className={labelClass}>
              موضوع *
            </label>
            <select
              id={`subject-${id ?? "contact"}`}
              name="subject"
              required
              disabled={loading}
              className={inputClass}
              defaultValue={resolvedSubject}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              {SUBJECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {subjectNote && (
              <input type="hidden" name="subject_detail" value={subjectNote} />
            )}
          </div>

          <div>
            <label htmlFor={`message-${id ?? "contact"}`} className={labelClass}>
              پیام *
            </label>
            <textarea
              id={`message-${id ?? "contact"}`}
              name="message"
              rows={isCompact ? 3 : 5}
              required
              disabled={loading}
              defaultValue={defaultMessage}
              className={`${inputClass} resize-none`}
              placeholder="شرح مختصر پرونده یا سوال حقوقی..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 py-4 font-semibold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />
                در حال ارسال...
              </>
            ) : (
              "ارسال درخواست"
            )}
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={dismissToast}
        />
      )}
    </>
  );
}
