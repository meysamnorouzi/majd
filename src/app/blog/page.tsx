import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPageContent } from "@/components/blog/BlogPageContent";

export const metadata: Metadata = {
  title: "بلاگ",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="بلاگ حقوقی"
        description="آخرین مقالات، تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص"
        breadcrumb={[{ label: "بلاگ" }]}
      />
      <BlogPageContent />
    </>
  );
}
