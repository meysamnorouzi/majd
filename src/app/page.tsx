import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
// Temporarily hidden — no payment gateway yet
// import { CoursesPreview } from "@/components/home/CoursesPreview";
import { AboutSection } from "@/components/home/AboutSection";
import { FounderBanner } from "@/components/home/FounderBanner";
import { TeamSection } from "@/components/home/TeamSection";
import { BlogSection } from "@/components/home/BlogSection";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  defaultKeywords,
} from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
    keywords: defaultKeywords,
  }),
  // Avoid "Name | ShortName" duplication on the homepage
  title: {
    absolute: siteConfig.name,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "خانه", path: "/" }])}
      />
      <Hero />
      <ServicesSection />
      {/* Temporarily hidden — no payment gateway yet */}
      {/* <CoursesPreview /> */}
      <AboutSection />
      <FounderBanner />
      <TeamSection />
      <BlogSection />
      <CTASection />
    </>
  );
}