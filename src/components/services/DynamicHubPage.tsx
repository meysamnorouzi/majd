"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PillarHubContent } from "@/components/services/PillarHubContent";
import { PillarRelatedPosts } from "@/components/services/PillarRelatedPosts";
import { Container } from "@/components/ui/Container";
import {
  hubSlugFromPathname,
  isServiceCategoryPrefix,
} from "@/lib/service-paths";

export function DynamicHubPage() {
  const pathname = usePathname();
  const slug = hubSlugFromPathname(pathname);
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 1 || !slug) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">صفحه یافت نشد</h1>
          <Link href="/" className="mt-6 inline-block text-gold-600">
            بازگشت به خانه
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PillarHubContent prefix={slug} />
      {isServiceCategoryPrefix(slug) ? (
        <PillarRelatedPosts prefix={slug} />
      ) : null}
    </>
  );
}
