import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { LandingServiceOutlineItem } from "@/data/pillar-landings";
import { servicePath } from "@/lib/service-paths";
import type { Service } from "@/types";

function CardImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-56 shrink-0 overflow-hidden bg-navy-950 sm:h-72">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : null}
    </div>
  );
}

function ServiceLinkCard({ service }: { service: Service }) {
  return (
    <Link
      href={servicePath(service)}
      className="card-shine group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <CardImage src={service.image} alt={service.title} />
      <div className="flex min-h-44 flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
          {service.excerpt}
        </p>
        <span className="mt-4 text-sm font-semibold text-gold-600">
          مشاهده خدمت ←
        </span>
      </div>
    </Link>
  );
}

function ServiceCopyCard({
  title,
  excerpt,
}: {
  title: string;
  excerpt: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardImage alt={title} />
      <div className="flex min-h-44 flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-navy-900">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
          {excerpt}
        </p>
      </div>
    </article>
  );
}

export function ServiceOutlineGrid({
  items,
}: {
  items: LandingServiceOutlineItem[];
}) {
  const servicesOnly = items.every((item) => item.type === "service");
  if (servicesOnly) {
    return (
      <ServiceSubpillarCards
        services={items.flatMap((item) =>
          item.type === "service" ? [item.service] : [],
        )}
      />
    );
  }

  return (
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
      {items.map((item) => (
        <StaggerItem
          key={item.type === "service" ? item.service.id : item.key}
          className="h-full"
          variant="up"
        >
          {item.type === "service" ? (
            <ServiceLinkCard service={item.service} />
          ) : (
            <ServiceCopyCard title={item.title} excerpt={item.excerpt} />
          )}
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function ServiceSubpillarCards({
  services,
  heading,
  description,
}: {
  services: Service[];
  heading?: string;
  description?: string;
}) {
  if (!services.length) return null;

  return (
    <div className={heading ? "py-4" : undefined}>
      {heading ? (
        <h2 className="text-2xl font-bold text-navy-900">{heading}</h2>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}
      <Stagger
        className={`${heading || description ? "mt-8" : ""} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}
        stagger={0.08}
      >
        {services.map((service) => (
          <StaggerItem key={service.id} className="h-full" variant="up">
            <ServiceLinkCard service={service} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
