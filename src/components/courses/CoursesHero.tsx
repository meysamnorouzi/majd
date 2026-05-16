import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/site";
import { coursesIntro, courseFormats } from "@/data/courses";
import { Container } from "@/components/ui/Container";
import { formatIcon } from "./FormatIcons";
import { getAccent } from "./accentStyles";

export function CoursesHero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1434030214721-735608b8d94b?w=1920&q=80"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-950 via-navy-950/90 to-navy-900/70" />
      </div>

      <Container className="relative py-20 lg:py-28">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-gold-400">
            خانه
          </Link>
          <span>/</span>
          <span className="text-gold-400">دوره‌های آموزشی</span>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-sm text-gold-400">
              آموزش تخصصی حقوق
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {coursesIntro.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              {coursesIntro.description}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {coursesIntro.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/85">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy-950">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              {courseFormats.map((format) => {
                const Icon = formatIcon(format.slug);
                const accent = getAccent(format);
                return (
                  <a
                    key={format.slug}
                    href={`#${format.slug}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:scale-105 ${accent.badge}`}
                  >
                    <Icon className="h-4 w-4" />
                    {format.badge}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-gold-500/30 to-transparent blur-md" />
            <div className="relative overflow-hidden rounded-2xl border border-gold-500/25 shadow-2xl">
              <div className="relative aspect-[5/4]">
                <Image
                  src={assets.founderPortrait}
                  alt="آموزش حقوقی — موسسه مجد"
                  fill
                  className="object-cover object-top"
                  sizes="560px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/20" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 bg-navy-950/85 p-5 backdrop-blur-sm">
                <p className="font-bold text-gold-400">اساتید وکیل پایه یک</p>
                <p className="text-sm text-white/70">مسعود جوکار درزی و تیم متخصص</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
