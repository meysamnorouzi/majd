import Link from "next/link";
import { courseFormats } from "@/data/courses";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { formatIcon } from "./FormatIcons";
import { getAccent } from "./accentStyles";

export function FormatOverviewCards() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <SectionTitle
          eyebrow="فرمت‌های آموزشی"
          title="پنج نوع دوره — یک هدف: تسلط حقوقی"
          description="بر اساس زمان، مکان و سبک یادگیری خود، یکی از پنج قالب زیر را انتخاب کنید."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {courseFormats.map((format) => {
            const Icon = formatIcon(format.slug);
            const accent = getAccent(format);
            return (
              <Link
                key={format.slug}
                href={`/courses/${format.slug}/`}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl ring-1 ${accent.ring}`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent.gradient}`}
                />
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${accent.icon}`}
                >
                  <Icon />
                </div>
                <span
                  className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${accent.badge}`}
                >
                  {format.badge}
                </span>
                <h3 className="mt-3 text-xl font-bold text-navy-900 group-hover:text-gold-600">
                  {format.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {format.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {format.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
                  مشاهده دوره‌ها
                  <span aria-hidden>←</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
