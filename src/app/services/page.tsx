import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدمات حقوقی",
  description:
    "خدمات تخصصی موسسه حقوقی مجد: وکالت حقوقی، کیفری، خانواده، ملکی و مشاوره",
};

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      <PageHero
        title="خدمات حقوقی"
        description="طیف کامل خدمات حقوقی و مشاوره تخصصی موسسه مجد وکیل الرعایا"
        breadcrumb={[{ label: "خدمات" }]}
      />
      <section className="py-20">
        <Container>
          <Stagger className="grid gap-8 md:grid-cols-2" stagger={0.1}>
            {services.map((service) => (
              <StaggerItem key={service.id} variant="up">
                <Link
                  href={`/services/${service.slug}/`}
                  className="card-shine group flex h-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
                >
                  <div className="relative hidden w-40 shrink-0 sm:block">
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <h2 className="text-xl font-bold text-navy-900 group-hover:text-gold-600">
                      {service.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-slate-600">
                      {service.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-gold-600">
                      جزئیات بیشتر ←
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
