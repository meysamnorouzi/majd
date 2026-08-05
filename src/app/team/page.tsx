import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTASection } from "@/components/home/CTASection";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { createPageMetadata } from "@/lib/seo";
import { getTeam } from "@/lib/wordpress";
import { assets } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "اعضای تیم",
  description: "وکلای پایه یک و متخصص موسسه حقوقی مجد وکیل الرعایا",
  path: "/team/",
  keywords: ["وکیل پایه یک", "تیم حقوقی مجد", "وکلای تهران"],
});

export default function TeamPage() {
  const team = getTeam();

  return (
    <>
      <PageHero
        title="اعضای تیم"
        description="وکلای مجرب و متخصص موسسه حقوقی مجد"
        breadcrumb={[{ label: "اعضای تیم" }]}
        image={assets.founderBanner}
        imagePosition="center 28%"
      />
      <section className="py-20">
        <Container>
          <SectionTitle
            title="تیم حقوقی ما"
            description="هر یک از وکلای موسسه در حوزه تخصصی خود سال‌ها تجربه عملی دارند."
          />
          <Stagger
            className={`grid gap-10 sm:grid-cols-2 ${
              team.length === 1
                ? "mx-auto max-w-sm lg:grid-cols-1"
                : "lg:grid-cols-4"
            }`}
            stagger={0.1}
          >
            {team.map((member) => (
              <StaggerItem key={member.id} variant="up">
                <TeamMemberCard member={member} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
