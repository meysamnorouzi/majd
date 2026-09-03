import Image from "next/image";
import { assets, portraitObjectPosition, siteConfig, stats } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const portraitSrc = assets.founderPortrait;
const portraitPosition =
  portraitObjectPosition(portraitSrc) ?? "center 18%";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -left-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-navy-700/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.08),_transparent_50%)]" />
      </div>

      <Container className="relative py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="hero-enter mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-sm text-gold-400 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              تندیس برترین موسسه حقوقی کشور در سال ۱۴۰۱
            </span>
            <h1 className="hero-enter hero-enter-d1 mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {siteConfig.name}
            </h1>
            <p className="hero-enter hero-enter-d1 mt-2 text-lg font-medium text-gold-400/90">
              مسعود جوکار درزی
            </p>
            <p className="hero-enter hero-enter-d2 mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {siteConfig.tagline}. وکلای مجرب ما در صدها پرونده حقوقی و کیفری،
              همراه شما از مشاوره تا اجرای حکم.
            </p>
            <div className="hero-enter hero-enter-d3 mt-8 flex flex-wrap gap-4">
              <Button href="#consultation" size="lg">
                درخواست مشاوره
              </Button>
              <Button href="#services" variant="secondary" size="lg">
                خدمات حقوقی
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-12">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm sm:p-4"
                >
                  <p className="text-xl font-bold text-gold-400 sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/65 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 hidden rounded-3xl bg-gradient-to-br from-gold-500/20 via-transparent to-navy-700/30 blur-sm lg:block" />
            <div className="group relative w-full overflow-hidden rounded-2xl border border-gold-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="relative aspect-[4/3] w-full lg:aspect-[4/5]">
                <Image
                  src={portraitSrc}
                  alt="مسعود جوکار درزی — مدیر عامل موسسه حقوقی مجد"
                  fill
                  priority
                  fetchPriority="high"
                  className="portrait-filter object-cover"
                  style={{ objectPosition: portraitPosition }}
                  sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 50vw, 560px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent lg:via-transparent lg:to-navy-950/30" />
                <div className="absolute inset-0 hidden bg-gradient-to-l from-navy-950/40 via-transparent to-transparent lg:block" />
              </div>
              <div className="absolute right-0 bottom-0 left-0 border-t border-gold-500/20 bg-navy-950/80 p-5 backdrop-blur-md lg:p-6">
                <p className="font-bold text-white lg:text-xl">مسعود جوکار درزی</p>
                <p className="mt-1 text-sm text-gold-400">
                  مدیر عامل موسسه حقوقی مجد
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3 hidden h-20 w-20 items-center justify-center rounded-full bg-navy-900 p-1 shadow-xl ring-2 ring-gold-500/50 lg:flex">
              <Image
                src={assets.logo}
                alt=""
                width={72}
                height={72}
                className="rounded-full object-cover"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
