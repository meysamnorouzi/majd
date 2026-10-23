import { Container } from "@/components/ui/Container";
import { ServiceCallCta } from "@/components/services/ServiceCallCta";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import {
  ServiceOutlineGrid,
  ServiceSubpillarCards,
} from "@/components/services/ServiceSubpillarCards";
import {
  outlineLandingServices,
  type PillarLanding,
} from "@/data/pillar-landings";
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

function BulletList({
  items,
  light = false,
}: {
  items: string[];
  light?: boolean;
}) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => {
        const labeled = item.match(/^([^:]{2,80}):\s*(.+)$/);
        return (
          <li
            key={item}
            className={`flex gap-3 text-base leading-[1.9] ${
              light ? "text-white/80" : "text-slate-700"
            }`}
          >
            <span
              className={`mt-3 h-2 w-2 shrink-0 rounded-full ${
                light ? "bg-gold-400" : "bg-gold-500"
              }`}
            />
            <span>
              {labeled ? (
                <>
                  <strong className={light ? "text-white" : "text-navy-900"}>
                    {labeled[1]}:
                  </strong>{" "}
                  {labeled[2]}
                </>
              ) : (
                item
              )}
            </span>
          </li>
        );
      })}
    </ul>
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
  const articleCards = landing.cardCopy.length > 0;
  const outline = articleCards ? outlineLandingServices(cards, landing) : [];
  const wideSteps = (steps: { description: string }[]) =>
    steps.length > 4 || steps.some((step) => step.description.length > 140);

  return (
    <>
      <section className="py-12 lg:py-16">
        <Container>
          {landing.introParagraphs?.length ? (
            <div className="mb-12">
              <Paragraphs paragraphs={landing.introParagraphs} />
            </div>
          ) : null}

          {articleCards ? (
            <>
              <div>
                <LandingHeading title={landing.servicesHeading} />
                <Paragraphs paragraphs={landing.servicesIntro} />
              </div>
              <div className="mt-10">
                <ServiceOutlineGrid items={outline} />
              </div>
            </>
          ) : (
            <ServiceSubpillarCards services={cards} />
          )}

          <ServiceCallCta
            title={`مشاوره ${defaultSubject}`}
            description="برای بررسی پرونده با وکیل متخصص این حوزه تماس بگیرید."
            titleAs="p"
            phone={landing.cta.phone}
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
              <div>
                <LandingHeading title={section.heading} light={navy} />
                <Paragraphs paragraphs={section.paragraphs} light={navy} />
                {section.bullets?.length ? (
                  <BulletList items={section.bullets} light={navy} />
                ) : null}
                {section.subsections?.length ? (
                  <div className="mt-10 space-y-10">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.heading}>
                        <h3
                          className={`text-xl font-bold sm:text-2xl ${
                            navy ? "text-white" : "text-navy-900"
                          }`}
                        >
                          {subsection.heading}
                        </h3>
                        <div className="mt-4">
                          <Paragraphs
                            paragraphs={subsection.paragraphs}
                            light={navy}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {section.steps?.length ? (
                <ol
                  className={`mt-10 grid gap-4 sm:grid-cols-2 ${
                    wideSteps(section.steps) ? "" : "lg:grid-cols-4"
                  }`}
                >
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
            </Container>
          </section>
        );
      })}

      {landing.faqs.length ? (
        <section className="border-t border-slate-100 py-16 lg:py-20">
          <Container>
            <LandingHeading title={landing.faqsHeading} />
            <ServiceFAQ items={landing.faqs} />
          </Container>
        </section>
      ) : null}

      <section className="pb-4">
        <Container>
          <div>
            <LandingHeading title={landing.cta.heading} />
            <Paragraphs paragraphs={landing.cta.paragraphs} />
          </div>
          <ServiceCallCta
            title={landing.cta.callTitle}
            description={landing.cta.callDescription}
            titleAs="p"
            phone={landing.cta.phone}
          />
        </Container>
      </section>
    </>
  );
}
