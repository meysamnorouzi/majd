import { notFound } from "next/navigation";

// Temporarily hidden — no payment gateway yet
// import { CourseDetailContent } from "@/components/courses/CourseDetailContent";

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function CourseViewPage() {
  notFound();
  // return <CourseDetailContent />;
}
