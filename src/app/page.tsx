import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { AboutSection } from "@/components/home/AboutSection";
import { TeamSection } from "@/components/home/TeamSection";
import { BlogSection } from "@/components/home/BlogSection";
import { CTASection } from "@/components/home/CTASection";
import { getPosts } from "@/lib/wordpress";

export default async function HomePage() {
  const posts = await getPosts(6);

  return (
    <>
      <Hero />
      <ServicesSection />
      <CoursesPreview />
      <AboutSection />
      <TeamSection />
      <BlogSection posts={posts} />
      <CTASection />
    </>
  );
}
