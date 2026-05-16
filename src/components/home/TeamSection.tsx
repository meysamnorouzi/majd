import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function TeamSection() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="تیم حقوقی"
          title="وکلای متخصص موسسه مجد"
          description="وکلای پایه یک با تجربه در پرونده‌های پیچیده حقوقی و کیفری"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="mt-1 text-xs text-gold-400">{member.role}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gold-600">
                  {member.specialty}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/team/"
            className="text-sm font-semibold text-navy-900 hover:text-gold-600"
          >
            مشاهده تمام اعضای تیم ←
          </Link>
        </div>
      </Container>
    </section>
  );
}
