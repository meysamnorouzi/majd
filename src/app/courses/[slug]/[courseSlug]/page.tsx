import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CoursePurchaseCard } from "@/components/courses/CoursePurchaseCard";
import { formatIcon } from "@/components/courses/FormatIcons";
import { getAccent } from "@/components/courses/accentStyles";
import { getAllCoursePaths, getCourseItem } from "@/data/courses";

export async function generateStaticParams() {
  return getAllCoursePaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string }>;
}): Promise<Metadata> {
  const { slug, courseSlug } = await params;
  const data = getCourseItem(slug, courseSlug);
  if (!data) return { title: "دوره یافت نشد" };
  return {
    title: data.course.title,
    description: data.course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string }>;
}) {
  const { slug, courseSlug } = await params;
  const data = getCourseItem(slug, courseSlug);
  if (!data) notFound();

  const { format, course } = data;
  const Icon = formatIcon(format.slug);
  const accent = getAccent(format);
  const heroImage = course.image ?? format.image;

  return (
    <>
      <PageHero
        title={course.title}
        description={`${format.badge} · ${course.duration}`}
        breadcrumb={[
          { label: "دوره‌های آموزشی", href: "/courses/" },
          { label: format.badge, href: `/courses/${format.slug}/` },
          { label: course.title },
        ]}
      />

      <section className="py-16">
        <Container>
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <div className="relative aspect-[21/9] min-h-[200px]">
              <Image
                src={heroImage}
                alt={course.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 to-navy-900/50" />
              <div className="absolute inset-0 flex items-center p-8 md:p-12">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.icon}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${accent.badge}`}
                  >
                    {format.badge} · سطح {course.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-lg leading-relaxed text-slate-600">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {course.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-md bg-navy-900/5 px-3 py-1 text-sm text-slate-600"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <h2 className="mt-10 text-xl font-bold text-navy-900">
                سرفصل دوره
              </h2>
              <ol className="mt-4 space-y-3">
                {course.syllabus.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-slate-100 bg-cream/50 px-4 py-3 text-sm text-slate-700"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent.icon}`}
                    >
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>

              <div className="mt-10 rounded-2xl bg-cream p-6">
                <h2 className="font-bold text-navy-900">درباره فرمت {format.badge}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {format.description}
                </p>
              </div>

              <Link
                href={`/courses/${format.slug}/`}
                className="mt-8 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                ← بازگشت به فهرست دوره‌های {format.badge}
              </Link>
            </div>

            <div>
              <CoursePurchaseCard format={format} course={course} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
