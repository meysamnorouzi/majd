import Image from "next/image";
import Link from "next/link";
import type { CourseFormat } from "@/types";
import { hasSpotPlayerLicense, usesSkyroom } from "@/lib/courses/format-utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/courses/CourseCard";
import { formatIcon } from "./FormatIcons";
import { getAccent } from "./accentStyles";

export function CourseFormatSection({
  format,
  reversed = false,
}: {
  format: CourseFormat;
  reversed?: boolean;
}) {
  const Icon = formatIcon(format.slug);
  const accent = getAccent(format);
  const isDark = hasSpotPlayerLicense(format.slug);
  return (
    <section
      id={format.slug}
      className={`scroll-mt-24 py-20 ${isDark ? "bg-navy-950 text-white" : "bg-white"}`}
    >
      <Container>
        <div className="relative mb-14 overflow-hidden rounded-2xl">
          <div className="relative min-h-[220px] md:min-h-[280px]">
            <Image
              src={format.image}
              alt={format.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-l from-navy-950/95 via-navy-950/80 to-navy-950/50"
                  : "bg-gradient-to-l from-navy-950/90 via-navy-900/70 to-transparent"
              }`}
            />
            <div className="absolute inset-0 flex items-center p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.icon}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${accent.badge}`}
                  >
                    {format.badge}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-white md:text-4xl">
                  {format.title}
                </h2>
                <p className="mt-2 text-lg text-gold-400/90">{format.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-12 lg:grid-cols-2 lg:items-start ${
            reversed ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div
            className={`space-y-6 ${reversed ? "lg:col-start-2" : ""} ${
              isDark ? "text-white/85" : "text-slate-600"
            }`}
          >
            <p className="leading-relaxed">{format.longDescription}</p>
            <div>
              <h3
                className={`mb-3 font-bold ${isDark ? "text-gold-400" : "text-navy-900"}`}
              >
                ویژگی‌ها
              </h3>
              <ul className="space-y-2">
                {format.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3
                className={`mb-3 font-bold ${isDark ? "text-gold-400" : "text-navy-900"}`}
              >
                مزایا
              </h3>
              <ul className="space-y-2">
                {format.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className="text-gold-500">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="#consultation">{format.ctaLabel}</Button>
              <Link
                href={`/courses/${format.slug}/`}
                className={`inline-flex items-center rounded-lg border-2 px-6 py-3 text-sm font-semibold transition ${
                  isDark
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"
                }`}
              >
                جزئیات بیشتر
              </Link>
            </div>
          </div>

          <div
            className={`space-y-4 ${reversed ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <h3
              className={`text-lg font-bold ${isDark ? "text-white" : "text-navy-900"}`}
            >
              دوره‌های پیشنهادی
            </h3>
            {format.courses.map((course) => (
              <CourseCard
                key={course.id}
                format={format}
                course={course}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {hasSpotPlayerLicense(format.slug) && (
          <div className="mt-12 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 md:flex md:items-center md:gap-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">راهنمای اسپات پلیر</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                پس از خرید، لینک دانلود نرم‌افزار Spot Player و کد لایسنس از طریق پیامک
                یا ایمیل برای شما ارسال می‌شود. پشتیبانی فنی موسسه در فعال‌سازی همراه
                شماست. نرم‌افزار روی ویندوز، اندروید و iOS قابل نصب است.
              </p>
            </div>
          </div>
        )}

        {usesSkyroom(format.slug) && !hasSpotPlayerLicense(format.slug) && (
          <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:flex md:items-center md:gap-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-navy-900">نحوه شرکت در کلاس آنلاین</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                یک روز قبل از برگزاری، لینک ورود به اتاق اسکای‌روم و راهنمای فنی ارسال
                می‌شود. پیشنهاد می‌شود ۱۰ دقیقه زودتر وارد شوید. این فرمت شامل لایسنس
                اسپات‌پلیر یا دسترسی آفلاین نمی‌شود.
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
