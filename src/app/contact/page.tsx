import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig, teamMembers } from "@/data/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import type { Metadata } from "next";

const lawyerOptions = teamMembers.map((m) => ({
  slug: m.slug,
  name: m.name,
}));

export const metadata: Metadata = createPageMetadata({
  title: "تماس با ما",
  description: `تماس با ${siteConfig.name} — ${siteConfig.address} | تلفن ${siteConfig.phones.join(" — ")}`,
  path: "/contact/",
  keywords: ["تماس با وکیل", "مشاوره حقوقی تهران", "آدرس موسسه حقوقی مجد"],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            { name: "تماس با ما", path: "/contact/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "تماس با ما",
            url: absoluteUrl("/contact/"),
            mainEntity: { "@id": `${absoluteUrl("/")}#organization` },
          },
        ]}
      />
      <PageHero
        title="تماس با ما"
        description="برای مشاوره حقوقی، پذیرش پرونده یا هرگونه سوال با ما در ارتباط باشید"
        breadcrumb={[{ label: "تماس با ما" }]}
      />

      <section className="border-b border-cream-dark/80 bg-white py-14">
        <Container>
          <Stagger className="grid gap-10 text-center sm:grid-cols-3" stagger={0.1}>
            <StaggerItem variant="up">
              <p className="text-xs font-semibold tracking-wide text-gold-600">
                موقعیت
              </p>
              <h2 className="mt-2 text-xl font-bold text-navy-900">
                {siteConfig.city}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
                {siteConfig.address}
              </p>
            </StaggerItem>

            <StaggerItem variant="up">
              <p className="text-xs font-semibold tracking-wide text-gold-600">
                تلفن‌ها
              </p>
              <h2 className="mt-2 text-xl font-bold text-navy-900">تماس مستقیم</h2>
              <div className="mt-3 flex flex-col items-center gap-1.5">
                {siteConfig.phones.map((phone, i) => (
                  <a
                    key={phone}
                    href={`tel:${siteConfig.phonesTel[i]}`}
                    className="text-lg font-semibold text-navy-900 transition hover:text-gold-600"
                    dir="ltr"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </StaggerItem>

            <StaggerItem variant="up">
              <p className="text-xs font-semibold tracking-wide text-gold-600">
                ایمیل
              </p>
              <h2 className="mt-2 text-xl font-bold text-navy-900">مکاتبه</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 inline-block text-lg font-semibold text-navy-900 transition hover:text-gold-600"
              >
                {siteConfig.email}
              </a>
              <p className="mx-auto mt-3 max-w-xs text-sm text-slate-600">
                {siteConfig.workingHours}
              </p>
            </StaggerItem>
          </Stagger>

          <Reveal className="mt-10 text-center" delay={0.15}>
            <p className="text-base font-semibold text-navy-900 sm:text-lg">
              {siteConfig.contactCta}:{" "}
              <a
                href={`tel:${siteConfig.phonesTel[1]}`}
                className="text-gold-600 transition hover:text-gold-500"
                dir="ltr"
              >
                {siteConfig.phones[1]}
              </a>
              {" · "}
              <a
                href={`tel:${siteConfig.phonesTel[0]}`}
                className="text-gold-600 transition hover:text-gold-500"
                dir="ltr"
              >
                {siteConfig.phones[0]}
              </a>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal variant="left">
              <h2 className="text-2xl font-bold text-navy-900">اطلاعات تماس</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {siteConfig.footerBlurb} می‌توانید از طریق فرم، تلفن یا مراجعه
                حضوری با ما تماس بگیرید.
              </p>

              <ul className="mt-8 space-y-6">
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">آدرس</h3>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {siteConfig.address}
                  </p>
                </li>
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">تلفن</h3>
                  <div className="mt-1 flex flex-col gap-1">
                    {siteConfig.phones.map((phone, i) => (
                      <a
                        key={phone}
                        href={`tel:${siteConfig.phonesTel[i]}`}
                        className="text-lg font-semibold text-navy-900 transition hover:text-gold-600"
                        dir="ltr"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">ایمیل</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 block text-navy-900 transition hover:text-gold-600"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">
                    ساعات کاری
                  </h3>
                  <p className="mt-1 text-slate-700">{siteConfig.workingHours}</p>
                </li>
              </ul>

              <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-navy-900/5">
                <iframe
                  title={siteConfig.mapTitle}
                  src={siteConfig.mapEmbedUrl}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal variant="right" delay={0.12}>
              <ContactForm
                title="ارسال پیام"
                description="پیام خود را ارسال کنید؛ در اسرع وقت با شما تماس می‌گیریم."
                lawyerOptions={lawyerOptions}
                showLawyerPicker
              />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
