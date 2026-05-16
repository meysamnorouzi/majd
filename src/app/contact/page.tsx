import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "تماس با موسسه حقوقی مجد — مشاوره رایگان و پذیرش پرونده",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="تماس با ما"
        description="برای مشاوره حقوقی، پذیرش پرونده یا هرگونه سوال با ما در ارتباط باشید"
        breadcrumb={[{ label: "تماس با ما" }]}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">
                اطلاعات تماس
              </h2>
              <p className="mt-4 text-slate-600">
                موسسه حقوقی مجد وکیل الرعایا آماده پاسخگویی به شماست. می‌توانید
                از طریق فرم، تلفن یا مراجعه حضوری با ما تماس بگیرید.
              </p>

              <ul className="mt-8 space-y-6">
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">آدرس</h3>
                  <p className="mt-1 text-slate-700">{siteConfig.address}</p>
                </li>
                <li>
                  <h3 className="text-sm font-semibold text-gold-600">تلفن</h3>
                  <div className="mt-1 flex flex-col gap-1">
                    {siteConfig.phones.map((phone, i) => (
                      <a
                        key={phone}
                        href={`tel:${siteConfig.phonesTel[i]}`}
                        className="text-lg font-semibold text-navy-900 hover:text-gold-600"
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
                    className="mt-1 block text-navy-900 hover:text-gold-600"
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

              <div className="mt-10 overflow-hidden rounded-2xl bg-navy-900/5">
                <iframe
                  title="موقعیت موسسه"
                  src="https://maps.google.com/maps?q=ولیعصر+ونک+تهران&output=embed&z=14&hl=fa"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
