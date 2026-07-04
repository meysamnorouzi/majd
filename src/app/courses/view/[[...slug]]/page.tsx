import { CourseDetailContent } from "@/components/courses/CourseDetailContent";

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function CourseViewPage() {
  return <CourseDetailContent />;
}
