import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getPillar } from "@/data/pillars";
import { hubPath, servicePath } from "@/lib/service-paths";
import { getServiceBySlug } from "@/lib/wordpress";
import type { Metadata } from "next";
import type { Service } from "@/types";

export async function generateServicePageMetadata(
  slug: string,
  pathOverride?: string,
): Promise<Metadata> {
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return createPageMetadata({
    title: service.title,
    description: service.excerpt,
    path: pathOverride ?? servicePath(service),
    image: service.image,
    keywords: [service.title, "خدمات حقوقی", "موسسه حقوقی مجد"],
  });
}

export async function ServicePage({
  slug,
  path: pathOverride,
  service: serviceProp,
}: {
  slug: string;
  path?: string;
  service?: Service;
}) {
  const service = serviceProp ?? (await getServiceBySlug(slug));
  if (!service) notFound();

  const path = pathOverride ?? servicePath(service);
  const pillar = service.categoryPrefix
    ? getPillar(service.categoryPrefix)
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service, path),
          breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            ...(pillar && service.categoryPrefix
              ? [
                  {
                    name: pillar.title,
                    path: hubPath(service.categoryPrefix),
                  },
                ]
              : []),
            { name: service.title, path },
          ]),
          ...(service.faqs?.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />
      <ServiceDetailView service={service} />
    </>
  );
}
