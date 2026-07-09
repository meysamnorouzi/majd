import Link from "next/link";
import { navLinks, practiceAreas, siteConfig } from "@/data/site";
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
              {siteConfig.description.slice(0, 120)}...
            </p>
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
              {practiceAreas.map((area) => (
                <li key={area} className="text-sm text-white/70">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gold-400">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>{siteConfig.address}</li>
              {siteConfig.phones.map((phone, i) => (
                <li key={phone}>
                  <a
                    href={`tel:${siteConfig.phonesTel[i]}`}
                    className="hover:text-gold-400"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-gold-400"
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
          <div className="flex gap-4">
            <a
              href={siteConfig.social.instagram}
              className="text-white/50 transition hover:text-gold-400"
              aria-label="اینستاگرام"
            >
              Instagram
            </a>
            <a
              href={siteConfig.social.telegram}
              className="text-white/50 transition hover:text-gold-400"
              aria-label="تلگرام"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
