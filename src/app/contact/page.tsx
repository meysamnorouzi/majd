import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { assets, portraitObjectPosition, siteConfig } from "@/data/site";
import { getTeam } from "@/lib/wordpress";
import { toLawyerOptions } from "@/lib/wordpress/team";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "تماس با ما",
  description: `تماس با ${siteConfig.name} — ${siteConfig.address} | تلفن ${siteConfig.phones.join(" — ")}`,
  path: "/contact/",
  keywords: ["تماس با وکیل", "مشاوره حقوقی تهران", "آدرس موسسه حقوقی مجد"],
});

export default async function ContactPage() {
  const lawyerOptions = toLawyerOptions(await getTeam());

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
        image={assets.founderBoardroom}
        imagePosition={
          portraitObjectPosition(assets.founderBoardroom) ?? "center 20%"
        }
      />

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
                  <p className="mt-1 text-sm font-semibold text-navy-900">
                    {siteConfig.contactCta}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
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
