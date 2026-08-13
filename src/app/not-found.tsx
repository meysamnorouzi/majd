import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";
import { BLOG_LIST_PATH } from "@/lib/blog-paths";

const quickLinks = [
  { href: "/services/", label: "خدمات حقوقی" },
  { href: BLOG_LIST_PATH, label: "مقالات تخصصی" },
  { href: "/team/", label: "اعضای تیم" },
  { href: "/contact/", label: "تماس با ما" },
] as const;

export default function NotFound() {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-navy-950"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 55% at 85% 15%, rgba(201, 162, 39, 0.22), transparent 55%),
            radial-gradient(ellipse 55% 45% at 10% 90%, rgba(19, 45, 82, 0.9), transparent 50%),
            linear-gradient(160deg, rgba(7, 20, 40, 0.95) 0%, rgba(12, 31, 61, 0.98) 45%, rgba(19, 45, 82, 0.92) 100%)
          `,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <Container className="relative text-center">
        <p className="animate-fade-up text-sm font-semibold tracking-wide text-gold-400">
          {siteConfig.shortName}
        </p>

        <p
          className="animate-fade-up mt-4 font-black leading-none text-gold-400/90"
          style={{
            fontSize: "clamp(5.5rem, 18vw, 9rem)",
            animationDelay: "80ms",
            animationFillMode: "both",
          }}
        >
          ۴۰۴
        </p>

        <h1
          className="animate-fade-up mt-4 text-2xl font-bold text-white sm:text-3xl"
          style={{ animationDelay: "140ms", animationFillMode: "both" }}
        >
          صفحه مورد نظر یافت نشد
        </h1>

        <p
          className="animate-fade-up mx-auto mt-3 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          این آدرس وجود ندارد یا جابه‌جا شده است. از لینک‌های زیر مسیر درست را
          پیدا کنید.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "280ms", animationFillMode: "both" }}
        >
          <Button href="/" size="lg">
            بازگشت به صفحه اصلی
          </Button>
          <Button href="/contact/" variant="secondary" size="lg">
            درخواست مشاوره
          </Button>
        </div>

        <nav
          className="animate-fade-up mx-auto mt-14 max-w-2xl border-t border-white/10 pt-8"
          style={{ animationDelay: "360ms", animationFillMode: "both" }}
          aria-label="میانبرهای مفید"
        >
          <p className="mb-4 text-sm text-white/50">دسترسی سریع</p>
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:border-gold-400/50 hover:bg-white/10 hover:text-gold-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
