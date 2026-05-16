import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CoursesCTA } from "@/components/courses/CoursesCTA";
import { CourseCard } from "@/components/courses/CourseCard";
import { formatIcon } from "@/components/courses/FormatIcons";
import { getAccent } from "@/components/courses/accentStyles";
import { courseFormats, getCourseFormat } from "@/data/courses";

export async function generateStaticParams() {
  return courseFormats.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const format = getCourseFormat(slug);
  if (!format) return { title: "دوره یافت نشد" };
  return {
    title: format.title,
    description: format.description,
  };
}

export default async function CourseFormatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const format = getCourseFormat(slug);
  if (!format) notFound();

  const Icon = formatIcon(format.slug);
  const accent = getAccent(format);

  return (
    <>
      <PageHero
        title={format.title}
        description={format.subtitle}
        breadcrumb={[
          { label: "دوره‌های آموزشی", href: "/courses/" },
          { label: format.badge },
        ]}
      />

      <section className="py-16">
        <Container>
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <div className="relative aspect-[21/9] min-h-[200px]">
              <Image
                src={format.image}
                alt={format.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 to-navy-900/50" />
              <div className="absolute inset-0 flex items-center p-8 md:p-12">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${accent.icon}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${accent.badge}`}
                    >
                      {format.badge}
                    </span>
                    <p className="mt-2 max-w-xl text-white/80">
                      {format.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mb-10 max-w-3xl leading-relaxed text-slate-600">
            {format.longDescription}
          </p>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-cream p-6">
              <h2 className="font-bold text-navy-900">ویژگی‌های این فرمت</h2>
              <ul className="mt-4 space-y-2">
                {format.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-navy-900">مزایا</h2>
              <ul className="mt-4 space-y-2">
                {format.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-gold-500">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mb-6 text-xl font-bold text-navy-900">فهرست دوره‌ها</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {format.courses.map((course) => (
              <CourseCard key={course.id} format={format} course={course} />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-100 pt-8">
            <Link
              href="/courses/"
              className="text-sm font-semibold text-gold-600 hover:text-gold-700"
            >
              ← بازگشت به همه دوره‌ها
            </Link>
          </div>
        </Container>
      </section>

      <CoursesCTA />
    </>
  );
}
