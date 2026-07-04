import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import type { Service } from "@/types";

export function ServiceRelatedServices({
  currentSlug,
  services,
}: {
  currentSlug: string;
  services: Service[];
}) {
  const related = services.filter((s) => s.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="bg-cream py-16">
      <Container>
        <h2 className="text-xl font-bold text-navy-900">سایر خدمات حقوقی</h2>
        <p className="mt-2 text-sm text-slate-600">
          خدمات تخصصی دیگر موسسه حقوقی مجد
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}/`}
              className="group flex overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:border-gold-400/40 hover:shadow-md"
            >
              {service.image && (
                <div className="relative hidden w-24 shrink-0 sm:block">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900/5 text-gold-600">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="font-bold text-navy-900 group-hover:text-gold-600">
                  {service.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                  {service.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
