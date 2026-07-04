import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { AboutSection } from "@/components/home/AboutSection";
import { TeamSection } from "@/components/home/TeamSection";
import { BlogSectionLive } from "@/components/home/BlogSectionLive";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <CoursesPreview />
      <AboutSection />
      <TeamSection />
      <BlogSectionLive />
      <CTASection />
    </>
  );
}
