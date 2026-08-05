"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  fetchCategoriesClient,
  type BlogCategory,
} from "@/lib/wordpress/client";
import { siteConfig, services, stats, teamMembers } from "@/data/site";
import type { LawyerOption } from "@/components/contact/ContactForm";

function flattenForNav(tree: BlogCategory[]): BlogCategory[] {
  const out: BlogCategory[] = [];
  for (const node of tree) {
    out.push(node);
    for (const child of node.children) out.push(child);
  }
  return out;
}

function categoryLabel(name: string) {
  return name.startsWith("مقالات") ? name : `مقالات ${name}`;
}

function BlogSidebarInner({
  lawyerOptions,
  activeCategorySlug,
}: {
  lawyerOptions?: LawyerOption[];
  activeCategorySlug?: string | null;
}) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const activeSlug = activeCategorySlug ?? urlCategory;

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const founder = teamMembers[0];

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesClient().then((tree) => {
      if (!cancelled) setCategories(flattenForNav(tree));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="space-y-6 lg:sticky lg:top-8">
      {/* Categories */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-cream/60 px-5 py-4">
          <h3 className="font-bold text-navy-900">دسته‌بندی مقالات</h3>
          <p className="mt-1 text-xs text-slate-500">
            موضوع موردنظر خود را انتخاب کنید
          </p>
        </div>
        <ul className="divide-y divide-slate-50 p-2">
          <li>
            <Link
              href="/blog/"
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                !activeSlug
                  ? "bg-navy-900 font-semibold text-gold-400"
                  : "text-slate-700 hover:bg-cream hover:text-navy-900"
              }`}
            >
              <span>همه مقالات</span>
            </Link>
          </li>
          {categories.map((cat) => {
            const active = activeSlug === cat.slug;
            return (
              <li key={cat.id}>
                <Link
                  href={`/blog/?category=${encodeURIComponent(cat.slug)}`}
                  className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-navy-900 font-semibold text-gold-400"
                      : "text-slate-700 hover:bg-cream hover:text-navy-900"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {categoryLabel(cat.name)}
                  </span>
                  {cat.count > 0 && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/10 text-gold-400"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cat.count.toLocaleString("fa-IR")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          {categories.length === 0 && (
            <li className="px-3 py-4 text-center text-xs text-slate-400">
              در حال بارگذاری دسته‌ها…
            </li>
          )}
        </ul>
      </div>

      {/* Consultation CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white shadow-xl">
        <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
        <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl" />
        <h3 className="relative text-lg font-bold text-gold-400">
          مشاوره حقوقی رایگان
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-white/75">
          سوال حقوقی دارید؟ وکلای متخصص موسسه مجد آماده پاسخگویی هستند.
        </p>
        <a
          href={`tel:${siteConfig.phonesTel[0]}`}
          className="relative mt-4 inline-block text-lg font-bold text-gold-400 transition hover:text-gold-300"
          dir="ltr"
        >
          {siteConfig.phones[0]}
        </a>
        <Link
          href="/contact/"
          className="relative mt-4 block rounded-lg bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          درخواست مشاوره
        </Link>
      </div>

      {/* Compact contact form */}
      <div className="overflow-hidden rounded-2xl border border-gold-400/20 bg-white shadow-lg">
        <ContactForm
          variant="compact"
          title="ارسال پیام"
          description="فرم را تکمیل کنید؛ در اسرع وقت تماس می‌گیریم."
          defaultSubject="مشاوره حقوقی"
          lawyerOptions={lawyerOptions}
          showLawyerPicker={!!lawyerOptions?.length}
        />
      </div>

      {/* Trust / stats */}
      <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-white">
        <h3 className="font-bold text-gold-400">چرا موسسه مجد؟</h3>
        <ul className="mt-4 space-y-3">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-3">
              <span className="text-xl font-bold text-gold-400">
                {stat.value}
              </span>
              <span className="text-sm text-white/80">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-navy-900">خدمات حقوقی</h3>
        <ul className="mt-4 space-y-2">
          {services.slice(0, 5).map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}/`}
                className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-gold-600"
              >
                <span className="text-gold-500">←</span>
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/services/"
          className="mt-4 inline-block text-sm font-semibold text-navy-900 hover:text-gold-600"
        >
          همه خدمات →
        </Link>
      </div>

      {/* Founder / team */}
      {founder && (
        <div className="rounded-2xl border border-slate-100 bg-cream/80 p-6">
          <p className="text-xs font-semibold text-gold-600">مدیر موسسه</p>
          <h3 className="mt-1 font-bold text-navy-900">{founder.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{founder.role}</p>
          <Link
            href={`/team/${founder.slug}/`}
            className="mt-4 inline-flex text-sm font-semibold text-navy-900 transition hover:text-gold-600"
          >
            مشاهده پروفایل ←
          </Link>
        </div>
      )}
    </aside>
  );
}

export function BlogSidebar({
  lawyerOptions,
  activeCategorySlug,
}: {
  lawyerOptions?: LawyerOption[];
  /** Optional override; falls back to ?category= from URL */
  activeCategorySlug?: string | null;
}) {
  return (
    <Suspense
      fallback={
        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        </aside>
      }
    >
      <BlogSidebarInner
        lawyerOptions={lawyerOptions}
        activeCategorySlug={activeCategorySlug}
      />
    </Suspense>
  );
}
