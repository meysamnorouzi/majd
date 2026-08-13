"use client";

import Image from "next/image";
import Link from "next/link";
import { assets, portraitObjectPosition } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/reveal";

/** Full-width cinematic banner featuring the institute director */
export function FounderBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[440px] md:min-h-[520px]">
        <Image
          src={assets.founderBoardroom}
          alt="مسعود جوکار درزی — گفتگو با رسانه‌ها"
          fill
          priority
          className="ken-burns object-cover portrait-filter"
          style={{
            objectPosition:
              portraitObjectPosition(assets.founderBoardroom) ?? "center 20%",
          }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-950/95 via-navy-950/72 to-navy-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(212,175,55,0.14),transparent_50%)]" />

        <Container className="relative flex min-h-[440px] items-center py-16 md:min-h-[520px]">
          <div className="max-w-xl">
            <FadeIn delay={0.05}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-gold-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                مدیر موسسه
              </span>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                مسعود جوکار درزی
              </h2>
              <p className="mt-2 text-lg text-gold-400/90">وکیل الرعایا</p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-5 leading-relaxed text-white/80">
                و مدیر موسسه حقوقی مجد  با بیش از دو دهه تجربه در پرونده‌های حقوقی و
                کیفری. همراهی شما از اولین جلسه مشاوره تا نتیجه نهایی پرونده.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="#consultation">رزرو وقت مشاوره</Button>
                <Link
                  href="/team/masoud-jokar-darzi/"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition hover:border-gold-400/50 hover:bg-white/10"
                >
                  پروفایل وکیل
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>
    </section>
  );
}
