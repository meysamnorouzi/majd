import type { Metadata } from "next";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/wordpress";

/**
 * SPA shell for service detail URLs not pre-rendered at build time.
 * Apache / Cloudflare rewrite `/services/<slug>/` → `/services/detail/index.html`
 * when no static folder exists — same pattern as `/blog/post/*`.
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
      path: `/services/${slug}/`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: service.title,
    description: service.excerpt,
    path: `/services/${service.slug}/`,
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

  return (
    <>
      {service ? (
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
      ) : null}
      <ServiceDetailContent />
    </>
  );
}
