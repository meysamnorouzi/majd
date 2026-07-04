import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/** Full-width cinematic banner featuring the institute director */
export function FounderBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] md:min-h-[480px]">
        <Image
          src={assets.founderPortrait}
          alt="مسعود جوکار درزی در دفتر وکالت"
          fill
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-950/95 via-navy-950/75 to-navy-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />

        <Container className="relative flex min-h-[420px] items-center py-16 md:min-h-[480px]">
          <div className="max-w-xl">
            <span className="text-sm font-semibold tracking-wide text-gold-400">
              مدیر موسسه
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              مسعود جوکار درزی
            </h2>
            <p className="mt-2 text-lg text-gold-400/90">وکیل الرعایا</p>
            <p className="mt-5 leading-relaxed text-white/80">
              وکیل پایه یک دادگستری با بیش از دو دهه تجربه در پرونده‌های حقوقی و
              کیفری. همراهی شما از اولین جلسه مشاوره تا نتیجه نهایی پرونده.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#consultation">رزرو وقت مشاوره</Button>
              <Link
                href="/team/masoud-jokar-darzi/"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                پروفایل وکیل
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
