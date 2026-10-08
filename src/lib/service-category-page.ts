import { familySublandings, familySublandingService } from "@/data/family-sublandings";
import { slugsRedirectedToPrefix } from "@/data/legacy-redirects";
import { getServiceBySlug, getServiceMegaTrees } from "@/lib/wordpress";
import {
  getAllServiceLandingRoutesFromWp,
  getServiceHubsFromWp,
  getServiceLandingAsService,
} from "@/lib/wordpress/service-landings";
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
  const routes = await getAllServiceLandingRoutesFromWp();
  const slugs = new Set([
    ...routes
      .filter((route) => route.category === prefix)
      .map((route) => route.slug),
    ...slugsRedirectedToPrefix(prefix),
    ...(prefix === "family-lawyer"
      ? familySublandings.map((item) => item.slug)
      : []),
  ]);
  const params = [...slugs].filter(Boolean).map((slug) => ({ slug }));
  // output: "export" treats an empty list as a missing generateStaticParams().
  if (!params.length) return [{ slug: "_placeholder" }];
  return params;
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
  const apiHubs = await getServiceHubsFromWp();
  if (apiHubs) {
    const service = await getServiceLandingAsService(prefix, decoded);
    if (service) return service;
  }

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

  if (prefix === "family-lawyer") return familySublandingService(decoded);
  return null;
}
