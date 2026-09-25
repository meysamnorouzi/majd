import { PillarHubContent } from "@/components/services/PillarHubContent";
import { PillarRelatedPosts } from "@/components/services/PillarRelatedPosts";
import { getPillar } from "@/data/pillars";
import { createPageMetadata } from "@/lib/seo";
import { hubPath, type ServiceCategoryPrefix } from "@/lib/service-paths";
import { getLandingByPrefix } from "@/lib/wordpress/landings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generatePillarHubMetadata(
  prefix: ServiceCategoryPrefix,
): Promise<Metadata> {
  const pillar = getPillar(prefix);
  if (!pillar) return { title: "صفحه یافت نشد" };
  const landing = await getLandingByPrefix(prefix);
  return createPageMetadata({
    title: landing.seoTitle,
    description: landing.seoDescription,
    path: hubPath(prefix),
    image: landing.image ?? pillar.image,
    keywords: landing.keywords,
  });
}

export async function PillarHubPage({
  prefix,
}: {
  prefix: ServiceCategoryPrefix;
}) {
  const pillar = getPillar(prefix);
  if (!pillar) notFound();

  return (
    <>
      <PillarHubContent prefix={prefix} />
      <PillarRelatedPosts prefix={prefix} />
    </>
  );
}
