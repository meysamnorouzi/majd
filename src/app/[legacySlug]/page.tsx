import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import { findRestoredPage, restoredPages } from "@/data/legacy-redirects";
import { getServiceBySlug, getServices } from "@/lib/wordpress";
import { getTopLevelServices } from "@/lib/wordpress/services";

/**
 * Root-level legacy URLs that predate the headless migration and still rank
 * (e.g. `/وکیل-خلع-ید/`). They were returning 404; each one is listed in
 * `src/data/legacy-redirects.json` with the WordPress slug that holds its body,
 * and is served here at its original path with a self-referencing canonical.
 *
 * Only the listed paths are generated — every other root path stays a 404.
 */
export const dynamicParams = false;

function slugOf(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function generateStaticParams() {
  return restoredPages.map((page) => ({ legacySlug: slugOf(page.path) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legacySlug: string }>;
}): Promise<Metadata> {
  const { legacySlug } = await params;
  const page = findRestoredPage(legacySlug);
  if (!page) return { title: "صفحه یافت نشد" };

  const service = await getServiceBySlug(page.wpSlug);

  return createPageMetadata({
    title: service?.title || page.title,
    description: service?.excerpt || page.description,
    path: page.path,
    image: service?.image,
    keywords: [page.title, "خدمات حقوقی", "موسسه حقوقی مجد"],
  });
}

export default async function RestoredLegacyPage({
  params,
}: {
  params: Promise<{ legacySlug: string }>;
}) {
  const { legacySlug } = await params;
  const page = findRestoredPage(legacySlug);
  if (!page) notFound();

  const service = await getServiceBySlug(page.wpSlug);

  // WordPress unreachable at build time, or the post is not published yet —
  // fall back to the client shell so the page fills in without a rebuild.
  if (!service) return <ServiceDetailContent slug={page.wpSlug} />;

  const allServices = await getServices();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service, page.path),
          breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            { name: "خدمات", path: "/services/" },
            { name: service.title, path: page.path },
          ]),
          ...(service.faqs?.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />
      <ServiceDetailView
        service={service}
        relatedServices={getTopLevelServices(allServices)}
      />
    </>
  );
}
