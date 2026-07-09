import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { TeamMemberTabs } from "@/components/team/TeamMemberTabs";
import { TeamMemberSidebar } from "@/components/team/TeamMemberSidebar";
import { getTeam, getTeamMemberBySlug } from "@/lib/wordpress";

export function generateStaticParams() {
  return getTeam().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) return { title: "عضو تیم یافت نشد" };
  return {
    title: member.name,
    description: `${member.role} — ${member.specialty}. ${member.bio}`,
  };
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      <p className="text-2xl font-bold text-gold-600">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) notFound();

  const allMembers = getTeam();
  const otherMembers = allMembers.filter((m) => m.slug !== slug);
  const lawyerOptions = allMembers.map((m) => ({
    slug: m.slug,
    name: m.name,
  }));

  return (
    <>
      <PageHero
        title={member.name}
        description={member.role}
        breadcrumb={[
          { label: "اعضای تیم", href: "/team/" },
          { label: member.name },
        ]}
      />

      <section className="relative bg-cream pt-12 lg:pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <div className="rounded-2xl bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-8 lg:p-10">
                <span className="inline-block rounded-full bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-600">
                  {member.specialty}
                </span>
                <h2 className="mt-5 text-2xl font-bold text-navy-900 sm:text-3xl">
                  {member.name}
                </h2>
                <p className="mt-2 text-gold-600">{member.role}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-lg bg-navy-900/5 px-4 py-2 text-sm font-semibold text-navy-900">
                    {member.experienceYears} سال تجربه
                  </span>
                  <span className="rounded-lg bg-navy-900/5 px-4 py-2 text-sm text-slate-600">
                    {member.education}
                  </span>
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  <StatCard label="سال تجربه" value={member.experienceYears} />
                  <StatCard
                    label="حوزه تخصصی"
                    value={member.areasOfPractice.length.toLocaleString("fa-IR")}
                  />
                  <StatCard
                    label="دستاورد"
                    value={member.achievements.length.toLocaleString("fa-IR")}
                  />
                </div>

                <div className="mt-10 border-t border-slate-100 pt-10">
                  <TeamMemberTabs member={member} />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <TeamMemberSidebar
                member={member}
                lawyerOptions={lawyerOptions}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-16 text-white">
        <Container>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gold-400">
              حوزه‌های فعالیت {member.name}
            </h3>
            <p className="mt-2 text-sm text-white/60">
              زمینه‌های تخصصی که در آن‌ها فعالیت دارد
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {member.areasOfPractice.map((area) => (
                <span
                  key={area}
                  className="rounded-lg border border-gold-400/30 bg-white/5 px-4 py-2 text-sm text-white/90"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h3 className="text-xl font-bold text-navy-900">سایر اعضای تیم</h3>
          <p className="mt-2 text-sm text-slate-600">
            با سایر وکلای متخصص موسسه مجد آشنا شوید
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((m) => (
              <TeamMemberCard key={m.id} member={m} variant="compact" />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/team/"
              className="text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              بازگشت به لیست اعضای تیم ←
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
