import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTASection } from "@/components/home/CTASection";
import { getTeam } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اعضای تیم",
  description: "وکلای پایه یک و متخصص موسسه حقوقی مجد وکیل الرعایا",
};

export default function TeamPage() {
  const team = getTeam();

  return (
    <>
      <PageHero
        title="اعضای تیم"
        description="وکلای مجرب و متخصص موسسه حقوقی مجد"
        breadcrumb={[{ label: "اعضای تیم" }]}
      />
      <section className="py-20">
        <Container>
          <SectionTitle
            title="تیم حقوقی ما"
            description="هر یک از وکلای موسسه در حوزه تخصصی خود سال‌ها تجربه عملی دارند."
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-navy-900">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm text-gold-600">{member.role}</p>
                  <p className="mt-2 text-xs font-semibold text-navy-700">
                    {member.specialty}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
