import type { Metadata } from "next";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { FormatOverviewCards } from "@/components/courses/FormatOverviewCards";
import { CoursesCatalog } from "@/components/courses/CoursesCatalog";
import { EnrollmentSteps } from "@/components/courses/EnrollmentSteps";
import { CoursesFAQ } from "@/components/courses/CoursesFAQ";
import { CoursesCTA } from "@/components/courses/CoursesCTA";

export const metadata: Metadata = {
  title: "دوره‌های آموزشی",
  description:
    "دوره‌های حقوقی در پنج قالب — وبینار آنلاین، آنلاین + آفلاین، حضوری + آنلاین + آفلاین، نشست ترکیبی و نشست حضوری — موسسه حقوقی مجد",
};

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <FormatOverviewCards />
      <CoursesCatalog
        sectionId="courses-catalog"
        heading="جستجو و فیلتر دوره‌ها"
        description="تمام دوره‌های موسسه را جستجو کنید یا با فیلتر نوع، سطح و قیمت، دوره مناسب خود را بیابید."
      />
      <EnrollmentSteps />
      <CoursesFAQ />
      <CoursesCTA />
    </>
  );
}
