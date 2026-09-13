import { Container } from "@/components/ui/Container";
import { ServiceCallCta } from "@/components/services/ServiceCallCta";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceSubpillarCards } from "@/components/services/ServiceSubpillarCards";
import type { PillarLanding } from "@/data/pillar-landings";
import type { Service } from "@/types";

function LandingHeading({
  title,
  light = false,
}: {
  title: string;
  light?: boolean;
}) {
  return (
    <div className="mb-6">
      <h2
        className={`text-2xl font-bold sm:text-3xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-4 h-1 w-16 rounded-full ${
          light ? "bg-gold-400" : "gold-gradient"
        }`}
      />
    </div>
  );
}

function Paragraphs({
  paragraphs,
  light = false,
}: {
  paragraphs: string[];
  light?: boolean;
}) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className={`text-base leading-[1.9] ${
            light ? "text-white/80" : "text-slate-700"
          }`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function PillarLandingBody({
  landing,
  cards,
  defaultSubject,
}: {
  landing: PillarLanding;
  cards: Service[];
  defaultSubject: string;
}) {
  return (
    <>
      <section className="py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl">
            <LandingHeading title={landing.servicesHeading} />
            <Paragraphs paragraphs={landing.servicesIntro} />
          </div>

          <div className="mt-10">
            <ServiceSubpillarCards services={cards} />
          </div>

          <ServiceCallCta
            title={`مشاوره ${defaultSubject}`}
            description="برای بررسی پرونده با وکیل متخصص این حوزه تماس بگیرید."
            titleAs="p"
          />
        </Container>
      </section>

      {landing.sections.map((section) => {
        const navy = section.variant === "navy";
        const muted = section.variant === "muted";

        return (
          <section
            key={section.heading}
            className={
              navy
                ? "bg-navy-900 py-16 lg:py-20"
                : muted
                  ? "bg-cream py-16 lg:py-20"
                  : "py-16 lg:py-20"
            }
          >
            <Container>
              <div className="max-w-3xl">
                <LandingHeading title={section.heading} light={navy} />
                <Paragraphs paragraphs={section.paragraphs} light={navy} />
              </div>

              {section.steps?.length ? (
                <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {section.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                        {index + 1}
                      </span>
                      <p className="mt-4 text-base font-bold text-navy-900">
                        {step.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}

              {section.subsections?.length ? (
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  {section.subsections.map((subsection) => (
                    <article
                      key={subsection.heading}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                      <h3 className="text-xl font-bold text-navy-900">
                        {subsection.heading}
                      </h3>
                      <div className="mt-4">
                        <Paragraphs paragraphs={subsection.paragraphs} />
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </Container>
          </section>
        );
      })}

      {landing.faqs.length ? (
        <section className="border-t border-slate-100 py-16 lg:py-20">
          <Container className="max-w-3xl">
            <LandingHeading title={landing.faqsHeading} />
            <ServiceFAQ items={landing.faqs} />
          </Container>
        </section>
      ) : null}

      <section className="pb-4">
        <Container>
          <div className="max-w-3xl">
            <LandingHeading title={landing.cta.heading} />
            <Paragraphs paragraphs={landing.cta.paragraphs} />
          </div>
          <ServiceCallCta
            title={landing.cta.callTitle}
            description={landing.cta.callDescription}
            titleAs="p"
          />
        </Container>
      </section>
    </>
  );
}
