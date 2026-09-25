import type { Metadata } from "next";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { generateServicePageMetadata } from "@/components/services/ServicePage";
import { createPageMetadata } from "@/lib/seo";
import {
  generateCategoryStaticParams,
  isRedirectTargetSlug,
  resolveCategoryService,
} from "@/lib/service-category-page";
import type { ServiceCategoryPrefix } from "@/lib/service-paths";

export function categoryStaticParams(prefix: ServiceCategoryPrefix) {
  return generateCategoryStaticParams(prefix);
}

export async function categoryServiceMetadata(
  prefix: ServiceCategoryPrefix,
  slug: string,
): Promise<Metadata> {
  const path = `/${prefix}/${slug}/`;
  const service = await resolveCategoryService(prefix, slug);
  if (service) {
    return generateServicePageMetadata(service.slug, path);
  }
  if (isRedirectTargetSlug(prefix, slug)) {
    return createPageMetadata({
      title: "خدمات حقوقی",
      description: "خدمات تخصصی موسسه حقوقی مجد وکیل الرعایا",
      path,
    });
  }
  return { title: "خدمت یافت نشد" };
}

export function CategoryServicePage({
  slug,
}: {
  prefix: ServiceCategoryPrefix;
  slug: string;
}) {
  return <ServiceDetailContent slug={slug} />;
}
