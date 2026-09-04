import type { Metadata } from "next";
import { TeamMemberContent } from "@/components/team/TeamMemberContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  personJsonLd,
} from "@/lib/seo";
import { TEAM_LIST_PATH, teamMemberPath } from "@/lib/team-paths";
import { getTeam, getTeamMemberBySlug } from "@/lib/wordpress";

export async function generateStaticParams() {
  const team = await getTeam();
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) {
    return createPageMetadata({
      title: "عضو تیم یافت نشد",
      description: "عضو تیم مورد نظر یافت نشد",
      path: teamMemberPath(slug),
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: member.name,
    description: `${member.role} — ${member.specialty}. ${member.bio}`,
    path: teamMemberPath(member.slug),
    image: member.image,
    type: "profile",
    keywords: [member.name, member.role, member.specialty, "وکیل"],
  });
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  return (
    <>
      {member ? (
        <JsonLd
          data={[
            personJsonLd(member),
            breadcrumbJsonLd([
              { name: "خانه", path: "/" },
              { name: "اعضای تیم", path: TEAM_LIST_PATH },
              { name: member.name, path: teamMemberPath(member.slug) },
            ]),
          ]}
        />
      ) : null}
      <TeamMemberContent />
    </>
  );
}
