import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { PILLARS } from "@/data/pillars";
import { hubPath } from "@/lib/service-paths";

export function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="خدمات تخصصی"
          title="پنج حوزه اصلی وکالت موسسه حقوقی مجد"
          description="خانواده، ملکی، کیفری، مشاوره حقوقی و وکیل اداری — هر پیلار صفحه اختصاصی و خدمات زیرمجموعه دارد."
          wide
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.prefix}
              href={hubPath(pillar.prefix)}
              className="card-shine group block h-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                  <ServiceIcon name={pillar.icon} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {pillar.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
                  ورود به صفحه
                  <span aria-hidden>←</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
