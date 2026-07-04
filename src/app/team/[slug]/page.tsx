import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { siteConfig } from "@/data/site";
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

  const otherMembers = getTeam().filter((m) => m.slug !== slug);

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

      <section className="relative bg-cream pb-20 pt-12 lg:pt-16">
        <Container>
          <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl shadow-2xl shadow-navy-900/20">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
              <div className="mt-6 hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
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
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white p-8 shadow-lg shadow-navy-900/5 lg:p-10">
                <span className="inline-block rounded-full bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-600">
                  {member.specialty}
                </span>
                <h2 className="mt-5 text-2xl font-bold text-navy-900 sm:text-3xl">
                  {member.name}
                </h2>
                <p className="mt-2 text-gold-600">{member.role}</p>

                <div className="mt-6 flex flex-wrap gap-3 sm:hidden">
                  <span className="rounded-lg bg-navy-900/5 px-4 py-2 text-sm font-semibold text-navy-900">
                    {member.experienceYears} سال تجربه
                  </span>
                  <span className="rounded-lg bg-navy-900/5 px-4 py-2 text-sm text-slate-600">
                    {member.education}
                  </span>
                </div>

                <div className="mt-8 space-y-4 border-t border-slate-100 pt-8">
                  {member.fullBio.map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-relaxed text-slate-600 first:text-lg first:text-slate-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 hidden items-center gap-4 rounded-xl bg-cream/80 p-5 sm:flex">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">تحصیلات</p>
                    <p className="mt-0.5 text-sm text-slate-600">{member.education}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-16 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-gold-400">حوزه‌های فعالیت</h3>
              <p className="mt-2 text-sm text-white/60">
                زمینه‌های تخصصی که {member.name} در آن‌ها فعالیت دارد
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
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
            <div>
              <h3 className="text-xl font-bold text-gold-400">دستاوردها</h3>
              <p className="mt-2 text-sm text-white/60">
                برجسته‌ترین سوابق حرفه‌ای
              </p>
              <ul className="mt-6 space-y-3">
                {member.achievements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/85"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs text-gold-400">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <aside className="relative h-fit overflow-hidden rounded-2xl bg-navy-900 p-8 text-white lg:sticky lg:top-8">
              <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
              <h3 className="text-lg font-bold text-gold-400">
                مشاوره با {member.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                برای دریافت مشاوره تخصصی در زمینه {member.specialty} با موسسه
                حقوقی مجد تماس بگیرید.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <p>
                  <span className="text-white/50">تلفن: </span>
                  <a
                    href={`tel:${siteConfig.phonesTel[0]}`}
                    className="font-semibold text-gold-400 hover:text-gold-300"
                    dir="ltr"
                  >
                    {siteConfig.phones[0]}
                  </a>
                </p>
                <p>
                  <span className="text-white/50">ایمیل: </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-gold-400 hover:text-gold-300"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              </div>
              <div className="mt-8 border-t border-white/10 pt-8">
                <ContactForm
                  variant="dark"
                  title="رزرو وقت مشاوره"
                  description=""
                  defaultSubject="مشاوره حقوقی"
                  defaultMessage={`درخواست مشاوره با ${member.name} — ${member.specialty}`}
                />
              </div>
            </aside>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-navy-900">سایر اعضای تیم</h3>
              <p className="mt-2 text-sm text-slate-600">
                با سایر وکلای متخصص موسسه مجد آشنا شوید
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
