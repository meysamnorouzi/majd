import { slugsRedirectedToPrefix } from "@/data/legacy-redirects";
import { getServiceBySlug, getServiceMegaTrees } from "@/lib/wordpress";
import {
  getPillarLeavesFromTree,
  type ServiceCategoryPrefix,
} from "@/lib/service-paths";
import type { Service } from "@/types";

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateCategoryStaticParams(
  prefix: ServiceCategoryPrefix,
) {
  const trees = await getServiceMegaTrees();
  const leaves = getPillarLeavesFromTree(
    trees.find((tree) => tree.categoryPrefix === prefix),
  );
  const slugs = new Set([
    ...leaves.map((service) => service.slug),
    ...slugsRedirectedToPrefix(prefix),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export function isRedirectTargetSlug(
  prefix: ServiceCategoryPrefix,
  slug: string,
): boolean {
  const decoded = decodeSlug(slug);
  return slugsRedirectedToPrefix(prefix).includes(decoded);
}

export function serviceMatchesPrefix(
  service: Service | null,
  prefix: ServiceCategoryPrefix,
  slug: string,
): service is Service {
  if (!service) return false;
  if (service.categoryPrefix === prefix) return true;
  return !service.categoryPrefix && isRedirectTargetSlug(prefix, slug);
}

export async function resolveCategoryService(
  prefix: ServiceCategoryPrefix,
  slug: string,
): Promise<Service | null> {
  const decoded = decodeSlug(slug);
  const trees = await getServiceMegaTrees();
  const leaf = getPillarLeavesFromTree(
    trees.find((tree) => tree.categoryPrefix === prefix),
  ).find((service) => service.slug === decoded || service.slug === slug);

  if (leaf) {
    return { ...leaf, categoryPrefix: prefix };
  }

  const service = await getServiceBySlug(decoded);
  if (serviceMatchesPrefix(service, prefix, decoded)) {
    return { ...service, categoryPrefix: service.categoryPrefix ?? prefix };
  }

  return null;
}
