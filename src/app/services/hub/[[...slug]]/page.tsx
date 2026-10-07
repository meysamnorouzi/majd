import type { Metadata } from "next";
import { DynamicHubPage } from "@/components/services/DynamicHubPage";
import { createPageMetadata } from "@/lib/seo";

/**
 * Shell for a service hub added in WordPress after the last static build.
 * Apache rewrites `/{slug}/` → `/services/hub/index.html` when that folder
 * does not exist yet. Known hubs keep their own routes.
 */
export async function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export const metadata: Metadata = createPageMetadata({
  title: "خدمات حقوقی",
  description: "لندینگ خدمات موسسه حقوقی مجد وکیل الرعایا",
  path: "/services/hub/",
  noIndex: true,
});

export default function ServiceHubShellPage() {
  return <DynamicHubPage />;
}
