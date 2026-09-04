import type { Metadata } from "next";
import { TeamMemberContent } from "@/components/team/TeamMemberContent";
import { createPageMetadata } from "@/lib/seo";

/**
 * SPA shell for team profile URLs not pre-rendered at build time.
 * Apache / Cloudflare rewrite `/team/<slug>/` → `/team/view/index.html`
 * when no static folder exists — same pattern as `/blogs/<slug>/`.
 */
export async function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export const metadata: Metadata = createPageMetadata({
  title: "عضو تیم",
  description: "وکلای پایه یک و متخصص موسسه حقوقی مجد وکیل الرعایا",
  path: "/team/view/",
  noIndex: true,
});

export default function TeamMemberShellPage() {
  return <TeamMemberContent />;
}
