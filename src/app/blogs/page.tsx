import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { createPageMetadata } from "@/lib/seo";
import { BLOG_LIST_PATH } from "@/lib/blog-paths";
import { assets, portraitObjectPosition } from "@/data/site";

export const metadata: Metadata = createPageMetadata({
  title: "مقالات",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
  path: BLOG_LIST_PATH,
  keywords: ["مقالات حقوقی", "تحلیل حقوقی", "راهنمای حقوقی"],
});

export default function BlogsPage() {
  return (
    <>
      <PageHero
        title="مقالات حقوقی"
        description="آخرین مقالات، تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص"
        breadcrumb={[{ label: "مقالات" }]}
        image={assets.founderReading}
        imagePosition={
          portraitObjectPosition(assets.founderReading) ?? "78% 22%"
        }
      />
      <BlogPageContent />
    </>
  );
}
