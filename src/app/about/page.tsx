import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTASection } from "@/components/home/CTASection";
import { FounderBanner } from "@/components/home/FounderBanner";
import { aboutContent, assets, practiceAreas, stats } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره موسسه حقوقی مجد وکیل الرعایا — سابقه، ارزش‌ها و حوزه‌های تخصصی",
};

export default function AboutPage() {
  return (
    <>
      <FounderBanner />

      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-xl ring-1 ring-gold-500/20">
              <Image
                src={assets.logo}
                alt="لوگوی موسسه حقوقی مجد وکیل الرعایا"
                fill
                className="object-contain bg-navy-950 p-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              {aboutContent.paragraphs.map((p, i) => (
                <p key={i} className="mb-4 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gold-400">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionTitle
            title="ارزش‌های ما"
            description="اصولی که بر اساس آن با موکلین خود رفتار می‌کنیم"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.values.map((value) => (
              <div
                key={value.title}
                className="card-shine rounded-2xl bg-white p-6 shadow-md"
              >
                <h3 className="font-bold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{value.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container>
          <SectionTitle
            title="حوزه‌های تخصصی"
            description="دامنه فعالیت حقوقی موسسه مجد"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <li
                key={area}
                className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                  ✓
                </span>
                <span className="font-medium text-navy-900">{area}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
