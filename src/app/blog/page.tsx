import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "مقالات",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
  path: "/blog/",
  keywords: ["مقالات حقوقی", "تحلیل حقوقی", "راهنمای حقوقی"],
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="مقالات حقوقی"
        description="آخرین مقالات، تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص"
        breadcrumb={[{ label: "مقالات" }]}
      />
      <BlogPageContent />
    </>
  );
}
