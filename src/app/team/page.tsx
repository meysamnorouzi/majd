import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/home/CTASection";
import { TeamPageContent } from "@/components/team/TeamPageContent";
import { createPageMetadata } from "@/lib/seo";
import { TEAM_LIST_PATH } from "@/lib/team-paths";
import { assets, portraitObjectPosition } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "اعضای تیم",
  description: "وکلای پایه یک و متخصص موسسه حقوقی مجد وکیل الرعایا",
  path: TEAM_LIST_PATH,
  keywords: ["وکیل پایه یک", "تیم حقوقی مجد", "وکلای تهران"],
});

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="اعضای تیم"
        description="وکلای مجرب و متخصص موسسه حقوقی مجد"
        breadcrumb={[{ label: "اعضای تیم" }]}
        image={assets.founderBanner}
        imagePosition={portraitObjectPosition(assets.founderBanner) ?? "center 28%"}
      />
      <TeamPageContent />
      <CTASection />
    </>
  );
}
