import Link from "next/link";
import { getTeam } from "@/lib/wordpress";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";

export async function TeamSection() {
  const team = await getTeam();

  if (!team.length) return null;

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="تیم حقوقی"
          title="وکلای متخصص موسسه مجد"
          description="وکلای پایه یک با تجربه در پرونده‌های پیچیده حقوقی و کیفری"
        />
        <div
          className={`grid gap-8 sm:grid-cols-2 ${
            team.length === 1
              ? "mx-auto max-w-sm lg:grid-cols-1"
              : "lg:grid-cols-4"
          }`}
        >
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
        {team.length > 1 && (
          <div className="mt-10 text-center">
            <Link
              href="/team/"
              className="text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              مشاهده تمام اعضای تیم ←
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
