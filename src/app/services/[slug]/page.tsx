import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getServiceBySlug, getAllServiceSlugs, getServices } from "@/lib/wordpress";
import { getTopLevelServices } from "@/lib/wordpress/services";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return createPageMetadata({
    title: service.title,
    description: service.excerpt,
    path: `/services/${service.slug}/`,
    image: service.image,
    keywords: [service.title, "خدمات حقوقی", "موسسه حقوقی مجد"],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const allServices = await getServices();
  const relatedServices = getTopLevelServices(allServices);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            { name: "خدمات", path: "/services/" },
            ...(service.parentSlug && service.parentTitle
              ? [
                  {
                    name: service.parentTitle,
                    path: `/services/${service.parentSlug}/`,
                  },
                ]
              : []),
            { name: service.title, path: `/services/${service.slug}/` },
          ]),
          ...(service.faqs?.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />
      <ServiceDetailView service={service} relatedServices={relatedServices} />
    </>
  );
}
