import Link from "next/link";
import { courseFormats } from "@/data/courses";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { formatIcon } from "@/components/courses/FormatIcons";
import { getAccent } from "@/components/courses/accentStyles";

export function CoursesPreview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="آموزش حقوقی"
          title="دوره‌های آموزشی موسسه مجد"
          description="وبینار، دوره ترکیبی، نشست حضوری — با اساتید وکیل پایه یک"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {courseFormats.map((format) => {
            const Icon = formatIcon(format.slug);
            const accent = getAccent(format);
            return (
              <Link
                key={format.slug}
                href={`/courses/${format.slug}/`}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-cream/30 p-5 transition hover:border-gold-500/30 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${accent.icon}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-navy-900">{format.badge}</p>
                  <p className="text-xs text-slate-500">{format.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/courses/"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-8 py-3 font-semibold text-white transition hover:bg-navy-800"
          >
            همه دوره‌های آموزشی
            <span aria-hidden>←</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
