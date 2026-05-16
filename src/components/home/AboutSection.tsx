import Image from "next/image";
import Link from "next/link";
import { aboutContent, assets, practiceAreas } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function AboutSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={assets.founderPortrait}
                alt="مسعود جوکار درزی — مدیر موسسه حقوقی مجد"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-navy-900 p-6 text-white shadow-xl lg:-left-8">
              <p className="text-3xl font-bold text-gold-400">۱۵+</p>
              <p className="text-sm text-white/80">سال تجربه حقوقی</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gold-600">درباره موسسه</span>
            <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
              {aboutContent.title}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {aboutContent.paragraphs[0]}
            </p>
            <ul className="mt-6 space-y-2">
              {practiceAreas.map((area) => (
                <li key={area} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/about/">بیشتر بدانید</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
