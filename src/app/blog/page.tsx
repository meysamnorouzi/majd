import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPageContent } from "@/components/blog/BlogPageContent";

export const metadata: Metadata = {
  title: "مقالات",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
};

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
