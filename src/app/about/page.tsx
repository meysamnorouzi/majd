import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTASection } from "@/components/home/CTASection";
import { FounderBanner } from "@/components/home/FounderBanner";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { aboutContent, assets, portraitObjectPosition, practiceAreas, stats } from "@/data/site";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "درباره ما",
  description:
    "درباره موسسه حقوقی مجد وکیل الرعایا — سابقه، ارزش‌ها و حوزه‌های تخصصی",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <FounderBanner />

      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal variant="left">
              <div className="relative pb-8">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl ring-1 ring-gold-500/20">
                  <Image
                    src={assets.founderArchitecture}
                    alt="مسعود جوکار درزی — مدیر موسسه حقوقی مجد"
                    fill
                    className="portrait-warm object-cover"
                    style={{
                      objectPosition:
                        portraitObjectPosition(assets.founderArchitecture) ??
                        "center 12%",
                    }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-5 -left-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-950 p-2 shadow-xl ring-2 ring-gold-500/40 sm:h-28 sm:w-28">
                  <Image
                    src={assets.logo}
                    alt="لوگوی موسسه حقوقی مجد وکیل الرعایا"
                    width={96}
                    height={96}
                    className="rounded-xl object-cover"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={0.1}>
              {aboutContent.paragraphs.map((p, i) => (
                <p key={i} className="mb-4 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-navy-950 py-4">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {[
            {
              src: assets.founderBanner,
              alt: "مسعود جوکار درزی — سخنرانی",
            },
            {
              src: assets.founderBoardroom,
              alt: "مسعود جوکار درزی — گفتگو با رسانه",
            },
            {
              src: assets.founderAward,
              alt: "مسعود جوکار درزی — تندیس",
            },
            {
              src: assets.founderConversation,
              alt: "مسعود جوکار درزی — همایش",
            },
          ].map((photo) => (
            <div key={photo.src} className="relative aspect-[16/11] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                style={{
                  objectPosition:
                    portraitObjectPosition(photo.src) ?? "center",
                }}
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <Container>
          <Stagger
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            stagger={0.08}
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label} variant="scale">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gold-400">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionTitle
            title="ارزش‌های ما"
            description="اصولی که بر اساس آن با موکلین خود رفتار می‌کنیم"
          />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
            {aboutContent.values.map((value) => (
              <StaggerItem key={value.title} variant="up">
                <div className="card-shine h-full rounded-2xl bg-white p-6 shadow-md">
                  <h3 className="font-bold text-navy-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{value.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container>
          <SectionTitle
            title="حوزه‌های تخصصی"
            description="دامنه فعالیت حقوقی موسسه مجد"
          />
          <Stagger
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            as="ul"
            stagger={0.06}
          >
            {practiceAreas.map((area) => (
              <StaggerItem key={area} as="li" variant="up">
                <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                    ✓
                  </span>
                  <span className="font-medium text-navy-900">{area}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
