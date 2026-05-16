import type { Metadata } from "next";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { FormatOverviewCards } from "@/components/courses/FormatOverviewCards";
import { CourseFormatSection } from "@/components/courses/CourseFormatSection";
import { EnrollmentSteps } from "@/components/courses/EnrollmentSteps";
import { CoursesFAQ } from "@/components/courses/CoursesFAQ";
import { CoursesCTA } from "@/components/courses/CoursesCTA";
import { courseFormats } from "@/data/courses";

export const metadata: Metadata = {
  title: "دوره‌های آموزشی",
  description:
    "دوره‌های حقوقی حضوری، آفلاین (اسپات پلیر) و آنلاین (وبینار) — موسسه حقوقی مجد وکیل الرعایا",
};

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <FormatOverviewCards />
      {courseFormats.map((format, i) => (
        <CourseFormatSection
          key={format.slug}
          format={format}
          reversed={i % 2 === 1}
        />
      ))}
      <EnrollmentSteps />
      <CoursesFAQ />
      <CoursesCTA />
    </>
  );
}
