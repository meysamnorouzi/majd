"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchServicesClient } from "@/lib/wordpress/client";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Service } from "@/types";

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchServicesClient().then(({ posts }) => {
      if (!cancelled) {
        setServices(posts.slice(0, 6));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!services.length) return null;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="خدمات تخصصی"
          title="حوزه‌های حقوقی موسسه مجد"
          description="از دعاوی کیفری تا خانواده و ملکی — تیم ما در تمامی شعب قضایی تهران در کنار شماست."
        />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {services.map((service) => (
            <StaggerItem key={service.id} variant="up">
              <Link
                href={`/services/${service.slug}/`}
                className="card-shine group block h-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  {service.image && (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                  <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                    <ServiceIcon name={service.icon} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {service.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
                    اطلاعات بیشتر
                    <span aria-hidden>←</span>
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center" delay={0.1}>
          <Link
            href="/services/"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            مشاهده همه خدمات
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
