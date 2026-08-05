import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { CourseFormatPageContent } from "@/components/courses/CourseFormatPageContent";
// import { courseFormats } from "@/data/courses";

export const metadata: Metadata = createPageMetadata({
  title: "قالب دوره",
  description: "جزئیات قالب دوره‌های آموزشی موسسه حقوقی مجد",
  path: "/courses/",
  noIndex: true,
});

export function generateStaticParams() {
  // return courseFormats.map((f) => ({ slug: f.slug }));
  // output: "export" requires at least one param (empty [] fails the build)
  return [{ slug: "_disabled" }];
}

export default async function CourseFormatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  notFound();
  // const { slug } = await params;
  // return <CourseFormatPageContent slug={slug} />;
}
