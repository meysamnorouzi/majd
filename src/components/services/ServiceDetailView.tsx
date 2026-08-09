import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { ServiceDetailActions } from "@/components/services/ServiceDetailActions";
import { ServiceTrustBar } from "@/components/services/ServiceTrustBar";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceRelatedServices } from "@/components/services/ServiceRelatedServices";
import { LatestBlogSection } from "@/components/blog/LatestBlogSection";
import { WpRichContent } from "@/components/content/WpRichContent";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Service } from "@/types";

function ServiceFeatures({ features }: { features: Service["features"] }) {
  if (!features?.length) return null;
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
      {features.map((feature) => (
        <StaggerItem key={feature.title} variant="up">
          <div className="group flex h-full items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-gold-400/40 hover:shadow-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-gold-600 transition group-hover:bg-gold-500/10">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-navy-900">{feature.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function ServiceProcessSteps({ steps }: { steps: Service["processSteps"] }) {
  if (!steps?.length) return null;
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
      {steps.map((step) => (
        <StaggerItem key={step.step} variant="up">
          <div className="relative h-full rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-600">
              {step.step.toLocaleString("fa-IR")}
            </span>
            <h4 className="mt-4 font-semibold text-navy-900">{step.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {step.description}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function buildServiceRichHtml(service: Service): string | undefined {
  if (service.contentHtml?.trim()) return service.contentHtml;
  if (!service.longDescription?.length) return undefined;
  return service.longDescription.map((p) => `<p>${p}</p>`).join("\n");
}

export function ServiceDetailView({
  service,
  relatedServices,
}: {
  service: Service;
  relatedServices: Service[];
}) {
  const richHtml = buildServiceRichHtml(service);

  return (
    <>
      <PageHero
        title={service.title}
        description={service.excerpt}
        breadcrumb={[
          { label: "خدمات", href: "/services/" },
          ...(service.parentSlug && service.parentTitle
            ? [
                {
                  label: service.parentTitle,
                  href: `/services/${service.parentSlug}/`,
                },
              ]
            : []),
          { label: service.title },
        ]}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <Reveal className="lg:col-span-2" variant="left" immediate>
              {service.image && (
                <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold-400 backdrop-blur-sm">
                      <ServiceIcon name={service.icon} />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-lg leading-relaxed text-slate-700">
                {service.description}
              </p>

              <div className="mt-8">
                <ServiceDetailActions />
              </div>

              {richHtml ? (
                <div className="mt-10">
                  <WpRichContent
                    html={richHtml}
                    defaultContactMessage={`درخواست مشاوره برای خدمت: ${service.title}`}
                    showTrailingContact
                    trailingContactTitle="درخواست مشاوره برای این خدمت"
                    trailingContactDescription="فرم زیر را تکمیل کنید؛ کارشناسان موسسه در اسرع وقت با شما تماس می‌گیرند."
                  />
                </div>
              ) : null}

              {service.children && service.children.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-navy-900">
                    زیرمجموعه‌های این خدمت
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    حوزه‌های تخصصی مرتبط با {service.title}
                  </p>
                  <Stagger className="mt-6 grid gap-4 sm:grid-cols-2" stagger={0.08}>
                    {service.children.map((child) => (
                      <StaggerItem key={child.slug} variant="up">
                        <Link
                          href={`/services/${child.slug}/`}
                          className="group flex h-full flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-gold-400/40 hover:shadow-md"
                        >
                          <h3 className="font-semibold text-navy-900 group-hover:text-gold-600">
                            {child.title}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                            {child.excerpt}
                          </p>
                          <span className="mt-3 text-sm font-semibold text-gold-600">
                            جزئیات بیشتر ←
                          </span>
                        </Link>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}

              {service.highlights && service.highlights.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {service.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {service.whyNeed && (
                <div className="mt-12 rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
                  <h2 className="text-xl font-bold text-gold-400">
                    {service.whyNeed.title}
                  </h2>
                  <div className="mt-6 space-y-4">
                    {service.whyNeed.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-white/80">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {service.features && service.features.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-navy-900">
                    حوزه‌های تخصصی
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    زمینه‌هایی که در این خدمت پوشش داده می‌شوند
                  </p>
                  <div className="mt-6">
                    <ServiceFeatures features={service.features} />
                  </div>
                </div>
              )}

              {service.cases && service.cases.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-navy-900">
                    چه زمانی به این خدمت نیاز دارید؟
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.cases.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-cream/50 px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs text-gold-600">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.processSteps && service.processSteps.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-navy-900">
                    مراحل همکاری با ما
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    فرایند ارائه خدمت از مشاوره تا نتیجه نهایی
                  </p>
                  <div className="mt-6">
                    <ServiceProcessSteps steps={service.processSteps} />
                  </div>
                </div>
              )}

              {service.faqs && service.faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-navy-900">
                    سوالات متداول
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    پاسخ پرسش‌های رایج درباره {service.title}
                  </p>
                  <div className="mt-6">
                    <ServiceFAQ items={service.faqs} />
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal className="lg:col-span-1" variant="right" delay={0.1} immediate>
              <ServiceSidebar service={service} />
            </Reveal>
          </div>
        </Container>
      </section>

      <ServiceTrustBar />

      <ServiceRelatedServices
        currentSlug={service.slug}
        services={relatedServices}
      />

      <LatestBlogSection
        description={`مقالات و تحلیل‌های حقوقی مرتبط با ${service.title}`}
      />
    </>
  );
}
