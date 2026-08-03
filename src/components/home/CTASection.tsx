"use client";

import { siteConfig, teamMembers, assets } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/reveal";

const lawyerOptions = teamMembers.map((m) => ({
  slug: m.slug,
  name: m.name,
}));

export function CTASection() {
  return (
    <section
      id="consultation"
      className="relative scroll-mt-24 overflow-hidden bg-navy-900 py-20"
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${assets.signingDocument})`,
          }}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              نیاز به مشاوره حقوقی دارید؟
            </h2>
            <p className="mt-4 max-w-xl text-white/75">
              {siteConfig.contactCta}. مشاوره رایگان برای اشخاص نیازمند.
            </p>
            <a
              href={`tel:${siteConfig.phonesTel[0]}`}
              className="mt-8 inline-block text-xl font-bold text-gold-400 hover:text-gold-300"
              dir="ltr"
            >
              {siteConfig.phones[0]}
            </a>
          </Reveal>
          <Reveal variant="right" delay={0.12}>
            <ContactForm
              variant="dark"
              title="درخواست مشاوره"
              description="فرم را تکمیل کنید تا با شما تماس بگیریم."
              defaultSubject="مشاوره حقوقی"
              lawyerOptions={lawyerOptions}
              showLawyerPicker
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
