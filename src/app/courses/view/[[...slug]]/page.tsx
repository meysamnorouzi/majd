import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { CourseDetailContent } from "@/components/courses/CourseDetailContent";

export const metadata: Metadata = createPageMetadata({
  title: "دوره آموزشی",
  description: "جزئیات دوره آموزشی موسسه حقوقی مجد",
  path: "/courses/view/",
  noIndex: true,
});

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function CourseViewPage() {
  notFound();
  // return <CourseDetailContent />;
}
