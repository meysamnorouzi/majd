import { CourseFormatPageContent } from "@/components/courses/CourseFormatPageContent";
import { courseFormats } from "@/data/courses";

export function generateStaticParams() {
  return courseFormats.map((f) => ({ slug: f.slug }));
}

export default async function CourseFormatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CourseFormatPageContent slug={slug} />;
}
