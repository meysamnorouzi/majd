"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { assets } from "@/data/site";
import { hubPath } from "@/lib/service-paths";
import {
  fetchServiceMenuClient,
  hubCardImage,
  type ServiceHub,
} from "@/lib/wordpress/service-landings";

export function ServicesSection() {
  const [hubs, setHubs] = useState<ServiceHub[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchServiceMenuClient()
      .then((items) => {
        if (!cancelled) setHubs(items);
      })
      .catch(() => {
        if (!cancelled) setHubs([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="services" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="خدمات تخصصی"
          title="حوزه‌های وکالت موسسه حقوقی مجد"
          description="هر لندینگ صفحه اختصاصی دارد و زیرلندینگ‌های همان حوزه را به‌صورت کارت نشان می‌دهد."
          wide
        />
        {hubs === null ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {hubs.map((hub) => {
              const image = hubCardImage(hub) || assets.lawBooks;
              return (
                <Link
                  key={hub.slug}
                  href={hubPath(hub.slug)}
                  className="card-shine group block h-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={image}
                      alt={hub.menuLabel}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                    <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                      <ServiceIcon name={hub.icon} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600">
                      {hub.menuLabel}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {hub.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
                      ورود به صفحه
                      <span aria-hidden>←</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
