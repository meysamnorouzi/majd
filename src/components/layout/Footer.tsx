import Link from "next/link";
import { navLinks, siteConfig } from "@/data/site";
import { PILLARS } from "@/data/pillars";
import { hubPath } from "@/lib/service-paths";
import {
  InstagramIcon,
  SocialIconLink,
  TelegramIcon,
} from "@/components/icons/SocialIcons";
import { EnamadSeal } from "@/components/ui/EnamadSeal";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {siteConfig.footerBlurb}
            </p>
            <div className="mt-6">
              <EnamadSeal />
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gold-400">دسترسی سریع</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gold-400">حوزه‌های تخصصی</h3>
            <ul className="space-y-2">
              {PILLARS.map((pillar) => (
                <li key={pillar.prefix}>
                  <Link
                    href={hubPath(pillar.prefix)}
                    className="text-sm text-white/70 transition hover:text-gold-400"
                  >
                    {pillar.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gold-400">راه‌های ارتباطی با ما</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="leading-relaxed">{siteConfig.address}</li>
              {siteConfig.phones.map((phone, i) => (
                <li key={phone}>
                  <a
                    href={`tel:${siteConfig.phonesTel[i]}`}
                    className="transition hover:text-gold-400"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-white/50">ایمیل: </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-gold-400"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.workingHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-sm text-white/50">
            © {new Date().getFullYear()} {siteConfig.name}. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-2">
            <SocialIconLink
              href={siteConfig.social.instagram}
              label="اینستاگرام"
              className="bg-white/5 text-white/60 hover:bg-white/10 hover:text-gold-400"
            >
              <InstagramIcon className="h-5 w-5" />
            </SocialIconLink>
            <SocialIconLink
              href={siteConfig.social.telegram}
              label="تلگرام"
              className="bg-white/5 text-white/60 hover:bg-white/10 hover:text-gold-400"
            >
              <TelegramIcon className="h-5 w-5" />
            </SocialIconLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
