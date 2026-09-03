import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientRedirect } from "@/components/services/ClientRedirect";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";
import {
  findRestoredPage,
  findRootLegacyRedirect,
  restoredPages,
  rootLegacyRedirects,
} from "@/data/legacy-redirects";
import { getServiceBySlug } from "@/lib/wordpress";
import { getPillar } from "@/data/pillars";
import { hubPath } from "@/lib/service-paths";

/**
 * Root-level legacy URLs that predate the headless migration.
 * Restored pages (e.g. `/وکیل-حقوقی/`) render content. Retired paths
 * (e.g. `/وکیل-خلع-ید/`) are generated here so `next dev` and static
 * fallbacks can send visitors to the new categorized URL — host 301s
 * still do that in production.
 */
export const dynamicParams = false;

function slugOf(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function generateStaticParams() {
  const restored = restoredPages.map((page) => ({
    legacySlug: slugOf(page.path),
  }));
  const redirected = rootLegacyRedirects().map((entry) => ({
    legacySlug: entry.slug,
  }));
  return [...restored, ...redirected];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legacySlug: string }>;
}): Promise<Metadata> {
  const { legacySlug } = await params;

  const redirectTo = findRootLegacyRedirect(legacySlug);
  if (redirectTo) {
    return createPageMetadata({
      title: "انتقال",
      description: "این صفحه به آدرس جدید منتقل شده است.",
      path: `/${legacySlug}/`,
      noIndex: true,
    });
  }

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

  const redirectTo = findRootLegacyRedirect(legacySlug);
  if (redirectTo) return <ClientRedirect href={redirectTo} />;

  const page = findRestoredPage(legacySlug);
  if (!page) notFound();

  const service = await getServiceBySlug(page.wpSlug);

  // WordPress unreachable at build time, or the post is not published yet —
  // fall back to the client shell so the page fills in without a rebuild.
  if (!service) return <ServiceDetailContent slug={page.wpSlug} />;

  const pillar = service.categoryPrefix
    ? getPillar(service.categoryPrefix)
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service, page.path),
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
            { name: service.title, path: page.path },
          ]),
          ...(service.faqs?.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />
      <ServiceDetailView service={service} />
    </>
  );
}
