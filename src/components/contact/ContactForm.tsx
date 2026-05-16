"use client";

import { useState } from "react";
import { siteConfig } from "@/data/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    const body = encodeURIComponent(
      `نام: ${name}\nتلفن: ${phone}\nموضوع: ${subject}\n\n${message}`,
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setStatus("sent");
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="text-xl font-bold text-navy-900">فرم تماس</h2>
      <p className="mt-2 text-sm text-slate-600">
        پیام خود را ارسال کنید؛ در اسرع وقت با شما تماس می‌گیریم.
      </p>

      {status === "sent" ? (
        <p className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          برنامه ایمیل شما باز شد. در صورت عدم باز شدن، مستقیماً با شماره‌های
          موسسه تماس بگیرید.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy-900">
              نام و نام خانوادگی
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              placeholder="نام شما"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-navy-900">
              شماره تماس
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              dir="ltr"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              placeholder="09121234567"
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-navy-900">
              موضوع
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            >
              <option value="">انتخاب کنید</option>
              <option value="مشاوره حقوقی">مشاوره حقوقی</option>
              <option value="وکالت">وکالت</option>
              <option value="خانواده">حقوق خانواده</option>
              <option value="ملکی">حقوق ملکی</option>
              <option value="کیفری">حقوق کیفری</option>
              <option value="سایر">سایر</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-navy-900">
              پیام
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              placeholder="شرح مختصر پرونده یا سوال حقوقی..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gold-500 py-4 font-semibold text-navy-950 transition hover:bg-gold-400"
          >
            ارسال پیام
          </button>
        </form>
      )}
    </div>
  );
}
