import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";
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
    <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
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

  return (
    <aside className="relative h-fit overflow-hidden rounded-2xl bg-navy-900 text-white lg:sticky lg:top-8">
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />

      <div className="relative mx-6 -mt-0 overflow-hidden rounded-xl border-4 border-navy-800 shadow-2xl lg:mx-8 lg:mt-0 lg:rounded-b-none lg:border-b-0">
        <div className="relative aspect-[4/5]">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="320px"
            priority
          />
        </div>
      </div>

      <div className="p-6 pt-5 lg:p-8">
        <StarRating />
        <h3 className="mt-3 text-xl font-bold text-white">{member.name}</h3>
        <p className="mt-1 text-sm text-gold-400">{member.role}</p>
        <p className="mt-2 text-xs text-white/60">{member.specialty}</p>

        <div className="mt-6 space-y-2">
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

          {member.social?.instagram && (
            <ContactRow
              label="اینستاگرام"
              href={member.social.instagram}
              icon={
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              }
            >
              اینستاگرام
            </ContactRow>
          )}

          {member.social?.telegram && (
            <ContactRow
              label="تلگرام"
              href={member.social.telegram}
              icon={
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              }
            >
              تلگرام
            </ContactRow>
          )}

          {member.social?.linkedin && (
            <ContactRow
              label="لینکدین"
              href={member.social.linkedin}
              icon={
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              }
            >
              لینکدین
            </ContactRow>
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
