import type { Metadata } from "next";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getPillar } from "@/data/pillars";
import { hubPath, servicePath } from "@/lib/service-paths";
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/wordpress";

/**
 * SPA shell for service detail URLs not pre-rendered at build time.
 * Apache / Cloudflare rewrite:
 *   `/{family-lawyer|property-lawyer|criminal-defense-lawyer|legal-consultation|administrative-lawyer}/<slug>/`
 *     → `/services/detail/index.html`
 * when no static folder exists — same pattern as `/blogs/<slug>/`.
 * Leftover `/services/<slug>/` bookmarks also land here and client-canonicalize.
 * This path is not a public URL (noindex).
 */
export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return [
    { slug: [] as string[] },
    ...slugs.map((slug) => ({ slug: [slug] })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts?.[0];

  if (!slug) {
    return createPageMetadata({
      title: "خدمت",
      description: "خدمات حقوقی موسسه حقوقی مجد وکیل الرعایا",
      path: "/services/detail/",
      noIndex: true,
    });
  }

  const service = await getServiceBySlug(slug);
  if (!service) {
    return createPageMetadata({
      title: "خدمت یافت نشد",
      description: "خدمت مورد نظر یافت نشد",
      path: "/services/detail/",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: service.title,
    description: service.excerpt,
    path: servicePath(service),
    image: service.image,
    keywords: [service.title, "خدمات حقوقی", "موسسه حقوقی مجد"],
  });
}

export default async function ServiceDetailShellPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug: parts } = await params;
  const slug = parts?.[0];
  const service = slug ? await getServiceBySlug(slug) : null;
  const path = service ? servicePath(service) : undefined;
  const pillar = service?.categoryPrefix
    ? getPillar(service.categoryPrefix)
    : undefined;

  return (
    <>
      {service && path ? (
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
      ) : null}
      <ServiceDetailContent />
    </>
  );
}
