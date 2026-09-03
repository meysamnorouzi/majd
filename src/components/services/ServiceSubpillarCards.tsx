import Image from "next/image";
import Link from "next/link";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { servicePath } from "@/lib/service-paths";
import type { Service } from "@/types";

export function ServiceSubpillarCards({
  services,
  heading,
  description,
}: {
  services: Service[];
  heading: string;
  description?: string;
}) {
  if (!services.length) return null;

  return (
    <section className="py-4">
      <h2 className="text-2xl font-bold text-navy-900">{heading}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {services.map((service) => (
          <StaggerItem key={service.id} variant="up">
            <Link
              href={servicePath(service)}
              className="card-shine group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden bg-navy-950">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                  <ServiceIcon name={service.icon} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.excerpt}
                </p>
                <span className="mt-4 text-sm font-semibold text-gold-600">
                  مشاهده خدمت ←
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
