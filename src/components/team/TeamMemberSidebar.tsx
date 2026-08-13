import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  InstagramIcon,
  LinkedInIcon,
  SocialIconLink,
  TelegramIcon,
} from "@/components/icons/SocialIcons";
import { portraitObjectPosition, siteConfig } from "@/data/site";
import type { LawyerOption } from "@/components/contact/ContactForm";
import type { TeamMember } from "@/types";

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="امتیاز ۵ از ۵">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-gold-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ContactRow({
  icon,
  label,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-semibold text-white transition hover:text-gold-400"
    >
      {children}
    </a>
  ) : (
    <span className="font-semibold text-white">{children}</span>
  );

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-white/50">{label}</p>
        <div className="mt-0.5 text-sm">{content}</div>
      </div>
    </div>
  );
}

export function TeamMemberSidebar({
  member,
  lawyerOptions,
}: {
  member: TeamMember;
  lawyerOptions?: LawyerOption[];
}) {
  const phone = member.phone ?? siteConfig.phones[0];
  const phoneTel = siteConfig.phonesTel[0];
  const email = member.email ?? siteConfig.email;
  const location = member.location ?? siteConfig.address;
  const portrait = member.image;
  const objectPosition =
    portraitObjectPosition(portrait) ?? "center 18%";

  return (
    <aside className="group relative h-fit overflow-hidden rounded-2xl bg-navy-900 text-white shadow-xl shadow-navy-900/20 lg:sticky lg:top-8">
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative overflow-hidden">
        <div className="relative aspect-[4/5]">
          <Image
            src={portrait}
            alt={member.name}
            fill
            className="portrait-filter object-cover"
            style={{ objectPosition }}
            sizes="(max-width: 1024px) 100vw, 400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-navy-900/30 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <StarRating />
          <h3 className="mt-3 text-xl font-bold text-white">{member.name}</h3>
          <p className="mt-1 text-sm text-gold-400">{member.role}</p>
          <p className="mt-2 text-xs text-white/60">{member.specialty}</p>
        </div>
      </div>

      <div className="p-6 pt-2 lg:p-8 lg:pt-4">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gold-400">راه‌های ارتباطی</h4>

          <ContactRow
            label="تلفن"
            href={`tel:${phoneTel}`}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            }
          >
            <span dir="ltr">{phone}</span>
          </ContactRow>

          <ContactRow
            label="ایمیل"
            href={`mailto:${email}`}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            }
          >
            {email}
          </ContactRow>

          <ContactRow
            label="موقعیت"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            }
          >
            {location}
          </ContactRow>

          {(member.social?.instagram ||
            member.social?.telegram ||
            member.social?.linkedin) && (
            <div className="pt-2">
              <p className="mb-2 text-xs text-white/50">شبکه‌های اجتماعی</p>
              <div className="flex items-center gap-2">
                {member.social?.instagram && (
                  <SocialIconLink
                    href={member.social.instagram}
                    label="اینستاگرام"
                    className="bg-white/5 text-gold-400 hover:bg-white/10 hover:text-gold-300"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </SocialIconLink>
                )}
                {member.social?.telegram && (
                  <SocialIconLink
                    href={member.social.telegram}
                    label="تلگرام"
                    className="bg-white/5 text-gold-400 hover:bg-white/10 hover:text-gold-300"
                  >
                    <TelegramIcon className="h-5 w-5" />
                  </SocialIconLink>
                )}
                {member.social?.linkedin && (
                  <SocialIconLink
                    href={member.social.linkedin}
                    label="لینکدین"
                    className="bg-white/5 text-gold-400 hover:bg-white/10 hover:text-gold-300"
                  >
                    <LinkedInIcon className="h-5 w-5" />
                  </SocialIconLink>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <ContactForm
            variant="dark"
            title="رزرو وقت مشاوره"
            description={`برای مشاوره تخصصی با ${member.name} فرم زیر را تکمیل کنید.`}
            defaultSubject="مشاوره حقوقی"
            defaultLawyer={member.name}
            defaultMessage={`درخواست مشاوره با ${member.name} — ${member.specialty}`}
            lawyerOptions={lawyerOptions}
            showLawyerPicker={!!lawyerOptions?.length}
          />
        </div>

        <Link
          href="/contact/"
          className="mt-6 block text-center text-xs text-white/50 transition hover:text-gold-400"
        >
          یا از طریق صفحه تماس با ما ارتباط بگیرید
        </Link>
      </div>
    </aside>
  );
}
