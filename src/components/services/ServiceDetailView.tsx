import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ServiceCallCta } from "@/components/services/ServiceCallCta";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import { WpRichContent } from "@/components/content/WpRichContent";
import { Reveal } from "@/components/motion/reveal";
import { portraitObjectPosition } from "@/data/site";
import { getPillar } from "@/data/pillars";
import { splitHtmlIntoParts } from "@/lib/split-html";
import { hubPath, type ServiceCategoryPrefix } from "@/lib/service-paths";
import type { Service } from "@/types";

function buildServiceRichHtml(service: Service): string {
  if (service.contentHtml?.trim()) return service.contentHtml;
  if (service.longDescription?.length) {
    return service.longDescription.map((p) => `<p>${p}</p>`).join("\n");
  }
  if (service.description) return `<p>${service.description}</p>`;
  return "";
}

export function ServiceDetailView({ service }: { service: Service }) {
  const prefix = service.categoryPrefix as ServiceCategoryPrefix | undefined;
  const pillar = prefix ? getPillar(prefix) : undefined;
  const hubHref = prefix ? hubPath(prefix) : undefined;
  const richHtml = buildServiceRichHtml(service);
  const [first, second, third] = splitHtmlIntoParts(richHtml, 3);

  return (
    <>
      <PageHero
        title={service.title}
        description={service.excerpt}
        breadcrumb={[
          ...(pillar && hubHref
            ? [{ label: pillar.title, href: hubHref }]
            : []),
          { label: service.title },
        ]}
        image={service.image}
        imagePosition={
          service.image
            ? (portraitObjectPosition(service.image) ?? "center 28%")
            : "center 28%"
        }
      />

      <section className="py-12 lg:py-16">
        <Container className="max-w-3xl">
          <Reveal variant="up" immediate>
            {first ? (
              <WpRichContent html={first} />
            ) : service.description ? (
              <p className="text-lg leading-relaxed text-slate-700">
                {service.description}
              </p>
            ) : null}

            <ServiceCallCta
              title="تماس با وکیل این پرونده"
              description={`برای ${service.title} همین حالا تماس بگیرید.`}
            />

            {second ? (
              <div className="mt-4">
                <WpRichContent html={second} />
              </div>
            ) : null}

            {service.highlights && service.highlights.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {service.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </Reveal>
        </Container>
      </section>

      <ConsultationSection
        title="فرم مشاوره"
        description="جزئیات پرونده را بنویسید تا وکیل متخصص با شما تماس بگیرد."
        defaultSubject={service.title}
        defaultMessage={`درخواست مشاوره برای خدمت: ${service.title}`}
      />

      <section className="pb-16 lg:pb-20">
        <Container className="max-w-3xl">
          {third ? (
            <div className="mt-4">
              <WpRichContent html={third} />
            </div>
          ) : null}

          {service.whyNeed ? (
            <div className="mt-12 rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold text-gold-400">
                {service.whyNeed.title}
              </h2>
              <div className="mt-6 space-y-4">
                {service.whyNeed.paragraphs.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-white/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {service.faqs && service.faqs.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-navy-900">سوالات متداول</h2>
              <div className="mt-6">
                <ServiceFAQ items={service.faqs} />
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
